import React from 'react';
import {AR} from '../fonts';
import {BARS, CHART_LINE, CHART_NODES, CIRCUITS, CIRCUIT_NODES, CLOUD_L, CLOUD_R, LOGO_CENTER, SERVER, SUBLINES, SUBMARK, WORDMARK} from '../logoData';

type Props = {x: number; y: number; scale?: number; reveal: number; shine: number; opacity?: number; uid: string; gold?: boolean; inline?: boolean; white?: boolean};

const trim = (p: number) => ({pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - Math.min(1, Math.max(0, p))});

/** لوجو Monzoma Digital (Vector) — تدرّج سماوي/ذهبي + لمعة 3D. uid لتفادي تعارض الـ ids. */
export const Logo: React.FC<Props> = ({x, y, scale = 1.3, reveal, shine, opacity = 1, uid, gold = false, inline = false, white = false}) => {
  const k = (a: number, b: number) => Math.min(1, Math.max(0, (reveal - a) / (b - a)));
  const shapes = (
    <g>
      {[CLOUD_L, CLOUD_R].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" {...trim(k(0, 0.45))} />
      ))}
      {BARS.map((b, i) => (
        <polygon key={i} points={b.pts} fill="#fff" opacity={k(0.3 + i * 0.08, 0.55 + i * 0.08)} />
      ))}
      <path d={CHART_LINE} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" {...trim(k(0.45, 0.7))} />
      {CHART_NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={9 * k(0.5 + i * 0.05, 0.7 + i * 0.05)} fill="#fff" />
      ))}
      {SERVER.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="#fff" opacity={k(0.35 + i * 0.07, 0.55 + i * 0.07)} />
      ))}
      {CIRCUITS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={3} {...trim(k(0.6, 0.85))} />
      ))}
      {CIRCUIT_NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={6 * k(0.75, 0.9)} fill="#fff" />
      ))}
      <text x={WORDMARK.x} y={WORDMARK.y} textAnchor="middle" fontFamily={AR} fontWeight={700} fontSize={WORDMARK.size} textLength={WORDMARK.textLength} lengthAdjust="spacing" fill="#fff" opacity={k(0.7, 0.95)}>
        MONZOMA
      </text>
      <text x={SUBMARK.x} y={SUBMARK.y} textAnchor="middle" fontFamily={AR} fontWeight={700} fontSize={SUBMARK.size} textLength={SUBMARK.textLength} lengthAdjust="spacing" fill="#fff" opacity={k(0.8, 1)}>
        DIGITAL
      </text>
      {SUBLINES.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={3} {...trim(k(0.8, 1))} />
      ))}
    </g>
  );
  const sx = 250 + shine * 600;
  const inner = (
    <>
      <defs>
        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={white ? '#FFFFFF' : gold ? '#FFD76A' : '#00F0FF'} />
          <stop offset="55%" stopColor={white ? '#FFFFFF' : gold ? '#FFBE28' : '#2563EB'} />
          <stop offset="100%" stopColor={white ? '#E8E8E8' : gold ? '#F59E0B' : '#00F0FF'} />
        </linearGradient>
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity={0} />
          <stop offset="50%" stopColor="#fff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${uid}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1080">
          {shapes}
        </mask>
      </defs>
      <g transform={`translate(540 540) scale(${scale}) translate(${-LOGO_CENTER.x} ${-LOGO_CENTER.y})`}>
        <g mask={`url(#${uid}-mask)`}>
          <rect x={250} y={300} width={600} height={470} fill={`url(#${uid}-base)`} />
          <polygon points={`${sx + 50},290 ${sx + 190},290 ${sx + 140},780 ${sx},780`} fill={`url(#${uid}-shine)`} />
        </g>
      </g>
    </>
  );
  if (inline) return <g transform={`translate(${x - 540} ${y - 540})`} opacity={opacity}>{inner}</g>;
  return (
    <svg width={1080} height={1080} viewBox="0 0 1080 1080" style={{position: 'absolute', left: x - 540, top: y - 540, overflow: 'visible', opacity}}>
      {inner}
    </svg>
  );
};
