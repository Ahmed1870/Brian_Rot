const fs = require('fs');
const files = ['public/voiceover.wav', 'public/bass.mp3', 'public/servo.mp3', 'public/fluid.mp3', 'public/ping.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
