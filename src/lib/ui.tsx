import type {ReactNode, CSSProperties} from 'react';
import {C, FONT, MONO} from '../theme';
import {pop, cursorAt} from './anim';
import type {Pt} from './anim';

export const Ltr = ({children}: {children: ReactNode}) => (
  <span dir="ltr" style={{unicodeBidi: 'isolate', fontFamily: FONT}}>
    {children}
  </span>
);

export const Code = ({children, color = C.ink, size = 30}: {children: ReactNode; color?: string; size?: number}) => (
  <span dir="ltr" style={{unicodeBidi: 'isolate', fontFamily: MONO, fontSize: size, color, background: '#F1F5F9', padding: '2px 10px', border: '1px solid #CBD5E1'}}>
    {children}
  </span>
);

export type CalloutProps = {
  fr: number;
  at: number;
  out?: number;
  x: number;
  y: number;
  w: number;
  color: string;
  title: ReactNode;
  body?: ReactNode;
  titleSize?: number;
  bodySize?: number;
  dark?: boolean;
};

export const Callout = ({fr, at, out, x, y, w, color, title, body, titleSize = 34, bodySize = 27, dark = false}: CalloutProps) => {
  const p = pop(fr, at, 10) * (out !== undefined ? 1 - pop(fr, out, 8) : 1);
  if (p <= 0.001) return null;
  const st: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y + (1 - p) * 16,
    width: w,
    opacity: p,
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: FONT,
    background: dark ? 'rgba(15,23,42,0.96)' : C.white,
    color: dark ? C.white : C.ink,
    borderTop: '1px solid ' + (dark ? '#334155' : '#CBD5E1'),
    borderBottom: '1px solid ' + (dark ? '#334155' : '#CBD5E1'),
    borderLeft: '1px solid ' + (dark ? '#334155' : '#CBD5E1'),
    borderRight: '10px solid ' + color,
    padding: '14px 22px 14px 18px',
    boxSizing: 'border-box',
  };
  return (
    <div style={st}>
      <div style={{fontSize: titleSize, fontWeight: 700, color: dark ? C.white : color, lineHeight: 1.35}}>{title}</div>
      {body ? <div style={{fontSize: bodySize, marginTop: 6, lineHeight: 1.45, color: dark ? '#CBD5E1' : C.gray}}>{body}</div> : null}
    </div>
  );
};

export const Ring = ({fr, at, out, x, y, w, h, color}: {fr: number; at: number; out?: number; x: number; y: number; w: number; h: number; color: string}) => {
  const p = pop(fr, at, 8) * (out !== undefined ? 1 - pop(fr, out, 8) : 1);
  if (p <= 0.001) return null;
  const pulse = 1 + 0.03 * Math.sin((fr - at) / 5);
  return (
    <div style={{position: 'absolute', left: x - 4, top: y - 4, width: w + 8, height: h + 8, border: '4px solid ' + color, borderRadius: 6, opacity: p, transform: 'scale(' + pulse + ')', boxSizing: 'border-box'}} />
  );
};

export const Badge = ({fr, at, x, y, n, color}: {fr: number; at: number; x: number; y: number; n: number; color: string}) => {
  const p = pop(fr, at, 8);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x - 17, top: y - 17, width: 34, height: 34, borderRadius: 17, background: color, color: C.white, fontFamily: FONT, fontWeight: 700, fontSize: 22, textAlign: 'center', lineHeight: '34px', opacity: p, transform: 'scale(' + (0.6 + 0.4 * p) + ')'}}>
      {n}
    </div>
  );
};

export const Dim = ({fr, at, out, a = 0.7}: {fr: number; at: number; out?: number; a?: number}) => {
  const p = pop(fr, at, 10) * (out !== undefined ? 1 - pop(fr, out, 10) : 1);
  if (p <= 0.001) return null;
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'rgba(15,23,42,' + a * p + ')'}} />;
};

export const Cursor = ({fr, pts, clicks}: {fr: number; pts: Pt[]; clicks: number[]}) => {
  if (fr < pts[0][0] - 1) return null;
  const {x, y} = cursorAt(fr, pts);
  const press = clicks.some((c) => fr >= c && fr < c + 5);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none'}}>
      {clicks.map((c) => {
        const t = (fr - c) / 14;
        if (t < 0 || t > 1) return null;
        const cp = cursorAt(c, pts);
        return (
          <div key={c} style={{position: 'absolute', left: cp.x - 30 * t - 4, top: cp.y - 30 * t - 4, width: 60 * t + 8, height: 60 * t + 8, borderRadius: 40, border: '3px solid rgba(37,99,235,' + (1 - t) + ')', boxSizing: 'border-box'}} />
        );
      })}
      <svg width={34} height={34} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: 'scale(' + (press ? 0.88 : 1) + ')', transformOrigin: '0 0'}}>
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill="#FFFFFF" stroke="#000000" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Chip = ({fr, at, out, x, y, w, text, color}: {fr: number; at: number; out?: number; x: number; y: number; w: number; text: ReactNode; color: string}) => {
  const p = pop(fr, at, 10) * (out !== undefined ? 1 - pop(fr, out, 8) : 1);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - p) * 12, width: w, opacity: p, direction: 'rtl', textAlign: 'center', fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.white, background: color, padding: '10px 6px', boxSizing: 'border-box'}}>
      {text}
    </div>
  );
};
