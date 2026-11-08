import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SMALL, fmtInt, fmtStat, smallCell, statsOf, tierOf} from '../data';
import {
  dwell, CAM0, CAM_NB, CAM_STATUS, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, NAME_BOX, Neon, Ripple, Stage, XL, camLerp, cellCenter, clamp, geo, prog, sec, track, typed,
} from '../kit';

// SC03: Name Box navigation + expanding the Formula Bar.
// Anchors (s): 83.87 Name Box | 93.88 A1:Z1000 | 94.96 Enter | 98.31 instantly | 101.33 formulas | 106.01 Ctrl+Shift+U | 107.39 readable | 112.83 technique
const S = START.s3;
const t = (g: number) => sec(g - S);
const FORMULA_LINES = ['=IF(', '    G2>=5000, "Premium",', '    IF(G2>=1000, "Standard", "Basic")', ')'];
const FORMULA_ONE = '=IF( G2>=5000, "Premium", IF(G2>=1000, "Standard", "Basic") )';

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  let cam = CAM_NB;
  cam = camLerp(cam, CAM0, prog(f, t(95.3), 40));
  cam = camLerp(cam, CAM_NB, prog(f, t(100.0), 40));
  cam = camLerp(cam, CAM_STATUS, prog(f, t(118.6), 60));

  const g0 = geo(1, 0, 1);
  const nbY = g0.fbTop + 14;
  const a1 = cellCenter(1, 1, {});
  const h2 = cellCenter(2, 8, {});
  const g2 = cellCenter(2, 7, {});
  const g19 = cellCenter(19, 7, {});

  // slow manual drag (old way) 88.3 -> 92.5
  const dragP = clamp((f - t(88.3)) / sec(4.2));
  const dragging = at(88.3) && !at(92.7);
  const dragRow = 1 + Math.floor(dragP * 180);
  let sel = {r1: 1, c1: 1, r2: 1, c2: 1};
  let active = {r: 1, c: 1};
  let scroll = {r: 1, c: 1};
  let nameBox = 'A1';
  let formula = 'Order ID';
  if (dragging) { sel = {r1: 1, c1: 1, r2: dragRow, c2: 1}; scroll = {r: Math.max(1, dragRow - 18), c: 1}; nameBox = `${dragRow}R x 1C`; }
  const nameEdit = f >= t(93.6) && f < t(94.96);
  const typedText = typed('A1:Z1000', f, t(93.7), 0.3);
  if (nameEdit) nameBox = typedText;
  if (at(94.96)) { sel = {r1: 1, c1: 1, r2: 1000, c2: 26}; nameBox = 'A1'; }
  if (at(101.95)) { sel = {r1: 2, c1: 8, r2: 2, c2: 8}; active = {r: 2, c: 8}; nameBox = 'H2'; }
  const expP = prog(f, t(106.01), 16) * (1 - prog(f, t(117.4), 16));
  const lines = FORMULA_LINES.length;
  if (at(101.95)) formula = expP > 0.5 ? FORMULA_LINES.join('\n') : FORMULA_ONE;
  if (at(118.9)) { sel = {r1: 2, c1: 7, r2: 19, c2: 7}; active = {r: 2, c: 7}; nameBox = 'G2'; formula = '=E2*F2'; }
  const gP = clamp((f - t(118.3)) / sec(0.6));
  if (f >= t(118.3) && f < t(118.9)) { sel = {r1: 2, c1: 7, r2: 2 + Math.floor(gP * 17), c2: 7}; active = {r: 2, c: 7}; nameBox = 'G2'; formula = '=E2*F2'; }

  const st = statsOf(sel.r1, sel.c1, sel.r2, sel.c2);
  const stats: Array<[string, string]> | undefined = st.numCount && !dragging ? [['Average', fmtStat(st.avg)], ['Count', fmtInt(st.count)], ['Sum', fmtStat(st.sum)]] : undefined;

  const pts = dwell([
    {f: t(79.4), x: 900, y: 330},
    {f: t(83.7), x: NAME_BOX.cx, y: nbY},
    {f: t(87.9), x: a1.x, y: a1.y},
    {f: t(88.3), x: a1.x, y: a1.y},
    {f: t(92.5), x: a1.x, y: 560},
    {f: t(93.5), x: NAME_BOX.cx, y: nbY},
    {f: t(101.2), x: NAME_BOX.cx + 6, y: nbY},
    {f: t(101.9), x: h2.x, y: h2.y},
    {f: t(117.9), x: h2.x, y: h2.y},
    {f: t(118.3), x: g2.x, y: g2.y},
    {f: t(118.9), x: g19.x, y: g19.y},
  ]);
  const cur = track(f, pts);
  const clicks = [93.6, 101.95, 118.3];
  const nbNeon = prog(f, t(83.9), 14) * (1 - prog(f, t(93.0), 12));
  const fbNeon = prog(f, t(106.01), 14) * (1 - prog(f, t(117.4), 14));
  const fbH = geo(1, expP, lines).fbH;
  const cells = Math.max(0, (sel.r2 - sel.r1 + 1) * (sel.c2 - sel.c1 + 1));
  const showCells = at(94.96) && !at(101.9);
  const dragWarn = prog(f, t(88.3), 10) * (1 - prog(f, t(92.9), 10));
  const okChip = prog(f, t(112.83), 14) * (1 - prog(f, t(118.0), 12));
  const r2total = SMALL[0] ? tierOf(SMALL[0].total) : '';

  return (
    <Stage dur={SCENES.s3.dur} inFx="none" outFx="none">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Book1" qat={['pasteValues', 'filter', 'sortAsc', 'clearFormats']} nameBox={nameBox} nameEdit={nameEdit} formula={formula}
          fbExp={expP} fbLines={lines} fbEdit={false} scroll={scroll}
          cell={(r, c) => (c === 8 && r >= 2 && r <= 19 ? {...smallCell(r, c)!} : smallCell(r, c))}
          sel={sel} active={active} stats={stats} thumb={dragging ? dragP * 0.4 : 0} thumbSize={dragging ? 0.08 : 0.55}
        >
          <Neon x={NAME_BOX.x} y={g0.fbTop + 2} w={NAME_BOX.w} h={24} color={C.purple} p={nbNeon} />
          <Neon x={0} y={g0.fbTop} w={XL.W} h={fbH} color={C.purple} p={fbNeon} />
          {[93.6, 101.95, 118.3].map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={['Ctrl', 'Shift', 'U']} p={prog(f, t(106.0), 8) * (1 - prog(f, t(110.5), 10))} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: dragWarn}}>
        <Chip color={C.red}>Manual drag ✗ slow</Chip>
      </div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: showCells ? prog(f, t(95.0), 10) : 0}}>
        <Chip color={C.green}>A1:Z1000 = {fmtInt(cells)} cells ⚡</Chip>
      </div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: okChip, fontFamily: MONO}}>
        <Chip color={C.purple}>✓ Readable formula · fewer errors</Chip>
      </div>
      <Caption text="Name Box Navigation ──► Type A1:Z1000 for Instant Multi-Row Selection" from={t(88.0)} to={t(105.6)} />
      <Caption text="Expand Formula Bar (Ctrl + Shift + U) ──► View Complex Multi-Line Formulas" from={t(106.0)} to={t(119.0)} />
      <div style={{display: 'none'}}>{r2total}</div>
    </Stage>
  );
};
