import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Bi, Pill, appear, pop} from '../components/Text';
import {back, eo, hash, mix, prog, pulse, seg, typed} from '../lib/anim';

const S = TL.cues.sc02;
const VIOLET = '#A78BFA';
const PW = 870;
const PY = 190;
const PH = 680;
const FLOOD = 'qX7!kP2@mZ9#vL4$tR8%wN3^bY6&hD1*sF5(gJ0)cA7_eU2+oI9=lK4~xQ8?zM3';
const DESC = 'سماعة بلوتوث لاسلكية بعزل ضوضاء نشط، بطارية تدوم 30 ساعة، ميكروفون مدمج لمكالمات واضحة، وتصميم مريح للاستخدام الطويل مع ضمان لمدة سنتين.';
const LINES: string[] = (() => {
  const words = DESC.split(' ');
  const out: string[] = [];
  let cur = '';
  words.forEach((w) => {
    if ((cur + ' ' + w).trim().length > 34) {
      out.push(cur.trim());
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  });
  if (cur) out.push(cur);
  return out;
})();
const LINE_START: number[] = LINES.map((_, i) => LINES.slice(0, i).reduce((a, l) => a + l.length + 1, 0));
const DESC_DT = 0.11;

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const inP = pop(t, 40.2, 41.4);
  const focusL = 1 - 0.55 * seg(t, S.tag2[0] - 0.5, S.tag2[0] + 0.5);
  const focusR = 0.55 + 0.45 * seg(t, S.tag1[0] - 0.2, S.tag1[0] + 0.4);

  // ---- left: VARCHAR(50)
  const emailLen = typed(S.emailText, t, S.emailT, 0.15).length;
  const clear = seg(t, 51, 51.5);
  const floodN = Math.floor(Math.max(0, (t - S.flood[0]) / 0.065));
  const accepted = Math.min(50, floodN);
  const fieldText = t < 51.3 ? typed(S.emailText, t, S.emailT, 0.15) : FLOOD.slice(0, accepted);
  const count = t < 51.3 ? emailLen : accepted;
  const blocked = floodN > 50;
  const errP = prog(t, S.flood[1], S.flood[1] + 0.5);
  const shake = blocked && t < S.flood[1] + 0.7 ? Math.sin(t * 90) * 5 : 0;
  const okMail = t > S.emailT + S.emailText.length * 0.15 && t < 51;
  const lockP = pop(t, S.lock, S.lock + 0.6);
  const lockClosed = t >= S.lock;

  // ---- right: TEXT (elastic)
  const stretch = back(prog(t, S.stretch, S.stretch + 1.3));
  const boxW = 380 + 400 * stretch;
  const typedCount = Math.max(0, Math.floor((t - S.descT) / DESC_DT));
  let boxH = 110;
  LINES.forEach((_, i) => {
    boxH += 52 * back(prog(t, S.descT + LINE_START[i] * DESC_DT - 0.1, S.descT + LINE_START[i] * DESC_DT + 0.5));
  });

  const bars = eo(prog(t, S.bars[0], S.bars[0] + 1.4));
  const barsOut = seg(t, S.bars[1] + 0.2, S.bars[1] + 0.8);

  const tag = (range: number[], ar: string, en: string, color: string) => {
    const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
    if (p <= 0.01) return null;
    return (
      <div style={{opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 30px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, color: C.text, whiteSpace: 'nowrap'}}>
          <span style={{color}}>{en}</span>
          <svg width="64" height="20" viewBox="0 0 64 20"><line x1="0" y1="10" x2={50 * eo(prog(t, range[0] + 0.3, range[0] + 1))} y2="10" stroke={color} strokeWidth="4" strokeLinecap="round" /><path d="M44 3 L58 10 L44 17" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={prog(t, range[0] + 0.8, range[0] + 1.1)} /></svg>
          <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 28}}>{ar}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      {/* tags */}
      <div style={{position: 'absolute', left: 60, top: 92, width: PW, height: 70}}>{tag(S.tag1, 'Constrained Length (Emails, Phones)', 'VARCHAR(50)', K.txt)}</div>
      <div style={{position: 'absolute', left: 990, top: 92, width: PW, height: 70}}>{tag(S.tag2, 'Unlimited Dynamic Length (Descriptions)', 'TEXT', VIOLET)}</div>

      {/* LEFT: VARCHAR(50) */}
      <div style={{position: 'absolute', left: 60 - (1 - inP) * 700, top: PY, width: PW, height: PH, opacity: focusL}}>
        <Glass w={PW} h={PH} t={t} tint={K.txt} glow={22} style={{border: `2px solid ${K.txt}88`}}>
          <div style={{padding: '30px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 48, color: K.txt}}>VARCHAR(50)</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 30, color: C.dim, direction: 'rtl'}}>حقل بحد أقصى</span>
            </div>
            <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.mute, margin: '34px 0 10px'}}>{t < 51.3 ? 'email VARCHAR(50)' : 'input → email'}</div>
            <div style={{position: 'relative', height: 96, width: 782, transform: `translateX(${shake}px)`}}>
              <div style={{position: 'absolute', left: 0, top: 0, width: 782, height: 96, borderRadius: 18, background: '#0F172A', border: `3px solid ${blocked ? K.err : okMail ? K.num : K.txt}`, display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box', fontFamily: FONT_MONO, fontWeight: 500, fontSize: 24, color: C.text, overflow: 'hidden', whiteSpace: 'nowrap', opacity: 1 - clear * (t < 51.3 ? 1 : 0)}}>
                {fieldText}
                <span style={{display: 'inline-block', width: 3, height: 34, background: K.txt, marginLeft: 2, opacity: Math.floor(t * 3) % 2}} />
              </div>
              {/* iron fence at the 50-character limit */}
              {t >= S.flood[0] - 0.4 ? (
                <div style={{position: 'absolute', right: -18, top: -14, width: 40, height: 124, opacity: appear(t, S.flood[0] - 0.4, S.flood[0] + 0.1)}}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{position: 'absolute', left: k * 14, top: 0, width: 9, height: 124, borderRadius: 5, background: 'linear-gradient(90deg, #64748B, #CBD5E1, #64748B)', boxShadow: blocked ? `0 0 18px ${K.err}` : undefined}} />
                  ))}
                  <div style={{position: 'absolute', left: -4, top: 28, width: 48, height: 9, borderRadius: 5, background: '#94A3B8'}} />
                  <div style={{position: 'absolute', left: -4, top: 86, width: 48, height: 9, borderRadius: 5, background: '#94A3B8'}} />
                </div>
              ) : null}
              {/* letters bouncing off the fence */}
              {blocked ? Array.from({length: Math.min(9, floodN - 50)}).map((_, k) => {
                const t0 = S.flood[0] + (50 + k) * 0.065;
                const p = prog(t, t0, t0 + 0.7);
                if (p <= 0 || p >= 1) return null;
                const x = 760 + Math.sin(p * Math.PI) * 60 - p * 120;
                const y = 30 - Math.sin(p * Math.PI) * 90 + p * 30;
                return <div key={k} style={{position: 'absolute', left: x, top: y, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: K.err, opacity: 1 - p}}>{FLOOD[50 + k]}</div>;
              }) : null}
            </div>
            <div style={{display: 'flex', gap: 2, marginTop: 24, width: 782}}>
              {Array.from({length: 50}).map((_, i) => (
                <div key={i} style={{flex: 1, height: 30, borderRadius: 4, background: i < count ? (count >= 50 && blocked ? K.err : K.txt) : 'rgba(255,255,255,0.08)'}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: FONT_MONO, fontSize: 24, color: blocked ? K.err : C.dim, width: 782}}>
              <span>{count} / 50</span>
              <span>{blocked ? 'LIMIT REACHED' : okMail ? '✓ valid email' : ''}</span>
            </div>
            {errP > 0 ? (
              <div style={{marginTop: 26, padding: '16px 24px', borderRadius: 16, background: 'rgba(127,29,29,0.55)', border: `2px solid ${K.err}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: '#FECACA', opacity: errP, transform: `translateY(${(1 - errP) * 20}px)`, width: 782, boxSizing: 'border-box'}}>
                ERROR: value too long for type character varying(50)
              </div>
            ) : null}
            {lockClosed ? (
              <div style={{position: 'absolute', right: 44, top: 520, display: 'flex', alignItems: 'center', gap: 18, opacity: lockP, transform: `scale(${0.7 + 0.3 * lockP})`}}>
                <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: K.txt, direction: 'rtl'}}>حماية على مستوى المدخلات</span>
                <svg width="66" height="66" viewBox="0 0 66 66" fill="none" stroke={K.txt} strokeWidth="5" strokeLinecap="round"><rect x="12" y="30" width="42" height="30" rx="8" fill={`${K.txt}33`} /><path d={t - S.lock < 0.25 ? 'M20 30V20a13 13 0 0 1 26 0v2' : 'M20 30V20a13 13 0 0 1 26 0v10'} /></svg>
              </div>
            ) : null}
          </div>
        </Glass>
      </div>

      {/* divider */}
      <div style={{position: 'absolute', left: 930, top: PY + PH / 2 - 36, width: 60, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: inP}}>
        <div style={{width: 62, height: 62, borderRadius: 31, background: C.bg, border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: C.dim}}>VS</div>
      </div>

      {/* RIGHT: TEXT */}
      <div style={{position: 'absolute', left: 990 + (1 - inP) * 700, top: PY, width: PW, height: PH, opacity: focusR}}>
        <Glass w={PW} h={PH} t={t + 3} tint={VIOLET} glow={22} style={{border: `2px solid ${VIOLET}88`}}>
          <div style={{padding: '30px 44px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 48, color: VIOLET}}>TEXT</span>
              <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 30, color: C.dim, direction: 'rtl'}}>وعاء مرن بلا حد</span>
            </div>
            <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.mute, margin: '34px 0 14px'}}>description TEXT</div>
            <div style={{width: boxW, minHeight: 110, height: boxH, borderRadius: 24, background: '#0F172A', border: `3px solid ${VIOLET}`, boxShadow: `0 0 ${20 + 14 * Math.sin(stretch * Math.PI)}px ${VIOLET}66`, padding: '22px 28px', boxSizing: 'border-box', overflow: 'hidden', direction: 'rtl', transformOrigin: '0 0'}}>
              {LINES.map((l, i) => {
                const start = LINE_START[i];
                const shown = Math.max(0, Math.min(l.length, typedCount - start));
                return shown > 0 ? <div key={i} style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 31, lineHeight: '52px', color: C.text, whiteSpace: 'nowrap'}}>{l.slice(0, shown)}</div> : null;
              })}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, fontFamily: FONT_MONO, fontSize: 24, color: C.dim}}>
              <span>{Math.min(DESC.length, typedCount)} chars</span>
              <span style={{color: VIOLET, fontWeight: 800, fontSize: 40}}>∞</span>
              <span>no limit</span>
            </div>
          </div>
        </Glass>
      </div>

      {/* comparison strip: same internal efficiency */}
      {t >= S.bars[0] - 0.2 ? (
        <div style={{position: 'absolute', left: 260, top: 900, width: 1400, opacity: appear(t, S.bars[0] - 0.2, S.bars[0] + 0.5) * (1 - barsOut)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            {[{l: 'VARCHAR(n)', c: K.txt}, {l: 'TEXT', c: VIOLET}].map((b) => (
              <div key={b.l} style={{flex: 1, display: 'flex', alignItems: 'center', gap: 14}}>
                <span style={{width: 150, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: b.c}}>{b.l}</span>
                <div style={{flex: 1, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.07)'}}>
                  <div style={{width: `${78 * bars}%`, height: 28, borderRadius: 14, background: b.c}} />
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop: 12, textAlign: 'center', fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl'}}>نفس كفاءة التخزين الداخلي في PostgreSQL — الفرق في حماية المدخلات</div>
        </div>
      ) : null}
    </div>
  );
};
