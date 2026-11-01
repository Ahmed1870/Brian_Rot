import React from 'react';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {COLS, COLS_W, SheetRow, getRow} from '../data';

export type CellStyle = {text?: string; bg?: string; color?: string; outline?: string; glow?: string; strike?: boolean; caret?: boolean};

export const LETTERS_H = 30;
export const HEAD_H = 56;
export const ROW_H = 52;
export const BODY_TOP = LETTERS_H + HEAD_H;

export const colX = (key: string): number => {
  let x = 0;
  for (const c of COLS) {
    if (c.key === key) return x;
    x += c.w;
  }
  return 0;
};
export const colW = (key: string): number => COLS.find((c) => c.key === key)?.w || 100;

// y of a data row inside the sheet panel (panel-local)
export const rowY = (n: number, scrollY: number, rowH = ROW_H): number => BODY_TOP + (n - 2) * rowH - scrollY;

export const RowView: React.FC<{row: SheetRow; rowH?: number; hl?: number; selected?: boolean; selCol?: string; cell?: (key: string) => CellStyle | undefined; bg?: string; style?: React.CSSProperties}> = ({row, rowH = ROW_H, hl = 0, selected, selCol, cell, bg, style}) => {
  const even = row.n % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 0, width: COLS_W, height: rowH, display: 'flex', background: bg || (selected ? 'rgba(56,189,248,0.22)' : hl > 0 ? `rgba(56,189,248,${0.06 + hl * 0.13})` : even ? 'rgba(255,255,255,0.018)' : 'transparent'), borderBottom: '1px solid rgba(71,85,105,0.55)', ...style}}>
      {hl > 0.05 ? <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: C.accent, opacity: hl}} /> : null}
      {COLS.map((c) => {
        const o = cell ? cell(c.key as string) : undefined;
        const raw = (row as unknown as Record<string, string | number | boolean>)[c.key as string];
        const text = o && o.text !== undefined ? o.text : String(raw);
        const isSel = selected && selCol === c.key;
        return (
          <div key={c.key as string} style={{width: c.w, height: rowH, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: c.mono ? 21 : 22, fontFamily: c.mono ? FONT_MONO : FONT_AR, fontWeight: c.key === 'name' ? 700 : 500, color: o?.color || (c.key === 'n' ? C.mute : C.text), background: o?.bg || (c.key === 'n' ? 'rgba(0,0,0,0.22)' : 'transparent'), borderRight: '1px solid rgba(71,85,105,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', unicodeBidi: 'plaintext', textAlign: 'start', outline: o?.outline ? `3px solid ${o.outline}` : isSel ? `3px solid ${C.accent}` : 'none', outlineOffset: -3, boxShadow: o?.glow ? `0 0 28px ${o.glow}, inset 0 0 18px ${o.glow}` : undefined, textDecoration: o?.strike ? 'line-through' : 'none', position: 'relative', zIndex: o?.outline || isSel ? 2 : 0}}>
            <span style={{unicodeBidi: 'plaintext'}}>{text}</span>
            {o?.caret ? <span style={{display: 'inline-block', width: 3, height: 28, background: C.accent, marginLeft: 3}} /> : null}
          </div>
        );
      })}
    </div>
  );
};

export const ColumnHeader: React.FC<{dim?: number}> = ({dim = 1}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: COLS_W, height: BODY_TOP, zIndex: 8, background: '#111B31', borderBottom: `2px solid ${C.line}`, boxShadow: '0 10px 24px rgba(0,0,0,0.45)', opacity: dim}}>
    <div style={{display: 'flex', height: LETTERS_H, borderBottom: '1px solid rgba(71,85,105,0.45)'}}>
      {COLS.map((c, i) => (
        <div key={c.key as string} style={{width: c.w, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 15, lineHeight: `${LETTERS_H}px`, color: C.mute, background: i === 0 ? 'rgba(0,0,0,0.3)' : 'transparent', borderRight: '1px solid rgba(71,85,105,0.35)'}}>{String.fromCharCode(65 + i)}</div>
      ))}
    </div>
    <div style={{display: 'flex', height: HEAD_H}}>
      {COLS.map((c) => (
        <div key={c.key as string} style={{width: c.w, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', fontFamily: FONT_AR, fontWeight: 800, fontSize: 21, color: C.accent, borderRight: '1px solid rgba(71,85,105,0.35)', unicodeBidi: 'plaintext'}}>{c.title}</div>
      ))}
    </div>
  </div>
);

// Scrollable, virtualised table panel with sticky header
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; scrollY: number; lastRow?: number; hlOf?: (n: number) => number; cellOf?: (n: number, key: string) => CellStyle | undefined; selRow?: number | null; selCol?: string; blur?: number; dim?: number; rowH?: number}> = ({x, y, w, h, scrollY, lastRow = 400, hlOf, cellOf, selRow, selCol, blur = 0, dim = 1, rowH = ROW_H}) => {
  const first = Math.max(2, Math.floor(scrollY / rowH) + 1);
  const count = Math.ceil(h / rowH) + 3;
  const rows: React.ReactNode[] = [];
  for (let n = first; n < first + count && n <= lastRow; n++) {
    const top = BODY_TOP + (n - 2) * rowH - scrollY;
    rows.push(
      <div key={n} style={{position: 'absolute', left: 0, top, width: COLS_W, height: rowH}}>
        <RowView row={getRow(n)} rowH={rowH} hl={hlOf ? hlOf(n) : 0} selected={selRow === n} selCol={selCol} cell={cellOf ? (k) => cellOf(n, k) : undefined} />
      </div>,
    );
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: 18, background: '#0D1527', border: `1.5px solid ${C.line}`, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', opacity: dim}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: COLS_W, height: h, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>{rows}</div>
      <ColumnHeader />
    </div>
  );
};
