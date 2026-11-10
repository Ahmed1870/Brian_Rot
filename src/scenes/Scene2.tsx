import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM_SHEET, Cells, Ev, NAME_OF, NF, Pick, RangeFx, Sim, TB, UNIQ, cellRect, fmtN, fn, mk, num, picksOf, prog, put, putTable, rangeRect, rev, G40} from '../l40';

// SC02 anchors (s, abs): 41.8 Delete | 43.6 A2=P-101 | 46.6-52.6 formula | 52.6 spill 3 cols | 55.2 shield | 59.1 A2=P-999 | 64.9 IFERROR not needed | 69.5 D4 w/o 4th arg -> #N/A
const S = START.s2;
const t = (g: number) => sec(g - S);
const FM = '=XLOOKUP(A2, tbl_Sales[Product ID], tbl_Sales[[Customer]:[Amount]], "' + NF + '")';
const F4 = '=XLOOKUP(A4, tbl_Sales[Product ID], tbl_Sales[[Customer]:[Amount]])';
const EVS: Ev[] = [
  {r: 2, c: 1, text: 'P-101', start: t(43.6), dur: 22, enter: t(44.7)},
  {r: 2, c: 4, text: FM, start: t(46.6), dur: sec(6.0), enter: t(52.6), c2: 6},
  {r: 2, c: 1, text: 'P-999', start: t(59.1), dur: 20, enter: t(60.2)},
  {r: 4, c: 1, text: 'P-999', start: t(67.5), dur: 20, enter: t(68.6)},
  {r: 4, c: 4, text: F4, start: t(69.5), dur: sec(3.0), enter: t(72.5), c2: 6},
];
const EXTRA: Pick[] = [{at: t(41.2), r: 2, c: 1, r2: 9, c2: 6, click: true}];
const PICKS = picksOf(EVS, EXTRA);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cleared = at(42.2);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Code', b: true, bg: '#DDEBF7'});
  put(m, 1, 4, {t: 'Customer', b: true, bg: '#DDEBF7'}); put(m, 1, 5, {t: 'Branch', b: true, bg: '#DDEBF7'}); put(m, 1, 6, {t: 'Amount', b: true, bg: '#DDEBF7', al: 'r'});
  putTable(m, TB);
  if (!cleared) { UNIQ.forEach((u, i) => { put(m, 2 + i, 1, {t: u}); put(m, 2 + i, 4, {t: NAME_OF(u)}); }); }
  else {
    if (at(44.7)) put(m, 2, 1, {t: within(60.2, 200) ? 'P-999' : 'P-101'});
    const row = (r: number, code: string, ev: Ev, start: number) => {
      if (f < ev.enter) return;
      const hit = TB.find((x) => x[0] === code);
      if (hit) { const k = rev(f, ev.enter, 3, 6); if (k > 0) put(m, r, 4, {t: hit[2]}); if (k > 1) put(m, r, 5, {t: hit[3]}); if (k > 2) put(m, r, 6, num(hit[4])); }
      else if (start === 0) put(m, r, 4, {t: NF, bg: '#FFF2CC'});
      else put(m, r, 4, {t: '#N/A', al: 'r'});
    };
    if (at(60.2)) { put(m, 2, 1, {t: 'P-999'}); row(2, 'P-999', EVS[1], 0); }
    else if (at(52.6)) row(2, 'P-101', EVS[1], 1);
    if (at(68.6)) put(m, 4, 1, {t: 'P-999'});
    if (at(72.5)) row(4, 'P-999', EVS[4], 1);
  }
  const hasShield = at(60.4);
  const iferr = prog(f, t(64.9), 10) * (1 - prog(f, t(70.0), 10));
  const noShield = prog(f, t(72.7), 12);

  return (
    <Stage dur={SCENES.s2.dur} inFx="left" outFx="left">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} cam={CAM_SHEET} keys={[{at: t(42.0), keys: ['Delete'], dur: 36}]}>
        <RangeFx rect={rangeRect(2, 4, 2, 6, G40)} color={C.green} p={prog(f, EVS[1].enter, 8) * (within(52.6, 59.8) ? 1 : 0)} fill={0.14} label="3 columns · 1 formula" labelBelow />
        <RangeFx rect={rangeRect(1, 10, 13, 12, G40)} color={C.green} p={prog(f, t(47.8), 10) * (1 - prog(f, t(53.8), 12))} fill={0.12} label="return_array: Customer : Amount" />
        <RangeFx rect={rangeRect(2, 8, 13, 8, G40)} color={C.blue} p={prog(f, t(50.6), 10) * (1 - prog(f, t(53.8), 12))} fill={0.1} label="lookup_array" />
        <RangeFx rect={cellRect(2, 4, G40)} color={C.amber} p={hasShield ? prog(f, t(60.4), 8) * (1 - prog(f, t(64.5), 20) * 0.6) : 0} fill={0.25} label={'[if_not_found] = "' + NF + '"'} labelBelow />
        <RangeFx rect={cellRect(4, 4, G40)} color={C.red} p={noShield} fill={0.2} label="#N/A (no 4th argument)" labelBelow />
        <div style={{position: 'absolute', left: 60, top: 400, width: 460, opacity: iferr, transform: `scale(${0.94 + 0.06 * iferr})`, transformOrigin: '0 0', background: '#fff', border: `3px solid ${C.red}`, borderRadius: 10, boxShadow: `0 0 18px ${C.red}88`, padding: '10px 14px', fontFamily: MONO, fontSize: 16, color: '#222'}}>
          <div style={{textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 3}}>{'=IFERROR(XLOOKUP(…), "' + NF + '")'}</div>
          <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.red, marginTop: 4, direction: 'rtl'}}>مش محتاجها: الوسيط الرابع بيكفي</div>
        </div>
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(47.0), 10) * (1 - prog(f, t(55.0), 10))}}><Chip color={C.green}>Multi-Column Return ──► 1 formula · 3 columns</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(55.3), 10) * (1 - prog(f, t(64.6), 10))}}><Chip color={C.amber}>4th argument = [if_not_found]</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(72.8), 10) * (1 - prog(f, t(78.0), 10))}}><Chip color={C.red}>Without it ──► #N/A</Chip></div>
      <Caption text="Multi-Column Return ──► Returns Multiple Adjacent Columns in a Single Formula Stream" from={t(46.8)} to={t(54.6)} />
      <Caption text="Built-in Error Shield ──► [if_not_found] Prevents #N/A Without External IFERROR" from={t(75.2)} to={t(83.3)} tone="ok" />
    </Stage>
  );
};
void fmtN; void C;
