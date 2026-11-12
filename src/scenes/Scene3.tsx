import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {MEASURE_ALLEXCEPT, MEASURE_REMOVEFILTERS} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 180, 120, 120, 30, 120][c] ?? XL.colW;

const MeasureEditor: React.FC<{p: number; title: string; formula: string; color: string; typingP: number}> = ({p, title, formula, color, typingP}) => {
  if (p <= 0.01) return null;
  const shown = formula.slice(0, Math.floor(typingP * formula.length));
  const blink = Math.floor(useCurrentFrame() / 14) % 2 === 0 ? 1 : 0;
  return (
    <div style={{position: 'absolute', left: 120, top: 140, width: 1680, height: 120, background: '#1E1E1E', border: `2px solid ${color}`, borderRadius: 10, opacity: p, zIndex: 40, boxShadow: `0 8px 30px ${color}44`, overflow: 'hidden'}}>
      <div style={{height: 32, background: '#2D2D2D', borderBottom: '1px solid #444', display: 'flex', alignItems: 'center', paddingLeft: 16}}>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#888'}}>Power Pivot — Measure Editor</span>
        <span style={{marginLeft: 'auto', marginRight: 16, fontFamily: 'Consolas, monospace', fontSize: 12, color, fontWeight: 700}}>{title}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', paddingLeft: 16, paddingTop: 8, gap: 10}}>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#666', minWidth: 30}}>fx:</span>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 16, color, whiteSpace: 'pre'}}>{shown}</span>
        {typingP < 1 ? <span style={{opacity: blink, color, fontFamily: 'Consolas, monospace', fontSize: 16}}>|</span> : null}
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 360, z: 0.8}, prog(f, t(2), 30));

  // Phase 1: ALLEXCEPT (86-95s)
  const aeTypeP = prog(f, t(86), 16);
  const aeDone = f >= t(95);
  // Phase 2: REMOVEFILTERS (97-105s)
  const rfTypeP = prog(f, t(97), 14);
  const rfDone = f >= t(105);
  // Phase 3: selective erasure animation (107-130s)
  const eraseP = prog(f, t(107), 16) * (1 - prog(f, t(130), 12));

  const pts = dwell([{f: t(86), x: 200, y: 170}, {f: t(97), x: 200, y: 170}, {f: t(107), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [86, 97, 107];
  const curHide = f > t(109);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="DAX_Filters.xlsx" nameBox="A1" formula="" tab="PivotTable"
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 2) return undefined;
              return {t: c === 1 ? 'Branch' : 'Cat Ratio %', b: true, bg: '#E2EFDA', al: c === 2 ? 'r' : 'l'};
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* Selective erasure: purple beam sweeps column B while preserving column A */}
          {eraseP > 0.05 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={cellCenter(1, 2, {colW}).x} y1={geo(1, 0, 1).rowsTop} x2={cellCenter(1, 2, {colW}).x} y2={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * eraseP} stroke={C.purple} strokeWidth={4} strokeDasharray="8 4" opacity={0.9} />
              <text x={cellCenter(1, 2, {colW}).x + 10} y={geo(1, 0, 1).rowsTop + 30} fill={C.purple} fontFamily="Consolas, monospace" fontSize={12} fontWeight={700}>Sub-filter erased</text>
              <text x={cellCenter(1, 1, {colW}).x} y={geo(1, 0, 1).rowsTop - 8} textAnchor="middle" fill={C.green} fontFamily="Consolas, monospace" fontSize={12} fontWeight={700}>✓ Category preserved</text>
            </svg>
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {f >= t(86) && f < t(97) ? <MeasureEditor p={prog(f, t(86), 8)} title="ALLEXCEPT Measure" formula={MEASURE_ALLEXCEPT} color={C.purple} typingP={aeTypeP} /> : null}
      {f >= t(97) ? <MeasureEditor p={clamp(prog(f, t(97), 8)) * (1 - prog(f, t(130), 12))} title="REMOVEFILTERS Measure" formula={MEASURE_REMOVEFILTERS} color={C.purple} typingP={rfTypeP} /> : null}

      <TopBadge text="Selective Removal ──► ALLEXCEPT(Table, PreserveColumn) vs. REMOVEFILTERS(TargetColumn)" from={t(86.0)} to={t(107.0)} />
      {eraseP > 0.3 ? <Caption text="Category Ratio Precision ──► Erases Sub-Filters While Retaining Main Category Context" from={t(107.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
