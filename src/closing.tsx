import React from 'react';
import {COL} from './theme';
import {FONT, Logo, pe} from './kit';
import {an} from './sync';

const SKILLS: {chip: string; ar: string; c: string}[] = [
  {chip: 'A1', ar: 'المرجع النسبي بيتحرك مع النسخ', c: COL.amber},
  {chip: '$A$1', ar: 'تثبيت كامل بزر F4', c: COL.green},
  {chip: 'A$1  $A1', ar: 'تثبيت الصف أو العمود فقط', c: COL.blue},
  {chip: '=$B5*C$4', ar: 'صيغة واحدة لمصفوفة كاملة', c: COL.purple},
  {chip: '50,000 rows', ar: 'عمولات بدون أخطاء ترحيل', c: COL.green},
];
const Check: React.FC<{c: string; p: number}> = ({c, p}) => (
  <svg width="38" height="38" viewBox="0 0 38 38" style={{opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}>
    <circle cx="19" cy="19" r="17" fill={`${c}26`} stroke={c} strokeWidth="2"/>
    <path d="M11 19.5l5.5 5.5L27 13" stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GRID: string[] = ['b', 'b', 'b', 'b', 'b', 'p', 'm', 'm', 'm', 'm', 'p', 'm', 'g', 'm', 'm', 'p', 'm', 'm', 'm', 'm', 'p', 'm', 'm', 'm', 'a'];

export const Closing: React.FC<{t: number}> = ({t}) => {
  const a0 = an(5, 0), a1 = an(5, 1), a2 = an(5, 2);
  const p = (a: number, b: number) => pe(t, a, b);
  const bar = p(2.0, 5.0) * 0.2;
  const colorOf = (k: string) => (k === 'b' ? COL.blue : k === 'p' ? COL.purple : k === 'g' ? COL.green : k === 'a' ? COL.amber : '#273449');
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* art column: no text over artwork */}
      <div style={{position: 'absolute', left: 90, top: 80, opacity: p(0, 0.8)}}><Logo h={110}/></div>
      <div style={{position: 'absolute', left: 70, top: 250, width: 640, height: 700, borderRadius: 28, background: 'rgba(30,41,59,.55)', border: '1.5px solid #334155', boxShadow: '0 30px 80px rgba(0,0,0,.45)', opacity: p(0.2, 1.0)}}>
        <div style={{position: 'absolute', left: 50, top: 70, display: 'grid', gridTemplateColumns: 'repeat(5,100px)', gap: 12}}>
          {GRID.map((k, i) => {
            const o = p(0.5 + (i % 5) * 0.12 + Math.floor(i / 5) * 0.12, 1.4 + (i % 5) * 0.12 + Math.floor(i / 5) * 0.12);
            const c = colorOf(k);
            return (
              <div key={i} style={{height: 100, borderRadius: 14, background: k === 'm' ? '#1B2638' : `${c}26`, border: `2px solid ${k === 'm' ? '#2B3A52' : c}`, boxShadow: k === 'm' ? undefined : `0 0 22px ${c}66`, opacity: o, position: 'relative'}}>
                {k === 'g' ? (
                  <svg width="100" height="100" viewBox="0 0 24 24" style={{position: 'absolute', left: -2, top: -2}}>
                    <path d="M7 11V8a5 5 0 0110 0v3" stroke={COL.green} strokeWidth="2" fill="none" strokeLinecap="round"/><rect x="5" y="11" width="14" height="9" rx="2" fill={COL.green}/>
                  </svg>
                ) : null}
                {k === 'a' ? <div style={{position: 'absolute', right: 8, bottom: 8, width: 16, height: 16, background: COL.amber, borderRadius: 3}}/> : null}
              </div>
            );
          })}
        </div>
      </div>
      {/* typography column */}
      <div style={{position: 'absolute', left: 790, top: 70, width: 1060}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: p(0.2, 1.0), transform: `translateY(${(1 - p(0.2, 1.0)) * 20}px)`}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 52, color: COL.text, whiteSpace: 'nowrap'}}>منظومة أكاديمي</span>
          <span style={{width: 4, height: 44, background: COL.green, alignSelf: 'center'}}/>
          <span dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 600, fontSize: 40, color: COL.green, whiteSpace: 'nowrap'}}>Manzooma Excel Masterclass</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 36, opacity: p(a0 + 0.6, a0 + 1.4)}}>
          <Check c={COL.green} p={p(a0 + 0.6, a0 + 1.4)}/>
          <div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 42, color: COL.text}}>Lesson 06 Completed</div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 30, color: COL.muted, marginTop: 4}}>Cell Reference Mechanics Mastered</div>
          </div>
        </div>
        <div style={{marginTop: 34, opacity: p(1.8, 2.6)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.ar, fontSize: 28, color: COL.muted, marginBottom: 12}}>
            <span dir="rtl">تقدم الوحدة الثانية</span><span dir="ltr" style={{color: COL.green, fontWeight: 700}}>{Math.round(bar * 100)}%</span>
          </div>
          <div style={{height: 18, borderRadius: 9, background: '#1E293B', border: '1px solid #334155', overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COL.green}, #34D399)`, boxShadow: `0 0 18px ${COL.green}`}}/>
          </div>
        </div>
        <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14}}>
          {SKILLS.map((s, i) => {
            const o = p(2.4 + i * 0.8, 3.2 + i * 0.8);
            return (
              <div key={s.chip} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: o, transform: `translateX(${(1 - o) * 24}px)`}}>
                <Check c={s.c} p={o}/>
                <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, color: s.c, minWidth: 250}}>{s.chip}</span>
                <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 30, color: COL.text}}>{s.ar}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 36, display: 'flex', alignItems: 'center', gap: 22, opacity: p(a1, a1 + 0.8)}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontSize: 30, color: COL.muted}}>الملفات والتدريبات</span>
          <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, color: COL.blue, background: '#38BDF81F', border: '1.5px solid #38BDF866', borderRadius: 12, padding: '8px 20px'}}>solutions.gomaaintelligence.me</span>
        </div>
        <div style={{marginTop: 28, padding: '20px 28px', borderRadius: 20, background: 'rgba(30,41,59,.8)', border: `1.5px solid ${COL.green}88`, boxShadow: `0 0 30px ${COL.green}33`, opacity: p(a2 - 0.4, a2 + 0.4), transform: `translateY(${(1 - p(a2 - 0.4, a2 + 0.4)) * 24}px)`}}>
          <div dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 34, color: COL.text}}>الدرس القادم: الدوال الحسابية والإحصائية</div>
          <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 28, color: COL.green, marginTop: 6}}>Lesson 07 — Core Statistical Functions: SUM, AVERAGE, COUNT, COUNTA</div>
        </div>
      </div>
    </div>
  );
};
