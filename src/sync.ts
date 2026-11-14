// Scene boundaries + sentence anchors from RMS analysis of the voiceover (30fps).
// Anchors are frames relative to each scene start: t(g) = sec(g - S).
export const SCENE_START = [0, 1312, 2349, 3513, 4708, 6085];
export const SCENE_LEN = [1312, 1037, 1164, 1195, 1377, 1115];
export const A: number[][] = [
  [3, 388, 697, 1312],
  [0, 277, 570, 1037],
  [0, 258, 737, 1164],
  [0, 185, 523, 759, 1195],
  [0, 426, 777, 1377],
  [0, 174, 456, 958],
];
