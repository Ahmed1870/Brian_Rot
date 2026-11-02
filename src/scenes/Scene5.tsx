import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {pop, appear} from '../components/Text';
import {back, eio, eo, hash, mix, prog, pulse, seg, typed} from '../lib/anim';

const S = TL.cues.sc05;
const PW = 900;
const PY = 170;
const PH = 740;
const RAW = ['5', '100', '25', '1500', '2', '30'];
const LEX = ['100', '1500', '2', '25', '30', '5'];
const NUM = ['2', '5', '25', '30', '100', '1500'];
const ROW0 = 200;
const RH = 54;
const QUERY = 'SELECT price FROM products ORDER BY price;';

const Tag: React.FC<{t: number; range: number[]; color: string; head: string; body: string}> = ({t, range, color, head, body}) => {
  const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
  if (p <= 0.01) return null;
  return (
    <div style={{opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        <span>{body}</span>
      </div>
    </div>
  );
};

const Rows: React.FC<{t: number; order: string[]; start: number; dur: number; color: string; quoted: boolean; messy: boolean}> = ({t, order, start, dur, color, quoted, messy}) => {
  const p = prog(t, start, start + dur);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: PW - 88, height: 340}}>
      {RAW.map((v, i) => {
        const target = order.indexOf(v);
        const e = messy ? back(p) : eio(p);
        const pos = mix(i, target, e);
        const wob = messy ? Math.sin(p * Math.PI) * (hash(i * 3.3) - 0.5) * 120 : 0;
        const rot = messy ? Math.sin(p * Math.PI * 2) * (hash(i * 5.1) - 0.5) * 16 : 0;
        const rowIn = appear(t, S.tag1[0] + 3 + i * 0.12, S.tag1[0] + 3.5 + i * 0.12);
        return (
          <div key={v} style={{position: 'absolute', left: wob, top: pos * RH, width: PW - 88, height: RH - 8, transform: `rotate(${rot}deg)`, opacity: rowIn}}>
            <div style={{height: RH - 8, borderRadius: 12, background: `${color}1A`, border: `2px solid ${color}66`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: C.text, justifyContent: 'space-between'}}>
              <span>{quoted ? `'${v}'` : v}</span>
              <span style={{fontSize: 20, color: C.mute, fontWeight: 500}}>{quoted ? 'text' : 'numeric'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const inP = pop(t, 165.2, 166.4);
  const focusL = 1 - 0.5 * seg(t, S.tag2[0] - 0.5, S.tag2[0] + 0.4);
  const focusR = 0.55 + 0.45 * seg(t, S.tag2[0] - 0.5, S.tag2[0] + 0.4);

  const q1 = typed(QUERY, t, S.q1, 0.06);
  const q2 = typed(QUERY, t, S.q2, 0.04);

  // TEXT side
  const sortL = prog(t, S.shuffle, S.shuffle + 1.8);
  const lexBadge = pop(t, S.shuffle + 2.2, S.shuffle + 3);
  const ramL = t < S.shuffle ? 0.35 : mix(0.35, 0.94, eo(prog(t, S.shuffle, S.shuffle + 4))) + 0.03 * Math.sin(t * 14) * (t > S.shuffle ? 1 : 0);
  const betweenL = pop(t, S.shuffle + 6, S.shuffle + 6.8);

  // NUMERIC side
  const sortStart = S.pass - 2.6;
  const needle = eo(prog(t, S.pass - 0.4, S.pass + 1.6));
  const mem = eo(prog(t, S.pass + 2, S.pass + 4.5));
  const betweenR = pop(t, S.pass + 7, S.pass + 7.8);
  const streak = prog(t, S.pass - 0.1, S.pass + 0.9);
  const savingBadge = pop(t, S.pass + 4.2, S.pass + 5);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} tint={t < S.tag2[0] ? K.err : K.num} />

      <div style={{position: 'absolute', left: 60, top: 96, width: PW, height: 60}}>
        <Tag t={t} range={S.tag1} color={K.err} head="TEXT Price Sorting Trap:" body={'"100" < "2"'} />
      </div>
      <div style={{position: 'absolute', left: 960, top: 96, width: PW, height: 60}}>
        <Tag t={t} range={S.tag2} color={K.num} head="NUMERIC Sorting: 2 < 100" body="──► 60% Memory Savings" />
      </div>

      {/* ---------- TEXT (wrong) ---------- */}
      <div style={{position: 'absolute', left: 60 - (1 - inP) * 800, top: PY, width: PW, height: PH, opacity: focusL}}>
        <Glass w={PW} h={PH} t={t} tint={K.err} glow={22} style={{border: `2px solid ${K.err}77`}}>
          <div style={{padding: '24px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 46, color: K.err}}>price TEXT</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl'}}>ترتيب أبجدي</span>
            </div>
            <div style={{marginTop: 14, height: 70, borderRadius: 14, background: '#0B1222', border: `2px solid ${K.err}55`, padding: '0 20px', display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize: 23, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden'}}>
              <span style={{color: C.mute, marginRight: 12}}>postgres=#</span>{q1}
            </div>
            <div style={{position: 'relative', marginTop: 18, height: 340}}>
              <Rows t={t} order={LEX} start={S.shuffle} dur={1.8} color={K.err} quoted messy />
              {lexBadge > 0.01 ? (
                <div style={{position: 'absolute', right: -6, top: 2 * RH - 4, transform: `scale(${0.7 + 0.3 * lexBadge})`, opacity: Math.min(1, lexBadge * 1.5)}}>
                  <div style={{padding: '8px 20px', borderRadius: 12, background: K.err, color: '#fff', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, boxShadow: `0 0 30px ${K.err}`}}>"100" &lt; "2" ✕</div>
                </div>
              ) : null}
            </div>
            {/* BETWEEN fails + RAM */}
            <div style={{marginTop: 4, opacity: Math.min(1, betweenL * 1.5), transform: `translateY(${(1 - betweenL) * 20}px)`, height: 70, borderRadius: 14, background: '#0B1222', border: `2px solid ${K.err}55`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: FONT_MONO, fontSize: 21, color: C.text}}>
              <span style={{whiteSpace: 'nowrap'}}>WHERE price BETWEEN '50' AND '500'</span>
              <span style={{fontWeight: 800, fontSize: 28, color: K.err}}>(0 rows)</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
              <span style={{width: 70, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: K.err}}>RAM</span>
              <div style={{flex: 1, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.07)'}}>
                <div style={{width: `${ramL * 100}%`, height: 30, borderRadius: 15, background: `linear-gradient(90deg, ${K.bool}, ${K.err})`}} />
              </div>
            </div>
          </div>
        </Glass>
      </div>

      {/* ---------- NUMERIC (right) ---------- */}
      <div style={{position: 'absolute', left: 960 + (1 - inP) * 800, top: PY, width: PW, height: PH, opacity: focusR}}>
        <Glass w={PW} h={PH} t={t + 2} tint={K.num} glow={22} style={{border: `2px solid ${K.num}77`}}>
          <div style={{padding: '24px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 46, color: K.num}}>price NUMERIC</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl'}}>ترتيب رقمي</span>
            </div>
            <div style={{marginTop: 14, height: 70, borderRadius: 14, background: '#0B1222', border: `2px solid ${K.num}55`, padding: '0 20px', display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize: 23, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden'}}>
              <span style={{color: C.mute, marginRight: 12}}>postgres=#</span>{t >= S.q2 ? q2 : ''}
            </div>
            <div style={{position: 'relative', marginTop: 18, height: 340}}>
              <Rows t={t} order={NUM} start={sortStart} dur={1.5} color={K.num} quoted={false} messy={false} />
              {streak > 0 && streak < 1 ? <div style={{position: 'absolute', left: -60 + streak * (PW + 120), top: -20, width: 120, height: 380, transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)'}} /> : null}
            </div>
            <div style={{marginTop: 4, opacity: Math.min(1, betweenR * 1.5), transform: `translateY(${(1 - betweenR) * 20}px)`, height: 70, borderRadius: 14, background: '#0B1222', border: `2px solid ${K.num}55`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: FONT_MONO, fontSize: 21, color: C.text}}>
              <span style={{whiteSpace: 'nowrap'}}>WHERE price BETWEEN 50 AND 500</span>
              <span style={{fontWeight: 800, fontSize: 28, color: K.num}}>100 ✓</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
              {/* speedometer */}
              <svg width="190" height="110" viewBox="0 0 190 110">
                <path d="M15 100 A80 80 0 0 1 175 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" strokeLinecap="round" />
                <path d="M15 100 A80 80 0 0 1 175 100" fill="none" stroke={K.num} strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - needle} />
                <line x1="95" y1="100" x2={95 + Math.cos(Math.PI * (1 - needle)) * 62} y2={100 - Math.sin(Math.PI * (1 - needle)) * 62} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
                <circle cx="95" cy="100" r="9" fill="#fff" />
              </svg>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
                  <span style={{width: 112, fontFamily: FONT_MONO, fontSize: 20, color: C.dim}}>TEXT</span>
                  <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(239,68,68,0.35)'}} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{width: 112, fontFamily: FONT_MONO, fontSize: 20, color: K.num}}>NUMERIC</span>
                  <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.07)'}}>
                    <div style={{width: `${mix(100, 40, mem)}%`, height: 22, borderRadius: 11, background: K.num}} />
                  </div>
                </div>
              </div>
              {savingBadge > 0.01 ? (
                <div style={{padding: '10px 20px', borderRadius: 16, background: K.num, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 34, transform: `scale(${0.6 + 0.4 * savingBadge})`, boxShadow: `0 0 34px ${K.num}`}}>−60%</div>
              ) : null}
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};
