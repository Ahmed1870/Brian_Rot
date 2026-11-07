import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Bi, Pill, appear, pop} from '../components/Text';
import {LOGO_PATHS, LOGO_VIEW} from '../logoData';
import {eo, hash, mix, prog, pulse} from '../lib/anim';

const S = TL.cues.sc06;
const LW = 150;
const LH = (LW * LOGO_VIEW.h) / LOGO_VIEW.w;
const SKILLS = ['EXPLAIN', 'EXPLAIN ANALYZE', 'Plan Nodes', 'BUFFERS'];

const Check: React.FC<{c?: string; s?: number}> = ({c = K.num, s = 34}) => (
  <svg width={s} height={s} viewBox="0 0 34 34" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18 L14 26 L29 8" /></svg>
);

export const Scene6: React.FC<{t: number}> = ({t}) => {
  const ring = eo(prog(t, S.progress[0], S.progress[1])) * 0.67;
  const done = t >= S.progress[1] - 0.4;
  const badgeP = pop(t, S.badge, S.badge + 0.8);
  const nextP = pop(t, S.next, S.next + 0.9);
  const sheetsP = pop(t, S.sheets, S.sheets + 0.9);
  const cardP = pop(t, S.header + 1.2, S.header + 2.2);
  const R = 92;
  const circ = 2 * Math.PI * R;
  const np = Math.sin(prog(t, S.nextPulse, S.nextPulse + 2.2) * Math.PI);
  const lp = Math.sin(prog(t, S.linkPulse, S.linkPulse + 2.2) * Math.PI);
  const sweep = mix(-300, 1900, ((t - S.sheets - 1) * 0.25) % 1);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      {/* header */}
      <div style={{position: 'absolute', left: 100, top: 54, width: 1720, display: 'flex', alignItems: 'center', gap: 28, opacity: appear(t, S.header, S.header + 0.6)}}>
        <svg width={LW} height={LH} viewBox={`${LOGO_VIEW.x} ${LOGO_VIEW.y} ${LOGO_VIEW.w} ${LOGO_VIEW.h}`} style={{filter: 'drop-shadow(0 0 14px rgba(56,189,248,0.4))'}}>
          <g transform="translate(0,600) scale(0.1,-0.1)" fill="#F8FAFC">
            {LOGO_PATHS.map((p, i) => (
              <path key={i} d={p.d} opacity={eo(prog(t, S.header + 0.1 + hash(i) * 0.8, S.header + 0.9 + hash(i) * 0.8))} />
            ))}
          </g>
        </svg>
        <Bi ar="منظومة أكاديمي" en="Manzooma SQL Masterclass" size={58} t={t} start={S.header + 0.2} weight={900} gap={26} />
      </div>

      {/* completed lesson card */}
      <div style={{position: 'absolute', left: 100, top: 214, width: 900, height: 420, opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 60}px)`}}>
        <Glass w={900} h={420} t={t} tint={K.num} glow={24} style={{border: `2px solid ${K.num}66`}}>
          <div style={{padding: '28px 40px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
              <div style={{position: 'relative', width: 210, height: 210}}>
                <svg width="210" height="210" viewBox="0 0 210 210" style={{transform: 'rotate(-90deg)'}}>
                  <circle cx="105" cy="105" r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="18" />
                  <circle cx="105" cy="105" r={R} fill="none" stroke={K.num} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${circ * ring} ${circ}`} />
                </svg>
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 66, color: C.text, lineHeight: 1}}>50</span>
                  <span style={{fontFamily: FONT_MONO, fontSize: 20, color: K.num}}>{Math.round(ring * 100)}%</span>
                </div>
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
                <div style={{opacity: Math.min(1, badgeP * 1.5), transform: `scale(${0.8 + 0.2 * badgeP})`, transformOrigin: '0 50%'}}>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 26, background: `${K.num}22`, border: `2px solid ${K.num}`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, lineHeight: 1.25, color: C.text, maxWidth: '100%', boxSizing: 'border-box', boxShadow: `0 0 ${24 + 12 * pulse(t, 1.6)}px ${K.num}66`}}>
                    <Check s={30} />
                    <span>Lesson 50 Completed: EXPLAIN & EXPLAIN ANALYZE Mastered</span>
                  </div>
                </div>
                <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color: C.dim, direction: 'rtl'}}>الوحدة الثانية عشرة — الفهرسة وتحسين الاستعلامات · 67%</div>
                <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                  {SKILLS.map((s, i) => (
                    <div key={s} style={{opacity: appear(t, S.progress[1] + i * 0.35, S.progress[1] + 0.6 + i * 0.35), transform: `translateY(${(1 - appear(t, S.progress[1] + i * 0.35, S.progress[1] + 0.6 + i * 0.35)) * 16}px)`}}>
                      <Pill mono size={21} bg={`${K.txt}1A`} color={C.text} border={`${K.txt}77`}>{s}</Pill>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* lesson track */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 34, gap: 0}}>
              {[48, 49, 50, 51].map((n, i) => {
                const complete = n < 50 || (n === 50 && done);
                const isNext = n === 51;
                const popP = n === 50 ? pop(t, S.progress[1] - 0.4, S.progress[1] + 0.4) : 1;
                return (
                  <React.Fragment key={n}>
                    {i > 0 ? <div style={{width: 96, height: 6, borderRadius: 3, background: n <= 50 ? K.num : 'rgba(255,255,255,0.12)', opacity: n === 50 ? 0.3 + 0.7 * ring : 1}} /> : null}
                    <div style={{width: 76, height: 76, borderRadius: 38, background: complete ? K.num : 'transparent', border: `4px ${isNext ? 'dashed' : 'solid'} ${complete ? K.num : isNext ? K.bool : 'rgba(255,255,255,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: complete ? C.bg : isNext ? K.bool : C.dim, transform: `scale(${n === 50 ? 0.8 + 0.2 * popP : 1 + (isNext ? 0.06 * pulse(t, 1.4) : 0)})`, boxShadow: isNext ? `0 0 ${12 + 14 * pulse(t, 1.4)}px ${K.bool}66` : undefined}}>
                      {complete ? <Check c={C.bg} s={36} /> : String(n)}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Glass>
      </div>

      {/* next lesson card */}
      <div style={{position: 'absolute', left: 1040, top: 214, width: 780, height: 420, opacity: Math.min(1, nextP * 1.5), transform: `translateY(${(1 - nextP) * 70}px) scale(${1 + 0.02 * np})`}}>
        <Glass w={780} h={420} t={t + 2} tint={K.bool} glow={24 + 30 * np} style={{border: `2px solid ${K.bool}${np > 0.2 ? 'CC' : '66'}`}}>
          <div style={{padding: '30px 40px', display: 'flex', gap: 30, alignItems: 'center', height: '100%', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0}}>
              {[{l: 'Seq Scan', c: K.err, g: '▤'}, {l: 'Bottleneck', c: K.bool, g: '⚠'}, {l: 'Index', c: K.num, g: '⚡'}].map((o, i) => {
                const op = appear(t, S.next + 0.4 + i * 0.3, S.next + 1 + i * 0.3);
                return (
                  <div key={o.l} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 14, background: `${o.c}22`, border: `2px solid ${o.c}`, opacity: op, transform: `translateX(${(1 - op) * -40}px)`, minWidth: 190}}>
                    <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: o.c, width: 30, textAlign: 'center'}}>{o.g}</span>
                    <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: C.text}}>{o.l}</span>
                  </div>
                );
              })}
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10, direction: 'rtl'}}>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: K.bool, letterSpacing: 3, direction: 'ltr', textAlign: 'right'}}>LESSON 51</div>
              <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 34, color: K.bool}}>الدرس القادم:</div>
              <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 38, lineHeight: 1.3, color: C.text}}>اكتشاف اختناقات الأداء والمسح المتسلسلي</div>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 25, color: C.text, direction: 'ltr', textAlign: 'right', whiteSpace: 'nowrap'}}>Sequential Scans</div>
              <div style={{fontFamily: FONT_MONO, fontSize: 19, color: C.dim, direction: 'ltr', textAlign: 'right'}}>Lesson 51: Sequential Scans &amp; Performance Bottlenecks</div>
            </div>
          </div>
        </Glass>
      </div>

      {/* sheets + exercises */}
      <div style={{position: 'absolute', left: 100, top: 676, width: 1720, height: 300, opacity: Math.min(1, sheetsP * 1.5), transform: `translateY(${(1 - sheetsP) * 70}px)`}}>
        <Glass w={1720} h={300} t={t + 4} tint={K.txt} glow={22} sheen={false} style={{border: `2px solid ${K.txt}66`}}>
          <div style={{position: 'absolute', top: -60, bottom: -60, left: sweep - 100, width: 160, transform: 'rotate(16deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)'}} />
          <div style={{padding: '34px 50px', display: 'flex', alignItems: 'center', gap: 44, height: '100%', boxSizing: 'border-box', direction: 'rtl'}}>
            <div style={{display: 'flex', gap: 20}}>
              {[{l: 'PLAN', c: K.txt}, {l: 'التمارين', c: K.num}, {l: 'الحلول', c: K.bool}].map((s, i) => (
                <div key={i} style={{width: 150, height: 190, borderRadius: 20, background: `${s.c}1F`, border: `2.5px solid ${s.c}`, padding: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10, transform: `rotate(${(i - 1) * 5}deg) translateY(${Math.sin(t * 1.4 + i) * 6}px)`}}>
                  {[0.9, 0.7, 0.85, 0.55, 0.8].map((w, k) => (
                    <div key={k} style={{height: 9, width: `${w * 100}%`, borderRadius: 5, background: s.c, opacity: 0.7}} />
                  ))}
                  <div style={{marginTop: 'auto', fontFamily: FONT_AR, fontWeight: 800, fontSize: 26, color: s.c, textAlign: 'center'}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14}}>
              <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 40, color: C.text}}>الشيتات والتمارين:</div>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: K.txt, direction: 'ltr', textAlign: 'right', textShadow: `0 0 ${28 + 30 * lp}px ${K.txt}${lp > 0.2 ? 'CC' : '66'}`, whiteSpace: 'nowrap'}}>solutions.gomaaintelligence.me</div>
              <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl'}}>سكريبتات تحليل خطط التنفيذ المعتمدة وأوراق العمل</div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};
