import React from 'react';
import {COL, FONT_AR} from '../theme';
import {win, ramp, CursorState} from './anim';

/** نص عربي يحوي مصطلحات إنجليزية بين {{ }} → تُعزل بـ dir=ltr + unicode-bidi:isolate */
export const Rich: React.FC<{t: string}> = ({t}) => {
  const parts = t.split(/\{\{(.+?)\}\}/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} dir="ltr" style={{unicodeBidi: 'isolate', fontWeight: 600}}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

/** شريط شرح عربي سفلي في منطقة ثابتة */
export const Annot: React.FC<{T: number; a: number; b: number; text: string; x?: number; y?: number; w?: number; tone?: 'dark' | 'warn' | 'ok'}> = ({
  T, a, b, text, x = 280, y = 880, w = 1250, tone = 'dark',
}) => {
  const o = win(T, a, b, 0.3);
  if (o <= 0.01) return null;
  const bar = tone === 'warn' ? COL.red : tone === 'ok' ? COL.green : COL.yellow;
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute', left: x, top: y + (1 - o) * 14, width: w, opacity: o,
        background: COL.ink, color: '#fff', borderRadius: 14, padding: '18px 30px 20px 26px',
        borderRight: `10px solid ${bar}`, fontFamily: FONT_AR, fontSize: 34, lineHeight: 1.5,
        textAlign: 'right',
      }}
    >
      <Rich t={text} />
    </div>
  );
};

export const SampleBadge: React.FC<{x?: number; y?: number}> = ({x = 1560, y = 1052}) => (
  <div
    dir="rtl"
    style={{
      position: 'absolute', left: x, top: y, height: 26, padding: '0 14px', borderRadius: 13,
      background: COL.yellow, color: COL.ink, fontFamily: FONT_AR, fontSize: 16, fontWeight: 700,
      display: 'flex', alignItems: 'center',
    }}
  >
    بيانات تجريبية
  </div>
);

export const Cursor: React.FC<{c: CursorState; show?: number}> = ({c, show = 1}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none', opacity: show}}>
    {c.press > 0 ? (
      <div
        style={{
          position: 'absolute', left: c.x - 26, top: c.y - 26, width: 52, height: 52, borderRadius: 26,
          border: `3px solid ${COL.blue}`, opacity: c.press * 0.7, transform: `scale(${1.5 - c.press * 0.5})`,
        }}
      />
    ) : null}
    <svg width="30" height="40" viewBox="0 0 30 40" style={{position: 'absolute', left: c.x - 3, top: c.y - 2, transform: `scale(${1 - c.press * 0.12})`, transformOrigin: '3px 2px'}}>
      <path d="M3 2v30l8-7 6 13 5-2.5-6-12.5h11z" fill="#fff" stroke="#000" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  </div>
);

export const Card: React.FC<{x: number; y: number; w: number; h?: number; o?: number; children: React.ReactNode; bg?: string; border?: string}> = ({
  x, y, w, h, o = 1, children, bg = '#fff', border = COL.line,
}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y + (1 - o) * 16, width: w, height: h, opacity: o, background: bg,
      border: `2px solid ${border}`, borderRadius: 16, boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

export const AR: React.CSSProperties = {fontFamily: FONT_AR, direction: 'rtl', textAlign: 'right'};
export {ramp, win};

export const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

type MT = {
  x: number; y: number; cols: string[]; ws: number[]; rows: (string | number | null)[][]; rowH: number; font: number; o?: number;
  headBg?: (j: number) => string | undefined; cellBg?: (i: number, j: number) => string | undefined;
};

/** جدول بسيط (خارج واجهة Power Query) */
export const MiniTable: React.FC<MT> = ({x, y, cols, ws, rows, rowH, font, o = 1, headBg, cellBg}) => (
  <div style={{position: 'absolute', left: x, top: y, width: ws.reduce((a, b) => a + b, 0), opacity: o, border: `2px solid ${COL.line}`, background: '#fff', direction: 'ltr', fontFamily: "'PBIInter','PBIArabic',sans-serif"}}>
    <div style={{display: 'flex', height: rowH, background: COL.panel}}>
      {cols.map((c, j) => (
        <div key={c} style={{width: ws[j], boxSizing: 'border-box', padding: '0 12px', display: 'flex', alignItems: 'center', fontSize: font, fontWeight: 600, color: COL.text, background: headBg?.(j), borderLeft: j ? `1px solid ${COL.line}` : undefined}}>{c}</div>
      ))}
    </div>
    {rows.map((r, i) => (
      <div key={i} style={{display: 'flex', height: rowH, borderTop: `1px solid ${COL.line}`}}>
        {r.map((v, j) => (
          <div key={j} style={{width: ws[j], boxSizing: 'border-box', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: typeof v === 'number' ? 'flex-end' : 'flex-start', fontSize: font, color: v === null ? '#8A8886' : COL.text, fontStyle: v === null ? 'italic' : 'normal', background: cellBg?.(i, j), borderLeft: j ? `1px solid ${COL.line}` : undefined}}>
            {v === null ? 'null' : String(v)}
          </div>
        ))}
      </div>
    ))}
  </div>
);
