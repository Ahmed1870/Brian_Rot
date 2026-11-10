import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, sec} from '../kit';
import {CAM0, CAM_SHEET, Cells, Ev, NAME_OF, Pick, RangeFx, Sim, TB, UNIQ, camLerp, cellRect, fn, mk, picksOf, prog, put, putTable, rangeRect, rev, G40, typeIn} from '../l40';

// SC01 anchors (s, abs): 3.5 =UNIQUE typed | 6.2 spill | 12 click A2 | 23.5 legacy crossed | 28.9 type XLOOKUP | 30 "A2#" | 35 Enter + spill
const S = START.s1;
const t = (g: number) => sec(g - S);
const F1 = '=UNIQUE(tbl_Sales[Product ID])';
const F2 = '=XLOOKUP(A2#, tbl_Sales[Product ID], tbl_Sales[Product Name])';
const EVS: Ev[] = [
  {r: 2, c: 1, text: F1, start: t(3.6), dur: sec(2.3), enter: t(6.2), r2: 7},
  {r: 2, c: 4, text: F2, start: t(28.6), dur: sec(6.0), enter: t(35.0), r2: 7},
];
const EXTRA: Pick[] = [{at: t(12.0), r: 2, c: 1, click: true}, {at: t(26.6), r: 1, c: 8, move: {x: 560, y: 330}}];
const PICKS = picksOf(EVS, EXTRA);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(2.0), 40));
  const nA = rev(f, EVS[0].enter, 6, 5), nD = rev(f, EVS[1].enter, 6, 6);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Code', b: true, bg: '#DDEBF7'});
  put(m, 1, 4, {t: 'Product Name', b: true, bg: '#DDEBF7'});
  putTable(m, TB);
  for (let i = 0; i < nA; i++) put(m, 2 + i, 1, {t: UNIQ[i]});
  for (let i = 0; i < nD; i++) put(m, 2 + i, 4, {t: NAME_OF(UNIQ[i])});
  const frameA = rangeRect(2, 1, 7, 1, G40), frameD = rangeRect(2, 4, 7, 4, G40);
  const sealA = prog(f, EVS[0].enter + 6, 10);
  const legacy = prog(f, t(23.4), 10) * (1 - prog(f, t(28.4), 10));
  const strike = prog(f, t(24.6), 8);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="left">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} cam={cam}>
        <RangeFx rect={rangeRect(1, 8, 13, 12, G40)} color={C.amber} p={prog(f, t(1.2), 10) * (1 - prog(f, t(3.0), 10))} fill={0.06} label="tbl_Sales" />
        <RangeFx rect={frameA} color={C.blue} p={sealA * (within(12.2, 36.6) ? 1 : 0)} fill={0.1} dashed label={within(29.9, 36.6) ? 'A2#  (spilled list)' : undefined} labelBelow />
        <RangeFx rect={frameD} color={C.blue} p={prog(f, EVS[1].enter, 8) * (1 - prog(f, t(40.0), 20))} fill={0.12} label="Bulk lookup spilled" labelDx={6} />
        <RangeFx rect={rangeRect(2, 8, 13, 8, G40)} color={C.green} p={prog(f, t(32.0), 10) * (1 - prog(f, t(36.0), 10))} fill={0.12} label="lookup_array" />
        <RangeFx rect={rangeRect(2, 9, 13, 9, G40)} color={C.purple} p={prog(f, t(33.2), 10) * (1 - prog(f, t(36.0), 10))} fill={0.12} label="return_array" />
      </Sim>

      <TopBadge text="الدرس 40 من 76 | الوحدة 8 من 14 ──► XLOOKUP & Dynamic Array Integration" from={t(2.0)} to={t(17.5)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(17.9), 10) * (1 - prog(f, t(22.6), 10))}}><Chip color={C.blue}>XLOOKUP ──► the modern lookup (Excel 365)</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(29.0), 10) * (1 - prog(f, t(36.6), 10))}}><Chip color={C.green}>A2# ──► one reference = the whole list</Chip></div>
      <div style={{position: 'absolute', left: 560, top: 300, width: 800, display: 'flex', gap: 40, justifyContent: 'center', opacity: legacy, transform: `scale(${0.92 + 0.08 * legacy})`}} dir="ltr">
        {['VLOOKUP', 'HLOOKUP', 'Manual drag'].map((n, i) => (
          <div key={n} style={{position: 'relative', padding: '16px 28px', borderRadius: 18, background: C.card, border: `2px solid ${C.red}`, boxShadow: `0 0 30px ${C.red}55`, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.text}}>
            {n}
            <div style={{position: 'absolute', left: 8, top: '50%', height: 5, width: `${strike * 100 - 2}%`, background: C.red, borderRadius: 3, transform: `rotate(${i % 2 ? 2 : -2}deg)`}} />
          </div>
        ))}
      </div>
      <Caption text="Spilled Bulk Lookup ──► =XLOOKUP(A2#, lookup_array, return_array) (Zero Manual Drag)" from={t(35.3)} to={t(39.8)} />
    </Stage>
  );
};
void typeIn; void cellRect;
