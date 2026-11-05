import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, prog} from '../common';

const VAL = [120, 135, 128, 150, 165, 158, 180, 195];
const MON = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس'];
const CW = 200, GAP = 20;

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const Bf = B.s4.buffer, Io = B.s4.io, Sp = B.s4.speed;
  const x0 = Bf.x + 30;
  const cx = (i: number) => x0 + i * (CW + GAP) + CW / 2;
  const cur = 1 + prog(f, 450, 450 + 5 * 60) * 5; // current row pointer (float index)
  const live = f >= 450;
  const cellY = Bf.y + 150;

  const tri = (x: number, y: number, up: boolean, color: string) => (
    <polygon points={up ? `${x},${y} ${x - 18},${y + 30} ${x + 18},${y + 30}` : `${x},${y + 30} ${x - 18},${y} ${x + 18},${y}`} fill={color} />
  );

  return (
    <Scene dur={S.s4.dur} accent={C.blue}>
      <Title ar="القراءة المباشرة من الذاكرة" en="In-Memory Offset Buffering" chip="SC 04 · ENGINE" accent={C.blue} />

      <Card box={Bf} accent={C.blue} at={6}>
        <div style={{position: 'absolute', left: 28, top: 20, direction: 'ltr'}}><Tag color={C.blue}>WINDOWAGG · work_mem · ORDERED BUFFER</Tag></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.green, opacity: prog(f, 560, 620)}}>pointer jump: 0.0001 s</div>
      </Card>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {VAL.map((v, i) => {
          const o = prog(f, 40 + i * 30, 70 + i * 30);
          const isCur = live && Math.abs(cur - i) < 0.5;
          const isLag = live && Math.abs(cur - 1 - i) < 0.5;
          const isLead = live && Math.abs(cur + 1 - i) < 0.5;
          const col = isCur ? C.green : isLag ? C.blue : isLead ? C.amber : C.line;
          return (
            <g key={i} opacity={o}>
              <rect x={cx(i) - CW / 2} y={cellY} width={CW} height={120} rx={18} fill={isCur ? 'rgba(16,185,129,0.18)' : C.bg2} stroke={col} strokeWidth={isCur || isLag || isLead ? 6 : 3} filter={isCur || isLag || isLead ? 'url(#glow)' : undefined} />
              <text x={cx(i)} y={cellY + 44} textAnchor="middle" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim}>{MON[i]}</text>
              <text x={cx(i)} y={cellY + 94} textAnchor="middle" fontFamily={mono} fontSize={40} fontWeight={700} fill={C.text}>${v}</text>
            </g>
          );
        })}
        {live && (
          <g>
            {/* CURRENT above, LAG / LEAD below (never over the numbers) */}
            <text x={x0 + cur * (CW + GAP) + CW / 2} y={Bf.y + 106} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={C.green}>CURRENT</text>
            {tri(x0 + cur * (CW + GAP) + CW / 2, Bf.y + 112, false, C.green)}
            {tri(x0 + (cur - 1) * (CW + GAP) + CW / 2, cellY + 134, true, C.blue)}
            <text x={x0 + (cur - 1) * (CW + GAP) + CW / 2} y={cellY + 190} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.blue}>LAG</text>
            {tri(x0 + (cur + 1) * (CW + GAP) + CW / 2, cellY + 134, true, C.amber)}
            <text x={x0 + (cur + 1) * (CW + GAP) + CW / 2} y={cellY + 190} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.amber}>LEAD</text>
          </g>
        )}
      </svg>

      {/* zero disk I/O */}
      <Card box={Io} accent={C.green} at={450}>
        <div style={{position: 'absolute', left: 30, top: 20, direction: 'ltr'}}><Tag color={C.green}>ZERO DISK I/O</Tag></div>
        <svg width={Io.w} height={Io.h} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(60 80)" opacity={prog(f, 480, 520)}>
            <ellipse cx={50} cy={20} rx={44} ry={14} fill={C.panel2} stroke={C.dim} strokeWidth={4} />
            <path d="M 6 20 V 80 A 44 14 0 0 0 94 80 V 20" fill={C.panel2} stroke={C.dim} strokeWidth={4} />
            <line x1={4} y1={100} x2={96} y2={0} stroke={C.red} strokeWidth={9} strokeLinecap="round" />
          </g>
        </svg>
        <div style={{position: 'absolute', left: 190, top: 76, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 54, color: C.green, opacity: prog(f, 500, 540)}}>disk reads: 0</div>
        <div style={{position: 'absolute', left: 190, right: 30, top: 150, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, opacity: prog(f, 540, 600)}}>المؤشرات بتتحرك داخل work_mem من غير ما نلمس القرص</div>
      </Card>
      <Card box={Sp} accent={C.blue} at={560}>
        <div style={{position: 'absolute', left: 30, top: 20, direction: 'ltr'}}><Tag color={C.blue}>SINGLE PASS</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 72, direction: 'ltr', opacity: prog(f, 600, 640)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontWeight: 700, fontSize: 26}}><span style={{color: C.green}}>LAG / LEAD pointer</span><span style={{color: C.green}}>0.0001 s</span></div>
          <div style={{height: 22, borderRadius: 11, background: 'rgba(100,116,139,0.3)', marginTop: 8}}><div style={{width: `${4 * ease(prog(f, 620, 700))}%`, height: '100%', borderRadius: 11, background: C.green}} /></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontWeight: 700, fontSize: 26, marginTop: 22}}><span style={{color: C.dim}}>re-scan the table</span><span style={{color: C.red}}>✗ not used</span></div>
          <div style={{height: 22, borderRadius: 11, background: 'rgba(100,116,139,0.3)', marginTop: 8}}><div style={{width: `${100 * ease(prog(f, 640, 760))}%`, height: '100%', borderRadius: 11, background: C.red, opacity: 0.45}} /></div>
        </div>
      </Card>

      <Caption from={60} to={540} color={C.blue}>PostgreSQL Execution Engine ──► In-Memory Offset Buffering in work_mem</Caption>
      <Caption from={660} to={1080} color={C.green}>Zero Disk I/O ──► High-Speed Pointer Access for LAG & LEAD Functions</Caption>
    </Scene>
  );
};
