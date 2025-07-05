import { db } from './firebaseConfig.js';
import {
  doc,
  setDoc,
  getDocs,
  collection
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

// Submit player scores
document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const week = document.getElementById('week').value;
  const formData = new FormData(e.target);
  const players = ["Micheal", "Tom", "Luke", "Jeff", "Jordan"];

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

// Submit venue rankings
document.getElementById('venue-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const week = document.getElementById('week').value;

  const venuePoints = { 1: 4, 2: 3, 3: 2, 4: 1, 5: 0 };
  const newScores = {};

  for (let i = 1; i <= 5; i++) {
    const selected = formData.getAll(`venueRank[${i}][]`);
    selected.forEach(player => {
      newScores[player] = venuePoints[i];
    });
  }

  try {
    const prevData = await getDocs(collection(db, 'venueTotals'));
    const prevTotals = {};
    prevData.forEach(doc => {
      prevTotals[doc.id] = doc.data().total || 0;
    });

    for (const [player, newScore] of Object.entries(newScores)) {
      const docRef = doc(db, 'venueTotals', player);
      await setDoc(docRef, { total: newScore, updatedAt: new Date() }, { merge: true });
    }

    alert("Venue rankings updated!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Error updating venue rankings");
  }
});
