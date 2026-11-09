import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {MIX, mixNonEmpty, mixNumeric} from '../data';
import type {CellV} from '../kit';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, Mix, Ripple, Stage, clamp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, FnPill, KpiCard, RangeFx, cellRect, center, typeIn} from '../l7';

// SC03: COUNT vs COUNTA.
// Anchors (s): 85.3 data | 88.9 COUNT vs COUNTA | 91.3 COUNT | 94.0 numbers | 95.0 dates | 98.3 text ignored | 101.1 COUNTA | 102.6 all non-empty | 105.0 Non-empty Cell | 107.1 number | 107.8 text | 108.4 date | 109.2 formula "" | 111.0 difference | 116.3 COUNT use | 120.1 COUNTA use
const S = START.s3;
const t = (g: number) => sec(g - S);
const cw3 = (c: number) => [0, 120, 100, 110][c] ?? 64;
const G0 = {colW: cw3};
const isNum = (k: string) => k === 'num' || k === 'date';

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const shown = at(85.3) ? Math.min(12, 1 + Math.floor((f - t(85.3)) / sec(0.22))) : 0;

  // lit cells (progressive)
  const lit = (g0: number, step: number, pred: (i: number) => boolean) => MIX.map((m, i) => (pred(i) ? clamp((f - t(g0 + (MIX.slice(0, i).filter((_, j) => pred(j)).length) * step)) / sec(0.2)) : 0));
  const numIdx = (i: number) => isNum(MIX[i].kind);
  const nonEmpty = (i: number) => MIX[i].kind !== 'blank';
  const countRaw = lit(93.4, 0.33, numIdx);
  const countLit = countRaw.map((p) => p * (1 - prog(f, t(100.8), 10)));
  const countaLit = lit(102.6, 0.27, nonEmpty);
  const countVal = Math.min(mixNumeric, countRaw.filter((p) => p > 0.5).length);
  const countaVal = Math.min(mixNonEmpty, countaLit.filter((p) => p > 0.5).length);
  const showCount = prog(f, t(88.9), 12);
  const showCounta = prog(f, t(90.2), 12);

  // typing
  const typingA = f >= t(91.6) && f < t(95.6);
  const typingB = f >= t(101.3) && f < t(105.4);
  const txtA = typeIn('=COUNT(A2:A13)', f, t(91.6), sec(1.6));
  const txtB = typeIn('=COUNTA(A2:A13)', f, t(101.3), sec(1.6));
  const editing = typingA || typingB;
  const cellFn = (r: number, c: number): CellV | undefined => {
    if (r === 1 && c <= 3) return {t: ['Mixed Data', 'Function', 'Result'][c - 1], b: true, bg: '#E2EFDA'};
    if (c === 1 && r >= 2 && r <= 13) {
      if (r - 1 > shown) return undefined;
      const m = MIX[r - 2];
      if (m.kind === 'blank' || m.kind === 'empty') return undefined;
      return {t: m.t, al: m.kind === 'text' ? 'l' : 'r', num: isNum(m.kind) ? 1 : undefined};
    }
    if (c === 2 && r === 2 && at(91.0)) return {t: 'COUNT', b: true};
    if (c === 2 && r === 3 && at(100.8)) return {t: 'COUNTA', b: true};
    if (c === 3 && r === 2) return typingA ? {t: txtA} : at(95.6) ? {t: String(mixNumeric), al: 'r', b: true, num: mixNumeric} : undefined;
    if (c === 3 && r === 3) return typingB ? {t: txtB} : at(105.4) ? {t: String(mixNonEmpty), al: 'r', b: true, num: mixNonEmpty} : undefined;
    return undefined;
  };

  // cursor + selection
  const c2 = center(cellRect(2, 3, G0));
  const c3 = center(cellRect(3, 3, G0));
  const a13 = center(cellRect(13, 1, G0));
  const pts = dwell([
    {f: t(85.0), x: 700, y: 420},
    {f: t(90.9), x: c2.x, y: c2.y},
    {f: t(100.6), x: c2.x, y: c2.y},
    {f: t(101.0), x: c3.x, y: c3.y},
    {f: t(108.6), x: c3.x, y: c3.y},
    {f: t(109.0), x: a13.x, y: a13.y},
    {f: t(112.0), x: a13.x + 80, y: a13.y - 60},
  ]);
  const cur = track(f, pts);
  const clicks = [91.3, 101.1, 109.0];
  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Mixed Data';
  if (at(91.3)) { sel = {r1: 2, c1: 3, r2: 2, c2: 3}; active = {r: 2, c: 3}; nameBox = 'C2'; formula = typingA ? txtA : ''; }
  if (at(95.6)) { sel = {r1: 3, c1: 3, r2: 3, c2: 3}; active = {r: 3, c: 3}; nameBox = 'C3'; formula = ''; }
  if (at(101.1)) formula = typingB ? txtB : '';
  if (at(105.4)) { sel = {r1: 4, c1: 3, r2: 4, c2: 3}; active = {r: 4, c: 3}; nameBox = 'C4'; formula = ''; }
  if (at(109.0)) { sel = {r1: 13, c1: 1, r2: 13, c2: 1}; active = {r: 13, c: 1}; nameBox = 'A13'; formula = '=""'; }

  const ignored = prog(f, t(98.3), 10) * (1 - prog(f, t(100.6), 10));
  const emptyFlag = prog(f, t(109.2), 10) * (1 - prog(f, t(111.0), 10));
  const tbl = prog(f, t(106.7), 14) * (1 - prog(f, t(110.9), 10));
  const rowP = (g: number) => prog(f, t(g), 10);
  const dec = prog(f, t(111.0), 16);
  const decCount = prog(f, t(116.0), 10);
  const decCounta = prog(f, t(119.8), 10);
  const diff = prog(f, t(121.4), 16);
  const kGlowA = Math.max(0, 1 - (f - t(95.6)) / 50) * (at(95.6) ? 1 : 0);
  const kGlowB = Math.max(0, 1 - (f - t(105.4)) / 50) * (at(105.4) ? 1 : 0);

  const row = (label: string, a: boolean, b: boolean, g: number, color = C.text) => {
    const p = rowP(g);
    return (
      <div key={label} style={{display: 'flex', alignItems: 'center', height: 46, opacity: p, transform: `translateX(${(1 - p) * -26}px)`, borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 24}}>
        <div style={{flex: 1.4, color, fontWeight: 700}}>{label}</div>
        <div style={{flex: 1, textAlign: 'center', color: a ? C.green : C.red, fontWeight: 700}}>{a ? '✓ counted' : '✗ ignored'}</div>
        <div style={{flex: 1, textAlign: 'center', color: b ? C.purple : C.red, fontWeight: 700}}>{b ? '✓ counted' : '✗ ignored'}</div>
      </div>
    );
  };

  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="down">
      <ExcelWindow cam={CAM_SHEET}>
        <ExcelApp file="Book1" nameBox={nameBox} formula={formula} fbEdit={editing} colW={cw3} cell={cellFn} sel={sel} active={active} thumb={0} thumbSize={0.55}>
          {MIX.map((m, i) => {
            const r = cellRect(i + 2, 1, G0);
            const g = countLit[i] * (1 - dec * 0);
            const a = countaLit[i];
            return (
              <div key={i} style={{display: 'contents'}}>
                {g > 0.01 ? <RangeFx rect={r} color={C.green} p={g} fill={0.3} width={2} /> : null}
                {a > 0.01 ? <RangeFx rect={r} color={C.purple} p={a * (g > 0.5 ? 0.9 : 1)} fill={0.22} width={2} /> : null}
              </div>
            );
          })}
          {[3, 6].map((r) => <RangeFx key={r} rect={cellRect(r, 1, G0)} color={C.red} p={ignored} fill={0.12} dashed label="ignored" labelDx={380} />)}
          <RangeFx rect={cellRect(13, 1, G0)} color={C.amber} p={emptyFlag} fill={0.2} dashed label={'formula ""  looks empty'} labelDx={380} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <div dir="ltr" style={{position: 'absolute', left: 880, top: 74, width: 940, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <FnPill name="COUNT" color={C.green} p={showCount} />
        <div style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.muted, opacity: showCount}}>VS</div>
        <FnPill name="COUNTA" color={C.purple} p={showCounta} />
      </div>
      <KpiCard x={880} y={250} w={450} h={220} title="COUNT" sub="أرقام وتواريخ فقط" value={String(countVal)} formula="=COUNT(A2:A13)" color={C.green} p={showCount} glow={kGlowA} />
      <KpiCard x={1370} y={250} w={450} h={220} title="COUNTA" sub="كل خلية غير فارغة" value={String(countaVal)} formula="=COUNTA(A2:A13)" color={C.purple} p={showCounta} glow={kGlowB} />

      <div dir="ltr" style={{position: 'absolute', left: 880, top: 500, width: 940, opacity: tbl, borderRadius: 22, border: `2px solid ${C.border}`, background: 'rgba(15,23,42,0.94)', padding: '10px 26px 14px'}}>
        <div style={{display: 'flex', height: 44, alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
          <div style={{flex: 1.4}}>Cell content</div><div style={{flex: 1, textAlign: 'center', color: C.green}}>COUNT</div><div style={{flex: 1, textAlign: 'center', color: C.purple}}>COUNTA</div>
        </div>
        {row('Number', true, true, 107.1)}
        {row('Text', false, true, 107.8)}
        {row('Date', true, true, 108.4)}
        {row('Formula → ""', false, true, 109.2, C.amber)}
        {row('Truly blank', false, false, 110.0)}
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 880, top: 520, width: 940, opacity: dec, transform: `translateY(${(1 - dec) * 24}px)`}}>
        <div style={{borderRadius: 22, border: `2px solid ${decCount > 0.3 ? C.green : C.border}`, background: 'rgba(15,23,42,0.94)', padding: '22px 28px', boxShadow: decCount > 0.3 ? `0 0 ${20 + 14 * decCount}px ${C.green}66` : 'none'}}>
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.green}}>COUNT</div>
          <Mix style={{fontSize: 34, color: C.text, display: 'block', marginTop: 6}}>عدد المعاملات المكتملة <span style={{color: C.muted}}>· Completed transactions</span></Mix>
        </div>
        <div style={{borderRadius: 22, border: `2px solid ${decCounta > 0.3 ? C.purple : C.border}`, background: 'rgba(15,23,42,0.94)', padding: '22px 28px', marginTop: 18, boxShadow: decCounta > 0.3 ? `0 0 ${20 + 14 * decCounta}px ${C.purple}66` : 'none'}}>
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.purple}}>COUNTA</div>
          <Mix style={{fontSize: 34, color: C.text, display: 'block', marginTop: 6}}>عدد العملاء في القائمة <span style={{color: C.muted}}>· Customer roster</span></Mix>
        </div>
      </div>
      <div style={{position: 'absolute', left: 880, top: 820, opacity: diff}}><Chip color={C.gold}>9 − 6 = 3 → 2 text + 1 formula ""</Chip></div>

      <Caption text="COUNT ──► Counts Numeric & Date Cells Only" from={t(88.6)} to={t(100.6)} />
      <Caption text="COUNTA ──► Counts ALL Non-Empty Cells (Numbers, Text, Errors)" from={t(101.0)} to={t(120.5)} />
    </Stage>
  );
};
