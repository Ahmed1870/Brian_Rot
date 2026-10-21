const fs = require('fs');
const files = ['public/vo_rfm_tutorial.mp3', 'public/chalk_write.mp3', 'public/click_drag.mp3', 'public/board_erase.mp3', 'public/keyboard.mp3', 'public/strike_arrow.mp3', 'public/calm_end.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
