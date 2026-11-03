import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1270, global 0-42.4s): the Heap has no inherent order - only ORDER BY guarantees one.
const t = (g: number) => sec(g);

// block id -> position inside the heap window, before / after a page re-organisation
const POS_A: Record<number, [number, number]> = {1: [40, 50], 2: [300, 20], 3: [30, 250], 4: [500, 210], 5: [280, 330], 6: [520, 40]};
const POS_B: Record<number, [number, number]> = {1: [500, 330], 2: [40, 60], 3: [300, 150], 4: [60, 300], 5: [520, 30], 6: [280, 350]};
const RUN1 = [3, 1, 5, 2, 6, 4];
const RUN2 = [5, 2, 6, 3, 1, 4];
const SORTED = [1, 2, 3, 4, 5, 6];
const COLX = [930, 1190, 1450];
const ROW0 = 360;
const RH = 62;

const Col: React.FC<{x: number; title: string; ids: number[]; color: string; start: number; f: number}> = ({x, title, ids, color, start, f}) => {
  const h = prog(f, start, 18);
  return (
    <div dir="ltr" style={{position: 'absolute', left: x, top: 300, width: 240, opacity: h}}>
      <Chip color={color}>{title}</Chip>
      {ids.map((id, i) => {
        const p = pop(f, start + 6 + i * 5);
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: ROW0 - 300 + i * RH - 10, width: 240, height: 52, borderRadius: 12, border: `2px solid ${color}`, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontFamily: MONO, fontSize: 24, color: C.text, opacity: clamp(p), transform: `translateX(${(1 - clamp(p)) * 30}px)`}}>
            <span>order #{id}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const win = prog(f, 0, 24);
  const heapTag = prog(f, t(15.5), 20);
  const shuffle = prog(f, t(22.5), 26);
  const wig1 = f >= t(18.6) && f < t(19.6) ? Math.sin(f * 1.6) * 5 : 0;
  const lines = prog(f, t(25.6), 24);
  const warn = prog(f, t(29.2), 22);
  const fix = prog(f, t(38.5), 22);
  const shake = f >= t(29.2) && f < t(31.5) ? Math.sin(f * 2.4) * 5 * (1 - prog(f, t(29.2), sec(2.2))) : 0;

  return (
    <Stage dur={1270} inFx="none" outFx="zoom">
      <TopBadge text="عشوائية التخزين في الـ Heap | Unordered Heap Table Storage" from={t(2)} to={t(18)} color={C.muted} />

      {/* Heap container */}
      <Win x={100} y={180} w={760} h={560} title="Heap Table · orders (physical pages)" accent={C.border} opacity={win}>
        {[1, 2, 3, 4, 5, 6].map((id, i) => {
          const drop = pop(f, t(1.4 + i * 0.7));
          const [ax, ay] = POS_A[id];
          const [bx, by] = POS_B[id];
          const x = lerp(ax, bx, shuffle);
          const y = lerp(ay, by, shuffle);
          const rot = ((id * 7) % 9) - 4 + (shuffle > 0 && shuffle < 1 ? Math.sin(f / 3 + id) * 6 : 0);
          return (
            <div key={id} dir="ltr" style={{position: 'absolute', left: x + wig1, top: y - (1 - clamp(drop)) * 320, width: 160, height: 76, borderRadius: 14, background: '#475569', border: `2px solid ${C.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.text, opacity: clamp(drop), transform: `rotate(${rot}deg)`}}>
              #{id}
            </div>
          );
        })}
        <div dir="ltr" style={{position: 'absolute', left: 24, bottom: 18, opacity: heapTag}}>
          <Chip color={C.muted}>Heap = no built-in order</Chip>
        </div>
      </Win>

      {/* query */}
      <Editor x={930} y={150} w={900} h={124} title="query.sql" lines={['SELECT * FROM orders;']} start={t(16.6)} cps={0.9} size={30} accent={C.border} opacity={prog(f, t(16.4), 16)} />

      {/* result columns */}
      <Col x={COLX[0]} title="Run 1" ids={RUN1} color={C.muted} start={t(18.6)} f={f} />
      <Col x={COLX[1]} title="Run 2" ids={RUN2} color={C.red} start={t(22.8)} f={f} />
      <Col x={COLX[2]} title="ORDER BY order_id" ids={SORTED} color={C.green} start={t(38.5)} f={f} />

      {/* mismatch lines between Run 1 and Run 2 */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: lines}}>
        {[1, 2, 3, 4, 5, 6].map((id) => {
          const y1 = ROW0 + RUN1.indexOf(id) * RH + 16;
          const y2 = ROW0 + RUN2.indexOf(id) * RH + 16;
          return <line key={id} x1={COLX[0] + 240} y1={y1} x2={COLX[1]} y2={y2} stroke={C.red} strokeWidth={3} strokeDasharray="8 6" opacity={0.8} />;
        })}
      </svg>
      <div dir="ltr" style={{position: 'absolute', left: COLX[2], top: 760, width: 240, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: C.green, opacity: fix}}>Run 1 = Run 2 ✓</div>

      {/* warning */}
      <div style={{position: 'absolute', left: 340, right: 340, top: 790, opacity: warn, transform: `translateY(${(1 - warn) * 30}px) translateX(${shake}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, background: `${C.red}1A`, border: `2px solid ${C.red}`, borderRadius: 20, padding: '14px 28px'}}>
          <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.red}}>!</div>
          <Mix style={{fontSize: 38, fontWeight: 700, color: C.text}}>بدون ORDER BY الترتيب غير مضمون هندسياً</Mix>
        </div>
      </div>

      <Caption text="Without ORDER BY ──► Order is Arbitrary & Unpredictable" from={t(29.4)} to={t(41)} />
    </Stage>
  );
};
