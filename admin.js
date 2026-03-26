import { db } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

// Players array
const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan"];

// =============================
// SAVE DRAFT
// =============================
document.getElementById('save-draft-btn').addEventListener('click', async () => {
  await saveScores(false);
  alert('Draft saved successfully!');
});

// =============================
// SUBMIT SCORES
// =============================
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveScores(true);
  alert('All scores submitted successfully!');
  e.target.reset();
});

// =============================
// SAVE SCORES FUNCTION
// =============================
async function saveScores(submitted) {
  const week = document.getElementById('week').value;
  const formData = new FormData(document.getElementById('score-form'));

  for (const player of players) {
    const scoreData = {
      player,
      week,

      // Bounties
      wildScalps: parseInt(formData.get(`wildScalps[${player}]`)) || 0,
      headHunter: parseInt(formData.get(`headHunter[${player}]`)) || 0,

      // Negative
      eliminated: parseInt(formData.get(`eliminated[${player}]`)) || 0,

      // Snitch
      goldenSnitch: parseInt(formData.get(`goldenSnitch[${player}]`)) || 0,
      snitchElim: parseInt(formData.get(`snitchElim[${player}]`)) || 0,
      snitchHolderBounty: parseInt(formData.get(`snitchHolderBounty[${player}]`)) || 0,

      // Final table position
      finalPosition: parseInt(formData.get(`finalPosition[${player}]`)) || null,

      // Break logic
      rebuy: formData.get(`rebuy[${player}]`) === "on",
      savedByBreak: formData.get(`savedByBreak[${player}]`) === "on",

      // Fish Favourite
      fishBounty72: parseInt(formData.get(`fishBounty72[${player}]`)) || 0,
      fishKO72: parseInt(formData.get(`fishKO72[${player}]`)) || 0,

      // Special hand bounty
      deathByQuads: parseInt(formData.get(`deathByQuads[${player}]`)) || 0,

      submitted,
      timestamp: new Date()
    };

    const docId = `${week}_${player}`;
    await setDoc(doc(db, 'scores', docId), scoreData, { merge: true });
  }
}

// =============================
// LOAD SCORES FOR WEEK
// =============================
async function loadScoresForWeek(week) {
  const scoreForm = document.getElementById('score-form');

  for (const player of players) {
    const docId = `${week}_${player}`;
    const docRef = doc(db, 'scores', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      setInputValue(scoreForm, `wildScalps[${player}]`, data.wildScalps ?? 0);
      setInputValue(scoreForm, `headHunter[${player}]`, data.headHunter ?? 0);
      setInputValue(scoreForm, `eliminated[${player}]`, data.eliminated ?? 0);

      setInputValue(scoreForm, `goldenSnitch[${player}]`, data.goldenSnitch ?? 0);
      setInputValue(scoreForm, `snitchElim[${player}]`, data.snitchElim ?? 0);
      setInputValue(scoreForm, `snitchHolderBounty[${player}]`, data.snitchHolderBounty ?? 0);

      setInputValue(scoreForm, `finalPosition[${player}]`, data.finalPosition ?? "");

      setCheckboxValue(scoreForm, `rebuy[${player}]`, data.rebuy ?? false);
      setCheckboxValue(scoreForm, `savedByBreak[${player}]`, data.savedByBreak ?? false);

      setInputValue(scoreForm, `fishBounty72[${player}]`, data.fishBounty72 ?? 0);
      setInputValue(scoreForm, `fishKO72[${player}]`, data.fishKO72 ?? 0);
      setInputValue(scoreForm, `deathByQuads[${player}]`, data.deathByQuads ?? 0);

    } else {
      resetPlayerInputs(scoreForm, player);
    }
  }
}

// =============================
// HELPERS
// =============================
function setInputValue(form, name, value) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}

function setCheckboxValue(form, name, checked) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.checked = checked;
}

function resetPlayerInputs(form, player) {
  setInputValue(form, `wildScalps[${player}]`, 0);
  setInputValue(form, `headHunter[${player}]`, 0);
  setInputValue(form, `eliminated[${player}]`, 0);

  setInputValue(form, `goldenSnitch[${player}]`, 0);
  setInputValue(form, `snitchElim[${player}]`, 0);
  setInputValue(form, `snitchHolderBounty[${player}]`, 0);

  setInputValue(form, `finalPosition[${player}]`, "");

  setCheckboxValue(form, `rebuy[${player}]`, false);
  setCheckboxValue(form, `savedByBreak[${player}]`, false);

  setInputValue(form, `fishBounty72[${player}]`, 0);
  setInputValue(form, `fishKO72[${player}]`, 0);
  setInputValue(form, `deathByQuads[${player}]`, 0);
}

// =============================
// WEEK CHANGE LISTENER
// =============================
document.getElementById('week').addEventListener('change', (e) => {
  loadScoresForWeek(e.target.value);
});

window.addEventListener('DOMContentLoaded', () => {
  const selectedWeek = document.getElementById('week').value;
  loadScoresForWeek(selectedWeek);
});