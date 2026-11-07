import React from 'react';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {back, eo, prog} from '../lib/anim';

export type Field = {name: string; type: string; at: number; badges?: {kind: string; at: number}[]};

const BADGE: Record<string, {label: string; color: string}> = {
  PK: {label: 'PRIMARY KEY', color: D.key},
  NN: {label: 'NOT NULL', color: D.code},
  UQ: {label: 'UNIQUE', color: D.code},
  DF: {label: 'DEFAULT', color: D.cat},
  FK: {label: 'FOREIGN KEY', color: D.code},
  CK: {label: 'CHECK ≥ 0', color: D.cat},
  IX: {label: 'B-Tree', color: D.cat},
};

const Icon: React.FC<{kind: string; c: string}> = ({kind, c}) => {
  const p = {fill: 'none', stroke: c, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (kind === 'PK') return <svg width="26" height="26" viewBox="0 0 26 26"><circle {...p} cx="8" cy="13" r="5" /><path {...p} d="M13 13h11M20 13v5M24 13v4" /></svg>;
  if (kind === 'NN' || kind === 'UQ') return <svg width="24" height="26" viewBox="0 0 24 26"><rect {...p} x="3" y="11" width="18" height="12" rx="3" /><path {...p} d="M7 11V8a5 5 0 0 1 10 0v3" /></svg>;
  if (kind === 'DF') return <svg width="26" height="26" viewBox="0 0 26 26"><circle {...p} cx="13" cy="13" r="10" /><path {...p} d="M13 7v6l4 3" /></svg>;
  if (kind === 'FK') return <svg width="28" height="26" viewBox="0 0 28 26"><path {...p} d="M11 8h-3a5 5 0 0 0 0 10h3M17 8h3a5 5 0 0 1 0 10h-3M9 13h10" /></svg>;
  if (kind === 'IX') return <svg width="26" height="26" viewBox="0 0 26 26"><circle {...p} cx="13" cy="5" r="3" /><circle {...p} cx="6" cy="20" r="3" /><circle {...p} cx="20" cy="20" r="3" /><path {...p} d="M11 7L7 17M15 7l4 10" /></svg>;
  return <svg width="26" height="26" viewBox="0 0 26 26"><path {...p} d="M4 14 L10 20 L22 6" /></svg>;
};

export const SchemaCard: React.FC<{t: number; x: number; y: number; w: number; name: string; ar: string; accent: string; fields: Field[]; rowH?: number; at: number; glow?: number; dim?: number}> = ({t, x, y, w, name, ar, accent, fields, rowH = 78, at, glow = 24, dim = 1}) => {
  const head = back(prog(t, at, at + 0.7));
  const h = 86 + fields.length * rowH + 16;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: Math.min(1, head * 1.5) * dim, transform: `scale(${0.9 + 0.1 * head})`, transformOrigin: '50% 0%'}}>
      <div style={{width: w, height: h, borderRadius: 26, background: 'linear-gradient(160deg, #22304A, #1B2740)', border: `2.5px solid ${accent}`, boxShadow: `0 28px 70px rgba(0,0,0,0.5), 0 0 ${glow}px ${accent}55`, overflow: 'hidden'}}>
        <div style={{height: 80, background: `linear-gradient(90deg, ${accent}55, ${accent}11)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px'}}>
          <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 38, color: C.text}}>{name}</span>
          <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 28, color: accent}}>{ar}</span>
        </div>
        {fields.map((f, i) => {
          const p = back(prog(t, f.at, f.at + 0.6));
          return (
            <div key={f.name} style={{position: 'absolute', left: 16, right: 16, top: 90 + i * rowH, height: rowH - 8, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -50}px) scale(${0.96 + 0.04 * p})`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: C.text, minWidth: 172}}>{f.name}</span>
              <span style={{fontFamily: FONT_MONO, fontSize: f.badges && f.badges.length > 2 ? 17 : 20, color: D.key, whiteSpace: 'nowrap'}}>{f.type}</span>
              <span style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
                {(f.badges || []).map((b) => {
                  const bp = back(prog(t, b.at, b.at + 0.55));
                  if (bp <= 0.02) return null;
                  const meta = BADGE[b.kind];
                  return (
                    <span key={b.kind} style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 10, whiteSpace: 'nowrap', background: `${meta.color}26`, border: `1.5px solid ${meta.color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 14, color: meta.color, transform: `scale(${0.5 + 0.5 * bp})`, opacity: Math.min(1, bp * 2), boxShadow: bp > 0.9 ? `0 0 14px ${meta.color}66` : undefined}}>
                      <Icon kind={b.kind} c={meta.color} />
                      {meta.label}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const schemaHeight = (n: number, rowH = 78) => 86 + n * rowH + 16;
