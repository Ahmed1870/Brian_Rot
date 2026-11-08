import React from 'react';
import {COL} from './theme';
import {FONT, Logo, pe} from './kit';
import {an} from './sync';

const GOLD = '#F5C542';
const SKILLS: {chip: string; ar: string; c: string}[] = [
  {chip: '#N/A  #DIV/0!', ar: 'فهم أنواع الأخطاء وتأثيرها', c: COL.red},
  {chip: 'IFERROR', ar: 'حماية شاملة لكل الأخطاء', c: COL.green},
  {chip: 'IFNA', ar: 'معالجة موجهة بدون إخفاء العيوب', c: COL.purple},
  {chip: '0  ""  "Pending"', ar: 'اختيار القيمة البديلة المناسبة', c: COL.blue},
  {chip: '50,000 rows', ar: 'تقارير مؤمّنة ضد الانكسار', c: GOLD},
];
const Check: React.FC<{c: string; p: number; s?: number}> = ({c, p, s = 38}) => (
  <svg width={s} height={s} viewBox="0 0 38 38" style={{opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}>
    <circle cx="19" cy="19" r="17" fill={`${c}26`} stroke={c} strokeWidth="2"/>
    <path d="M11 19.5l5.5 5.5L27 13" stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GRID: string[] = ['e', 'm', 'e', 'm', 'm', 'm', 'e', 'm', 'm', 'e', 'e', 'm', 'g', 'm', 'm', 'm', 'm', 'e', 'm', 'e', 'm', 'e', 'm', 'm', 'e'];
const lerpHex = (a: number[], b: number[], p: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(',')})`;
const RED = [239, 68, 68], GRN = [16, 185, 129];

export const Closing: React.FC<{t: number}> = ({t}) => {
  const a0 = an(5, 0), a1 = an(5, 1), a2 = an(5, 2);
  const p = (a: number, b: number) => pe(t, a, b);
  const bar = p(2.0, 5.5);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 90, top: 80, opacity: p(0, 0.8)}}><Logo h={110}/></div>
      <div style={{position: 'absolute', left: 70, top: 250, width: 640, height: 700, borderRadius: 28, background: 'rgba(30,41,59,.55)', border: '1.5px solid #334155', boxShadow: '0 30px 80px rgba(0,0,0,.45)', opacity: p(0.2, 1.0)}}>
        <div style={{position: 'absolute', left: 50, top: 70, display: 'grid', gridTemplateColumns: 'repeat(5,100px)', gap: 12}}>
          {GRID.map((k, i) => {
            const o = p(0.5 + (i % 5) * 0.1 + Math.floor(i / 5) * 0.1, 1.3 + (i % 5) * 0.1 + Math.floor(i / 5) * 0.1);
            const fix = p(a0 + 0.8 + i * 0.12, a0 + 1.5 + i * 0.12);
            const c = k === 'e' ? lerpHex(RED, GRN, fix) : k === 'g' ? GOLD : '#2B3A52';
            return (
              <div key={i} style={{height: 100, borderRadius: 14, background: k === 'm' ? '#1B2638' : k === 'g' ? `${GOLD}22` : `${c}`.replace('rgb', 'rgba').replace(')', ',0.16)'), border: `2px solid ${c}`, boxShadow: k === 'm' ? undefined : `0 0 22px ${c}`, opacity: o, position: 'relative'}}>
                {k === 'g' ? (
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{position: 'absolute', left: -2, top: -2}}>
                    <path d="M50 18l24 8v18c0 17-10 29-24 35-14-6-24-18-24-35V26z" fill="#2B2208" stroke={GOLD} strokeWidth="3"/>
                    <path d="M38 48l9 9 17-19" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 790, top: 70, width: 1060}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: p(0.2, 1.0), transform: `translateY(${(1 - p(0.2, 1.0)) * 20}px)`}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 52, color: COL.text, whiteSpace: 'nowrap'}}>منظومة أكاديمي</span>
          <span style={{width: 4, height: 44, background: COL.green, alignSelf: 'center'}}/>
          <span dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 600, fontSize: 40, color: COL.green, whiteSpace: 'nowrap'}}>Manzooma Excel Masterclass</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, opacity: p(a0 + 0.6, a0 + 1.4)}}>
          <Check c={GOLD} p={p(a0 + 0.6, a0 + 1.4)} s={52}/>
          <div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 42, color: GOLD}}>Unit 2 Fully Completed</div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 29, color: COL.muted, marginTop: 4}}>Core Formulas & Logic Engine Mastered</div>
          </div>
        </div>
        <div style={{marginTop: 32, opacity: p(1.8, 2.6)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.ar, fontSize: 28, color: COL.muted, marginBottom: 12}}>
            <span dir="rtl">تقدم الوحدة الثانية</span><span dir="ltr" style={{color: GOLD, fontWeight: 700}}>{Math.round(bar * 100)}%</span>
          </div>
          <div style={{height: 18, borderRadius: 9, background: '#1E293B', border: '1px solid #334155', overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COL.green}, ${GOLD})`, boxShadow: `0 0 ${10 + 18 * bar}px ${bar > 0.98 ? GOLD : COL.green}`}}/>
          </div>
        </div>
        <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 12}}>
          {SKILLS.map((s, i) => {
            const o = p(2.4 + i * 0.8, 3.2 + i * 0.8);
            return (
              <div key={s.chip} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: o, transform: `translateX(${(1 - o) * 24}px)`}}>
                <Check c={s.c} p={o}/>
                <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 28, color: s.c, minWidth: 330}}>{s.chip}</span>
                <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 29, color: COL.text}}>{s.ar}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 22, opacity: p(a1, a1 + 0.8)}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontSize: 30, color: COL.muted}}>الملفات والتدريبات</span>
          <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, color: COL.blue, background: '#38BDF81F', border: '1.5px solid #38BDF866', borderRadius: 12, padding: '8px 20px'}}>solutions.gomaaintelligence.me</span>
        </div>
        <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 24, padding: '18px 26px', borderRadius: 20, background: 'rgba(30,41,59,.8)', border: `1.5px solid ${GOLD}88`, boxShadow: `0 0 30px ${GOLD}33`, opacity: p(a2 - 0.4, a2 + 0.4), transform: `translateY(${(1 - p(a2 - 0.4, a2 + 0.4)) * 24}px)`}}>
          <div style={{width: 118, height: 78, borderRadius: 12, background: '#0F172A', border: `1.5px solid ${COL.blue}`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: 3, padding: 6, boxSizing: 'border-box'}}>
            {Array.from({length: 12}, (_, i) => <div key={i} style={{borderRadius: 3, background: i % 4 === 0 ? `${COL.blue}88` : i < 4 ? `${GOLD}66` : '#1E293B'}}/>)}
          </div>
          <div>
            <div dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 32, color: COL.text}}>الدرس القادم 11: دالة البحث الرأسي التقليدية</div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 27, color: GOLD, marginTop: 4}}>Unit 3 starts — VLOOKUP Architecture</div>
          </div>
        </div>
      </div>
    </div>
  );
};
