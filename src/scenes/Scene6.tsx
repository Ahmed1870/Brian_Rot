import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, LESSON, LOGO_FILE, MONO, SCENES, START} from '../theme';
import {Check, Mix, Stage, clamp, pop, prog, sec} from '../kit';

// SC06: Lesson 11 completion card — 20% of Unit 3, next: INDEX & MATCH.
// Anchors (s): 211.0 card appears | 212.0 header | 213.0 badge | 214.0 progress | 215.0 skills | 218.0 resources | 222.0 next lesson
const S = START.s6;
const t = (g: number) => sec(g - S);

const SKILLS = [
  {a: 'تفكيك صيغة VLOOKUP الأربعة', e: 'lookup_value · table_array · col_index_num · range_lookup', at: 214.2},
  {a: 'المطابقة التامة والتقريبية', e: 'FALSE / 0 (Exact) vs TRUE / 1 (Approx)', at: 215.4},
  {a: 'عجز البحث لليسار', e: 'Left-Lookup Barrier · #N/A Error', at: 216.6},
  {a: 'هشاشة رقم العمود الثابت', e: 'Col_Index_Num Breakage · Silent Corruption', at: 217.8},
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 28);
  const head = prog(f, t(212), 22);
  const badge = pop(f, t(212.5));
  const fill = prog(f, t(214), sec(2.6)) * 0.20; // 20% of Unit 3
  const res = prog(f, t(218), 20);
  const linkPulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  const linkHot = prog(f, t(221), 10) * (1 - prog(f, t(224), 10));
  const next = prog(f, t(222), 22);
  const tag = pop(f, t(228));
  const idle = Math.sin(f * 0.05);

  return (
    <Stage dur={SCENES.s6.dur} inFx="none" outFx="black">
      <div style={{position: 'absolute', left: 100, top: 96, width: 1720, height: 880, borderRadius: 36, background: 'rgba(30,41,59,0.72)', border: `2px solid ${C.green}`, boxShadow: `0 50px 140px rgba(2,6,23,.8), 0 0 50px ${C.green}33`, opacity: card, transform: `translateY(${(1 - card) * 36}px)`}}>
        {/* header */}
        <div style={{position: 'absolute', left: 60, top: 36, display: 'flex', alignItems: 'center', gap: 24, opacity: head}}>
          <Img src={staticFile(LOGO_FILE)} style={{height: 104, width: 125}} />
          <div>
            <Mix style={{fontSize: 52, fontWeight: 700, color: C.text}}>منظومة أكاديمي</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.green, marginTop: 2}}>Manzooma Excel Masterclass</div>
          </div>
        </div>

        {/* completion badge */}
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 176, display: 'flex', alignItems: 'center', gap: 18}}>
          <Check p={badge} size={64} />
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.text, opacity: clamp(badge), lineHeight: 1.3}}>
            Lesson {String(LESSON).padStart(2, '0')} Completed:<br /><span style={{color: C.green}}>Traditional VLOOKUP Architecture Mastered</span>
          </div>
        </div>

        {/* progress bar */}
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 282, width: 940, opacity: head}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 10}}>
            <span>Unit 3 · Lookup &amp; Data Merging Engine</span><span style={{color: C.green, fontWeight: 700}}>{Math.round(fill * 100 / 0.20 * 0.20)}%</span>
          </div>
          <div style={{height: 26, borderRadius: 13, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
            <div style={{width: `${fill * 100 / 0.20}%`, minWidth: fill > 0 ? 8 : 0, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 13, boxShadow: `0 0 16px ${C.green}`}} />
          </div>
        </div>

        {/* skills checklist */}
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

        {/* resources card */}
        <div style={{position: 'absolute', left: 1060, top: 50, width: 600, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${linkHot > 0.1 ? C.green : C.border}`, padding: '26px 32px', boxShadow: linkHot > 0.1 ? `0 0 ${30 * linkPulse}px ${C.green}88` : 'none'}}>
            <Mix style={{fontSize: 30, fontWeight: 700, color: C.text}}>الملفات والتدريبات</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.blue, marginTop: 14, wordBreak: 'break-all'}}>solutions.gomaaintelligence.me</div>
            <Mix style={{fontSize: 22, color: C.muted, display: 'block', marginTop: 10}}>نزّل manzooma_sales_2026.xlsx وطبّق VLOOKUP</Mix>
          </div>
        </div>

        {/* next lesson card */}
        <div style={{position: 'absolute', left: 1060, top: 330, width: 600, opacity: next, transform: `translateY(${(1 - next) * 30}px)`}}>
          <div style={{borderRadius: 24, background: C.card, border: `2px solid ${C.blue}`, padding: '24px 30px', boxShadow: `0 0 0 6px ${C.blue}22`}}>
            <Mix style={{fontSize: 24, color: C.blue, fontWeight: 700}}>الدرس القادم</Mix>
            <Mix style={{fontSize: 34, fontWeight: 700, color: C.text, display: 'block', marginTop: 6}}>الثنائية المتقدمة لفك قيود البحث</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.muted, marginTop: 8}}>Lesson 12 · INDEX &amp; MATCH Mechanics</div>
            {/* mini visual: INDEX/MATCH breaking the barrier */}
            <svg width={540} height={140} viewBox="0 0 540 140" style={{marginTop: 16}}>
              <rect x={1} y={1} width={538} height={138} rx={10} fill="#fff" stroke="#334155" />
              {/* left barrier (broken) */}
              <rect x={40} y={20} width={8} height={100} fill="#EF4444" opacity={0.3} />
              <line x1={44} y1={20} x2={44} y2={120} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" opacity={0.4} />
              {/* bidirectional arrows showing INDEX+MATCH freedom */}
              {Array.from({length: 5}, (_, r) => Array.from({length: 7}, (_, c) => (
                <rect key={r + '-' + c} x={60 + c * 65} y={20 + r * 20} width={65} height={20} fill={(r === 1 && c === 1) || (r === 3 && c === 5) ? 'rgba(56,189,248,0.2)' : '#fff'} stroke="#D9D9D9" />
              )))}
              <path d="M130 50 L400 90" stroke="#38BDF8" strokeWidth={3} fill="none" markerEnd="url(#ah)" />
              <path d="M400 90 L130 50" stroke="#A855F7" strokeWidth={3} fill="none" markerEnd="url(#ah2)" />
              <defs>
                <marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#38BDF8" /></marker>
                <marker id="ah2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#A855F7" /></marker>
              </defs>
            </svg>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: -8, transform: `scale(${0.8 + 0.2 * tag})`, opacity: clamp(tag)}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green, border: `2px solid ${C.green}`, borderRadius: 999, padding: '4px 16px', background: `${C.green}18`}}>INDEX &amp; MATCH</div>
            </div>
          </div>
        </div>

        {/* bottom decoration */}
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 26, height: 3, background: C.border, opacity: 0.6}} />
        <div style={{position: 'absolute', left: 60 + 40 * idle + 40, bottom: 24, width: 120, height: 7, borderRadius: 4, background: C.green, opacity: 0.8}} />
      </div>
    </Stage>
  );
};
