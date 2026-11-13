import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SPARKLINE_DATA} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 200, 120, 120, 150][c] ?? XL.colW;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 300, z: 0.85}, prog(f, t(2), 30));
  const sparkDrawP = prog(f, t(131), 16) * (1 - prog(f, t(170), 12));
  const titleLinkP = prog(f, t(140), 14) * (1 - prog(f, t(170), 12));
  const titleUpdateP = prog(f, t(148), 12) * (1 - prog(f, t(170), 12));
  const fbEdit = f >= t(142) && f < t(148);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([{f: t(131), x: 300, y: 260}, {f: t(142), x: 200, y: fbY}, {f: t(148), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [142];
  const curHide = f > t(150);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx={'fade'} outFx={'fade'}>
      <ExcelWindow cam={cam}>
        <ExcelApp file={'Charts.xlsx'} nameBox={'A1'} formula={fbEdit ? typed('=Summary!B2', f, t(142), 0.8) : ''} fbEdit={fbEdit}
          cell={(r, c) => {
            if (r === 1) {
              const h = ['Product', 'Q1', 'Q2', 'Trend'];
              if (c < 1 || c > 4) return undefined;
              return {t: h[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
            }
            const idx = r - 2;
            if (idx < 0 || idx >= SPARKLINE_DATA.length) return undefined;
            const row = SPARKLINE_DATA[idx];
            if (c === 1) return {t: row.product};
            if (c === 2) return {t: String(row.trend[0] + row.trend[1] + row.trend[2]), al: 'r'};
            if (c === 3) return {t: String(row.trend[6] + row.trend[7] + row.trend[8]), al: 'r'};
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* Sparklines drawn inside column D (col 4) cells */}
          <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
            {SPARKLINE_DATA.map((row, ri) => {
              const cellX = cellCenter(ri + 2, 4, {colW}).x - colW(4) / 2 + 5;
              const cellY = cellCenter(ri + 2, 4, {colW}).y - XL.rowH / 2 + 3;
              const cellW = colW(4) - 10;
              const cellH = XL.rowH - 6;
              const maxVal = Math.max(...row.trend);
              const minVal = Math.min(...row.trend);
              const range = maxVal - minVal || 1;
              const drawProgress = clamp(sparkDrawP * SPARKLINE_DATA.length - ri);
              const pointsDrawn = Math.floor(drawProgress * row.trend.length);
              const pts = row.trend.slice(0, pointsDrawn + 1).map((v, i) => ({
                x: cellX + (i / (row.trend.length - 1)) * cellW,
                y: cellY + cellH - ((v - minVal) / range) * cellH,
              }));
              const highIdx = row.trend.indexOf(maxVal);
              const lowIdx = row.trend.indexOf(minVal);
              return (
                <g key={ri}>
                  {pts.length > 1 ? (
                    <polyline points={pts.map(function(p){return String(p.x) + String.fromCharCode(44) + String(p.y)}).join(String.fromCharCode(32))} fill={'none'} stroke={C.amber} strokeWidth={1.5} opacity={sparkDrawP} />
                  ) : null}
                  {/* High point marker */}
                  {sparkDrawP > 0.5 && pointsDrawn >= highIdx ? (
                    <circle cx={cellX + (highIdx / (row.trend.length - 1)) * cellW} cy={cellY + cellH - ((maxVal - minVal) / range) * cellH} r={3} fill={C.green} stroke={'#fff'} strokeWidth={1} opacity={sparkDrawP} />
                  ) : null}
                  {/* Low point marker */}
                  {sparkDrawP > 0.5 && pointsDrawn >= lowIdx ? (
                    <circle cx={cellX + (lowIdx / (row.trend.length - 1)) * cellW} cy={cellY + cellH - ((minVal - minVal) / range) * cellH} r={3} fill={C.red} stroke={'#fff'} strokeWidth={1} opacity={sparkDrawP} />
                  ) : null}
                </g>
              );
            })}
            {/* High/Low labels */}
            {sparkDrawP > 0.6 ? (
              <g opacity={sparkDrawP}>
                <circle cx={cellCenter(2, 4, {colW}).x - colW(4) / 2 + 10} cy={geo(1, 0, 1).rowsTop - 8} r={4} fill={C.green} />
                <text x={cellCenter(2, 4, {colW}).x - colW(4) / 2 + 20} y={geo(1, 0, 1).rowsTop - 4} fill={C.green} fontFamily={'Consolas, monospace'} fontSize={11} fontWeight={700}>High</text>
                <circle cx={cellCenter(2, 4, {colW}).x + 30} cy={geo(1, 0, 1).rowsTop - 8} r={4} fill={C.red} />
                <text x={cellCenter(2, 4, {colW}).x + 40} y={geo(1, 0, 1).rowsTop - 4} fill={C.red} fontFamily={'Consolas, monospace'} fontSize={11} fontWeight={700}>Low</text>
              </g>
            ) : null}
          </svg>

          {/* Dynamic chart title overlay */}
          {titleLinkP > 0.01 ? (
            <div style={{position: 'absolute', left: 600, top: 150, width: 400, height: 60, background: '#fff', border: '2px solid ' + C.amber + ',', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: titleLinkP, zIndex: 35, boxShadow: '0 4px 20px ' + C.amber + '44'}}>
              <span style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 18, fontWeight: 700, color: '#333'}}>
                {titleUpdateP > 0.3 ? 'Cairo Branch Performance - Q3' : 'Chart Title (linked to cell)'}
              </span>
            </div>
          ) : null}

          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: '2px solid ' + C.border + ',', borderRadius: 12, padding: '8px 18px'}}>
          {sparkDrawP > 0.3 ? <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber}}>Sparklines: Line + High/Low markers in cells</span> : null}
          {titleLinkP > 0.3 ? <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>| Dynamic title: =Summary!B2 → auto-syncs</span> : null}
        </div>
      </div>

      <TopBadge text={'In-Cell Sparklines ──► Line, Column & Win/Loss with High / Low Point Markers'} from={t(131.0)} to={t(145.0)} />
      {titleLinkP > 0.3 ? <Caption text={'Dynamic Chart Titles - Link Title via Formula Bar for Live Slicer Sync'} from={t(145.0)} to={t(169.0)} tone={'ok'} /> : null}
    </Stage>
  );
};
