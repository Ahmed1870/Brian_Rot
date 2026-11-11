// Scene boundaries + sentence anchors from RMS analysis of the voiceover (30fps).
// Anchors are frames relative to each scene start: t(g) = sec(g - S).
export const SCENE_START = [0, 1528, 2722, 3903, 5034, 6000];
export const SCENE_LEN = [1528, 1194, 1181, 1131, 966, 1200];
export const A: number[][] = [
  [38, 476, 832, 1155, 1484],
  [45, 193, 588, 825, 1149],
  [45, 298, 470, 672, 897, 1151],
  [31, 199, 465, 652, 1093],
  [38, 352, 548, 943],
  [28, 233, 463, 716],
];
