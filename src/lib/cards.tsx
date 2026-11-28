import React from 'react';
import { C, FONT_MONO, FONT_UI } from '../theme';
import { Appear, En } from './ui';

export const BigType: React.FC<{ t: number; at: number; name: string; ar: React.ReactNode; note: string; ex?: string; c: string; h?: number }> = ({ t, at, name, ar, note, ex, c, h = 230 }) => (
  <Appear t={t} at={at} style={{ position: 'relative', width: '100%', height: h, borderRadius: 26, background: C.panel, border: `4px solid ${c}`, flexShrink: 0 }}>
    <div style={{ position: 'absolute', right: 26, top: 24, width: 190, height: 96, borderRadius: 20, background: c, color: '#0D1117', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr' }}>{name}</div>
    <div style={{ position: 'absolute', right: 240, top: 22, color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 42 }}>{ar}</div>
    <div style={{ position: 'absolute', right: 240, top: 84, color: C.dim, fontFamily: FONT_UI, fontSize: 28 }}>{note}</div>
    {ex && <div style={{ position: 'absolute', left: 26, right: 26, bottom: 20, height: 78, borderRadius: 16, background: '#1F1F1F', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr', fontFamily: FONT_MONO, fontSize: 42, color: C.text }}>{ex}</div>}
  </Appear>
);

export const Row: React.FC<{ t: number; at: number; c: string; mark?: string; children: React.ReactNode; sub?: string; h?: number }> = ({ t, at, c, mark, children, sub, h = 84 }) => (
  <Appear t={t} at={at} style={{ width: '100%', minHeight: h, borderRadius: 18, border: `3px solid ${c}`, background: `${c}1c`, display: 'flex', alignItems: 'center', gap: 18, padding: '8px 24px', direction: 'ltr', flexShrink: 0 }}>
    {mark && <span style={{ fontSize: 44, color: c, fontWeight: 700, fontFamily: FONT_UI }}>{mark}</span>}
    <div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 36, color: C.text, fontWeight: 700 }}>{children}</div>
      {sub && <div style={{ fontFamily: FONT_UI, fontSize: 22, color: c, direction: 'rtl' }}>{sub}</div>}
    </div>
  </Appear>
);

export const Note: React.FC<{ t: number; at: number; c?: string; size?: number; children: React.ReactNode }> = ({ t, at, c = C.text, size = 36, children }) => (
  <Appear t={t} at={at} style={{ width: '100%', textAlign: 'center', color: c, fontFamily: FONT_UI, fontWeight: 700, fontSize: size, direction: 'rtl', flexShrink: 0 }}>{children}</Appear>
);
export { En };
