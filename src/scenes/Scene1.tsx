import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {REV7, cw7, fmtInt, fmtMoney, mainCell} from '../data';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, TopBadge, camLerp, clamp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, CAM_ZOOM_C, FnPill, KpiCard, RangeFx, cellRect, center, rangeRect, roll, stat3, typeIn} from '../l7';

// SC01: SUM + AutoSum (Alt + =).
// Anchors (s): 1.2 welcome | 10.35 SUM | 10.85 AVERAGE | 11.7 COUNT | 12.25 COUNTA | 13.4 SUM backbone | 17.6 whole range | 21.9 manual typing | 25.25 Alt | 25.95 = | 28.0 range detected | 30.8 instantly (Enter)
const S = START.s1;
const t = (g: number) => sec(g - S);
const G0 = {colW: cw7};
const FORMULA = '=SUM(C2:C11)';
const TOTAL = REV7.reduce((a, b) => a + b, 0);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  let cam = camLerp(CAM0, CAM_SHEET, prog(f, t(6.3), 50));
  cam = camLerp(cam, CAM_ZOOM_C, prog(f, t(37.7), 55));

  const c12 = center(cellRect(12, 3, G0));
  const c2 = center(cellRect(2, 3, G0));
  const c11 = center(cellRect(11, 3, G0));
  const pts = dwell([
    {f: t(0), x: 760, y: 470},
    {f: t(13.2), x: c12.x, y: c12.y},
    {f: t(17.7), x: c12.x, y: c12.y},
    {f: t(18.2), x: c2.x, y: c2.y},
    {f: t(20.4), x: c11.x, y: c11.y},
    {f: t(21.0), x: c12.x, y: c12.y},
    {f: t(38.0), x: c12.x, y: c12.y},
  ]);
  const cur = track(f, pts);
  const clicks = [13.5, 18.2, 21.2, 31.7];
  const dragging = at(18.2) && !at(20.5);

  // selection
  let sel = {r1: 12, c1: 3, r2: 12, c2: 3};
  let active = {r: 12, c: 3};
  let nameBox = 'C12';
  if (at(18.2) && !at(21.2)) {
    const r2 = dragging ? 2 + Math.floor(clamp((f - t(18.2)) / sec(2.0)) * 9.99) : 11;
    sel = {r1: 2, c1: 3, r2, c2: 3}; active = {r: 2, c: 3};
    nameBox = dragging ? `${r2 - 1}R x 1C` : 'C2';
  }
  if (at(30.8) && !at(31.7)) { sel = {r1: 13, c1: 3, r2: 13, c2: 3}; active = {r: 13, c: 3}; nameBox = 'C13'; }

  // typing / edit state of C12
  const manual = f >= t(21.9) && f < t(23.4);
  const auto = f >= t(25.95) && f < t(30.8);
  const editText = manual ? typeIn(FORMULA, f, t(21.9), sec(1.1)) : auto ? FORMULA : '';
  const editing = manual || auto;
  const val = Math.round(roll(0, TOTAL, f, t(30.8), sec(1.3)));
  const cell12 = at(30.8) ? {t: fmtMoney(val), num: TOTAL, al: 'r' as const, b: true} : undefined;
  const formula = editing ? editText : at(31.7) ? FORMULA : '';

  // status bar stats for multi-cell selection
  const nSel = sel.r2 - sel.r1 + 1;
  let stats: Array<[string, string]> | undefined;
  if (sel.c1 === 3 && sel.r1 === 2 && nSel > 1) {
    const part = REV7.slice(0, nSel);
    const s = part.reduce((a, b) => a + b, 0);
    stats = stat3(fmtInt(Math.round((s / nSel) * 1000) / 1000), String(nSel), fmtInt(s));
  }

  const blueGlow = prog(f, t(1.5), 14) * (1 - prog(f, t(21.4), 12));
  const rangeTint = prog(f, t(17.6), 12) * (1 - prog(f, t(21.0), 10));
  const detect = prog(f, t(25.95), 10) * (1 - prog(f, t(31.2), 10));
  const doneGlow = prog(f, t(30.8), 12) * (1 - 0.25 * prog(f, t(33), 20));
  const keyP = prog(f, t(25.0), 8) * (1 - prog(f, t(28.4), 10));
  const keys = at(25.95) ? ['Alt', '='] : ['Alt'];
  const pillsP = prog(f, t(10.3), 8) * (1 - prog(f, t(17.2), 10));
  const manualChip = prog(f, t(22.0), 10) * (1 - prog(f, t(24.0), 10));
  const cmp = prog(f, t(32.6), 16);
  const statChip = stats ? prog(f, t(18.4), 8) : 0;
  const kpiGlow = Math.max(0, 1 - (f - t(30.8) - 45) / 60);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="none">
      <ExcelWindow cam={cam} glow={blueGlow > 0.4 ? C.blue : undefined}>
        <ExcelApp
          file="Book1" nameBox={nameBox} formula={formula} fbEdit={editing} colW={cw7}
          cell={(r, c) => mainCell(r, c, REV7, {c12: cell12, edit: editing ? {r: 12, c: 3, t: editText} : undefined})}
          sel={sel} active={active} stats={stats} thumb={0} thumbSize={0.55}
        >
          <RangeFx rect={cellRect(12, 3, G0)} color={C.blue} p={blueGlow} fill={0.12} label="Target cell" labelDx={214} />
          <RangeFx rect={rangeRect(2, 3, 11, 3, G0)} color={C.green} p={rangeTint} fill={0.1} label="10 numeric cells" labelDx={214} />
          <RangeFx rect={rangeRect(2, 3, 11, 3, G0)} color={C.green} p={detect} fill={0.12} dashed label="Range auto-detected" labelDx={214} />
          <RangeFx rect={cellRect(12, 3, G0)} color={C.green} p={doneGlow} fill={0.2} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={dragging || clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="الدوال الحسابية والإحصائية الأساسية | SUM, AVERAGE, COUNT, COUNTA" from={t(2.0)} to={t(9.8)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', gap: 22, opacity: pillsP}} dir="ltr">
        <FnPill name="SUM" color={C.green} p={prog(f, t(10.35), 10)} />
        <FnPill name="AVERAGE" color={C.blue} p={prog(f, t(10.85), 10)} />
        <FnPill name="COUNT" color={C.gold} p={prog(f, t(11.7), 10)} />
        <FnPill name="COUNTA" color={C.purple} p={prog(f, t(12.25), 10)} />
      </div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: manualChip}}><Chip color={C.red}>Manual typing ✗ slow &amp; error-prone</Chip></div>
      <KeyBadge keys={keys} p={keyP} />
      <div dir="ltr" style={{position: 'absolute', left: 100, top: 82, opacity: statChip}}><Chip color={C.blue}>Status Bar ──► {stats ? stats.map(([k, v]) => `${k}: ${v}`).join('  ·  ') : ''}</Chip></div>

      <KpiCard x={1010} y={300} w={740} h={230} title="SUM · Total Revenue" value={fmtMoney(val)} formula={FORMULA} color={C.green} p={prog(f, t(30.8), 14)} glow={kpiGlow} badge="AutoSum" />
      <div style={{position: 'absolute', left: 1010, top: 560, width: 740, opacity: cmp, transform: `translateY(${(1 - cmp) * 20}px)`, display: 'flex', gap: 18}} dir="ltr">
        <div style={{flex: 1, borderRadius: 18, border: `2px solid ${C.red}`, background: 'rgba(15,23,42,0.94)', padding: '14px 20px'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.red, fontWeight: 700}}>Manual ✗</div>
          <div style={{fontSize: 34, fontWeight: 700, color: C.text, marginTop: 4}}>13 keystrokes</div>
        </div>
        <div style={{flex: 1, borderRadius: 18, border: `2px solid ${C.green}`, background: 'rgba(15,23,42,0.94)', padding: '14px 20px'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>AutoSum ✓</div>
          <div style={{fontSize: 34, fontWeight: 700, color: C.text, marginTop: 4}}>Alt + = , Enter</div>
        </div>
      </div>
      <Caption text="AutoSum Shortcut: Alt + = ──► Instant Range Detection & Summation" from={t(22.0)} to={t(38.0)} />
    </Stage>
  );
};
