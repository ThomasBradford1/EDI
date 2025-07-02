import { db } from './firebaseConfig.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';

document.getElementById('score-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const week = document.getElementById('week').value;
  const player = document.getElementById('player').value;
  const wildScalps = parseInt(document.getElementById('wildScalps').value);
  const headHunter = parseInt(document.getElementById('headHunter').value);
  const assassinated = document.getElementById('assassinated').checked;
  const venuePosition = parseInt(document.getElementById('venuePosition').value);
  const goldenSnitch = document.getElementById('goldenFitch').checked;
  const finalTable = document.getElementById('finalTable').checked;
  const outBeforeBreak = document.getElementById('outBeforeBreak').checked;

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

  try {
    await setDoc(doc(db, 'scores', docId), scoreData);
    alert('Score submitted successfully!');
    document.getElementById('score-form').reset();
  } catch (error) {
    alert('Error submitting score: ' + error.message);
  }
});
