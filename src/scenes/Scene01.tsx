import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, prog} from '../common';

const LINES = ['{', '  "brand": "Manzooma",', '  "color": "Red",', '  "specs": {', '    "ram": "8GB",', '    "storage": "256GB"', '  },', '  "in_stock": true,', '  "tags": ["new", "sale"]', '}'];
const NOTE: Record<number, {t: string; c: string}> = {
  1: {t: "?  key exists", c: C.blue}, 2: {t: '@>  contains', c: C.blue}, 4: {t: "jsonb_set('{specs,ram}')", c: C.amber}, 8: {t: "-  'tags'  (delete)", c: C.red},
};
const RY = 76, RP = 56;
const hl = (l: string) => l.replace(/("[^"]+")(:)/, '$1$2');

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const D = B.s1.doc, V = B.s1.side;
  const beam = prog(f, 181, 540) * LINES.length; // laser goes down the nested document
  const badge = ease(prog(f, 541, 600));

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="استعلامات وتعديل JSONB وفهارس GIN" en="JSONB Queries, Mutations & GIN Indexes" chip="SC 01 · CONCEPT" accent={C.blue} />

      <Card box={D} accent={C.line} at={4}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.blue}>store_products.attributes · JSONB</Tag></div>
        {LINES.map((l, i) => {
          const passed = beam > i + 0.5;
          const n = NOTE[i];
          return (
            <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + i * RP, height: RP - 6, borderRadius: 10, display: 'flex', alignItems: 'center', direction: 'ltr', background: passed && n ? 'rgba(56,189,248,0.10)' : 'transparent', borderLeft: `6px solid ${passed && n ? n.c : 'transparent'}`, opacity: prog(f, 10 + i * 6, 40 + i * 6)}}>
              <span style={{whiteSpace: 'pre', width: 440, paddingLeft: 12, fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text}}>{hl(l)}</span>
              {n && (
                <span style={{marginLeft: 20, fontFamily: mono, fontWeight: 700, fontSize: 24, color: n.c, border: `2px solid ${n.c}`, borderRadius: 10, padding: '2px 14px', opacity: passed ? 1 : 0, whiteSpace: 'nowrap'}}>{n.t}</span>
              )}
            </div>
          );
        })}
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {beam > 0 && beam < LINES.length && <rect x={D.x + 14} y={D.y + RY + beam * RP - 4} width={D.w - 28} height={6} rx={3} fill={C.blue} filter="url(#glow)" />}
      </svg>

      <Card box={V} accent={C.green} at={150}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>WHAT YOU WILL LEARN</Tag></div>
        {[
          {k: '@>', ar: 'فلترة عميقة بالاحتواء', c: C.blue}, {k: 'jsonb_set', ar: 'تعديل مكاني من غير إعادة كتابة', c: C.amber}, {k: 'GIN', ar: 'فهرس معكوس للسرعة', c: C.green},
        ].map((x, i) => (
          <div key={x.k} style={{position: 'absolute', left: 24, right: 24, top: 76 + i * 130, height: 112, borderRadius: 16, border: `3px solid ${x.c}`, background: C.panel2, display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px', direction: 'ltr', opacity: prog(f, 200 + i * 40, 240 + i * 40)}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 34, color: x.c, width: 190}}>{x.k}</span>
            <span style={{fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, direction: 'rtl', textAlign: 'left', flex: 1}}>{x.ar}</span>
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 34, textAlign: 'center', opacity: badge, transform: `scale(${0.9 + 0.1 * badge})`}}>
          <span style={{display: 'inline-block', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.bg, background: C.green, borderRadius: 999, padding: '8px 22px'}}>GIN Indexing &amp; Containment Engine</span>
        </div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>استعلامات وتعديل JSONB وفهارس GIN | JSONB Queries, Mutations & GIN Indexes</Caption>
      <Caption from={660} to={1140} color={C.green}>Advanced JSONB ──► Deep Containment Queries (@&gt;) & GIN Index Acceleration</Caption>
    </Scene>
  );
};
