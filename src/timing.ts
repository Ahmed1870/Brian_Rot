// generated from lesson65_final.mp3 (RMS dips + text weights)
export const FPS_T = 30;
export const SC_START: number[] = [0, 1281, 2604, 3841, 4996, 6060];
export const SC_END = 7200;
export const OFF: number[] = [0, 3, 8, 12, 16, 19];
export const S: [number, number][] = [[6, 406], [406, 831], [831, 1281], [1281, 1434], [1434, 1647], [1647, 1949], [1949, 2213], [2213, 2604], [2604, 2764], [2764, 3084], [3084, 3393], [3393, 3841], [3841, 3971], [3971, 4248], [4248, 4506], [4506, 4996], [4996, 5257], [5257, 5805], [5805, 6060], [6060, 6181], [6181, 6336], [6336, 6693], [6693, 7040]];
export const anch = (sc: number) => (k: number, fr = 0): number => {
  const [s, e] = S[OFF[sc] + k];
  return Math.round(s + (e - s) * fr) - SC_START[sc];
};
