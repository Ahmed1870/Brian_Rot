// Scene boundaries + sentence anchors from RMS analysis of the voiceover (30fps).
// Anchors are frames relative to each scene start: t(g) = sec(g - S).
export const SCENE_START = [0, 1200, 2546, 3898, 5099, 6270];
export const SCENE_LEN = [1200, 1346, 1352, 1201, 1171, 930];
export const A: number[][] = [
  [36, 165, 464, 677, 798],
  [36, 167, 434, 592, 703, 1039],
  [37, 278, 385, 624, 821, 922],
  [36, 207, 454, 777],
  [36, 323, 519, 732],
  [36, 227, 466],
];
