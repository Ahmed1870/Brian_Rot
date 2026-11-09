import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, LESSON, LOGO_FILE, MONO, SCENES, START} from '../theme';
import {Check, Mix, Stage, clamp, pop, prog, sec} from '../kit';

// SC06: academic end card. Anchors (s): 210.2 well done | 213.4 SUM AVERAGE COUNT COUNTA | 216.6 practice sheet | 219.8 link | 223.4 practice | 224.6 lesson 8 | 226.4 conditional logic | 230.4 IF AND OR
const S = START.s6;
const t = (g: number) => sec(g - S);
const SKILLS = [
  {a: 'دالة الجمع SUM واختصار AutoSum', e: 'SUM · Alt + =', at: 211.4},
  {a: 'المتوسط AVERAGE: الفارغ ليس صفراً', e: 'AVERAGE · Blank ≠ Zero', at: 212.4},
  {a: 'العد COUNT مقابل COUNTA', e: 'COUNT = numbers · COUNTA = non-empty', at: 213.4},
  {a: 'فخاخ الأرقام النصية وأخطاء الصيغ', e: 'Text-Numbers · #N/A Propagation', at: 214.4},
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 28);
  const head = prog(f, t(209.4), 22);
  const badge = pop(f, t(210.2));
  const fill = prog(f, t(210.6), sec(3.0)) * 0.4;
  const res = prog(f, t(216.6), 20);
  const linkPulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  const linkHot = prog(f, t(219.8), 10) * (1 - prog(f, t(223.0), 10));
  const next = prog(f, t(224.6), 22);
  const tag = pop(f, t(230.4));
  const idle = Math.sin(f * 0.05);
  return (
    <Stage dur={SCENES.s6.dur} inFx="none" outFx="black">
      <div style={{position: 'absolute', left: 100, top: 96, width: 1720, height: 880, borderRadius: 36, background: 'rgba(30,41,59,0.72)', border: `2px solid ${C.green}`, boxShadow: `0 50px 140px rgba(2,6,23,.8), 0 0 50px ${C.green}33`, opacity: card, transform: `translateY(${(1 - card) * 36}px)`}}>
        <div style={{position: 'absolute', left: 60, top: 36, display: 'flex', alignItems: 'center', gap: 24, opacity: head}}>
          <Img src={staticFile(LOGO_FILE)} style={{height: 104, width: 125}} />
          <div>
            <Mix style={{fontSize: 52, fontWeight: 700, color: C.text}}>منظومة أكاديمي</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.green, marginTop: 2}}>Manzooma Excel Masterclass</div>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 176, display: 'flex', alignItems: 'center', gap: 18}}>
          <Check p={badge} size={64} />
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.text, opacity: clamp(badge), lineHeight: 1.3}}>
            Lesson {String(LESSON).padStart(2, '0')} Completed:<br /><span style={{color: C.green}}>Core Statistical Functions Mastered</span>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 282, width: 940, opacity: head}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 10}}>
            <span>Unit 2 · Core Formulas &amp; Conditional Logic Engine</span><span style={{color: C.green, fontWeight: 700}}>{Math.round(fill * 100)}%</span>
          </div>
          <div style={{height: 26, borderRadius: 13, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
            <div style={{width: `${fill * 100}%`, minWidth: fill > 0 ? 8 : 0, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 13, boxShadow: `0 0 16px ${C.green}`}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 392, width: 940}}>
          {SKILLS.map((s, i) => {
            const p = prog(f, t(s.at), 16);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <Check p={clamp(p)} size={46} />
                <div>
                  <Mix style={{fontSize: 34, fontWeight: 600, color: C.text}}>{s.a}</Mix>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginTop: 2}}>{s.e}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 1060, top: 50, width: 600, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${linkHot > 0.1 ? C.green : C.border}`, padding: '26px 32px', boxShadow: linkHot > 0.1 ? `0 0 ${30 * linkPulse}px ${C.green}88` : 'none'}}>
            <Mix style={{fontSize: 30, fontWeight: 700, color: C.text}}>الملفات والتدريبات</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, marginTop: 10}}>manzooma_sales_2026.xlsx</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.blue, marginTop: 10, wordBreak: 'break-all'}}>solutions.gomaaintelligence.me</div>
            <Mix style={{fontSize: 22, color: C.muted, display: 'block', marginTop: 10}}>نزّل الشيت التدريبي وطبّق بنفسك</Mix>
          </div>
        </div>
        <div style={{position: 'absolute', left: 1060, top: 330, width: 600, opacity: next, transform: `translateY(${(1 - next) * 30}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${C.blue}`, padding: '24px 30px', boxShadow: `0 0 0 6px ${C.blue}22`}}>
            <Mix style={{fontSize: 24, color: C.blue, fontWeight: 700}}>الدرس القادم</Mix>
            <Mix style={{fontSize: 34, fontWeight: 700, color: C.text, display: 'block', marginTop: 6}}>الدرس 8: المنطق الشرطي المتعدد والإنشاء المركب</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.muted, marginTop: 8}}>Lesson 08 · Conditional Logic Engine</div>
            <div dir="ltr" style={{marginTop: 18, borderRadius: 12, background: C.deep, border: `2px solid ${C.border}`, padding: '16px 18px', fontFamily: MONO, fontSize: 20, color: C.text, lineHeight: 1.6}}>
              <span style={{color: C.green}}>=IF(</span><span style={{color: C.blue}}>AND(</span>B2&gt;0, C2&gt;0<span style={{color: C.blue}}>)</span>, <span style={{color: C.amber}}>"OK"</span>, <span style={{color: C.amber}}>"Check"</span><span style={{color: C.green}}>)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 14, transform: `scale(${0.8 + 0.2 * tag})`, opacity: clamp(tag)}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green, border: `2px solid ${C.green}`, borderRadius: 999, padding: '4px 16px', background: `${C.green}18`}}>IF · AND · OR</div>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 26, height: 3, background: C.border, opacity: 0.6}} />
        <div style={{position: 'absolute', left: 60 + 40 * idle + 40, bottom: 24, width: 120, height: 7, borderRadius: 4, background: C.green, opacity: 0.8}} />
      </div>
    </Stage>
  );
};
