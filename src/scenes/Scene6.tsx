import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Check, Chip, Mix, Stage, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC06 (frames 6300-7200, global 210-240s): Manzooma Academy outro. Ends with a fade to black.
const S = 210;
const t = (g: number) => sec(g - S);

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 30);
  const head = prog(f, t(210.7), 24);
  const badge = pop(f, t(211.2));
  const fill = prog(f, t(211.8), sec(5.2));
  const res = prog(f, t(218.3), 24);
  const next = prog(f, t(224.8), 28);
  const code = typed('CREATE DATABASE manzooma_store;', f, t(230.9), 0.55);
  const pct = Math.round(fill * 100);

  return (
    <Stage dur={900} inFx="fade" outFx="black">
      <div style={{position: 'absolute', left: 190, top: 100, width: 1540, height: 880, borderRadius: 34, background: 'rgba(30,41,59,0.62)', border: `2px solid ${C.border}`, boxShadow: '0 40px 120px rgba(2,6,23,.7)', opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
        {/* brand header */}
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

        {/* completed badge + progress */}
        <div dir="ltr" style={{position: 'absolute', left: 90, right: 90, top: 190}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${0.9 + 0.1 * badge})`, transformOrigin: 'left center', opacity: clamp(badge)}}>
            <Check p={badge} size={64} />
            <div style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.green}}>Lesson 08 Completed: <span style={{color: C.text}}>Environment & Setup Mastered</span></div>
          </div>
          <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{flex: 1, height: 28, borderRadius: 14, background: C.deep, overflow: 'hidden', border: `2px solid ${C.border}`}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 14}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.text, width: 130, textAlign: 'right'}}>{pct}%</div>
          </div>
          <div style={{marginTop: 12, fontFamily: MONO, fontSize: 22, color: C.muted}}>Module 3 · Hands-On Workspace — Start of the practical module</div>
        </div>

        {/* resources */}
        <div dir="ltr" style={{position: 'absolute', left: 90, top: 400, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <Chip color={C.amber} style={{fontSize: 28, padding: '10px 26px'}}>
            <Mix>الشيتات والتمارين</Mix> <span style={{color: C.text}}>→ solutions.gomaaintelligence.me</span>
          </Chip>
        </div>

        {/* next lesson */}
        <div style={{position: 'absolute', left: 90, right: 90, top: 500, height: 300, borderRadius: 26, background: C.deep, border: `2px solid ${C.blue}`, opacity: next, transform: `translateY(${(1 - next) * 60}px)`, display: 'flex', alignItems: 'center', padding: '0 46px', gap: 40}}>
          <div style={{flex: 1}}>
            <Mix style={{fontSize: 30, color: C.blue, fontWeight: 700, display: 'block'}}>الدرس القادم · 09</Mix>
            <Mix style={{fontSize: 48, fontWeight: 700, color: C.text, display: 'block', marginTop: 10}}>إنشاء قواعد البيانات والجداول بـ DDL</Mix>
          </div>
          <div dir="ltr" style={{width: 560, height: 170, borderRadius: 18, background: C.bg, border: `2px solid ${C.border}`, padding: '26px 28px', fontFamily: MONO, fontSize: 28, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 20, marginBottom: 16}}>-- Lesson 09</div>
            <div>
              {code.split(/(CREATE|DATABASE)/).map((p, i) => (
                <span key={i} style={{color: p === 'CREATE' || p === 'DATABASE' ? C.blue : C.text, fontWeight: p === 'CREATE' || p === 'DATABASE' ? 700 : 400}}>{p}</span>
              ))}
              <span style={{color: C.green}}>▌</span>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};
