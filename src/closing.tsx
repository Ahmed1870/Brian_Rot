import React from 'react';
import {COL} from './theme';
import {FONT, Logo, pe} from './kit';
import {an} from './sync';

const SKILLS: {chip: string; ar: string; c: string}[] = [
  {chip: 'TEXTBEFORE  TEXTAFTER', ar: 'اقتطاع النص قبل وبعد أي محدد', c: COL.blue},
  {chip: 'TEXTSPLIT', ar: 'تفكيك النص عبر الأعمدة والصفوف', c: COL.amber},
  {chip: 'TEXTJOIN', ar: 'دمج النطاقات بمحدد مشترك', c: COL.green},
  {chip: 'TRIM CLEAN SUBSTITUTE', ar: 'ثلاثية تطهير البيانات النصية', c: COL.purple},
  {chip: 'TRIM(TEXTSPLIT(…))', ar: 'خط إنتاج نصي في خلية واحدة', c: '#06B6D4'},
];
const Check: React.FC<{c: string; p: number; s?: number}> = ({c, p, s = 38}) => (
  <svg width={s} height={s} viewBox="0 0 38 38" style={{opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}>
    <circle cx="19" cy="19" r="17" fill={`${c}26`} stroke={c} strokeWidth="2"/>
    <path d="M11 19.5l5.5 5.5L27 13" stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
// text-split motif: [before | delimiter | after] rows, then a purple "clean" column
const ROWS: string[][] = [['b', 'b', 'a', 'g', 'g'], ['b', 'b', 'a', 'g', 'g'], ['b', 'b', 'a', 'g', 'g'], ['m', 'p', 'p', 'p', 'm'], ['m', 'm', 'm', 'm', 'm']];
const colorOf = (k: string) => (k === 'b' ? COL.blue : k === 'a' ? COL.amber : k === 'g' ? COL.green : k === 'p' ? COL.purple : '#2B3A52');

export const Closing: React.FC<{t: number}> = ({t}) => {
  const a0 = an(5, 0), a1 = an(5, 1), a2 = an(5, 2);
  const p = (a: number, b: number) => pe(t, a, b);
  const fill = p(2.0, 5.5);
  const lesson = Math.round(fill * 20);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 90, top: 80, opacity: p(0, 0.8)}}><Logo h={110}/></div>
      <div style={{position: 'absolute', left: 70, top: 250, width: 640, height: 700, borderRadius: 28, background: 'rgba(30,41,59,.55)', border: '1.5px solid #334155', boxShadow: '0 30px 80px rgba(0,0,0,.45)', opacity: p(0.2, 1.0)}}>
        <div style={{position: 'absolute', left: 50, top: 70, display: 'grid', gridTemplateColumns: 'repeat(5,100px)', gap: 12}}>
          {ROWS.flatMap((row, ri) => row.map((k, ci) => {
            const i = ri * 5 + ci;
            const o = p(0.5 + ci * 0.1 + ri * 0.1, 1.3 + ci * 0.1 + ri * 0.1);
            const c = colorOf(k);
            const split = k === 'a' ? 1 + 0.12 * Math.sin(t * 3 + ri) : 1;
            return (
              <div key={i} style={{height: 100, borderRadius: 14, background: k === 'm' ? '#1B2638' : `${c}26`, border: `2px solid ${c}`, boxShadow: k === 'm' ? undefined : `0 0 22px ${c}66`, opacity: o, transform: `scaleY(${split})`}}/>
            );
          }))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 790, top: 70, width: 1060}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: p(0.2, 1.0), transform: `translateY(${(1 - p(0.2, 1.0)) * 20}px)`}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 52, color: COL.text, whiteSpace: 'nowrap'}}>منظومة أكاديمي</span>
          <span style={{width: 4, height: 44, background: COL.green, alignSelf: 'center'}}/>
          <span dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 600, fontSize: 40, color: COL.green, whiteSpace: 'nowrap'}}>Manzooma Excel Masterclass</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, opacity: p(a0 + 0.6, a0 + 1.4)}}>
          <Check c={COL.green} p={p(a0 + 0.6, a0 + 1.4)} s={52}/>
          <div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 42, color: COL.text}}>Lesson 20 Completed</div>
            <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 29, color: COL.green, marginTop: 4}}>Text Parsing Engine Mastered</div>
          </div>
        </div>
        <div style={{marginTop: 30, opacity: p(1.8, 2.6)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONT.ar, fontSize: 28, color: COL.muted, marginBottom: 12}}>
            <span dir="rtl">الدرس {lesson} من 76</span>
            <span dir="rtl" style={{color: COL.blue, fontWeight: 600}}>الوحدة 4 من 14</span>
          </div>
          <div style={{height: 18, borderRadius: 9, background: '#1E293B', border: '1px solid #334155', overflow: 'hidden'}}>
            <div style={{width: `${fill * (20 / 76) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COL.green}, #34D399)`, boxShadow: `0 0 18px ${COL.green}`}}/>
          </div>
        </div>
        <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12}}>
          {SKILLS.map((s, i) => {
            const o = p(2.4 + i * 0.8, 3.2 + i * 0.8);
            return (
              <div key={s.chip} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: o, transform: `translateX(${(1 - o) * 24}px)`}}>
                <Check c={s.c} p={o}/>
                <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: s.c, minWidth: 390}}>{s.chip}</span>
                <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 28, color: COL.text}}>{s.ar}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 22, opacity: p(a1, a1 + 0.8)}}>
          <span dir="rtl" style={{fontFamily: FONT.ar, fontSize: 30, color: COL.muted}}>الملفات والتدريبات</span>
          <span dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, color: COL.blue, background: '#38BDF81F', border: '1.5px solid #38BDF866', borderRadius: 12, padding: '8px 20px'}}>solutions.gomaaintelligence.me</span>
        </div>
        <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 24, padding: '18px 26px', borderRadius: 20, background: 'rgba(30,41,59,.8)', border: `1.5px solid ${COL.green}88`, boxShadow: `0 0 30px ${COL.green}33`, opacity: p(a2 - 0.4, a2 + 0.4), transform: `translateY(${(1 - p(a2 - 0.4, a2 + 0.4)) * 24}px)`}}>
          <div style={{width: 118, height: 78, borderRadius: 12, background: '#0F172A', border: `1.5px solid ${COL.amber}`, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridTemplateRows: 'repeat(4,1fr)', gap: 3, padding: 6, boxSizing: 'border-box'}}>
            {Array.from({length: 28}, (_, i) => <div key={i} style={{borderRadius: 2, background: i === 10 || i === 11 || i === 12 ? `${COL.amber}99` : i % 7 === 0 ? `${COL.blue}66` : '#1E293B'}}/>)}
          </div>
          <div>
            <div dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 32, color: COL.text}}>الدرس القادم 21: دوال التواريخ والفترات الزمنية</div>
            <div dir="ltr" style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 25, color: COL.amber, marginTop: 6}}>WORKDAY · EOMONTH · YEARFRAC · DATEDIF</div>
          </div>
        </div>
      </div>
    </div>
  );
};
