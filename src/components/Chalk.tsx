import React from 'react';
import {CH, clamp} from '../theme';
import {AR, EN} from '../fonts';

/** فلتر الطباشير (خشونة + حبيبات ثابتة). بيتطبّق مرة واحدة على طبقة كل مشهد. */
export const ChalkDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="chalk" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={3} result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={8} result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.45 1.62" result="mask" />
        <feComposite in="disp" in2="mask" operator="in" />
      </filter>
    </defs>
  </svg>
);

type PathProps = {d: string; p: number; color?: string; w?: number; opacity?: number; fill?: string; fillOpacity?: number};

/** خط طباشير بيترسم تدريجيًا (stroke-dash). */
export const ChalkPath: React.FC<PathProps> = ({d, p, color = CH.white, w = 5, opacity = 0.95, fill = 'none', fillOpacity = 0}) => {
  if (p <= 0.0005) return null;
  return (
    <path d={d} fill={fill} fillOpacity={fillOpacity * clamp(p)} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} opacity={opacity} />
  );
};

type TextProps = {
  text: string;
  x: number; // مركز الصندوق
  y: number; // أعلى الصندوق
  w?: number;
  size: number;
  p: number; // تقدّم الكتابة 0..1
  color?: string;
  font?: 'ar' | 'en';
  weight?: number;
  align?: 'center' | 'right' | 'left';
  lh?: number;
  dir?: 'rtl' | 'ltr';
  ls?: number;
};

/** نص بيتكتب بكشف تدريجي بحافة ناعمة (من اليمين للعربي ومن الشمال للإنجليزي). */
export const ChalkText: React.FC<TextProps> = ({text, x, y, w = 1000, size, p, color = CH.white, font = 'ar', weight, align = 'center', lh = 1.25, dir, ls}) => {
  if (p <= 0.001) return null;
  const rtl = (dir ?? (font === 'ar' ? 'rtl' : 'ltr')) === 'rtl';
  const q = clamp(p);
  const a = q * 112 - 12;
  const mask = `linear-gradient(to ${rtl ? 'left' : 'right'}, #000 ${a}%, transparent ${q * 112}%)`;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        textAlign: align,
        direction: rtl ? 'rtl' : 'ltr',
        fontFamily: font === 'ar' ? AR : EN,
        fontWeight: weight ?? (font === 'ar' ? 700 : 700),
        fontSize: size,
        lineHeight: lh,
        color,
        letterSpacing: ls,
        whiteSpace: 'pre-wrap',
        textShadow: '0 0 1.5px rgba(255,255,255,0.45)',
        WebkitMaskImage: q >= 0.999 ? undefined : mask,
        maskImage: q >= 0.999 ? undefined : mask,
      }}
    >
      {text}
    </div>
  );
};

/** دايرة/بيضاوي طباشير حوالين عنصر (بتترسم من الدرجة). */
export const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * 1.35} ${cx + rx} ${cy - ry * 1.35} ${cx + rx + 6} ${cy + 4} C ${cx + rx} ${cy + ry * 1.35} ${cx - rx} ${cy + ry * 1.35} ${cx - rx - 8} ${cy - 6}`;

export const arrowHead = (x: number, y: number, ang: number, s = 22) => {
  const a1 = ang + Math.PI - 0.5;
  const a2 = ang + Math.PI + 0.5;
  return `M ${x + Math.cos(a1) * s} ${y + Math.sin(a1) * s} L ${x} ${y} L ${x + Math.cos(a2) * s} ${y + Math.sin(a2) * s}`;
};
