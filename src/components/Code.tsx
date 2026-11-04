import React from 'react';
import {C, D, FONT_MONO} from '../theme';
import {typed} from '../lib/anim';

export type CodeLine = {text: string; at: number; dt?: number};

const KW = new Set(['CREATE', 'DATABASE', 'TABLE', 'ENCODING', 'GENERATED', 'ALWAYS', 'AS', 'IDENTITY', 'PRIMARY', 'KEY', 'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CONSTRAINT', 'FOREIGN', 'REFERENCES', 'ON', 'DELETE', 'RESTRICT', 'CHECK', 'SELECT', 'FROM', 'WHERE', 'BEGIN', 'ROLLBACK', 'COMMIT', 'IF', 'EXISTS', 'UPDATE', 'NO', 'ACTION', 'WITH', 'TIME', 'ZONE', 'EXISTS', 'IN', 'AVG', 'AND', 'IS', 'JOIN', 'LEFT', 'SEMI', 'EXPLAIN']);
const TY = new Set(['INT', 'INTEGER', 'VARCHAR', 'TIMESTAMPTZ', 'NUMERIC', 'TEXT', 'BOOLEAN', 'timestamp', 'integer', 'numeric', 'with', 'time', 'zone']);
const FN = new Set(['CURRENT_TIMESTAMP']);

export const highlight = (text: string): React.ReactNode[] => {
  const parts = text.match(/'[^']*'?|--.*$|\w+|\s+|[^\w\s]/g) || [];
  return parts.map((p, i) => {
    let color = C.text;
    if (p.startsWith('--')) color = D.cmt;
    else if (p.startsWith("'")) color = D.str;
    else if (KW.has(p.toUpperCase()) && p === p.toUpperCase()) color = D.code;
    else if (TY.has(p)) color = D.key;
    else if (FN.has(p)) color = D.fn;
    else if (/^\d+$/.test(p)) color = D.num;
    return <span key={i} style={{color}}>{p}</span>;
  });
};

export const Code: React.FC<{lines: CodeLine[]; t: number; x: number; y: number; w: number; h: number; title?: string; fontSize?: number; lineH?: number; accent?: string; opacity?: number}> = ({lines, t, x, y, w, h, title = 'ddl_script.sql', fontSize = 27, lineH = 46, accent = D.code, opacity = 1}) => {
  let caretLine = -1;
  const shown = lines.map((l, i) => {
    const dt = l.dt ?? 0.034;
    const s = typed(l.text, t, l.at, dt);
    if (s.length > 0 && s.length < l.text.length) caretLine = i;
    if (s.length === l.text.length && l.text.length > 0 && t - l.at < l.text.length * dt + 0.5) caretLine = i;
    return s;
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, background: '#0B1222', border: `2px solid ${accent}55`, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${accent}22`, overflow: 'hidden', opacity}}>
      <div style={{height: 52, background: '#111B31', borderBottom: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10}}>
        {['#EF4444', '#F59E0B', '#10B981'].map((c) => (
          <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85}} />
        ))}
        <span style={{marginLeft: 16, fontFamily: FONT_MONO, fontSize: 20, color: C.dim}}>{title}</span>
      </div>
      <div style={{padding: '18px 0 0 0'}}>
        {lines.map((l, i) => (
          <div key={i} style={{height: lineH, display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize, whiteSpace: 'pre'}}>
            <span style={{width: 62, textAlign: 'right', paddingRight: 18, color: '#334155', fontSize: fontSize * 0.8, flexShrink: 0}}>{i + 1}</span>
            <span>{highlight(shown[i])}</span>
            {caretLine === i ? <span style={{display: 'inline-block', width: 3, height: fontSize * 1.1, background: accent, marginLeft: 2, opacity: Math.floor(t * 3) % 2}} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
