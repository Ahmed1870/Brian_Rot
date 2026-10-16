const fs = require('fs');
const files = ['public/voiceover.wav', 'public/sfx.wav'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
