export const VOICE = {file: 'vo_rfm_tutorial.mp3', volume: 1};

export type Cue = {file: string; t: number; volume: number};
const at = (file: string, volume: number, ...ts: number[]): Cue[] => ts.map((t) => ({file, t, volume}));

/** Scene SFX fired on VO-synchronised seconds. */
export const CUES: Cue[] = [
  // soft chalk writing (scene starts and big drawings)
  ...at('chalk_write.mp3', 0.30, 0.15, 3.2, 6.7, 9.55, 14.95, 24.6, 31.55, 39.6, 41.9, 44.95, 62.5, 70.4, 80.65, 84.4, 91.8, 96.85, 120.35, 152.4, 214.1, 222.6, 234.65),
  // sharp result writing (scores)
  ...at('chalk_write.mp3', 0.55, 128.8, 135.05, 139.85, 149.6, 157.05, 160.35, 166.55),
  // quintile clicks + sharp drags
  ...at('click_drag.mp3', 0.6, 54.45, 98.0, 98.9, 99.8, 100.7, 109.3, 116.65),
  // board erase between sub-scenes
  ...at('board_erase.mp3', 0.45, 9.3, 24.4, 39.3, 44.4, 62.0, 80.3, 91.5, 96.6, 120.0, 176.8, 213.9, 234.3),
  // keyboard + code selection
  ...at('keyboard.mp3', 0.45, 177.4, 186.5, 195.4, 205.0),
  // strike-throughs and guiding arrows
  ...at('strike_arrow.mp3', 0.6, 3.6, 7.0, 224.0, 228.0, 230.2),
  // calm closing tone
  ...at('calm_end.mp3', 0.55, 234.65),
];
