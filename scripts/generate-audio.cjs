const fs = require('fs');
const files = ['public/vo_average_trap.mp3', 'public/sub_bass.mp3', 'public/impact.mp3', 'public/servo_slide.mp3', 'public/emerald_chime.mp3', 'public/metallic_lock.mp3', 'public/ping.mp3'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing audio files: ' + missing.join(', '));
  process.exit(1);
}
console.log('Audio OK: ' + files.join(', '));
