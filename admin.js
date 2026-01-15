import { db } from './firebaseConfig.js';
import {
  doc,
  setDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan"];

/* =========================
   WEEK DROPDOWN (THURSDAYS)
========================= */
function generateThursdayWeeks() {
  const start = new Date('2026-01-08'); // Thursday
  const end = new Date('2026-03-26');   // Thursday
  const weeks = [];

  let current = new Date(start);
  while (current <= end) {
    weeks.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

function populateWeekDropdown() {
  const weekSelect = document.getElementById('week');
  weekSelect.innerHTML = '';

  generateThursdayWeeks().forEach((week) => {
    const option = document.createElement('option');
    option.value = week;
    option.textContent = week;
    weekSelect.appendChild(option);
  });
}

/* =========================
   SAVE DRAFT
========================= */
document.getElementById('save-draft-btn').addEventListener('click', async () => {
  const week = document.getElementById('week').value;
  const formData = new FormData(document.getElementById('score-form'));

  try {
    for (const player of players) {
      const scoreData = {
        player,
        week,
        wildScalps: parseInt(formData.get(`wildScalps[${player}]`)) || 0,
        headHunter: formData.get(`headHunter[${player}]`) === "on",
        assassinated: formData.get(`assassinated[${player}]`) === "on",
        goldenSnitch: formData.get(`goldenSnitch[${player}]`) === "on",
        finalTable: formData.get(`finalTable[${player}]`) === "on",
        winningGame: formData.get(`winningGame[${player}]`) === "on",
        snitchElim: formData.get(`snitchElim[${player}]`) === "on",
        submitted: false,
        timestamp: new Date()
      };

      await setDoc(
        doc(db, 'scores', `${week}_${player}`),
        scoreData,
        { merge: true }
      );
    }

    alert('Draft saved successfully!');
  } catch (error) {
    console.error(error);
    alert('Error saving draft');
  }
});

/* =========================
   FINAL SUBMIT
========================= */
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const week = document.getElementById('week').value;
  const formData = new FormData(e.target);

  try {
    for (const player of players) {
      const scoreData = {
        player,
        week,
        wildScalps: parseInt(formData.get(`wildScalps[${player}]`)) || 0,
        headHunter: formData.get(`headHunter[${player}]`) === "on",
        assassinated: formData.get(`assassinated[${player}]`) === "on",
        goldenSnitch: formData.get(`goldenSnitch[${player}]`) === "on",
        finalTable: formData.get(`finalTable[${player}]`) === "on",
        winningGame: formData.get(`winningGame[${player}]`) === "on",
        snitchElim: formData.get(`snitchElim[${player}]`) === "on",
        submitted: true,
        timestamp: new Date()
      };

      await setDoc(
        doc(db, 'scores', `${week}_${player}`),
        scoreData,
        { merge: true }
      );
    }

    alert('Scores submitted successfully!');
    e.target.reset();
  } catch (error) {
    console.error(error);
    alert('Error submitting scores');
  }
});

/* =========================
   LOAD SCORES PER WEEK
========================= */
async function loadScoresForWeek(week) {
  const form = document.getElementById('score-form');

  for (const player of players) {
    const snap = await getDoc(doc(db, 'scores', `${week}_${player}`));

    if (snap.exists()) {
      const d = snap.data();

      setInput(form, `wildScalps[${player}]`, d.wildScalps ?? 0);
      setCheck(form, `headHunter[${player}]`, d.headHunter);
      setCheck(form, `assassinated[${player}]`, d.assassinated);
      setCheck(form, `goldenSnitch[${player}]`, d.goldenSnitch);
      setCheck(form, `finalTable[${player}]`, d.finalTable);
      setCheck(form, `winningGame[${player}]`, d.winningGame);
      setCheck(form, `snitchElim[${player}]`, d.snitchElim);
    } else {
      setInput(form, `wildScalps[${player}]`, 0);
      setCheck(form, `headHunter[${player}]`, false);
      setCheck(form, `assassinated[${player}]`, false);
      setCheck(form, `goldenSnitch[${player}]`, false);
      setCheck(form, `finalTable[${player}]`, false);
      setCheck(form, `winningGame[${player}]`, false);
      setCheck(form, `snitchElim[${player}]`, false);
    }
  }
}

/* =========================
   VENUE LEADERBOARD
========================= */
document.getElementById('venue-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const week = document.getElementById('week').value;

  const pointsMap = [5, 4, 3, -1, -2];

  try {
    for (let rank = 1; rank <= 5; rank++) {
      const checkboxes = document.querySelectorAll(
        `input[name="venueRank[${rank}][]"]:checked`
      );

      for (const cb of checkboxes) {
        await setDoc(
          doc(db, 'venueTotals', `${week}_${cb.value}`),
          {
            player: cb.value,
            week: 'venue-total',
            latestVenueRank: rank,
            total: pointsMap[rank - 1],
            timestamp: new Date()
          },
          { merge: true }
        );
      }
    }

    alert('Venue leaderboard submitted!');
    e.target.reset();
  } catch (error) {
    console.error(error);
    alert('Venue leaderboard error');
  }
});

/* =========================
   HELPERS
========================= */
function setInput(form, name, value) {
  const el = form.querySelector(`[name="${name}"]`);
  if (el) el.value = value;
}

function setCheck(form, name, checked) {
  const el = form.querySelector(`[name="${name}"]`);
  if (el) el.checked = checked;
}

/* =========================
   INIT
========================= */
window.addEventListener('DOMContentLoaded', () => {
  populateWeekDropdown();
  loadScoresForWeek(document.getElementById('week').value);
});

document.getElementById('week').addEventListener('change', (e) => {
  loadScoresForWeek(e.target.value);
});
