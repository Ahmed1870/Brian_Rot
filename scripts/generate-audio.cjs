const fs = require('fs');
const files = ['public/vo_market_basket.mp3', 'public/whoosh.mp3', 'public/kaching.mp3', 'public/chalk_write.mp3', 'public/tick.mp3', 'public/ding.mp3', 'public/keyboard_fast.mp3', 'public/bass_swoosh.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
