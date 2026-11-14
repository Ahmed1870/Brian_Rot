import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, CellV, Stage, clamp, prog, sec} from '../kit';
import {Pointer, Wp} from '../lq';
import {Tag} from '../l54';
import {Host63, OUTLIER, OUT_ID, SAMPLE, SAMP_IDS, cellC, f2, fmt, meanOf, medOf} from '../l63';

// SC03 anchors (s, abs): 88.2 axis | 91.2/92.3/93.4 trio | 96-98 AVERAGE | 100.9 outlier typed | 102.4-103.4 mean pulled | 106 MEDIAN | 108-110 sorted+middle | 114.8 MODE.SNGL | 117.3 mode dots | 121.9 typical spend
const S = START.s3;
const t = (g: number) => sec(g - S);
const cwM = (c: number) => [0, 90, 100, 30, 150, 150][c] ?? 64;
const ALL = [...SAMPLE, OUTLIER];
const M14 = meanOf(SAMPLE), M15 = meanOf(ALL), MD14 = medOf(SAMPLE), MD15 = medOf(ALL);
const MODE = (() => { const m: Record<number, number> = {}; let b = SAMPLE[0], bc = 0; ALL.forEach((x) => { m[x] = (m[x] ?? 0) + 1; if (m[x] > bc) { bc = m[x]; b = x; } }); return b; })();
const P = {x: 700, y: 226, w: 790, h: 262};
const XM = 30000;
const px = (v: number) => 30 + (v / XM) * (P.w - 60);
const pointer = (g: number, r: number, c: number): [number, number, number] => [g, cellC(r, c, cwM).x, cellC(r, c, cwM).y];
const EV: Array<[number, number, number]> = [pointer(95.4, 2, 5), pointer(100.9, 16, 2), pointer(105.6, 3, 5), pointer(114.3, 4, 5)];
const PTS: Wp[] = [{f: 0, x: 900, y: 560}];
const CLICKS: number[] = [];
EV.forEach(([g, x, y]) => { PTS.push({f: t(g - 0.3), x, y}, {f: t(g), x, y}); CLICKS.push(t(g)); });
PTS.push({f: t(118.5), x: 1000, y: 560});
const ty = (s: string, f: number, a: number, b: number) => s.slice(0, Math.floor(s.length * prog(f, t(a), sec(b - a)) + 0.0001));

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const hasOut = at(102.4);
  const pull = prog(f, t(102.4), sec(1.0));
  const meanNow = M14 + (M15 - M14) * pull;
  const medNow = hasOut ? MD15 : MD14;
  const vals = hasOut ? ALL : SAMPLE;
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.16);
  // formulas typing
  const fAvg = '=AVERAGE(B2:B16)', fMed = '=MEDIAN(B2:B16)', fMode = '=MODE.SNGL(B2:B16)';
  const tAvg = ty(fAvg, f, 96.0, 97.8), tMed = ty(fMed, f, 106.0, 107.4), tMode = ty(fMode, f, 114.8, 116.8);
  const outTyped = ty('28800', f, 101.0, 102.2);
  const formula = f >= t(114.3) ? (at(117.0) ? fMode : tMode) : f >= t(105.6) ? (at(107.5) ? fMed : tMed) : f >= t(100.9) ? (outTyped.length >= 5 ? '28800' : outTyped) : f >= t(95.4) ? (at(97.9) ? fAvg : tAvg) : '';
  const sel = f >= t(114.3) ? {r: 4, c: 5} : f >= t(105.6) ? {r: 3, c: 5} : f >= t(100.9) ? {r: 16, c: 2} : {r: 2, c: 5};
  const cell = (r: number, c: number): CellV | undefined => {
    if (r === 1) return c === 1 ? {t: 'Order ID', b: true, bg: '#4472C4', color: '#fff'} : c === 2 ? {t: 'Total', b: true, bg: '#4472C4', color: '#fff', al: 'r'} : c === 4 ? {t: 'Measure', b: true, bg: '#4472C4', color: '#fff'} : c === 5 ? {t: 'Result', b: true, bg: '#4472C4', color: '#fff', al: 'r'} : undefined;
    if (r >= 2 && r <= 15 && c <= 2) { const bg = r % 2 === 0 ? '#D9E1F2' : undefined; return c === 1 ? {t: SAMP_IDS[r - 2], bg} : {t: fmt(SAMPLE[r - 2]), num: 1, al: 'r', bg}; }
    if (r === 16 && c <= 2) { if (outTyped.length === 0) return undefined; return c === 1 ? {t: OUT_ID} : {t: at(102.3) ? fmt(OUTLIER) : outTyped, num: 1, al: 'r', bg: at(102.3) ? '#FECACA' : undefined, b: at(102.3)}; }
    if (c === 4 && r === 2 && at(96.0)) return {t: 'AVERAGE'};
    if (c === 4 && r === 3 && at(106.0)) return {t: 'MEDIAN'};
    if (c === 4 && r === 4 && at(114.8)) return {t: 'MODE.SNGL'};
    if (c === 5 && r === 2 && at(96.0)) return at(97.9) ? {t: f2(meanNow), num: 1, al: 'r', bg: hasOut ? '#FECACA' : undefined, b: true} : {t: tAvg, al: 'l'};
    if (c === 5 && r === 3 && at(106.0)) return at(107.5) ? {t: fmt(medNow), num: 1, al: 'r', bg: '#E9D5FF', b: true} : {t: tMed, al: 'l'};
    if (c === 5 && r === 4 && at(114.8)) return at(117.0) ? {t: fmt(MODE), num: 1, al: 'r', bg: '#E9D5FF', b: true} : {t: tMode, al: 'l'};
    return undefined;
  };
  // dots (stack duplicates)
  const seen: Record<number, number> = {};
  const dots = vals.map((v, i) => { const k = seen[v] ?? 0; seen[v] = k + 1; return {v, i, k}; });
  const sorted = [...vals].sort((a, b) => a - b);
  const rank = (v: number, k: number) => sorted.findIndex((x, j) => x === v && sorted.slice(0, j).filter((y) => y === v).length === k) + 1;
  const axisP = prog(f, t(88.2), 14);
  const rankP = prog(f, t(108.0), 14) * (1 - prog(f, t(113.0), 10));
  const medRingP = prog(f, t(109.9), 10);
  const modeP = prog(f, t(117.3), 10);
  const BY = 150;
  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Host63 cell={cell} colW={cwM} sheets={['Sample']} sheet="Sample" sel={{r1: sel.r, c1: sel.c, r2: sel.r, c2: sel.c}} active={sel} nameBox={`${'ABCDE'[sel.c - 1]}${sel.r}`} formula={formula} fbEdit={formula.length > 0 && !at(97.9) ? true : undefined}>
        <svg width={P.w} height={P.h} style={{position: 'absolute', left: P.x, top: P.y, zIndex: 30, overflow: 'visible'}}>
          <g opacity={clamp(axisP)}>
            <rect width={P.w} height={P.h} rx={14} fill="#0B1222" stroke={C.blue} strokeWidth={2} />
            <line x1={30} x2={P.w - 30} y1={BY + 16} y2={BY + 16} stroke="#475569" strokeWidth={2} />
            {[0, 5000, 10000, 15000, 20000, 25000, 30000].map((v) => <g key={v}><line x1={px(v)} x2={px(v)} y1={BY + 16} y2={BY + 22} stroke="#475569" /><text x={px(v)} y={BY + 38} textAnchor="middle" fill="#94A3B8" fontFamily={MONO} fontSize={12}>{fmt(v)}</text></g>)}
            <text x={P.w - 20} y={BY + 54} textAnchor="end" fill="#64748B" fontFamily={MONO} fontSize={11}>Total per invoice (sample of {vals.length})</text>
            {dots.map(({v, i, k}) => {
              const isOut = v === OUTLIER && i === SAMPLE.length;
              const flyIn = isOut ? prog(f, t(102.2), sec(0.6)) : 1;
              const isMode = v === MODE && modeP > 0 && !isOut;
              return (
                <g key={i} opacity={flyIn}>
                  {isMode ? <circle cx={px(v)} cy={BY - k * 18 - (1 - flyIn) * 60} r={13 + 3 * pulse} fill="none" stroke={C.purple} strokeWidth={3} /> : null}
                  <circle cx={px(v)} cy={BY - k * 18 - (1 - flyIn) * 60} r={7} fill={isOut ? C.red : C.blue} stroke="#0B1222" strokeWidth={1.5} />
                </g>
              );
            })}
            {/* trio legend */}
            {[['Mean · AVERAGE', C.red, 91.2, 30], ['Median · MEDIAN', C.purple, 92.3, 250], ['Mode · MODE.SNGL', C.purple, 93.4, 480]].map(([lab, col, g, x]) => (
              <g key={String(lab)} opacity={prog(f, t(Number(g)), 10)}><circle cx={Number(x)} cy={24} r={6} fill={String(col)} /><text x={Number(x) + 14} y={29} fill={C.text} fontFamily={MONO} fontSize={14} fontWeight={700}>{String(lab)}</text></g>
            ))}
            {/* sorted strip */}
            {rankP > 0.05 ? (
              <g opacity={rankP}>
                <text x={30} y={P.h - 44} fill="#94A3B8" fontFamily={MONO} fontSize={11}>sorted ascending:</text>
                {sorted.map((v, i) => <text key={i} x={30 + i * 49} y={P.h - 26} fill={C.text} fontFamily={MONO} fontSize={12}>{fmt(v)}</text>)}
              </g>
            ) : null}
            {medRingP > 0.05 ? <rect x={30 + Math.floor(sorted.length / 2) * 49 - 4} y={P.h - 41} width={50} height={20} rx={5} fill="none" stroke={C.purple} strokeWidth={2.5} opacity={medRingP} /> : null}
            {/* mean marker (above) */}
            {at(97.9) ? (
              <g>
                <line x1={px(meanNow)} x2={px(meanNow)} y1={46} y2={BY + 16} stroke={hasOut ? C.red : C.blue} strokeWidth={3} strokeDasharray="7 5" />
                <text x={Math.min(px(meanNow) + 8, P.w - 190)} y={46} fill={hasOut ? C.red : C.blue} fontFamily={MONO} fontSize={14} fontWeight={700}>Mean {f2(meanNow)}</text>
              </g>
            ) : null}
            {/* median marker */}
            {at(107.5) ? (
              <g>
                <line x1={px(medNow)} x2={px(medNow)} y1={60} y2={BY + 16} stroke={C.purple} strokeWidth={3 + 2 * medRingP * pulse} />
                <text x={px(medNow) + 8} y={70} textAnchor="start" fill={C.purple} fontFamily={MONO} fontSize={14} fontWeight={700}>Median {fmt(medNow)}</text>
              </g>
            ) : null}
            {at(114.8) ? <text x={P.w - 20} y={P.h - 30} textAnchor="end" fill={C.purple} fontFamily={MONO} fontSize={14} fontWeight={700} opacity={modeP}>Mode {fmt(MODE)} (appears twice)</text> : null}
          </g>
        </svg>
        <Tag x={700} y={500} text={`Mean ${f2(M14)} → ${f2(M15)} with ONE big invoice (+${Math.round(((M15 - M14) / M14) * 100)}%)`} color={C.red} p={prog(f, t(103.6), 10) * (1 - prog(f, t(105.6), 8))} dark />
        <Tag x={700} y={500} text={`Median ${fmt(MD14)} → ${fmt(MD15)} · barely moves`} color={C.purple} p={prog(f, t(112.4), 10) * (1 - prog(f, t(114.6), 8))} dark />
        <Tag x={700} y={500} text="MODE.SNGL ──► the most frequent invoice value" color={C.purple} p={prog(f, t(117.6), 10) * (1 - prog(f, t(121.4), 8))} dark />
        <Tag x={700} y={500} text="Typical spend = Median / Mode · not a distorted Mean" color={C.green} p={prog(f, t(121.9), 10)} />
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(118.8)} />
      </Host63>
      <Caption text="Central Tendency Trio ──► Mean (Sensitive to Outliers) vs. Median (Outlier-Resistant Center)" from={t(88.0)} to={t(106.0)} tone="danger" />
      <Caption text="Frequency Detection ──► MODE.SNGL Identifies Most Frequent Transaction Value" from={t(110.0)} to={t(128.0)} />
    </Stage>
  );
};
