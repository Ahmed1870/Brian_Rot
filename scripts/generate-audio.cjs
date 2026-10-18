const fs = require('fs');
const files = ['public/voiceover.wav', 'public/drone_28hz.mp3', 'public/glass_fracture.mp3', 'public/servo_sand.mp3', 'public/whoosh_chime.mp3', 'public/lock_snap.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
