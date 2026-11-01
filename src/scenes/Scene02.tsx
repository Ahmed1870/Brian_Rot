import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Caption, Panel, Scene, Title, prog} from '../common';

const Clock: React.FC<{cx: number; cy: number; r: number; hour: number; min: number; color: string; ticks?: boolean}> = ({cx, cy, r, hour, min, color}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={C.bg} stroke={color} strokeWidth={8} />
    {Array.from({length: 12}, (_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      return <line key={i} x1={cx + Math.sin(a) * (r - 14)} y1={cy - Math.cos(a) * (r - 14)} x2={cx + Math.sin(a) * (r - 34)} y2={cy - Math.cos(a) * (r - 34)} stroke={C.dim} strokeWidth={i % 3 === 0 ? 7 : 3} strokeLinecap="round" />;
    })}
    <line x1={cx} y1={cy} x2={cx + Math.sin((hour * Math.PI) / 180) * r * 0.5} y2={cy - Math.cos((hour * Math.PI) / 180) * r * 0.5} stroke={C.text} strokeWidth={11} strokeLinecap="round" />
    <line x1={cx} y1={cy} x2={cx + Math.sin((min * Math.PI) / 180) * r * 0.78} y2={cy - Math.cos((min * Math.PI) / 180) * r * 0.78} stroke={color} strokeWidth={7} strokeLinecap="round" />
    <circle cx={cx} cy={cy} r={11} fill={color} />
  </g>
);

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  // left: lost hands spinning erratically; right: smooth, locked on 10:00
  const lh = f * 2.7 + Math.sin(f * 0.13) * 90;
  const lm = f * 11 + Math.sin(f * 0.21) * 140;
  const settle = prog(f, 660, 720);
  const rh = 300 * settle + (1 - settle) * (f * 1.5);
  const rm = 360 * settle + (1 - settle) * (f * 9);

  return (
    <Scene dur={S.s2.dur}>
      <Title ar="التشريح التقني" en="TIMESTAMP vs TIMESTAMPTZ" />

      {/* LEFT - blind wall clock */}
      <Panel x={80} y={200} w={840} h={600} stroke={C.red} style={{opacity: prog(f, 20, 50)}} />
      <div className="absolute" style={{left: 80, top: 214, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 40, fontWeight: 700, color: C.red, opacity: prog(f, 30, 60)}}>TIMESTAMP</div>
      <div className="absolute" style={{left: 80, top: 712, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 34, color: C.text, opacity: prog(f, 60, 90)}}>
        2026-11-01 10:00:00 <span style={{color: C.red}}>?</span>
      </div>
      <div className="absolute" style={{left: 80, top: 752, width: 840, textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.dim, direction: 'rtl', opacity: prog(f, 90, 120)}}>أرقام مجردة بدون منطقة زمنية</div>

      {/* RIGHT - UTC anchored clock */}
      <Panel x={1000} y={200} w={840} h={600} stroke={C.green} style={{opacity: prog(f, 600, 640)}} />
      <div className="absolute" style={{left: 1000, top: 214, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 40, fontWeight: 700, color: C.green, opacity: prog(f, 620, 650)}}>TIMESTAMPTZ</div>
      <div className="absolute" style={{left: 1000, top: 712, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 34, color: C.text, opacity: prog(f, 690, 720)}}>
        2026-11-01 10:00:00<span style={{color: C.amber}}>+02</span> <span style={{color: C.green}}>= 08:00 UTC</span>
      </div>
      <div className="absolute" style={{left: 1000, top: 752, width: 840, textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.dim, direction: 'rtl', opacity: prog(f, 720, 750)}}>مرساة زمنية مثبّتة على UTC</div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g opacity={prog(f, 40, 70)}><Clock cx={500} cy={470} r={190} hour={lh} min={lm} color={C.red} /></g>
        <g opacity={prog(f, 610, 650)}>
          <Clock cx={1420} cy={515} r={170} hour={rh} min={rm} color={C.green} />
          {/* UTC anchor above clock */}
          <rect x={1360} y={284} width={120} height={44} rx={22} fill={C.green} opacity={prog(f, 680, 710)} />
          <text x={1420} y={315} textAnchor="middle" fontSize={28} fontWeight={700} fill={C.bg} fontFamily={mono} opacity={prog(f, 680, 710)}>UTC</text>
          <line x1={1420} y1={328} x2={1420} y2={344} stroke={C.green} strokeWidth={5} opacity={prog(f, 680, 710)} />
        </g>

        {/* 8 BYTES = 8 BYTES */}
        <g opacity={prog(f, 880, 920)}>
          <rect x={620} y={826} width={300} height={64} rx={14} fill={C.panel} stroke={C.line} strokeWidth={2} />
          <text x={770} y={869} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.text} fontFamily={mono}>8 BYTES</text>
          <text x={960} y={870} textAnchor="middle" fontSize={50} fontWeight={700} fill={C.amber} fontFamily={mono}>=</text>
          <rect x={1000} y={826} width={300} height={64} rx={14} fill={C.panel} stroke={C.line} strokeWidth={2} />
          <text x={1150} y={869} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.text} fontFamily={mono}>8 BYTES</text>
        </g>
      </svg>

      <Caption from={60} to={540} color={C.red}>TIMESTAMP ──► Blind Wall Clock (No Timezone Offset)</Caption>
      <Caption from={660} to={1140} color={C.green}>TIMESTAMPTZ ──► Universal Time Anchor (UTC Normalized)</Caption>
    </Scene>
  );
};
