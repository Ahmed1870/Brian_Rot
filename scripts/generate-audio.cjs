const fs = require('fs');
const files = ['public/vo_free_templates_20s.mp3', 'public/paper_flip.mp3', 'public/servo_slide.mp3', 'public/quick_card_swipe.mp3', 'public/metallic_lock.mp3', 'public/ping.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
