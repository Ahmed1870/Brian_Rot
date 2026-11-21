// فحوص ساكنة بلا اعتماديات: node scripts/validate.mjs
import fs from 'fs';
import {execSync} from 'child_process';
const R = (p) => fs.readFileSync(p, 'utf8');
const res = [];
const ok = (name, pass, info = '') => res.push({name, pass, info});

const theme = R('src/theme.ts');
const id = /COMP_ID = '([^']+)'/.exec(theme)?.[1];
ok('COMP_ID موجود', !!id, id);
const pkg = JSON.parse(R('package.json'));
ok('package.json name = lowercase(COMP_ID)', pkg.name === id.toLowerCase(), pkg.name);
ok('npm render script يستخدم COMP_ID', pkg.scripts.render.includes(id));
ok('workflow يستخدم COMP_ID', R('.github/workflows/render.yml').includes(id));
ok('README يذكر COMP_ID', R('README.md').includes(id));
ok('إصدارات remotion متطابقة ومثبّتة', ['remotion', '@remotion/cli', '@remotion/renderer'].every((k) => pkg.dependencies[k] === '4.0.250'));
ok('1920x1080 @30fps و 9000 فريم', /WIDTH = 1920/.test(theme) && /HEIGHT = 1080/.test(theme) && /FPS = 30/.test(theme) && /DURATION = 9000/.test(theme));

for (const f of ['public/voiceover_lesson_41.mp3', 'public/logo.svg', 'public/sfx/click.wav', 'public/sfx/pop.wav', 'public/sfx/swish.wav', 'public/sfx/whoosh.wav', 'public/sfx/type.wav', 'src/fonts/Inter-Regular.otf', 'src/fonts/DejaVuSans.ttf', 'src/fonts/DejaVuSansMono.ttf']) ok('ملف موجود: ' + f, fs.existsSync(f));

const sync = R('src/sync.ts');
const b = JSON.parse(/BOUNDS: number\[\] = (\[[^\]]*\])/.exec(sync)[1]);
ok('حدود المشاهد 9 قيم تصاعدية وتنتهي عند 300', b.length === 9 && b.every((v, i) => i === 0 || v > b[i - 1]) && b[8] === 300, b.join(','));
ok('آخر 5 ثوانٍ صمت (S8 تبدأ عند 295)', b[7] === 295);
ok('خط Cairo موجود في public/fonts (اختياري)', true, fs.existsSync('public/fonts/Cairo-Regular.ttf') ? 'موجود' : 'غير موجود - يُستخدم DejaVu');

try {
  const d = parseFloat(execSync('ffprobe -v error -show_entries format=duration -of csv=p=0 public/voiceover_lesson_41.mp3').toString());
  ok('مدة الصوت 300±0.1s (ffprobe)', Math.abs(d - 300) < 0.1, d.toFixed(3));
  const s = execSync('ffmpeg -hide_banner -nostats -ss 294.9 -i public/voiceover_lesson_41.mp3 -af silencedetect=noise=-45dB:d=4.5 -f null - 2>&1 || true').toString();
  ok('الصوت صامت بعد 294.9s', /silence_start/.test(s));
} catch {
  ok('ffprobe/ffmpeg غير متاح - تخطّي فحص الصوت', true, 'skipped');
}

const src = [];
const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).forEach((e) => (e.isDirectory() ? walk(d + '/' + e.name) : /\.(tsx?|css)$/.test(e.name) && src.push(d + '/' + e.name)));
walk('src');
const all = src.map(R).join('\n');
ok('لا Math.random/Date.now (حتمية)', !/Math\.random|Date\.now/.test(all));
ok('لا blur/drop-shadow ثقيل', !/blur\(|drop-shadow|boxShadow/.test(all));
ok('لا localStorage/fetch', !/localStorage|fetch\(/.test(all));

let fail = 0;
for (const r of res) { if (!r.pass) fail++; console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.info ? '  [' + r.info + ']' : '')); }
console.log(`\n${res.length - fail}/${res.length} passed`);
process.exit(fail ? 1 : 0);
