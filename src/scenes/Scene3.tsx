import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Pill, appear, pop} from '../components/Text';
import {back, eo, hash, mix, prog, pulse, seg, typed} from '../lib/anim';

const S = TL.cues.sc03;
const PW = 900;
const PY = 170;
const PH = 720;
const Q1 = 'SELECT 0.1::float8 + 0.2::float8;';
const Q2 = 'SELECT 0.1::numeric(10,2) + 0.2::numeric(10,2);';
const B1 = '0.0001100110011001100110011001100110011';
const B2 = '0.0011001100110011001100110011001100110';
const FLOAT_RES = '0.30000000000000004';

const Terminal: React.FC<{query: string; color: string; w?: number}> = ({query, color, w = PW - 88}) => (
  <div style={{width: w, height: 104, borderRadius: 18, background: '#0B1222', border: `2px solid ${color}55`, padding: '0 24px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize: 21, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden'}}>
    <span style={{color: C.mute, marginRight: 14}}>postgres=#</span>
    <span>{query}</span>
    <span style={{display: 'inline-block', width: 3, height: 30, background: color, marginLeft: 2}} />
  </div>
);

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

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const inP = pop(t, 80.2, 81.4);
  const focusL = 1 - 0.5 * seg(t, S.tagGreen[0] - 0.4, S.tagGreen[0] + 0.5);
  const focusR = 0.5 + 0.5 * seg(t, S.tagGreen[0] - 0.4, S.tagGreen[0] + 0.5);

  // ---------- FLOAT side ----------
  const q1 = typed(Q1, t, S.q1, 0.07);
  const bitsP = prog(t, S.bits[0], S.bits[1] - 0.8);
  const bitsOut = seg(t, S.glitch + 0.3, S.glitch + 1.2);
  const resP = prog(t, S.glitch, S.glitch + 0.5);
  const glitching = t >= S.glitch && t < S.glitch + 0.6;
  const shake = t >= S.glitch && t < S.glitch + 2 ? Math.sin((t - S.glitch) * 70) * 9 * (1 - prog(t, S.glitch, S.glitch + 2)) : 0;
  const zoom = 1 + 0.12 * eo(prog(t, S.glitch + 1.2, S.glitch + 2.4)) * (1 - seg(t, S.glitch + 7, S.glitch + 8));
  const warn = 0.5 + 0.5 * pulse(t, 0.8);
  const eqP = pop(t, 100, 101);
  const typedRes = FLOAT_RES.slice(0, Math.floor(prog(t, S.glitch, S.glitch + 1.6) * FLOAT_RES.length));

  // ---------- NUMERIC side ----------
  const q2 = typed(Q2, t, S.q2, 0.06);
  const numP = pop(t, S.cash, S.cash + 0.7);
  const slideIn = eo(prog(t, S.cash, S.cash + 0.6));
  const verdictP = pop(t, S.verdict, S.verdict + 0.7);
  const digits = ['', '', '', '', '', '', '', '0', '.', '3', '0'];

  const bit = (s: string, color: string) =>
    s.split('').map((ch, i) => (
      <span key={i} style={{color: i > 1 && Math.floor((i - 2) / 4) % 2 === 0 ? color : C.dim, opacity: 1}}>{ch}</span>
    ));

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} tint={t < S.tagGreen[0] ? K.err : K.num} />

      <div style={{position: 'absolute', left: 60, top: 96, width: PW, height: 60}}>
        <Tag t={t} range={S.tagRed} color={K.err} head="FLOAT Trap:" body="0.1 + 0.2 = 0.30000000000000004" />
      </div>
      <div style={{position: 'absolute', left: 960, top: 96, width: PW, height: 60}}>
        <Tag t={t} range={S.tagGreen} color={K.num} head="NUMERIC(10,2):" body="Exact Precision for Money = 0.30" />
      </div>

      {/* ---------------- FLOAT ---------------- */}
      <div style={{position: 'absolute', left: 60 - (1 - inP) * 800, top: PY, width: PW, height: PH, opacity: focusL}}>
        <Glass w={PW} h={PH} t={t} tint={K.err} glow={24} style={{border: `2px solid ${K.err}77`}}>
          <div style={{padding: '26px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: K.err}}>FLOAT</span>
              <span style={{fontFamily: FONT_MONO, fontSize: 22, color: C.dim}}>DOUBLE PRECISION · IEEE 754</span>
            </div>
            <Terminal query={q1} color={K.err} />

            {/* binary approximation */}
            {t >= S.bits[0] - 0.2 ? (
              <div style={{marginTop: 20, height: 150, opacity: appear(t, S.bits[0] - 0.2, S.bits[0] + 0.4) * (1 - bitsOut), fontFamily: FONT_MONO, fontSize: 21}}>
                <div style={{color: C.mute, marginBottom: 6, fontFamily: FONT_AR, fontSize: 23, direction: 'rtl'}}>الصيغة الثنائية: كسور لا تنتهي أبدًا</div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}><span style={{color: C.dim}}>0.1 = </span>{bit(B1.slice(0, Math.floor(bitsP * B1.length)), K.bool)}<span style={{color: K.err}}>{bitsP > 0.95 ? '…' : ''}</span></div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', marginTop: 8}}><span style={{color: C.dim}}>0.2 = </span>{bit(B2.slice(0, Math.floor(bitsP * B2.length)), K.txt)}<span style={{color: K.err}}>{bitsP > 0.95 ? '…' : ''}</span></div>
              </div>
            ) : null}

            {/* result */}
            {resP > 0 ? (
              <div style={{marginTop: -150, height: 170, position: 'relative'}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.mute, marginBottom: 6}}>?column?</div>
                <div style={{transform: `translateX(${shake}px) scale(${zoom})`, transformOrigin: '0% 50%', display: 'inline-block', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glitching ? `4px 0 ${K.err}, -4px 0 ${K.txt}` : `0 0 26px ${K.err}55`, whiteSpace: 'nowrap'}}>
                  <span>{typedRes.slice(0, 3)}</span>
                  <span style={{color: K.err}}>{typedRes.slice(3)}</span>
                </div>
                {/* leaking drops */}
                {Array.from({length: 6}).map((_, i) => {
                  const p = ((t * 0.7 + i / 6) % 1);
                  return t > S.glitch + 1.6 ? <div key={i} style={{position: 'absolute', left: 540 + (i % 3) * 36 + hash(i) * 16, top: 70 + p * 70, width: 10, height: 14, borderRadius: 5, background: K.err, opacity: 1 - p}} /> : null;
                })}
              </div>
            ) : null}

            {resP > 0 ? (
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, opacity: appear(t, S.glitch + 0.8, S.glitch + 1.5), direction: 'rtl'}}>
                <svg width="46" height="46" viewBox="0 0 104 104"><path d="M52 8 L98 90 L6 90 Z" fill={K.err} stroke="#fff" strokeWidth="5" strokeLinejoin="round" /><rect x="48" y="38" width="8" height="30" rx="4" fill="#fff" /><circle cx="52" cy="78" r="5" fill="#fff" /></svg>
                <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: '#FCA5A5', opacity: 0.7 + 0.3 * warn}}>تسرّب القروش: فقدان الدقة في الحسابات المالية</span>
              </div>
            ) : null}

            {eqP > 0.01 ? (
              <div style={{marginTop: 26, opacity: Math.min(1, eqP * 1.5), transform: `translateY(${(1 - eqP) * 24}px)`}}>
                <div style={{width: PW - 88, height: 84, borderRadius: 16, background: '#0B1222', border: `2px solid ${K.err}55`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', boxSizing: 'border-box', fontFamily: FONT_MONO, fontSize: 22, color: C.text}}>
                  <span style={{color: C.dim}}>0.1 + 0.2 = 0.3 ?</span>
                  <span style={{fontWeight: 800, fontSize: 38, color: K.err}}>f&nbsp;&nbsp;(false)</span>
                </div>
              </div>
            ) : null}
          </div>
        </Glass>
      </div>

      {/* ---------------- NUMERIC ---------------- */}
      <div style={{position: 'absolute', left: 960 + (1 - inP) * 800, top: PY, width: PW, height: PH, opacity: focusR}}>
        <Glass w={PW} h={PH} t={t + 2} tint={K.num} glow={24} style={{border: `2px solid ${K.num}77`}}>
          <div style={{padding: '26px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: K.num}}>NUMERIC(10,2)</span>
              <span style={{fontFamily: FONT_MONO, fontSize: 22, color: C.dim}}>Arbitrary Precision</span>
            </div>
            <Terminal query={t >= S.q2 ? q2 : ''} color={K.num} />

            {/* exact decimal slots: precision 10, scale 2 */}
            <div style={{marginTop: 24, opacity: appear(t, S.q2 + 3, S.q2 + 3.8)}}>
              <div style={{fontFamily: FONT_AR, fontSize: 23, color: C.dim, marginBottom: 10, direction: 'rtl'}}>صيغة عشرية ثابتة: 10 خانات، منها 2 بعد الفاصلة</div>
              <div style={{display: 'flex', gap: 8, direction: 'ltr', alignItems: 'center'}}>
                {digits.map((d, i) => (
                  <div key={i} style={{width: d === '.' ? 24 : 56, height: d === '.' ? 56 : 72, borderRadius: 12, background: d && d !== '.' && t >= S.cash ? `${K.num}33` : 'rgba(255,255,255,0.06)', border: `2px solid ${d && d !== '.' && t >= S.cash ? K.num : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 38, color: K.num, opacity: d === '.' ? 1 : 1}}>{t >= S.cash ? d : d === '.' ? '.' : ''}</div>
                ))}
              </div>
            </div>

            {t >= S.cash ? (
              <div style={{marginTop: 26, height: 150, position: 'relative'}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.mute, marginBottom: 6}}>?column?</div>
                <div style={{display: 'inline-flex', alignItems: 'center', gap: 22, transform: `translateX(${(1 - slideIn) * -260}px)`, opacity: Math.min(1, slideIn * 2), fontFamily: FONT_MONO, fontWeight: 800, fontSize: 84, color: K.num, textShadow: `0 0 34px ${K.num}88`}}>
                  0.30
                  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke={K.num} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{transform: `scale(${0.6 + 0.4 * numP})`}}><circle cx="35" cy="35" r="30" /><path d="M20 36 L31 47 L51 23" /></svg>
                </div>
              </div>
            ) : null}

            {verdictP > 0.01 ? (
              <div style={{marginTop: 4, opacity: Math.min(1, verdictP * 1.5), transform: `translateY(${(1 - verdictP) * 24}px)`}}>
                <div style={{width: PW - 88, height: 84, borderRadius: 16, background: '#0B1222', border: `2px solid ${K.num}55`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', boxSizing: 'border-box', fontFamily: FONT_MONO, fontSize: 22, color: C.text}}>
                  <span style={{color: C.dim}}>0.1 + 0.2 = 0.3 ?</span>
                  <span style={{fontWeight: 800, fontSize: 38, color: K.num}}>t&nbsp;&nbsp;(true)</span>
                </div>
              </div>
            ) : null}
          </div>
        </Glass>
      </div>
    </div>
  );
};
