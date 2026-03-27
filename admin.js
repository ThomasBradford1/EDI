import { db } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

// Updated Players (NOW 6)
const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan", "Travis"];

// =============================
// SUBMIT SCORES
// =============================
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveScores(true);
  alert('Week submitted successfully!');
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

      // Core scoring
      wildScalps: parseInt(formData.get(`wildScalps[${player}]`)) || 0,
      headHunter: parseInt(formData.get(`headHunter[${player}]`)) || 0,
      goldenSnitch: parseInt(formData.get(`goldenSnitch[${player}]`)) || 0,
      snitchBeast: parseInt(formData.get(`snitchBeast[${player}]`)) || 0,

      // Final table (1–5 or null)
      finalPosition: formData.get(`finalPosition[${player}]`)
        ? parseInt(formData.get(`finalPosition[${player}]`))
        : null,

      // Checkboxes
      savedByBell: formData.get(`savedByBell[${player}]`) === "on",
      rebuyBust: formData.get(`rebuyBust[${player}]`) === "on",

      // Negatives
      assassinated: parseInt(formData.get(`assassinated[${player}]`)) || 0,
      snitchElim: parseInt(formData.get(`snitchElim[${player}]`)) || 0,

      // Special rules
      fish72Bounty: parseInt(formData.get(`fish72Bounty[${player}]`)) || 0,
      fish72Elim: parseInt(formData.get(`fish72Elim[${player}]`)) || 0,
      deathByQuadsOrSF: parseInt(formData.get(`deathByQuadsOrSF[${player}]`)) || 0,

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

      setInput(scoreForm, `wildScalps[${player}]`, data.wildScalps ?? 0);
      setInput(scoreForm, `headHunter[${player}]`, data.headHunter ?? 0);
      setInput(scoreForm, `goldenSnitch[${player}]`, data.goldenSnitch ?? 0);
      setInput(scoreForm, `snitchBeast[${player}]`, data.snitchBeast ?? 0);

      setInput(scoreForm, `finalPosition[${player}]`, data.finalPosition ?? "");

      setCheckbox(scoreForm, `savedByBell[${player}]`, data.savedByBell ?? false);
      setCheckbox(scoreForm, `rebuyBust[${player}]`, data.rebuyBust ?? false);

      setInput(scoreForm, `assassinated[${player}]`, data.assassinated ?? 0);
      setInput(scoreForm, `snitchElim[${player}]`, data.snitchElim ?? 0);

      setInput(scoreForm, `fish72Bounty[${player}]`, data.fish72Bounty ?? 0);
      setInput(scoreForm, `fish72Elim[${player}]`, data.fish72Elim ?? 0);
      setInput(scoreForm, `deathByQuadsOrSF[${player}]`, data.deathByQuadsOrSF ?? 0);

    } else {
      resetPlayer(scoreForm, player);
    }
  }
}

// =============================
// HELPERS
// =============================
function setInput(form, name, value) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}

function setCheckbox(form, name, checked) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.checked = checked;
}

function resetPlayer(form, player) {
  setInput(form, `wildScalps[${player}]`, 0);
  setInput(form, `headHunter[${player}]`, 0);
  setInput(form, `goldenSnitch[${player}]`, 0);
  setInput(form, `snitchBeast[${player}]`, 0);

  setInput(form, `finalPosition[${player}]`, "");

  setCheckbox(form, `savedByBell[${player}]`, false);
  setCheckbox(form, `rebuyBust[${player}]`, false);

  setInput(form, `assassinated[${player}]`, 0);
  setInput(form, `snitchElim[${player}]`, 0);

  setInput(form, `fish72Bounty[${player}]`, 0);
  setInput(form, `fish72Elim[${player}]`, 0);
  setInput(form, `deathByQuadsOrSF[${player}]`, 0);
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