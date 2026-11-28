import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_UI, LESSON, LOGO_FILE } from '../theme';
import { clamp } from '../lib/util';

/** Silent static closing shot (last 5 seconds). */
export const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const k = clamp(f / 12);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: k, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 90 }}>
      <Img src={staticFile(LOGO_FILE)} style={{ width: 600, height: 524, objectFit: 'contain' }} />
      <div style={{ width: 2, height: 420, background: C.line }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 820 }}>
        <div style={{ color: C.dim, fontFamily: FONT_UI, fontSize: 38, direction: 'rtl', textAlign: 'right' }}>{LESSON.unit} · الدرس {LESSON.num}</div>
        <div style={{ color: C.text, fontFamily: FONT_UI, fontWeight: 700, fontSize: 64, lineHeight: 1.3, direction: 'ltr' }}>{LESSON.title}</div>
        <div style={{ color: C.dim, fontFamily: FONT_UI, fontSize: 32, direction: 'ltr' }}>{LESSON.course}</div>
      </div>
    </div>
  );
};
