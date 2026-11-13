import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 760, fy: 420, z: 0.7}, prog(f, t(2), 30));
  const cluttered = prog(f, t(1), 10) * (1 - prog(f, t(6), 10));
  const consolidated = prog(f, t(6), 16);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="Charts.xlsx" nameBox="A1" formula="" tab="Insert"
          cell={() => undefined} colW={() => 80}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Cluttered: 4 small charts (red, fading) */}
          {cluttered > 0.01 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
              {[
                {x: 100, y: 150, label: 'Sales'},
                {x: 500, y: 150, label: 'Margin'},
                {x: 100, y: 400, label: 'Products'},
                {x: 500, y: 400, label: 'Branches'},
              ].map((chart, i) => (
                <g key={i} opacity={cluttered}>
                  <rect x={chart.x} y={chart.y} width={320} height={180} fill={'rgba(239,68,68,0.08)'} stroke={C.red} strokeWidth={2} rx={8} />
                  <text x={chart.x + 160} y={chart.y + 95} textAnchor="middle" fill={C.red} fontFamily={'Consolas, monospace'} fontSize={14} fontWeight={700}>{chart.label}</text>
                  <rect x={chart.x + 20} y={chart.y + 110} width={40} height={50} fill={C.red} opacity={0.3} />
                  <rect x={chart.x + 70} y={chart.y + 90} width={40} height={70} fill={C.red} opacity={0.3} />
                  <rect x={chart.x + 120} y={chart.y + 60} width={40} height={100} fill={C.red} opacity={0.3} />
                  <rect x={chart.x + 170} y={chart.y + 80} width={40} height={80} fill={C.red} opacity={0.3} />
                  <rect x={chart.x + 220} y={chart.y + 100} width={40} height={60} fill={C.red} opacity={0.3} />
                </g>
              ))}
              <text x={500} y={80} textAnchor="middle" fill={C.red} fontFamily={'Consolas, monospace'} fontSize={20} fontWeight={700} opacity={cluttered}>⚠ CLUTTERED: 4 separate charts → confusing</text>
            </svg>
          ) : null}

          {/* Consolidated: advanced charts (blue, appearing) */}
          {consolidated > 0.01 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
              {/* Big Combo chart */}
              <rect x={100} y={120} width={600} height={420} fill={'rgba(56,189,248,0.06)'} stroke={C.blue} strokeWidth={2.5} rx={10} opacity={consolidated} />
              <text x={400} y={150} textAnchor="middle" fill={C.blue} fontFamily={'Consolas, monospace'} fontSize={18} fontWeight={700} opacity={consolidated}>Combo Chart (Sales + Margin%)</text>
              {/* Combo bars + line */}
              {[200, 280, 360, 440, 520, 600].map((x, i) => {
                const heights = [140, 100, 85, 60, 48, 35];
                return <rect key={i} x={x - 25} y={510 - heights[i]} width={50} height={heights[i]} fill={`${C.blue}55`} stroke={C.blue} strokeWidth={2} rx={3} opacity={consolidated} />;
              })}
              {/* Combo line (margin %) */}
              <polyline points={`175,360 255,390 335,340 415,410 495,380 575,430`} fill={'none'} stroke={C.green} strokeWidth={3} opacity={consolidated} />

              {/* Waterfall */}
              <rect x={750} y={120} width={500} height={420} fill={'rgba(56,189,248,0.06)'} stroke={C.blue} strokeWidth={2.5} rx={10} opacity={consolidated} />
              <text x={1000} y={150} textAnchor="middle" fill={C.blue} fontFamily={'Consolas, monospace'} fontSize={18} fontWeight={700} opacity={consolidated}>Waterfall (Revenue → Profit)</text>

              {/* Pareto */}
              <rect x={100} y={580} width={500} height={300} fill={'rgba(56,189,248,0.06)'} stroke={C.blue} strokeWidth={2.5} rx={10} opacity={consolidated} />
              <text x={350} y={610} textAnchor="middle" fill={C.blue} fontFamily={'Consolas, monospace'} fontSize={18} fontWeight={700} opacity={consolidated}>Pareto 80/20</text>

              {/* Bullet */}
              <rect x={650} y={580} width={600} height={300} fill={'rgba(56,189,248,0.06)'} stroke={C.blue} strokeWidth={2.5} rx={10} opacity={consolidated} />
              <text x={950} y={610} textAnchor="middle" fill={C.blue} fontFamily={'Consolas, monospace'} fontSize={18} fontWeight={700} opacity={consolidated}>Bullet Chart (Actual vs Target)</text>

              <text x={640} y={100} textAnchor="middle" fill={C.blue} fontFamily={'Consolas, monospace'} fontSize={22} fontWeight={700} opacity={consolidated}>✓ CONSOLIDATED: Advanced Charts tell the full story</text>
            </svg>
          ) : null}
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}><div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 68 من 76 · الوحدة 13 من 14</div></div>
      <TopBadge text={'الدرس 68 من 76 | الوحدة 13 من 14 ──► Advanced Charts & Custom Visualizations Engine'} from={t(2.0)} to={t(18.0)} />
      <Caption text={'Executive Visual Storytelling ──► Combo, Waterfall, Pareto & Bullet Chart Architecture'} from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
