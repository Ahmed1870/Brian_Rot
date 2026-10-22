export const VOICE = {file: 'vo_market_basket.mp3', volume: 1};

export type Cue = {file: string; t: number; volume: number};
const at = (file: string, volume: number, ...ts: number[]): Cue[] => ts.map((t) => ({file, t, volume}));

/** SFX on VO-synchronised seconds. */
export const CUES: Cue[] = [
  // scene 1: whoosh + ka-ching on every product that lands in the cart
  ...at('whoosh.mp3', 0.45, 0.3, 1.8, 5.0, 6.2, 8.1, 12.0, 18.4),
  ...at('kaching.mp3', 0.7, 2.25, 5.45, 6.65),
  ...at('chalk_write.mp3', 0.3, 0.9, 7.0, 9.95, 12.1, 19.0, 25.95, 41.55, 59.0, 75.95),
  // scene 2: tick / heartbeat for each metric, ding on Lift
  ...at('tick.mp3', 0.55, 33.0, 34.65, 40.05, 41.55, 48.6),
  ...at('ding.mp3', 0.7, 50.75),
  ...at('tick.mp3', 0.45, 36.15, 43.1, 52.25, 56.05),
  // scene 3: fast mechanical keyboard
  ...at('keyboard_fast.mp3', 0.5, 62.2, 66.8, 71.55),
  // scene 4: deep bass swoosh
  ...at('bass_swoosh.mp3', 0.8, 75.9),
];
