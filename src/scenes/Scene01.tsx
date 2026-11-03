import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const AMOUNTS = [1200, 850, 2300, 640, 1750, 980, 3100, 420, 1500, 2050, 760, 1100]; // = 16,650
const TOTAL = AMOUNTS.reduce((a, b) => a + b, 0);
const RH = 44, R0 = 100; // row pitch, first row offset inside the card

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const T = B.s1.table, O = B.s1.out;
  const down = ease(prog(f, 30, 180)); // piston descends onto the table
  const p = ease(prog(f, 181, 540)); // compression progress
  const cy = T.y + R0 + (12 * RH) / 2; // centre of the row block
  const plateY = f < 181 ? lerp(T.y + 14, T.y + 60, down) : lerp(T.y + 60, cy - 90, p);
  const sum = Math.round(TOTAL * p);
  const query = 'SELECT SUM(total) FROM orders;';

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="فلسفة التجميع" en="Aggregate Reduction Engine" chip="SC 01 · AGGREGATION" accent={C.blue} />

      <Card box={T} accent={C.line} at={4}>
        <div style={{position: 'absolute', left: 30, bottom: 18, direction: 'ltr'}}><Tag color={C.dim}>orders · 12 ROWS</Tag></div>
      </Card>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {/* rows (compress towards the centre) */}
        {AMOUNTS.map((a, i) => {
          const y0 = T.y + R0 + i * RH;
          const y = lerp(y0, cy, p) + (1 - p) * 0;
          const h = 36 * (1 - p);
          const w = 140 + (a / 3100) * 520;
          const o = Math.min(prog(f, 20 + i * 6, 50 + i * 6), 1 - prog(f, 520, 545));
          return h > 0.5 ? (
            <g key={i} opacity={o}>
              <rect x={T.x + 30} y={y} width={T.w - 60} height={h} rx={Math.min(8, h / 2)} fill={C.panel2} />
              <rect x={T.x + 30} y={y} width={w} height={h} rx={Math.min(8, h / 2)} fill={C.row} opacity={0.9} />
              {h > 22 && (
                <>
                  <text x={T.x + 46} y={y + 25} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.text}>#{String(i + 1).padStart(2, '0')}</text>
                  <text x={T.x + T.w - 46} y={y + 25} textAnchor="end" fontFamily={mono} fontSize={24} fontWeight={700} fill={C.text}>{a.toLocaleString('en-US')}</text>
                </>
              )}
            </g>
          ) : null;
        })}

        {/* scalar value cell */}
        <g opacity={p} filter="url(#glow)">
          <rect x={T.x + 200} y={cy - 48} width={T.w - 400} height={96} rx={20} fill="rgba(56,189,248,0.18)" stroke={C.blue} strokeWidth={5} />
          <text x={T.x + T.w / 2} y={cy + 24} textAnchor="middle" fontFamily={mono} fontSize={68} fontWeight={700} fill={C.text}>{sum.toLocaleString('en-US')}</text>
        </g>

        {/* piston: shaft + plate */}
        <g opacity={prog(f, 0, 25)}>
          <rect x={T.x + T.w / 2 - 22} y={T.y + 2} width={44} height={Math.max(0, plateY - T.y - 2)} fill="#475569" />
          <rect x={T.x + 30} y={plateY} width={T.w - 60} height={34} rx={10} fill={C.blue} filter="url(#glow)" />
          <text x={T.x + T.w / 2} y={plateY + 24} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.bg}>AGGREGATE ENGINE</text>
        </g>
      </svg>

      {/* output panel */}
      <Card box={O} accent={C.blue} at={300}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 28, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs(query, O.w - 60, 36, mono)}}>
          <span style={{color: C.pink}}>SELECT</span> <span style={{color: C.blue}}>SUM</span>(total) <span style={{color: C.pink}}>FROM</span> orders;
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 130, display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr'}}>
          <div style={{textAlign: 'center', width: 280}}>
            <Tag color={C.dim}>INPUT</Tag>
            <div style={{display: 'flex', gap: 5, marginTop: 14, justifyContent: 'center'}}>
              {AMOUNTS.map((a, i) => (<div key={i} style={{width: 14, height: 10 + (a / 3100) * 70, background: C.row, borderRadius: 3, alignSelf: 'flex-end', opacity: 1 - 0.8 * p}} />))}
            </div>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 32, color: C.text, marginTop: 14}}>12 rows</div>
          </div>
          <div style={{fontFamily: mono, fontSize: 60, color: C.blue, fontWeight: 700}}>→</div>
          <div style={{textAlign: 'center', width: 280}}>
            <Tag color={C.blue}>OUTPUT</Tag>
            <div style={{marginTop: 14, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 120, height: 30 + 40 * p, background: C.blue, borderRadius: 10, opacity: 0.3 + 0.7 * p}} />
            </div>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 32, color: C.blue, marginTop: 14}}>1 row</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 380, textAlign: 'center', opacity: prog(f, 540, 590), transform: `scale(${0.85 + 0.15 * ease(prog(f, 540, 590))})`}}>
          <Tag color={C.blue}>SCALAR VALUE</Tag>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 110, color: C.text, marginTop: 8}}>{TOTAL.toLocaleString('en-US')}</div>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 36, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.green, opacity: prog(f, 640, 690)}}>آلاف الأسطر ← قيمة واحدة بس</div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>فلسفة التجميع | Aggregate Reduction Engine</Caption>
      <Caption from={660} to={1140} color={C.green}>Multi-Row Input ──► Single Scalar Summary Output</Caption>
    </Scene>
  );
};
