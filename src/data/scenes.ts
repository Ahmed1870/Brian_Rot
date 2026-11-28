import narration from './narration.json';
import timing from './timing.json';
import { FPS } from '../theme';

export type SceneMeta = {
  id: number; title: string; narration: string; words: number;
  planStart: string; planEnd: string; start: number; end: number; startF: number; durF: number;
};

export const SCENES: SceneMeta[] = narration.map((n, i) => {
  const t = timing.scenes[i];
  const startF = Math.round(t.start * FPS);
  const endF = Math.round(t.end * FPS);
  return { id: n.id, title: n.title, narration: n.text, words: n.words, planStart: n.planStart, planEnd: n.planEnd, start: t.start, end: t.end, startF, durF: endF - startF };
});
export const VOICE_END_FRAME = SCENES[SCENES.length - 1].startF + SCENES[SCENES.length - 1].durF;
export const TOTAL_WORDS = SCENES.reduce((a, s) => a + s.words, 0);
