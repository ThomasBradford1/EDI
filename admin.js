import { db } from './firebaseConfig.js';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

// Players array (always 5)
const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan"];

// Points rules for venue/leaderboard
const venuePoints = [5, 4, 3, -1, -2];

// Save draft button
document.getElementById('save-draft-btn').addEventListener('click', async () => {
  await saveScores(false); // submitted = false for draft
  alert('Draft saved successfully!');
});

// Submit all scores button
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveScores(true); // submitted = true
  alert('All scores submitted successfully!');
  e.target.reset();
});

// Function to save weekly/home game scores
async function saveScores(submitted) {
  const week = document.getElementById('week').value;
  const formData = new FormData(document.getElementById('score-form'));

  for (const player of players) {
    const wildScalps = parseInt(formData.get(`wildScalps[${player}]`)) || 0;
    const headHunter = parseInt(formData.get(`headHunter[${player}]`)) || 0;
    const winningGame = formData.get(`winningGame[${player}]`) === "on";
    const finalTable = formData.get(`finalTable[${player}]`) === "on";
    const goldenSnitch = formData.get(`goldenSnitch[${player}]`) === "on";
    const snitchElim = formData.get(`snitchElim[${player}]`) === "on";
    const assassinated = formData.get(`assassinated[${player}]`) === "on";

    const docId = `${week}_${player}`;
    const scoreData = {
      player,
      week,
      wildScalps,
      headHunter,
      winningGame,
      finalTable,
      goldenSnitch,
      snitchElim,
      assassinated,
      submitted,
      timestamp: new Date()
    };

    await setDoc(doc(db, 'scores', docId), scoreData, { merge: true });
  }
}

// Load scores for selected week (draft or submitted)
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
      setCheckboxValue(scoreForm, `winningGame[${player}]`, data.winningGame ?? false);
      setCheckboxValue(scoreForm, `finalTable[${player}]`, data.finalTable ?? false);
      setCheckboxValue(scoreForm, `goldenSnitch[${player}]`, data.goldenSnitch ?? false);
      setCheckboxValue(scoreForm, `snitchElim[${player}]`, data.snitchElim ?? false);
      setCheckboxValue(scoreForm, `assassinated[${player}]`, data.assassinated ?? false);
    } else {
      // Reset inputs if no data
      setInputValue(scoreForm, `wildScalps[${player}]`, 0);
      setInputValue(scoreForm, `headHunter[${player}]`, 0);
      setCheckboxValue(scoreForm, `winningGame[${player}]`, false);
      setCheckboxValue(scoreForm, `finalTable[${player}]`, false);
      setCheckboxValue(scoreForm, `goldenSnitch[${player}]`, false);
      setCheckboxValue(scoreForm, `snitchElim[${player}]`, false);
      setCheckboxValue(scoreForm, `assassinated[${player}]`, false);
    }
  }
}

// Helper functions
function setInputValue(form, name, value) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}

function setCheckboxValue(form, name, checked) {
  const input = form.querySelector(`[name="${name}"]`);
  if (input) input.checked = checked;
}

// Reload scores when week selection changes
document.getElementById('week').addEventListener('change', (e) => {
  loadScoresForWeek(e.target.value);
});

// Load initial week on page load
window.addEventListener('DOMContentLoaded', () => {
  const selectedWeek = document.getElementById('week').value;
  loadScoresForWeek(selectedWeek);
});

// Venue / Leaderboard submission
document.getElementById('venue-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const week = document.getElementById('week').value;
  const form = e.target;
  const venueData = [];

  for (let rank = 1; rank <= 5; rank++) {
    const checkboxes = form.querySelectorAll(`input[name="venueRank[${rank}][]"]:checked`);
    checkboxes.forEach((checkbox) => {
      venueData.push({
        player: checkbox.value,
        points: venuePoints[rank - 1],
        rank
      });
    });
  }

  for (const entry of venueData) {
    const docId = `${week}_${entry.player}`;
    await setDoc(doc(db, 'venueTotals', docId), {
      player: entry.player,
      week,
      total: entry.points,
      latestVenueRank: entry.rank,
      timestamp: new Date()
    }, { merge: true });
  }

  alert('Venue leaderboard submitted successfully!');
  form.reset();
});
