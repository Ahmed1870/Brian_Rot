import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {REV7, countOf, cw7, fmt2, fmtInt, fmtMoney, fmtMoney2, mainCell, sumOf} from '../data';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Mix, Ripple, Stage, camLerp, clamp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, CAM_ZOOM_C, RangeFx, cellRect, center, roll, typeIn} from '../l7';

// SC02: AVERAGE, blank vs zero.
// Anchors (s): 44.6 AVERAGE | 46.8 sum / count | 54.0 blanks appear | 57.1 ignores blanks | 60.6 ten cells, two blank | 65.0 eight | 66.3 careful | 68.5 zero | 69.2 counted | 72.1 summary
const S = START.s2;
const t = (g: number) => sec(g - S);
const G0 = {colW: cw7};
const FORMULA = '=AVERAGE(C2:C11)';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const cam = camLerp(CAM_ZOOM_C, CAM_SHEET, prog(f, t(41.3), 56));

  // data state
  const arr: Array<number | null> = REV7.slice();
  if (at(54.0)) arr[2] = at(68.6) ? 0 : null;
  if (at(54.6)) arr[6] = null;
  const s = sumOf(arr), n = countOf(arr), avg = s / n;

  const c13 = center(cellRect(13, 3, G0));
  const c4 = center(cellRect(4, 3, G0));
  const c8 = center(cellRect(8, 3, G0));
  const c12 = center(cellRect(12, 3, G0));
  const pts = dwell([
    {f: t(39.98), x: c12.x, y: c12.y},
    {f: t(43.3), x: c13.x, y: c13.y},
    {f: t(52.9), x: c13.x, y: c13.y},
    {f: t(53.6), x: c4.x, y: c4.y},
    {f: t(54.3), x: c8.x, y: c8.y},
    {f: t(55.4), x: c13.x + 40, y: c13.y + 18},
    {f: t(66.2), x: c13.x + 40, y: c13.y + 18},
    {f: t(66.8), x: c4.x, y: c4.y},
    {f: t(70.5), x: c4.x + 60, y: c4.y + 90},
  ]);
  const cur = track(f, pts);
  const clicks = [43.9, 53.7, 54.4, 66.9];

  // typing in C13 and in C4
  const typingAvg = f >= t(44.6) && f < t(46.4);
  const typingZero = f >= t(67.9) && f < t(68.6);
  const editText = typingAvg ? typeIn(FORMULA, f, t(44.6), sec(1.5)) : typingZero ? '0' : '';
  const editing = typingAvg || typingZero;
  const avgVal = at(46.4) ? fmtMoney2(avg) : '';
  const c13cell = at(46.4) ? {t: avgVal, num: avg, al: 'r' as const, b: true} : undefined;
  const c12cell = {t: fmtMoney(s), num: s, al: 'r' as const, b: true};

  let sel = {r1: 12, c1: 3, r2: 12, c2: 3};
  let active = {r: 12, c: 3};
  let nameBox = 'C12';
  let formula = '=SUM(C2:C11)';
  if (at(43.9)) { sel = {r1: 13, c1: 3, r2: 13, c2: 3}; active = {r: 13, c: 3}; nameBox = 'C13'; formula = typingAvg ? editText : ''; }
  if (at(46.4)) { sel = {r1: 14, c1: 3, r2: 14, c2: 3}; active = {r: 14, c: 3}; nameBox = 'C14'; formula = ''; }
  if (at(53.7)) { sel = {r1: 4, c1: 3, r2: 4, c2: 3}; active = {r: 4, c: 3}; nameBox = 'C4'; formula = at(54.0) ? '' : '960'; }
  if (at(54.4)) { sel = {r1: 8, c1: 3, r2: 8, c2: 3}; active = {r: 8, c: 3}; nameBox = 'C8'; formula = at(54.6) ? '' : '540'; }
  if (at(66.9)) { sel = {r1: 4, c1: 3, r2: 4, c2: 3}; active = {r: 4, c: 3}; nameBox = 'C4'; formula = typingZero ? '0' : ''; }
  if (at(68.6)) { sel = {r1: 5, c1: 3, r2: 5, c2: 3}; active = {r: 5, c: 3}; nameBox = 'C5'; formula = ''; }

  // glows
  const lastGreen = 1 - prog(f, t(41.5), 18);
  const blueC13 = prog(f, t(46.4), 12) * (1 - prog(f, t(69.0), 10));
  const blankFx = prog(f, t(54.0), 10) * (1 - prog(f, t(68.6), 6));
  const zeroFx = prog(f, t(68.8), 10);
  const amberC13 = prog(f, t(69.2), 12);

  // panel
  const panel = prog(f, t(46.8), 16) * (1 - prog(f, t(72.0), 12));
  const compare = prog(f, t(72.3), 18);
  const hiSum = prog(f, t(47.8), 8) * (1 - prog(f, t(49.0), 8));
  const hiDiv = prog(f, t(49.0), 8) * (1 - prog(f, t(50.6), 8));
  const eight = prog(f, t(63.7), 10) * (1 - prog(f, t(65.9), 12));
  const nine = prog(f, t(69.0), 10);
  const avgShown = at(68.6) ? roll(2425, 19400 / 9, f, t(69.2), sec(2.0)) : at(54.6) ? roll(2215.5556, 2425, f, t(54.6), sec(0.6)) : at(54.0) ? roll(2090, 2215.5556, f, t(54.0), sec(0.6)) : avg;
  const denColor = at(68.6) ? C.amber : C.blue;
  const pulseKey = (g: number) => prog(f, t(g), 5) * (1 - prog(f, t(g + 0.5), 6));
  const keyP = Math.max(pulseKey(54.0), pulseKey(54.6));

  const boxes = arr.map((v, i) => {
    const blank = v === null; const zero = v === 0;
    const col = blank ? C.blue : zero ? C.amber : C.green;
    return (
      <div key={i} style={{width: 150, height: 66, borderRadius: 12, boxSizing: 'border-box', border: `2px ${blank ? 'dashed' : 'solid'} ${col}`, background: blank ? 'transparent' : `${col}1c`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: MONO, color: C.text, boxShadow: zero ? `0 0 18px ${C.amber}` : 'none'}}>
        <div style={{fontSize: 24, fontWeight: 700, opacity: blank ? 0.35 : 1}}>{blank ? '—' : fmtInt(v as number)}</div>
        <div style={{fontSize: 13, color: col, fontWeight: 700}}>{blank ? 'blank · ignored' : zero ? '0 · counted' : `C${i + 2}`}</div>
      </div>
    );
  });

  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Book1" nameBox={nameBox} formula={formula} fbEdit={editing} colW={cw7}
          cell={(r, c) => mainCell(r, c, arr, {c12: c12cell, c13: c13cell, b13: at(43.0), edit: editing ? {r: typingZero ? 4 : 13, c: 3, t: editText} : undefined})}
          sel={sel} active={active} thumb={0} thumbSize={0.55}
        >
          <RangeFx rect={cellRect(12, 3, G0)} color={C.green} p={lastGreen} fill={0.18} />
          <RangeFx rect={cellRect(13, 3, G0)} color={C.blue} p={blueC13} fill={0.16} label="AVERAGE" labelDx={214} />
          <RangeFx rect={cellRect(4, 3, G0)} color={C.blue} p={blankFx} fill={0.1} dashed label="blank" labelDx={214} />
          <RangeFx rect={cellRect(8, 3, G0)} color={C.blue} p={blankFx} fill={0.1} dashed label="blank" labelDx={214} />
          <RangeFx rect={cellRect(4, 3, G0)} color={C.amber} p={zeroFx} fill={0.22} label="0 counted" labelDx={214} />
          <RangeFx rect={cellRect(13, 3, G0)} color={C.amber} p={amberC13} fill={0.2} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <div dir="ltr" style={{position: 'absolute', left: 860, top: 250, width: 960, opacity: panel, transform: `translateY(${(1 - panel) * 24}px)`}}>
        <div style={{borderRadius: 26, border: `2px solid ${denColor}`, background: 'rgba(15,23,42,0.94)', padding: '24px 30px', boxShadow: `0 30px 80px rgba(2,6,23,.75), 0 0 40px ${denColor}44`}}>
          <div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text}}>
            AVERAGE = <span style={{color: C.green, textShadow: hiSum > 0.1 ? `0 0 18px ${C.green}` : 'none'}}>Sum</span> <span style={{color: denColor, textShadow: hiDiv > 0.1 ? `0 0 18px ${C.blue}` : 'none'}}>÷ Count</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 150px)', gap: 14, marginTop: 20}}>{boxes}</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 24, fontFamily: MONO, fontWeight: 700}}>
            <span style={{fontSize: 52, color: C.green}}>{fmtInt(s)}</span>
            <span style={{fontSize: 44, color: C.muted}}>÷</span>
            <span style={{fontSize: 64, color: denColor, display: 'inline-block', transform: `scale(${1 + 0.22 * Math.max(eight, nine * 0.8)})`, textShadow: `0 0 ${24 * Math.max(eight, nine)}px ${denColor}`}}>{n}</span>
            <span style={{fontSize: 44, color: C.muted}}>=</span>
            <span style={{fontSize: 56, color: C.text}}>{fmt2(avgShown)}</span>
          </div>
        </div>
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 860, top: 290, width: 960, opacity: compare, transform: `translateY(${(1 - compare) * 30}px)`, display: 'flex', gap: 24}}>
        <div style={{flex: 1, borderRadius: 24, border: `2px solid ${C.blue}`, background: 'rgba(15,23,42,0.94)', padding: '24px 28px', boxShadow: `0 0 30px ${C.blue}44`}}>
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.blue}}>Blank cell</div>
          <Mix style={{fontSize: 30, color: C.text, display: 'block', marginTop: 8}}>تُتجاهل من القاسم</Mix>
          <div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text, marginTop: 20}}>19,400 ÷ <span style={{color: C.blue}}>8</span></div>
          <div style={{fontFamily: MONO, fontSize: 48, fontWeight: 700, color: C.blue, marginTop: 6}}>$2,425.00</div>
        </div>
        <div style={{flex: 1, borderRadius: 24, border: `2px solid ${C.amber}`, background: 'rgba(15,23,42,0.94)', padding: '24px 28px', boxShadow: `0 0 30px ${C.amber}44`}}>
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.amber}}>Zero (0)</div>
          <Mix style={{fontSize: 30, color: C.text, display: 'block', marginTop: 8}}>تُحسب كقيمة في القاسم</Mix>
          <div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text, marginTop: 20}}>19,400 ÷ <span style={{color: C.amber}}>9</span></div>
          <div style={{fontFamily: MONO, fontSize: 48, fontWeight: 700, color: C.amber, marginTop: 6}}>$2,155.56</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 860, top: 590, opacity: compare}}><Chip color={C.red}>Δ −$269.44 (−11.1%) — Zero ≠ Blank</Chip></div>
      <KeyBadge keys={['Delete']} p={keyP} />

      <Caption text="AVERAGE Mechanics ──► Formula: Sum / Count (Ignores Blank Cells)" from={t(44.5)} to={t(63.5)} />
      <Caption text="Zero vs Blank ──► Blank = Ignored | Zero (0) = Calculated in Denominator" from={t(66.3)} to={t(82.6)} tone="ok" />
    </Stage>
  );
};
