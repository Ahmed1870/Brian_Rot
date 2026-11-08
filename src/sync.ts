// Scene boundaries + sentence anchors from RMS analysis of the voiceover (30fps).
// Anchors are frames relative to each scene start: t(g) = sec(g - S).
export const SCENE_START = [0, 1199, 2547, 3897, 5099, 6270];
export const SCENE_LEN = [1199, 1348, 1350, 1202, 1171, 930];
export const A: number[][] = [
  [34, 170, 444, 684, 824],
  [38, 338, 621, 759, 1015],
  [37, 239, 640, 894],
  [37, 222, 377, 588],
  [36, 361, 673],
  [35, 256, 466],
];
