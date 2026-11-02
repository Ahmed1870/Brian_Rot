import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {appear, pop} from '../components/Text';
import {back, ei, eo, fmt, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc04;
const AMBER = K.bool;
const VIO = '#A78BFA';

type IntBox = {name: string; bytes: number; max: string; use: string; x: number; w: number; h: number; at: number};
const BOXES: IntBox[] = [
  {name: 'SMALLINT', bytes: 2, max: '32,767', use: 'age · flags', x: 90, w: 280, h: 250, at: S.boxes[0]},
  {name: 'INTEGER', bytes: 4, max: '2,147,483,647', use: 'orders · qty', x: 410, w: 340, h: 350, at: S.boxes[0] + 2},
  {name: 'BIGINT', bytes: 8, max: '9,223,372,036,854,775,807', use: 'IDs · event logs', x: 790, w: 410, h: 470, at: S.boxes[0] + 4},
];
const BASE = 790;

const Tag: React.FC<{t: number; range: number[]; color: string; head: string; body: string}> = ({t, range, color, head, body}) => {
  const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
  if (p <= 0.01) return null;
  return (
    <div style={{opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 27, color: C.text, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        <span>{body}</span>
      </div>
    </div>
  );
};

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const lit = (bi: number, k: number) => t >= S.ascend + bi * 0.9 + k * 0.1; // bytes light up in ascending order
  const ov = S.overflow;
  const climb = eo(prog(t, ov[0], ov[0] + 2.4));
  const hit = t >= ov[0] + 2.5;
  const err = prog(t, ov[0] + 2.5, ov[0] + 3.2);
  const move = eo(prog(t, ov[0] + 3.4, ov[0] + 4.4));
  const counter = hit ? 2147483647 : Math.floor(1000 + climb * (2147483647 - 1000));
  const flash = hit ? 1 - prog(t, ov[0] + 2.5, ov[0] + 3.3) : 0;
  const boolP = pop(t, 131, 132.2);
  const boolFocus = 0.35 + 0.65 * seg(t, S.tag2[0] - 1.5, S.tag2[0] - 0.5);
  const dim = 1 - 0.35 * seg(t, S.tag2[0] - 1, S.tag2[0]);

  // boolean state: TRUE -> FALSE (click) -> NULL
  const toTrue = 1;
  const toFalse = eo(prog(t, S.toggle - 0.15, S.toggle + 0.35));
  const toNull = eo(prog(t, S.toggle + 3.0, S.toggle + 3.6));
  const knobPos = t < S.toggle - 0.15 ? 1 : t < S.toggle + 3.0 ? mix(1, 0, toFalse) : mix(0, 0.5, toNull);
  const state = t < S.toggle - 0.1 ? 'TRUE' : t < S.toggle + 3.1 ? 'FALSE' : 'NULL';
  const col = state === 'TRUE' ? K.num : state === 'FALSE' ? K.err : AMBER;
  const click = Math.sin(prog(t, S.toggle, S.toggle + 0.4) * Math.PI);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} tint={AMBER} />

      <div style={{position: 'absolute', left: 80, top: 96, width: 1200, height: 60}}>
        <Tag t={t} range={S.tag1} color={AMBER} head="INT (4 Bytes) vs BIGINT (8 Bytes)" body="──► Capacity Balance" />
      </div>
      <div style={{position: 'absolute', left: 1240, top: 96, width: 640, height: 60}}>
        <Tag t={t} range={S.tag2} color={VIO} head="BOOLEAN" body="──► TRUE / FALSE / NULL" />
      </div>

      {/* measuring boxes growing with capacity */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: dim}}>
        {BOXES.map((b, bi) => {
          const p = back(prog(t, S.boxes[0] + bi * 1.4, S.boxes[0] + bi * 1.4 + 0.9));
          const isInt = bi === 1;
          const isBig = bi === 2;
          const redNow = isInt && hit && t < ov[0] + 4.2;
          return (
            <div key={b.name} style={{position: 'absolute', left: b.x, top: BASE - b.h, width: b.w, height: b.h, transform: `scale(${Math.max(0.001, p)})`, transformOrigin: '50% 100%', opacity: Math.min(1, p * 2)}}>
              <div style={{width: b.w, height: b.h, borderRadius: 28, background: `linear-gradient(180deg, ${AMBER}${bi === 0 ? '22' : bi === 1 ? '33' : '44'}, rgba(30,41,59,0.95))`, border: `3px solid ${redNow ? K.err : AMBER}`, boxShadow: `0 0 ${redNow ? 50 : 24}px ${redNow ? K.err : AMBER}55`, padding: '22px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden'}}>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 34, color: AMBER}}>{b.name}</div>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 56, color: C.text, lineHeight: 1}}>{b.bytes} <span style={{fontSize: 26, color: C.dim}}>BYTES</span></div>
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                  {Array.from({length: b.bytes}).map((_, k) => (
                    <div key={k} style={{width: 34, height: 34, borderRadius: 8, background: lit(bi, k) ? AMBER : 'rgba(255,255,255,0.08)', boxShadow: lit(bi, k) ? `0 0 14px ${AMBER}` : undefined}} />
                  ))}
                </div>
                <div style={{marginTop: 'auto', fontFamily: FONT_MONO, fontSize: isBig ? 21 : 26, fontWeight: 700, color: isBig ? K.num : C.text}}>max {b.max}</div>
              </div>
            </div>
          );
        })}
        {/* usage chips */}
        {BOXES.map((b, bi) => (
          <div key={b.name} style={{position: 'absolute', left: b.x, top: BASE + 22, width: b.w, display: 'flex', justifyContent: 'center', opacity: appear(t, S.boxes[0] + bi * 1.4 + 0.6, S.boxes[0] + bi * 1.4 + 1.2)}}>
            <div style={{padding: '8px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.14)', fontFamily: FONT_MONO, fontSize: 22, color: C.dim}}>{b.use}</div>
          </div>
        ))}

        {/* integer overflow demo */}
        {t >= ov[0] - 0.4 ? (
          <div style={{position: 'absolute', left: 410, top: BASE + 78, opacity: appear(t, ov[0] - 0.4, ov[0] + 0.2)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{minWidth: 340, padding: '12px 22px', borderRadius: 16, background: '#0B1222', border: `2px solid ${hit ? K.err : AMBER}`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 34, color: hit ? K.err : C.text, boxShadow: flash > 0 ? `0 0 ${50 * flash}px ${K.err}` : undefined, textAlign: 'center', transform: `translateX(${hit && t < ov[0] + 3.3 ? Math.sin(t * 80) * 6 : 0}px)`}}>
                id = {fmt(counter)}
              </div>
              {err > 0 && move < 1 ? <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: '#FCA5A5', opacity: err * (1 - move)}}>ERROR: integer out of range</div> : null}
              {move > 0 ? (
                <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: move}}>
                  <svg width="90" height="30" viewBox="0 0 90 30"><line x1="0" y1="15" x2={76 * move} y2="15" stroke={K.num} strokeWidth="5" strokeLinecap="round" /><path d="M66 6 L82 15 L66 24" fill="none" stroke={K.num} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: K.num}}>BIGINT ✓</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* BOOLEAN panel */}
      <div style={{position: 'absolute', left: 1250 + (1 - boolP) * 700, top: 190, width: 620, height: 700, opacity: Math.min(1, boolP * 1.4) * boolFocus}}>
        <Glass w={620} h={700} t={t} tint={VIO} glow={24} style={{border: `2px solid ${VIO}88`}}>
          <div style={{padding: '30px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 48, color: VIO}}>BOOLEAN</div>
            <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px', borderRadius: 22, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', direction: 'rtl', boxSizing: 'border-box'}}>
              <div style={{width: 70, height: 70, borderRadius: 35, background: `linear-gradient(135deg, ${K.txt}, ${VIO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 900, fontSize: 38, color: C.bg}}>أ</div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 32, color: C.text}}>أحمد محمود</span>
                <span style={{fontFamily: FONT_MONO, fontSize: 20, color: C.dim, direction: 'ltr'}}>is_active</span>
              </div>
              <div style={{marginRight: 'auto', padding: '8px 22px', borderRadius: 999, background: `${col}22`, border: `2px solid ${col}`, fontFamily: FONT_AR, fontWeight: 800, fontSize: 26, color: col}}>{state === 'TRUE' ? 'نشط' : state === 'FALSE' ? 'غير نشط' : 'غير معروف'}</div>
            </div>
            {/* toggle switch */}
            <div style={{position: 'relative', width: 420, height: 170, borderRadius: 85, background: `${col}33`, border: `4px solid ${col}`, boxShadow: `0 0 ${34 + 20 * click}px ${col}77`, marginTop: 10}}>
              <div style={{position: 'absolute', left: 18 + knobPos * (420 - 36 - 134), top: 14 + 0, width: 134, height: 134, borderRadius: 67, background: col, boxShadow: '0 10px 26px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: C.bg, transform: `scale(${1 - 0.1 * click})`}}>{state === 'NULL' ? '?' : state === 'TRUE' ? '✓' : '✕'}</div>
            </div>
            <div style={{display: 'flex', gap: 14, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30}}>
              {['TRUE', 'FALSE', 'NULL'].map((s) => (
                <div key={s} style={{padding: '8px 22px', borderRadius: 12, background: s === state ? (s === 'TRUE' ? K.num : s === 'FALSE' ? K.err : AMBER) : 'rgba(255,255,255,0.06)', color: s === state ? C.bg : C.dim}}>{s}</div>
              ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 8}}>
              <div style={{width: 34, height: 34, borderRadius: 8, background: VIO, boxShadow: `0 0 14px ${VIO}`}} />
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 36, color: C.text}}>1 BYTE</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 26, color: C.dim, direction: 'rtl'}}>مساحة لا تتجاوز بايت واحد</span>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};
