import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT_MONO, FONT_UI, HEIGHT, LESSON, LOGO_FILE, WIDTH } from '../theme';
import { L } from './layout';
import { clamp, easeInOut, easeOut, fade } from './util';

/** Latin run inside Arabic text: isolates direction so punctuation never flips. */
export const En: React.FC<{ children: React.ReactNode; mono?: boolean; color?: string }> = ({ children, mono, color }) => (
  <span style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', fontFamily: mono ? FONT_MONO : undefined, color }}>{children}</span>
);

export const Appear: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number }> = ({ t, at, children, style, dy = 18 }) => {
  const k = fade(t, at, 0.4);
  return <div style={{ ...style, opacity: k, transform: `translateY(${(1 - k) * dy}px)` }}>{children}</div>;
};

/** Right-hand explainer panel: children flow vertically, centered. */
export const RP: React.FC<{ children: React.ReactNode; align?: 'center' | 'flex-start' }> = ({ children, align = 'center' }) => (
  <div style={{ position: 'absolute', left: L.rpX, top: L.rpY, width: L.rpW, height: L.rpH, display: 'flex', flexDirection: 'column', justifyContent: align, gap: 16, direction: 'rtl' }}>{children}</div>
);

export const Pill: React.FC<{ text: React.ReactNode; color: string; mono?: boolean; size?: number; solid?: boolean }> = ({ text, color, mono, size = 30, solid }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 18px', borderRadius: 40, border: `3px solid ${color}`, background: solid ? color : `${color}22`, color: solid ? '#0D1117' : color, fontSize: size, fontFamily: mono ? FONT_MONO : FONT_UI, fontWeight: 700, direction: 'ltr' }}>{text}</span>
);

export const Header: React.FC<{ frame: number; sceneIdx: number; title: string }> = ({ sceneIdx, title }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: WIDTH, height: L.headerH, background: C.bg, borderBottom: `1px solid ${C.line}`, direction: 'rtl' }}>
    <Img src={staticFile(LOGO_FILE)} style={{ position: 'absolute', left: 16, top: 8, width: 84, height: 73, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 116, top: 14, color: C.dim, fontFamily: FONT_UI, fontSize: 22, direction: 'ltr' }}>{LESSON.course}</div>
    <div style={{ position: 'absolute', left: 116, top: 46, color: C.dim, fontFamily: FONT_UI, fontSize: 22, direction: 'rtl' }}>{LESSON.unit} · الدرس {LESSON.num}</div>
    <div style={{ position: 'absolute', right: 40, top: 16, width: 1100, textAlign: 'right', color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 42, whiteSpace: 'nowrap' }}>{title}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', gap: 4, direction: 'ltr' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 5, background: i < sceneIdx ? C.accent : i === sceneIdx ? C.teal : '#30363D' }} />
      ))}
    </div>
  </div>
);

export const Caption: React.FC<{ items: { at: number; text: React.ReactNode }[]; t: number }> = ({ items, t }) => {
  let cur = -1;
  items.forEach((it, i) => { if (t >= it.at) cur = i; });
  if (cur < 0) return null;
  const it = items[cur];
  const k = fade(t, it.at, 0.3);
  return (
    <div style={{ position: 'absolute', left: 0, top: L.capY, width: WIDTH, height: HEIGHT - L.capY, background: C.bg, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 60px', direction: 'rtl' }}>
      <div style={{ opacity: k, transform: `translateY(${(1 - k) * 10}px)`, color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 40, textAlign: 'center' }}>{it.text}</div>
    </div>
  );
};

type Wp = { t: number; x: number; y: number };
export const Mouse: React.FC<{ t: number; path: Wp[]; clicks?: number[] }> = ({ t, path, clicks = [] }) => {
  if (path.length === 0 || t < path[0].t) return null;
  let x = path[0].x, y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = easeInOut((t - a.t) / Math.max(0.001, b.t - a.t));
      x = a.x + (b.x - a.x) * k; y = a.y + (b.y - a.y) * k;
    } else if (t > b.t) { x = b.x; y = b.y; }
  }
  const rip = clicks.filter((c) => t >= c && t < c + 0.5);
  const down = clicks.some((c) => t >= c && t < c + 0.12);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: WIDTH, height: HEIGHT, pointerEvents: 'none', zIndex: 50 }}>
      {rip.map((c) => {
        const k = easeOut(clamp((t - c) / 0.5));
        return <div key={c} style={{ position: 'absolute', left: x - 30 * k, top: y - 30 * k, width: 60 * k, height: 60 * k, borderRadius: 60, border: `3px solid ${C.accent}`, opacity: 1 - clamp((t - c) / 0.5) }} />;
      })}
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: 'absolute', left: x - 3, top: y - 1, transform: `scale(${down ? 0.88 : 1})`, transformOrigin: '3px 1px' }}>
        <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.5 L13.2 20.3 L10.1 13.7 L16.5 13.4 Z" fill="#FFFFFF" stroke="#000000" strokeWidth={1.3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Icon: React.FC<{ d: string; active?: boolean }> = ({ d, active }) => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#858585'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const UI_FONT = "LessonSans, 'DejaVu Sans', sans-serif";

export const VSChrome: React.FC<{
  tabs: { name: string; active?: boolean; dirty?: boolean }[];
  ln?: number; col?: number; errors?: number; pyVersion: string; runHot?: boolean;
}> = ({ tabs, ln = 1, col = 1, errors = 0, pyVersion, runHot }) => {
  const menu = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
  const W = L.chromeW;
  return (
    <div style={{ position: 'absolute', left: 0, top: L.chromeY, width: W, height: L.capY - L.chromeY, direction: 'ltr' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 44, background: C.chrome, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 14, fontFamily: UI_FONT, fontSize: 18, color: '#CCCCCC' }}>
        <svg width={24} height={24} viewBox="0 0 24 24"><path d="M17 3 L21 5 V19 L17 21 L7 12 L3.5 15 L2 14 V10 L3.5 9 L7 12 Z M17 7.5 L11 12 L17 16.5 Z" fill="#2489CA" /></svg>
        {menu.map((m) => <span key={m}>{m}</span>)}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 44, width: L.actW, height: L.statusY - L.chromeY - 44, background: C.chrome, borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, paddingTop: 20 }}>
        <Icon active d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5" />
        <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5" />
        <Icon d="M6 3v12 M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 9a9 9 0 0 1-9 9" />
        <Icon d="M7 4l12 8-12 8z" />
        <Icon d="M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M15 14l4 4" />
      </div>
      <div style={{ position: 'absolute', left: L.actW, top: 44, width: W - L.actW, height: 54, background: C.chrome, borderBottom: `1px solid ${C.line}`, display: 'flex' }}>
        {tabs.map((tb) => (
          <div key={tb.name} style={{ height: 54, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 10, background: tb.active ? C.edBg : '#181818', borderTop: tb.active ? `2px solid ${C.accent}` : '2px solid transparent', borderRight: `1px solid ${C.line}`, color: tb.active ? '#FFFFFF' : '#9D9D9D', fontFamily: UI_FONT, fontSize: 21 }}>
            <svg width={20} height={20} viewBox="0 0 24 24"><rect x="2" y="2" width="12" height="12" rx="3" fill="#3776AB" /><rect x="10" y="10" width="12" height="12" rx="3" fill="#FFD43B" /></svg>
            {tb.name}
            <span style={{ width: 11, height: 11, borderRadius: 6, background: tb.dirty ? '#CCCCCC' : 'transparent', marginLeft: 4 }} />
          </div>
        ))}
        <div style={{ position: 'absolute', right: 12, top: 8, width: 38, height: 38, borderRadius: 8, background: runHot ? '#3A3D41' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24"><path d="M6 3l14 9-14 9z" fill="none" stroke="#3FB950" strokeWidth={2.2} strokeLinejoin="round" /></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: L.statusY - L.chromeY, width: W, height: L.capY - L.statusY, background: C.chrome, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: UI_FONT, fontSize: 17, color: '#CCCCCC' }}>
        <span>⊗ {errors}   ⚠ 0</span>
        <span>Ln {ln}, Col {col}    UTF-8    {'{ }'} Python {pyVersion}</span>
      </div>
    </div>
  );
};
