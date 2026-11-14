import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, LESSON, LOGO_FILE, MONO, SCENES, START} from '../theme';
import {Check, Mix, Stage, clamp, pop, prog, sec} from '../kit';

// SC06 anchors (s, abs): 208.9 header | 209.7 badge | 210.2-214.2 skills | 215.0 unit pill | 217.9 files | 220.3 link | 225.4 next lesson | 229.7 tag
const S = START.s6;
const t = (g: number) => sec(g - S);
const SKILLS = [
  {a: 'تفعيل Analysis ToolPak', e: 'File ──► Options ──► Add-ins ──► Excel Add-ins', at: 210.2},
  {a: 'تقرير الإحصاءات الوصفية', e: 'Data Analysis ──► Descriptive Statistics · 16 rows', at: 211.2},
  {a: 'المتوسط والوسيط والمنوال', e: 'AVERAGE vs MEDIAN vs MODE.SNGL · outliers', at: 212.2},
  {a: 'مخرجات ثابتة مقابل دوال ديناميكية', e: 'TRIMMEAN · PERCENTILE.INC · FILTER', at: 213.2},
  {a: 'إحصاء 50,000 صف', e: 'manzooma_sales_2026.xlsx · 4 model tables'.replace('4 model tables','Sales table'), at: 214.2},
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 28);
  const head = prog(f, t(208.9), 22);
  const badge = pop(f, t(209.7));
  const fill = prog(f, t(209.9), sec(5.0)) * (63 / 76);
  const res = prog(f, t(217.9), 20);
  const linkPulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  const linkHot = prog(f, t(220.3), 10) * (1 - prog(f, t(222.4), 10));
  const next = prog(f, t(225.4), 22);
  const tag = pop(f, t(229.7));
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
            Lesson {String(LESSON).padStart(2, '0')} Completed:<br /><span style={{color: C.green}}>Statistical Analysis Tools Mastered</span>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 282, width: 940, opacity: head}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 10}}>
            <span>Lesson 63 of 76 · Unit 13 of 14</span><span style={{color: C.green, fontWeight: 700}}>{(fill * 100).toFixed(1)}%</span>
          </div>
          <div style={{height: 26, borderRadius: 13, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
            <div style={{width: `${fill * 100}%`, minWidth: fill > 0 ? 8 : 0, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 13, boxShadow: `0 0 16px ${C.green}`}} />
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 350, opacity: pop(f, t(215.0)), transform: `scale(${0.9 + 0.1 * pop(f, t(215.0))})`, transformOrigin: '0 50%'}}><span style={{fontFamily: MONO, fontSize: 19, fontWeight: 700, color: C.green, border: `2px solid ${C.green}`, borderRadius: 999, padding: '3px 16px', background: `${C.green}18`}}>UNIT 13 · LESSON 1 DONE · 12 of 14 units complete</span></div>
        <div style={{position: 'absolute', left: 60, top: 400, width: 940}}>
          {SKILLS.map((s, i) => {
            const p = prog(f, t(s.at), 16);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
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
            <Mix style={{fontSize: 30, fontWeight: 700, color: C.text, display: 'block', marginTop: 6}}>الدرس 64 — التوزيعات والتشتت والقيم المتطرفة</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.muted, marginTop: 8}}>Lesson 64 · Unit 13 · Distributions, Dispersion &amp; Outliers</div>
            <div dir="ltr" style={{marginTop: 18, borderRadius: 12, background: C.deep, border: `2px solid ${C.border}`, padding: '16px 18px', fontFamily: MONO, fontSize: 20, color: C.text, lineHeight: 1.6}}>
              <span style={{color: C.green}}>Spread</span> = <span style={{color: C.amber}}>STDEV.S</span>(Sales[Total])</div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 14, transform: `scale(${0.8 + 0.2 * tag})`, opacity: clamp(tag)}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green, border: `2px solid ${C.green}`, borderRadius: 999, padding: '4px 16px', background: `${C.green}18`}}>Dispersion &amp; Outliers</div>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 26, height: 3, background: C.border, opacity: 0.6}} />
        <div style={{position: 'absolute', left: 60 + 40 * idle + 40, bottom: 24, width: 120, height: 7, borderRadius: 4, background: C.green, opacity: 0.8}} />
      </div>
    </Stage>
  );
};
