import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Check, Chip, Mix, Sql, Stage, clamp, pop, prog, sec, typed} from '../kit';

// SC06 (210-240s): Manzooma Academy outro — Module 12 at 25%
// Anchors: 211.0 excellent | 213.5 download scripts | 220.0 prepare | 225.0 next lesson | 230.0 composite & partial
const S = START.s6;
const t = (g: number) => sec(g - S);

const SKILLS = ['B-Tree Architecture ✓', 'Hash Equality Index ✓', 'GIN Inverted Index ✓', 'GiST Spatial Index ✓', 'TIDs & DML Overhead ✓'];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 0, 30);
  const head = prog(f, t(211), 24);
  const badge = pop(f, t(211.6));
  const fill = prog(f, t(212.2), sec(4.8));
  const modDone = prog(f, t(213.5), 20);
  const res = prog(f, t(215), 24);
  const next = prog(f, t(220), 28);
  const code = typed("CREATE INDEX idx_comp ON tbl (col1, col2);\n\n-- partial: WHERE active = true\n-- composite: (col1, col2) ordering", f, t(225), 0.65).split('\n');
  const pct = Math.round(fill * 25); // 25% of Module 12

  return (
    <Stage dur={900} inFx="fade" outFx="black">
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
            <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.green}}>
              Lesson 47 Completed: <span style={{color: C.text}}>Indexing Architecture &amp; Data Structures Mastered</span>
            </div>
          </div>
          <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{flex: 1, height: 28, borderRadius: 14, background: C.deep, overflow: 'hidden', border: `2px solid ${C.border}`}}>
              <div style={{width: `${fill * 25}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 14}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.text, width: 130, textAlign: 'right'}}>{pct}%</div>
          </div>
          <div style={{marginTop: 12, fontFamily: MONO, fontSize: 22, color: modDone > 0.5 ? C.green : C.muted}}>
            Module 12 · Indexing Architecture &amp; Data Structures — {modDone > 0.5 ? 'B-Tree · Hash · GIN · GiST · TIDs Mastered ✓' : 'in progress'}
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 364, display: 'flex', gap: 14, flexWrap: 'wrap', maxWidth: 1540}}>
          {SKILLS.map((s, i) => {
            const p = pop(f, t(214 + i * 0.5));
            return (
              <div key={s} style={{opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 18}px)`}}>
                <Chip color={C.blue} style={{fontSize: 18}}>{s}</Chip>
              </div>
            );
          })}
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 460, opacity: res, transform: `translateY(${(1 - res) * 24}px)`}}>
          <Chip color={C.amber} style={{fontSize: 28, padding: '10px 26px'}}>
            <Mix>الشيتات والتمارين</Mix> <span style={{color: C.text}}>→ solutions.gomaaintelligence.me</span>
          </Chip>
        </div>

        <div style={{position: 'absolute', left: 90, right: 90, top: 540, height: 310, borderRadius: 26, background: C.deep, border: `2px solid ${C.blue}`, opacity: next, transform: `translateY(${(1 - next) * 60}px)`, display: 'flex', alignItems: 'center', padding: '0 46px', gap: 40}}>
          <div style={{flex: 1}}>
            <Mix style={{fontSize: 30, color: C.blue, fontWeight: 700, display: 'block'}}>الدرس القادم · 48</Mix>
            <Mix style={{fontSize: 32, fontWeight: 700, color: C.text, display: 'block', marginTop: 10, lineHeight: 1.3}}>الفهارس المركبة والجزئية وتحسين أداء الاستعلامات متعددة الأعمدة</Mix>
          </div>
          <div dir="ltr" style={{width: 600, height: 250, borderRadius: 18, background: C.bg, border: `2px solid ${C.border}`, padding: '18px 24px', fontFamily: MONO, fontSize: 15, color: C.text}}>
            <div style={{color: '#64748B', fontSize: 13, marginBottom: 8}}>-- Lesson 48</div>
            {code.map((l, i) => (
              <div key={i} style={{whiteSpace: 'pre', minHeight: 24}}>
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
