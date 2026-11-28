import { TermLine } from './code';
import { typedCount } from './util';
import { C } from '../theme';

export type Step = { text: string; t0: number; dur: number };

/** Builds the visible document + caret position from a list of typing steps appended in order. */
export const buildDoc = (base: string, steps: Step[], t: number) => {
  let doc = base;
  let typingNow = false;
  for (const s of steps) {
    const n = typedCount(s.text, s.t0, s.dur, t);
    doc += s.text.slice(0, n);
    if (n > 0 && n < s.text.length) typingNow = true;
    if (n < s.text.length) break;
  }
  const lines = doc.split('\n');
  const line = lines.length - 1;
  return { lines, cursor: { line, col: lines[line].length }, typingNow };
};

export type Run = { at: number; cmd: string; lines: { at: number; text: string; color?: string }[] };

/** Terminal content: prompt, typed command after a run click, then output lines as they appear. */
export const buildTerm = (runs: Run[], t: number): TermLine[] => {
  const out: TermLine[] = [];
  let pendingPrompt = true;
  for (const r of runs) {
    if (t < r.at) break;
    const n = typedCount(r.cmd, r.at + 0.15, 0.5, t);
    out.push({ text: r.cmd.slice(0, n), cmd: true });
    pendingPrompt = false;
    if (n < r.cmd.length) break;
    r.lines.forEach((l) => { if (t >= l.at) out.push({ text: l.text, color: l.color }); });
    const done = r.lines.every((l) => t >= l.at);
    if (done) pendingPrompt = true;
  }
  if (pendingPrompt) out.push({ text: '', cmd: true });
  return out;
};

export const outLines = (stdout: string, at: number, gap = 0.0, color?: string) =>
  stdout.replace(/\n$/, '').split('\n').map((text, i) => ({ at: at + i * gap, text, color }));

export const errLines = (stderr: string, at: number, gap = 0.12) =>
  stderr.replace(/\n$/, '').split('\n').map((text, i) => ({ at: at + i * gap, text, color: i === stderr.replace(/\n$/, '').split('\n').length - 1 ? C.red : '#F0A3A0' }));
