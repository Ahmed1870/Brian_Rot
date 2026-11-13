import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BULLET, PARETO} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 360, z: 0.75}, prog(f, t(2), 30));

  const paretoDrawP = prog(f, t(86), 18) * (1 - prog(f, t(130), 12));
  const eightyMark = prog(f, t(95), 10) * (1 - prog(f, t(130), 12));
  const bulletDrawP = prog(f, t(100), 18) * (1 - prog(f, t(130), 12));
  const overlapP = prog(f, t(108), 12) * (1 - prog(f, t(130), 12));

  const maxParetoSales = Math.max(...PARETO.map((d) => d.sales));
  const pX = 100, pY = 200, pW = 700, pH = 350;
  const bX = 850, bY = 200, bW = 550, bH = 350;
  const maxBullet = 350;

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="Charts.xlsx" nameBox="A1" formula="" tab="Insert"
          cell={() => undefined} colW={() => 80}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* === PARETO CHART === */}
          <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
            <rect x={pX} y={pY} width={pW} height={pH} fill={'rgba(255,255,255,0.95)'} stroke={C.purple} strokeWidth={2.5} rx={8} opacity={paretoDrawP} />
            <text x={pX + pW / 2} y={pY + 25} textAnchor="middle" fill={'#333'} fontFamily={'Segoe UI, sans-serif'} fontSize={14} fontWeight={700} opacity={paretoDrawP}>Pareto Chart (80/20 Rule)</text>
            <line x1={pX + 40} y1={pY + 50} x2={pX + 40} y2={pY + pH - 30} stroke={'#666'} strokeWidth={1} opacity={paretoDrawP} />
            {/* Pareto bars (descending) */}
            {PARETO.map((d, i) => {
              const gap = (pW - 60) / PARETO.length;
              const bx = pX + 50 + i * gap;
              const barH = (d.sales / maxParetoSales) * (pH - 90) * paretoDrawP;
              const by = pY + pH - 30 - barH;
              return (
                <g key={i} opacity={paretoDrawP}>
                  <rect x={bx} y={by} width={gap - 8} height={barH} fill={`${C.purple}66`} stroke={C.purple} strokeWidth={1} rx={2} />
                  <text x={bx + (gap - 8) / 2} y={pY + pH - 18} textAnchor="middle" fill={'#444'} fontFamily={'Consolas, monospace'} fontSize={8} transform={`rotate(-30 ${bx + (gap - 8) / 2} ${pY + pH - 18})`}>{d.product.slice(0, 8)}</text>
                </g>
              );
            })}
            {/* Cumulative % line */}
            <polyline points={PARETO.map((d, i) => {
              const gap = (pW - 60) / PARETO.length;
              const px = pX + 50 + i * gap + (gap - 8) / 2;
              const py = pY + pH - 30 - (d.cumPct / 100) * (pH - 90) * paretoDrawP;
              return `${px},${py}`;
            }).join(' ')} fill={'none'} stroke={C.green} strokeWidth={3} opacity={paretoDrawP} />
            {PARETO.map((d, i) => {
              const gap = (pW - 60) / PARETO.length;
              const px = pX + 50 + i * gap + (gap - 8) / 2;
              const py = pY + pH - 30 - (d.cumPct / 100) * (pH - 90) * paretoDrawP;
              return <circle key={i} cx={px} cy={py} r={4} fill={C.green} opacity={paretoDrawP} />;
            })}
            {/* 80% cutoff line */}
            {eightyMark > 0.01 ? (
              <>
                <line x1={pX + 40} y1={pY + pH - 30 - 0.8 * (pH - 90)} x2={pX + pW - 10} y2={pY + pH - 30 - 0.8 * (pH - 90)} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" opacity={eightyMark} />
                <text x={pX + pW - 20} y={pY + pH - 30 - 0.8 * (pH - 90) - 8} textAnchor="end" fill={C.red} fontFamily={'Consolas, monospace'} fontSize={12} fontWeight={700} opacity={eightyMark}>80% cutoff → vital few</text>
              </>
            ) : null}
          </svg>

          {/* === BULLET CHART === */}
          <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
            <rect x={bX} y={bY} width={bW} height={bH} fill={'rgba(255,255,255,0.95)'} stroke={C.purple} strokeWidth={2.5} rx={8} opacity={bulletDrawP} />
            <text x={bX + bW / 2} y={bY + 25} textAnchor="middle" fill={'#333'} fontFamily={'Segoe UI, sans-serif'} fontSize={14} fontWeight={700} opacity={bulletDrawP}>Bullet Chart: Actual vs Target</text>
            {/* Bullet bars */}
            {BULLET.map((d, i) => {
              const rowH = (bH - 60) / BULLET.length;
              const by = bY + 40 + i * rowH;
              const targetW = (d.target / maxBullet) * (bW - 100) * bulletDrawP;
              const actualW = (d.actual / maxBullet) * (bW - 100) * bulletDrawP;
              return (
                <g key={i} opacity={bulletDrawP}>
                  <text x={bX + 10} y={by + rowH / 2 + 4} fill={'#444'} fontFamily={'Consolas, monospace'} fontSize={11} fontWeight={600}>{d.branch}</text>
                  {/* Target (wide, background) */}
                  <rect x={bX + 70} y={by + rowH / 2 - 14} width={targetW} height={28} fill={`${C.amber}33`} stroke={`${C.amber}88`} strokeWidth={1} rx={3} />
                  {/* Actual (narrow, front) — overlap 100% */}
                  <rect x={bX + 70} y={by + rowH / 2 - 6} width={actualW} height={12} fill={d.actual >= d.target ? C.green : C.red} rx={2} opacity={overlapP > 0.3 ? 1 : 0.5} />
                  {overlapP > 0.3 ? <text x={bX + 70 + actualW + 5} y={by + rowH / 2 + 4} fill={d.actual >= d.target ? C.green : C.red} fontFamily={'Consolas, monospace'} fontSize={10} fontWeight={700}>{d.actual >= d.target ? '✓' : '✗'} {d.actual}K / {d.target}K</text> : null}
                </g>
              );
            })}
            {overlapP > 0.3 ? <text x={bX + bW / 2} y={bY + bH - 8} textAnchor="middle" fill={C.purple} fontFamily={'Consolas, monospace'} fontSize={11} fontWeight={700} opacity={overlapP}>Series Overlap = 100% → Actual nested inside Target</text> : null}
          </svg>
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text={'Pareto Chart (80/20 Rule) ──► Auto-Sorts Descending Bars + Cumulative % Line'} from={t(86.0)} to={t(105.0)} />
      {bulletDrawP > 0.3 ? <Caption text={'Custom Bullet Chart ──► Series Overlap = 100% + Adjusted Gap Width for Actual vs. Target'} from={t(105.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
