import { db } from './firebaseConfig.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

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
      const venuePosition = parseInt(formData.get(`venuePosition[${player}]`)) || null;
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
        venuePosition,
        goldenSnitch,
        finalTable,
        outBeforeBreak,
        timestamp: new Date()
      };

      await setDoc(doc(db, 'scores', docId), scoreData);
      console.log(`✅ Submitted for ${player}`);
    }

    alert('All scores submitted successfully!');
    document.getElementById('score-form').reset();
  } catch (error) {
    alert('❌ Error submitting scores: ' + error.message);
    console.error(error);
  }
});
