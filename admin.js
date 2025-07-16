import { db } from './firebaseConfig.js';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan"];

// Save draft handler (Save button click)
document.getElementById('save-draft-btn').addEventListener('click', async () => {
  const week = document.getElementById('week').value;
  const formData = new FormData(document.getElementById('score-form'));

  try {
    for (const player of players) {
      const wildScalps = parseInt(formData.get(`wildScalps[${player}]`)) || 0;
      const headHunter = parseInt(formData.get(`headHunter[${player}]`)) || 0;
      const assassinated = formData.get(`assassinated[${player}]`) === "on";
      const goldenSnitch = formData.get(`goldenSnitch[${player}]`) === "on";
      const finalTable = formData.get(`finalTable[${player}]`) === "on";
      const outBeforeBreak = formData.get(`outBeforeBreak[${player}]`) === "on";

      const docId = `${week}_${player}`;
      const scoreData = {
        player,
        week,
        wildScalps,
        headHunter,
        assassinated,
        goldenSnitch,
        finalTable,
        outBeforeBreak,
        submitted: false,   // mark as draft
        timestamp: new Date()
      };

      await setDoc(doc(db, 'scores', docId), scoreData, { merge: true });
    }

    alert('Draft saved successfully!');
  } catch (error) {
    alert('Error saving draft: ' + error.message);
    console.error(error);
  }
});

// Final submit handler (Submit button click)
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const week = document.getElementById('week').value;
  const formData = new FormData(e.target);

  try {
    for (const player of players) {
      const wildScalps = parseInt(formData.get(`wildScalps[${player}]`)) || 0;
      const headHunter = parseInt(formData.get(`headHunter[${player}]`)) || 0;
      const assassinated = formData.get(`assassinated[${player}]`) === "on";
      const goldenSnitch = formData.get(`goldenSnitch[${player}]`) === "on";
      const finalTable = formData.get(`finalTable[${player}]`) === "on";
      const outBeforeBreak = formData.get(`outBeforeBreak[${player}]`) === "on";

      const docId = `${week}_${player}`;
      const scoreData = {
        player,
        week,
        wildScalps,
        headHunter,
        assassinated,
        goldenSnitch,
        finalTable,
        outBeforeBreak,
        submitted: true,    // mark as submitted/final
        timestamp: new Date()
      };

      await setDoc(doc(db, 'scores', docId), scoreData, { merge: true });
    }

    alert('All scores submitted successfully!');
    e.target.reset();
  } catch (error) {
    alert('Error submitting scores: ' + error.message);
    console.error(error);
  }
});

// Load saved draft (or submitted) data when week changes or page loads
async function loadScoresForWeek(week) {
  const container = document.getElementById('players-area');
  const scoreForm = document.getElementById('score-form');

  // For each player, load their saved score doc for the selected week if exists
  for (const player of players) {
    const docId = `${week}_${player}`;
    const docRef = doc(db, 'scores', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Only load if it's a draft or submitted score for this week/player
      if (data.week === week) {
        // Fill inputs for player with saved data
        setInputValue(scoreForm, `wildScalps[${player}]`, data.wildScalps ?? 0);
        setInputValue(scoreForm, `headHunter[${player}]`, data.headHunter ?? 0);
        setCheckboxValue(scoreForm, `assassinated[${player}]`, data.assassinated ?? false);
        setCheckboxValue(scoreForm, `goldenSnitch[${player}]`, data.goldenSnitch ?? false);
        setCheckboxValue(scoreForm, `finalTable[${player}]`, data.finalTable ?? false);
        setCheckboxValue(scoreForm, `outBeforeBreak[${player}]`, data.outBeforeBreak ?? false);
      }
    } else {
      // If no saved doc, reset inputs to default (0 / unchecked)
      setInputValue(scoreForm, `wildScalps[${player}]`, 0);
      setInputValue(scoreForm, `headHunter[${player}]`, 0);
      setCheckboxValue(scoreForm, `assassinated[${player}]`, false);
      setCheckboxValue(scoreForm, `goldenSnitch[${player}]`, false);
      setCheckboxValue(scoreForm, `finalTable[${player}]`, false);
      setCheckboxValue(scoreForm, `outBeforeBreak[${player}]`, false);
    }
  }
}

// Helper functions to fill form inputs
function setInputValue(form, name, value) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}
function setCheckboxValue(form, name, checked) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.checked = checked;
}

// Reload scores on week change
document.getElementById('week').addEventListener('change', (e) => {
  loadScoresForWeek(e.target.value);
});

// On page load, load scores for the selected week
window.addEventListener('DOMContentLoaded', () => {
  const selectedWeek = document.getElementById('week').value;
  loadScoresForWeek(selectedWeek);
});
