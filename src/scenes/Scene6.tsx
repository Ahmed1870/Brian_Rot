import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Check, Chip, Mix, Sql, Stage, clamp, pop, prog, sec, typed} from '../kit';

// SC06 (211.5-240s): Manzooma Academy outro. Ends with a fade to black.
// Anchors (s): 211.9 great | 213.8 we mastered | 220.7 download scripts | 225.9 link | 228.2 get ready | 231.3 next lesson | 234.3 case functions
const S = START.s6;
const t = (g: number) => sec(g - S);

const SKILLS = ['LENGTH ✓', 'SUBSTRING ✓', 'CONCAT_WS ✓', 'TRIM ✓', 'REPLACE ✓'];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 30);
  const head = prog(f, t(212.0), 24);
  const badge = pop(f, t(212.3));
  const fill = prog(f, t(213.8), sec(4.8));
  const modDone = prog(f, t(219.6), 20);
  const res = prog(f, t(220.7), 24);
  const next = prog(f, t(228.2), 28);
  const code = typed("SELECT INITCAP(name),\n  UPPER(city_code)\nFROM customers\nWHERE name ~* '^a';", f, t(231.3), 0.55).split('\n');
  const pct = Math.round(fill * 100);

  return (
    <Stage dur={855} inFx="fade" outFx="black">
      <div style={{position: 'absolute', left: 190, top: 100, width: 1540, height: 880, borderRadius: 34, background: 'rgba(30,41,59,0.62)', border: `2px solid ${C.border}`, boxShadow: '0 40px 120px rgba(2,6,23,.7)', opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * 20}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 22}}>
            <svg width={70} height={70} viewBox="0 0 70 70">
              <line x1={14} y1={52} x2={35} y2={16} stroke={C.blue} strokeWidth={5} />
              <line x1={35} y1={16} x2={56} y2={52} stroke={C.green} strokeWidth={5} />
              <line x1={14} y1={52} x2={56} y2={52} stroke={C.amber} strokeWidth={5} />
              <circle cx={14} cy={52} r={9} fill={C.blue} />
              <circle cx={35} cy={16} r={9} fill={C.text} />
              <circle cx={56} cy={52} r={9} fill={C.green} />
            </svg>
            <Mix style={{fontSize: 62, fontWeight: 700, color: C.text}}>منظومة أكاديمي</Mix>
            <span style={{fontFamily: MONO, fontSize: 40, color: C.muted}}>|</span>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.blue}}>Manzooma SQL Masterclass</span>
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, right: 90, top: 170}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${0.9 + 0.1 * badge})`, transformOrigin: 'left center', opacity: clamp(badge)}}>
            <Check p={badge} size={64} />
            <div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.green}}>
              Lesson 25 Completed: <span style={{color: C.text}}>String Manipulation Mastered</span>
            </div>
          </div>
          <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{flex: 1, height: 28, borderRadius: 14, background: C.deep, overflow: 'hidden', border: `2px solid ${C.border}`}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 14}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.text, width: 130, textAlign: 'right'}}>{pct}%</div>
          </div>
          <div style={{marginTop: 12, fontFamily: MONO, fontSize: 22, color: modDone > 0.5 ? C.green : C.muted}}>
            Module 7 · String &amp; Temporal Data — {modDone > 0.5 ? 'Advanced String Functions Mastered ✓' : 'started'}
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 364, display: 'flex', gap: 16}}>
          {SKILLS.map((s, i) => {
            const p = pop(f, t(215.5 + i * 0.9));
            return (
              <div key={s} style={{opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 18}px)`}}>
                <Chip color={C.blue} style={{fontSize: 22}}>{s}</Chip>
              </div>
            );
          })}
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 440, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <Chip color={C.amber} style={{fontSize: 28, padding: '10px 26px'}}>
            <Mix>الشيتات والتمارين</Mix> <span style={{color: C.text}}>→ solutions.gomaaintelligence.me</span>
          </Chip>
        </div>

        <div style={{position: 'absolute', left: 90, right: 90, top: 535, height: 290, borderRadius: 26, background: C.deep, border: `2px solid ${C.blue}`, opacity: next, transform: `translateY(${(1 - next) * 60}px)`, display: 'flex', alignItems: 'center', padding: '0 46px', gap: 40}}>
          <div style={{flex: 1}}>
            <Mix style={{fontSize: 30, color: C.blue, fontWeight: 700, display: 'block'}}>الدرس القادم · 26</Mix>
            <Mix style={{fontSize: 42, fontWeight: 700, color: C.text, display: 'block', marginTop: 10}}>دوال حالة الأحرف والتعبير النمطي UPPER, LOWER, INITCAP, REGEXP</Mix>
          </div>
          <div dir="ltr" style={{width: 560, height: 210, borderRadius: 18, background: C.bg, border: `2px solid ${C.border}`, padding: '20px 26px', fontFamily: MONO, fontSize: 24, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 20, marginBottom: 10}}>-- Lesson 26</div>
            {code.map((l, i) => (
              <div key={i} style={{whiteSpace: 'pre', minHeight: 36}}>
                <Sql text={l} />
                {i === code.length - 1 ? <span style={{color: C.green}}>▌</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};
