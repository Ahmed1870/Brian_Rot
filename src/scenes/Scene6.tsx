import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {COURSE_STATS} from '../data';
import {Check, Chip, Mix, Stage, clamp, pop, prog, sec, typed} from '../kit';

// SC06 (210-240s): GRAND COURSE GRADUATION FINALE
// 100% complete · 68 lessons · 16 modules · Gold Graduation Certificate
// This is the FINAL scene of the entire course - must be celebratory and memorable
// Anchors: 211.0 graduation | 213.5 stats | 220.0 certificate | 225.0 celebration | 230.0 100% complete
const S = START.s6;
const t = (g: number) => sec(g - S);

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 30);
  const head = prog(f, t(211), 24);
  const badge = pop(f, t(211.6));
  const fill = prog(f, t(212.2), sec(4.8));
  const statsP = prog(f, t(213.5), 20);
  const certP = pop(f, t(220));
  const celebrateP = pop(f, t(225));
  const pct = Math.round(fill * 100); // 100% — Course Complete!

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);

  return (
    <Stage dur={900} inFx="fade" outFx="black">
      <div style={{position: 'absolute', left: 100, top: 60, width: 1720, height: 960, borderRadius: 40, background: 'rgba(30,41,59,0.7)', border: `3px solid ${C.gold}`, boxShadow: `0 50px 150px rgba(2,6,23,.8), 0 0 60px ${C.gold}33`, opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
        
        {/* Festive confetti dots (animated) */}
        <svg width={1720} height={960} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          {Array.from({length: 30}, (_, i) => {
            const x = (i * 57 + f * 0.3) % 1720;
            const y = (i * 31 + f * 0.5) % 960;
            const colors = [C.gold, C.green, C.blue, C.purple, C.amber];
            const color = colors[i % 5];
            const size = 4 + (i % 3) * 2;
            return <circle key={i} cx={x} cy={y} r={size} fill={color} opacity={0.3} style={{filter: `drop-shadow(0 0 4px ${color})`}} />;
          })}
        </svg>

        {/* Header: Manzooma Academy + Graduation */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * 20}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 22}}>
            <svg width={80} height={80} viewBox="0 0 70 70">
              <line x1={14} y1={52} x2={35} y2={16} stroke={C.blue} strokeWidth={5} />
              <line x1={35} y1={16} x2={56} y2={52} stroke={C.green} strokeWidth={5} />
              <line x1={14} y1={52} x2={56} y2={52} stroke={C.gold} strokeWidth={5} />
              <circle cx={14} cy={52} r={9} fill={C.blue} />
              <circle cx={35} cy={16} r={9} fill={C.text} />
              <circle cx={56} cy={52} r={9} fill={C.green} />
            </svg>
            <Mix style={{fontSize: 62, fontWeight: 700, color: C.gold}}>منظومة أكاديمي</Mix>
            <span style={{fontFamily: MONO, fontSize: 40, color: C.muted}}>|</span>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.gold}}>SQL Masterclass Finale 🎓</span>
          </div>
        </div>

        {/* 100% Complete badge */}
        <div dir="ltr" style={{position: 'absolute', left: 100, right: 100, top: 160}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${0.9 + 0.1 * badge})`, transformOrigin: 'left center', opacity: clamp(badge)}}>
            <Check p={badge} size={72} color={C.gold} />
            <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.gold}}>
              🎓 COURSE COMPLETED: <span style={{color: C.text}}>SQL From Zero to Professional — 100% Mastered (68 Lessons · 16 Modules · SQL Professional Certified)</span>
            </div>
          </div>
          {/* 100% Progress bar */}
          <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{flex: 1, height: 32, borderRadius: 16, background: C.deep, overflow: 'hidden', border: `3px solid ${C.gold}`, boxShadow: `0 0 20px ${C.gold}44`}}>
              <div style={{width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green}, ${C.gold})`, borderRadius: 16, boxShadow: `0 0 20px ${C.gold}`}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 42, fontWeight: 700, color: C.gold, width: 160, textAlign: 'right'}}>{pct}%</div>
          </div>
          <div style={{marginTop: 14, fontFamily: MONO, fontSize: 24, color: C.gold, fontWeight: 700, textAlign: 'center'}}>
            {statsP > 0.5 ? '🎓 100% COMPLETE · 68 Lessons · 16 Modules · 45 Hours · 850 Queries · 320 Exercises — ALL MASTERED' : 'course complete'}
          </div>
        </div>

        {/* Course Stats (4 stat cards) */}
        <div dir="ltr" style={{position: 'absolute', left: 120, right: 120, top: 330, display: 'flex', gap: 18, justifyContent: 'center'}}>
          {[
            {label: 'Lessons', value: COURSE_STATS.totalLessons, color: C.blue},
            {label: 'Modules', value: COURSE_STATS.totalModules, color: C.purple},
            {label: 'Hours', value: COURSE_STATS.totalHours, color: C.amber},
            {label: 'Queries', value: COURSE_STATS.totalQueries, color: C.green},
          ].map((s, i) => {
            const p = pop(f, t(214 + i * 0.4));
            return (
              <div key={s.label} style={{opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 18}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', border: `2px solid ${s.color}`, borderRadius: 16, background: `${s.color}0d`, minWidth: 180}}>
                <span dir="ltr" style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: s.color}}>{s.value}</span>
                <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Gold Graduation Certificate */}
        <div style={{position: 'absolute', left: 200, right: 200, top: 470, height: 320, borderRadius: 26, background: `linear-gradient(135deg, ${C.deep}, ${C.card})`, border: `4px solid ${C.gold}`, opacity: certP, transform: `translateY(${(1 - certP) * 60}px) scale(${0.9 + 0.1 * certP})`, boxShadow: `0 0 60px ${C.gold}44`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 50px'}}>
          
          {/* Certificate header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
            <svg width={50} height={50} viewBox="0 0 50 50">
              <circle cx={25} cy={25} r={22} fill={`${C.gold}22`} stroke={C.gold} strokeWidth={3} />
              <path d="M 15 25 L 22 32 L 35 18" fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Mix style={{fontSize: 36, fontWeight: 700, color: C.gold}}>شهادة التخرج المعتمدة</Mix>
          </div>
          
          {/* Certificate title */}
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 8}}>
            SQL From Zero to Professional — Certified
          </div>
          
          {/* Certificate body */}
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'center', marginBottom: 16}}>
            This certifies that the holder has successfully completed all 68 lessons<br />
            across 16 modules of the Manzooma SQL Masterclass Program<br />
            and is recognized as a <span style={{color: C.green, fontWeight: 700}}>SQL Professional</span> · <span style={{color: C.gold, fontWeight: 700}}>100% Career Ready</span>
          </div>

          {/* Certificate footer */}
          <div style={{display: 'flex', gap: 60, alignItems: 'center'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>Platform</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.gold, fontWeight: 700}}>Manzooma Academy</div>
            </div>
            <div style={{width: 2, height: 40, background: C.border}} />
            <div style={{textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>Certification</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>SQL Professional 🎓</div>
            </div>
            <div style={{width: 2, height: 40, background: C.border}} />
            <div style={{textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>Resources</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>solutions.gomaaintelligence.me</div>
            </div>
          </div>
        </div>

        {/* Celebration footer */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', opacity: celebrateP, transform: `translateY(${(1 - celebrateP) * 20}px)`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>
            🎉 مبارك نجاحك! أنت الآن مهندس ومحلل بيانات محترف · جاهز لسوق العمل · SQL Professional Certified 🎉
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 8}}>
            نزل شهادة التخرج وسكريبت المشروع النهائي من منصتنا التعليمية · انطلق بثقة في سوق العمل
          </div>
        </div>
      </div>
    </Stage>
  );
};
