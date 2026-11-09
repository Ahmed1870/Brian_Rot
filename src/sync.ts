// Scene boundaries + sentence anchors from RMS analysis of the voiceover (30fps).
// Anchors are frames relative to each scene start: t(g) = sec(g - S).
export const SCENE_START = [0, 1196, 2547, 3900, 5099, 6270];
export const SCENE_LEN = [1196, 1351, 1353, 1199, 1171, 930];
export const A: number[][] = [
  [38, 389, 634, 908],
  [39, 344, 704, 884],
  [38, 273, 640, 832, 1048],
  [36, 281, 665],
  [38, 358, 675],
  [37, 219, 434],
];
