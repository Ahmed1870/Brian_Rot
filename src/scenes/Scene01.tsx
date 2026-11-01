import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Caption, Scene, Title, prog} from '../common';

// flat timezone map: longitude -30..90 -> x, latitude 5..60 -> y
const X = (lon: number) => 80 + (lon + 30) * 9.333;
const Y = (lat: number) => 215 + (60 - lat) * 11.2;
const cities = [
  {name: 'London', off: 'UTC+0', lon: -0.13, lat: 51.5, lab: 'above'},
  {name: 'Cairo', off: 'UTC+2', lon: 31.2, lat: 30.0, lab: 'left'},
  {name: 'Dubai', off: 'UTC+4', lon: 55.3, lat: 25.2, lab: 'below'},
];
const SERVER = {x: 1130, y: 420};
// same real instant = 08:00 UTC; each server logs the local wall-clock
const rows = [
  {city: 'London', t: '08:00:00', c: C.blue},
  {city: 'Cairo', t: '10:00:00', c: C.amber},
  {city: 'Dubai', t: '12:00:00', c: C.red},
];

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const shake = (a: number, b: number) => (f > a && f < b ? Math.sin(f * 2.1) * 9 * (1 - (f - a) / (b - a)) : 0);
  const sx = shake(420, 560) + shake(900, 1000);

  return (
    <Scene dur={S.s1.dur}>
      <Title ar="كارثة التوقيت المحلي" en="Local Time Trap" color={C.text} />

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* timezone bands */}
        {Array.from({length: 8}, (_, i) => {
          const lon0 = -37.5 + i * 15;
          return <rect key={i} x={X(lon0)} y={215} width={15 * 9.333} height={640} fill={i % 2 ? '#1E293B' : '#172033'} opacity={0.9} />;
        })}
        {[-30, -15, 0, 15, 30, 45, 60, 75, 90].map((lon) => (
          <text key={lon} x={X(lon)} y={885} textAnchor="middle" fontSize={24} fill={C.dim} fontFamily={mono}>
            {lon === 0 ? 'UTC+0' : `${lon / 15 > 0 ? '+' : ''}${lon / 15}`}
          </text>
        ))}

        {/* orders -> server: lines + pulses */}
        {cities.map((c, i) => {
          const px = X(c.lon), py = Y(c.lat);
          const lp = prog(f, 120, 200);
          const t = prog(f, 220 + i * 0, 340);
          const mx = (px + SERVER.x) / 2, my = Math.min(py, SERVER.y) - 90;
          const q = (u: number, a: number, b: number, cc: number) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * cc;
          const dx = q(t, px, mx, SERVER.x), dy = q(t, py, my, SERVER.y);
          const ring = (f % 60) / 60;
          return (
            <g key={c.name}>
              <path d={`M ${px} ${py} Q ${mx} ${my} ${SERVER.x} ${SERVER.y}`} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="10 10" opacity={lp * 0.8} />
              <circle cx={px} cy={py} r={14 + ring * 34} fill="none" stroke={C.blue} strokeWidth={3} opacity={(1 - ring) * prog(f, 60, 90)} />
              <circle cx={px} cy={py} r={13} fill={C.blue} opacity={prog(f, 50, 80)} />
              {t > 0 && t < 1 && <circle cx={dx} cy={dy} r={12} fill={C.text} />}
              <text
                x={c.lab === 'left' ? px - 26 : px}
                y={c.lab === 'above' ? py - 34 : c.lab === 'below' ? py + 52 : py + 10}
                textAnchor={c.lab === 'left' ? 'end' : 'middle'}
                fontSize={32}
                fontWeight={700}
                fill={C.text}
                opacity={prog(f, 60, 90)}
              >
                {c.name} <tspan fill={C.dim} fontSize={24} fontFamily={mono}>{c.off}</tspan>
              </text>
            </g>
          );
        })}

        {/* server */}
        <g opacity={prog(f, 90, 120)}>
          <rect x={SERVER.x - 55} y={SERVER.y - 55} width={110} height={110} rx={16} fill={C.panel} stroke={C.blue} strokeWidth={4} />
          {[-28, 0, 28].map((o) => (<rect key={o} x={SERVER.x - 34} y={SERVER.y + o - 8} width={68} height={14} rx={4} fill={C.blue} opacity={0.8} />))}
          <text x={SERVER.x} y={SERVER.y + 92} textAnchor="middle" fontSize={26} fill={C.dim} fontFamily={mono}>SERVER</text>
        </g>
      </svg>

      {/* logs panel */}
      <div className="absolute" style={{left: 1290, top: 215, width: 550, height: 640, background: C.panel, border: `2px solid ${f > 600 ? C.red : C.line}`, borderRadius: 24, transform: `translateX(${sx}px)`}}>
        <div style={{padding: '22px 28px', fontFamily: mono, fontSize: 28, fontWeight: 700, color: C.blue, direction: 'ltr', opacity: prog(f, 300, 330)}}>orders_log — TIMESTAMP</div>
        <div style={{height: 2, background: C.line}} />
        {rows.map((r, i) => (
          <div key={r.city} style={{position: 'absolute', top: 100 + i * 120, left: 28, right: 28, opacity: prog(f, 340 + i * 30, 370 + i * 30), direction: 'ltr'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontSize: 34, fontWeight: 900, color: r.c}}>{r.city}</span>
              <span style={{fontSize: 38, fontWeight: 700, color: C.text, fontFamily: mono}}>{r.t}</span>
            </div>
            <div style={{fontSize: 24, color: C.dim, fontFamily: mono, marginTop: 4}}>real instant: 08:00:00 UTC</div>
          </div>
        ))}
        <div style={{position: 'absolute', top: 450, left: 28, right: 28, direction: 'ltr', opacity: prog(f, 460, 490), fontFamily: mono, fontSize: 30, color: C.red, fontWeight: 700}}>
          gap: +2h → +4h
        </div>
        <div style={{position: 'absolute', bottom: 28, left: 28, right: 28, opacity: prog(f, 560, 590), background: 'rgba(239,68,68,0.16)', border: `2px solid ${C.red}`, borderRadius: 14, padding: '12px 16px', color: C.red, fontSize: 28, fontWeight: 900, textAlign: 'center', direction: 'rtl'}}>
          التسلسل الزمني اتدمّر
        </div>
      </div>

      <Caption from={60} to={540} ltr={false} color={C.red} size={46}>كارثة التوقيت المحلي | Local Time Trap</Caption>
      <Caption from={660} to={1140} color={C.amber}>Same Moment ──► Scrambled Chronological Sequence</Caption>
    </Scene>
  );
};
