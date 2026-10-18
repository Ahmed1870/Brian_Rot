import {spring} from 'remotion';
import {clamp, lerp, ss} from './theme';
import {HERO_C} from './components/Dashboard';

/**
 * كاميرا Pull-Back: بتبدأ ماكرو على كارت +10M (مقياس 2.5×) وبترتد بزنبرك (mass .8 / stiffness 140 / damping 18)
 * لحد ما الشاشة كلها تظهر، وبعدها بتكمّل دولي بطيء يكشف إطار الشاشة (Bezel).
 */
export const cameraAt = (f: number, fps = 30) => {
  const t = f / fps;
  const pull = spring({frame: f - 150, fps, config: {mass: 0.8, stiffness: 140, damping: 18}});
  const S0 = 2.5 * (1 + 0.05 * clamp(t / 5));
  const S = lerp(S0, 1, pull) * (1 - 0.14 * ss(5.5, 9.2, t));
  const k = clamp(pull);
  return {S, x: lerp(HERO_C.x, 540, k), y: lerp(HERO_C.y, 960, k), pull: k};
};
