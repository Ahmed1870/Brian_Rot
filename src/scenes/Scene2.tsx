import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {COMBO_DATA, WATERFALL} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 100, 100, 100, 100, 100][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 360, z: 0.75}, prog(f, t(2), 30));

  // Phase 1: Combo chart (42-55s) — flat line (red) → secondary axis lift (green)
  const flatP = prog(f, t(42), 10) * (1 - prog(f, t(48), 8));
  const liftP = prog(f, t(48), 14) * (1 - prog(f, t(85), 12));
  const comboDrawP = prog(f, t(44), 16);

  // Phase 2: Waterfall (55-85s)
  const waterfallP = prog(f, t(58), 18) * (1 - prog(f, t(85), 12));
  const setAsTotalP = prog(f, t(72), 12) * (1 - prog(f, t(85), 12));

  const maxSales = Math.max(...COMBO_DATA.map((d) => d.sales));
  const maxWaterfall = Math.max(...WATERFALL.map((d) => Math.abs(d.value)));

  const chartX = 100, chartY = 200, chartW = 700, chartH = 350;
  const wfX = 850, wfY = 200, wfW = 550, wfH = 350;

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="Charts.xlsx" nameBox="A1" formula="" tab="Insert"
          cell={(r, c) => {
            if (r === 1 && c <= 6) {
              const h = ['Branch', 'Sales', 'Margin%', '', '', ''];
              return {t: h[c - 1] || '', b: true, bg: '#E2EFDA', al: 'l'};
            }
            const idx = r - 2;
            if (idx < COMBO_DATA.length && c <= 3) {
              const row = COMBO_DATA[idx];
              if (c === 1) return {t: row.branch};
              if (c === 2) return {t: (row.sales / 1000000).toFixed(1) + 'M', al: 'r'};
              if (c === 3) return {t: row.margin.toFixed(1) + '%', al: 'r'};
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* === COMBO CHART === */}
          <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
            {/* Chart frame */}
            <rect x={chartX} y={chartY} width={chartW} height={chartH} fill={'rgba(255,255,255,0.95)'} stroke={liftP > 0.3 ? C.green : C.red} strokeWidth={2.5} rx={8} opacity={comboDrawP} />
            <text x={chartX + chartW / 2} y={chartY + 25} textAnchor="middle" fill={'#333'} fontFamily={'Segoe UI, sans-serif'} fontSize={14} fontWeight={700} opacity={comboDrawP}>Combo Chart: Sales (M) + Margin %</text>
            {/* Y-axis left (Sales) */}
            <line x1={chartX + 40} y1={chartY + 50} x2={chartX + 40} y2={chartY + chartH - 30} stroke={'#666'} strokeWidth={1} opacity={comboDrawP} />
            {/* Bars */}
            {COMBO_DATA.map((d, i) => {
              const barW = 60, gap = (chartW - 80) / COMBO_DATA.length;
              const bx = chartX + 50 + i * gap;
              const barH = (d.sales / maxSales) * (chartH - 90) * comboDrawP;
              const by = chartY + chartH - 30 - barH;
              return <rect key={i} x={bx} y={by} width={barW} height={barH} fill={`${C.blue}88`} stroke={C.blue} strokeWidth={1.5} rx={3} opacity={comboDrawP} />;
            })}
            {/* Margin line — FLAT (before secondary axis) */}
            {flatP > 0.01 ? (
              <line x1={chartX + 50} y1={chartY + chartH - 35} x2={chartX + chartW - 20} y2={chartY + chartH - 35} stroke={C.red} strokeWidth={3} opacity={flatP} />
            ) : null}
            {/* Margin line — LIFTED (after secondary axis) */}
            {liftP > 0.01 ? (
              <>
                <line x1={chartX + chartW - 10} y1={chartY + 50} x2={chartX + chartW - 10} y2={chartY + chartH - 30} stroke={C.green} strokeWidth={1.5} opacity={liftP} />
                {COMBO_DATA.map((d, i) => {
                  const gap = (chartW - 80) / COMBO_DATA.length;
                  const px = chartX + 50 + i * gap + 30;
                  const py = chartY + chartH - 30 - (d.margin / 40) * (chartH - 90) * liftP;
                  return <circle key={i} cx={px} cy={py} r={5} fill={C.green} opacity={liftP} />;
                })}
                <polyline points={COMBO_DATA.map((d, i) => {
                  const gap = (chartW - 80) / COMBO_DATA.length;
                  const px = chartX + 50 + i * gap + 30;
                  const py = chartY + chartH - 30 - (d.margin / 40) * (chartH - 90) * liftP;
                  return `${px},${py}`;
                }).join(' ')} fill={'none'} stroke={C.green} strokeWidth={3} opacity={liftP} />
                <text x={chartX + chartW - 5} y={chartY + 45} fill={C.green} fontFamily={'Consolas, monospace'} fontSize={11} fontWeight={700} opacity={liftP}>2nd Axis</text>
              </>
            ) : null}
            {flatP > 0.3 ? <text x={chartX + chartW / 2} y={chartY + chartH - 45} textAnchor="middle" fill={C.red} fontFamily={'Consolas, monospace'} fontSize={12} fontWeight={700} opacity={flatP}>⚠ Margin line FLAT — single axis</text> : null}
          </svg>

          {/* === WATERFALL CHART === */}
          <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
            <rect x={wfX} y={wfY} width={wfW} height={wfH} fill={'rgba(255,255,255,0.95)'} stroke={setAsTotalP > 0.3 ? C.green : C.blue} strokeWidth={2.5} rx={8} opacity={waterfallP} />
            <text x={wfX + wfW / 2} y={wfY + 25} textAnchor="middle" fill={'#333'} fontFamily={'Segoe UI, sans-serif'} fontSize={14} fontWeight={700} opacity={waterfallP}>Waterfall: Revenue → Net Profit</text>
            <line x1={wfX + 40} y1={wfY + 50} x2={wfX + 40} y2={wfY + wfH - 30} stroke={'#666'} strokeWidth={1} opacity={waterfallP} />
            {/* Waterfall bars */}
            {(() => {
              let cumY = wfY + wfH - 30;
              return WATERFALL.map((d, i) => {
                const barW = 50, gap = (wfW - 60) / WATERFALL.length;
                const bx = wfX + 50 + i * gap;
                const barH = (Math.abs(d.value) / maxWaterfall) * (wfH - 90) * waterfallP;
                let by: number;
                if (d.type === 'total') {
                  by = wfY + wfH - 30 - barH;
                  cumY = by;
                } else {
                  by = cumY - barH;
                  cumY = by;
                }
                const color = d.type === 'total' ? (setAsTotalP > 0.3 && i === WATERFALL.length - 1 ? C.green : C.blue) : C.red;
                return (
                  <g key={i} opacity={waterfallP}>
                    <rect x={bx} y={by} width={barW} height={barH} fill={`${color}88`} stroke={color} strokeWidth={1.5} rx={2} />
                    {setAsTotalP > 0.3 && d.type === 'total' ? (
                      <>
                        <line x1={bx - 5} y1={wfY + wfH - 30} x2={bx + barW + 5} y2={wfY + wfH - 30} stroke={C.green} strokeWidth={2} strokeDasharray="4 2" opacity={setAsTotalP} />
                        <text x={bx + barW / 2} y={wfY + wfH - 15} textAnchor="middle" fill={C.green} fontFamily={'Consolas, monospace'} fontSize={9} fontWeight={700} opacity={setAsTotalP}>Set as Total ✓</text>
                      </>
                    ) : null}
                    <text x={bx + barW / 2} y={by - 5} textAnchor="middle" fill={'#444'} fontFamily={'Consolas, monospace'} fontSize={9} opacity={waterfallP}>{d.label}</text>
                  </g>
                );
              });
            })()}
          </svg>
        </ExcelApp>
      </ExcelWindow>

      {/* Badge */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          {flatP > 0.3 ? <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.red}}>⚠ Single axis → margin line flat</span> : null}
          {liftP > 0.3 && flatP < 0.3 ? <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>✓ Secondary Axis → margin line visible</span> : null}
          {waterfallP > 0.3 ? <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>| Waterfall → Set as Total anchors</span> : null}
        </div>
      </div>

      <TopBadge text={'Combo Chart & Secondary Axis ──► Combine Currency Columns with Percentage Lines Cleanly'} from={t(42.0)} to={t(60.0)} />
      {waterfallP > 0.3 ? <Caption text={'Waterfall Financial Bridge ──► Trace Revenue to Net Profit Using Set as Total Anchors'} from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
