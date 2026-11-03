import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {Field, SchemaCard} from '../components/Schema';
import {appear, pop} from '../components/Text';
import {back, eo, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc03;
const CODE: CodeLine[] = [
  {text: 'CREATE TABLE customers (', at: S.l1},
  {text: '  customer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,', at: S.l2, dt: 0.03},
  {text: '  first_name VARCHAR(50) NOT NULL,', at: S.l3},
  {text: '  last_name VARCHAR(50) NOT NULL,', at: S.l4},
  {text: '  email VARCHAR(100) UNIQUE NOT NULL,', at: S.l5},
  {text: '  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP', at: S.l6},
  {text: ');', at: S.l7},
];
const FIELDS: Field[] = [
  {name: 'customer_id', type: 'INT IDENTITY', at: S.l2 + 1.6, badges: [{kind: 'PK', at: S.pk + 0.8}]},
  {name: 'first_name', type: 'VARCHAR(50)', at: S.l3 + 1.0, badges: [{kind: 'NN', at: S.l3 + 1.3}]},
  {name: 'last_name', type: 'VARCHAR(50)', at: S.l4 + 1.0, badges: [{kind: 'NN', at: S.l4 + 1.3}]},
  {name: 'email', type: 'VARCHAR(100)', at: S.l5 + 1.1, badges: [{kind: 'UQ', at: S.uq}, {kind: 'NN', at: S.uq + 0.5}, {kind: 'IX', at: S.idx}]},
  {name: 'created_at', type: 'TIMESTAMPTZ', at: S.l6 + 1.4, badges: [{kind: 'DF', at: S.ts}]},
];

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 86.7, 87.7);
  const warm = 0.5 + 0.5 * pulse(t, 1.4);
  const keyFly = prog(t, S.pk, S.pk + 0.8);
  const done = pop(t, S.l7 + 0.8, S.l7 + 1.6);
  const keyGlow = Math.sin(prog(t, S.pk + 0.8, S.pk + 1.8) * Math.PI);

  const tag = (range: number[], head: string, body: string, color: string) => {
    const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
    if (p <= 0.01) return null;
    return (
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 28px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 27, color: C.text, whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`, boxShadow: `0 0 30px ${color}44`}}>
        <span style={{color}}>{head}</span>
        <span>{body}</span>
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag1, 'CREATE TABLE customers', '( customer_id INT PRIMARY KEY ... );', D.code)}</div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}>{tag(S.tag2, 'Parent Entity Schema', '──► Primary Key & Constraints Integrated', D.key)}</div>

      <div style={{opacity: enter, transform: `translateX(${(1 - enter) * -80}px)`}}>
        <Code lines={CODE} t={t} x={60} y={190} w={1040} h={500} title="01_customers.sql" fontSize={26} lineH={52} />
      </div>
      {t >= S.l7 + 0.5 ? (
        <div style={{position: 'absolute', left: 60, top: 720, opacity: appear(t, S.l7 + 0.5, S.l7 + 1.1), fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.cat}}>
          <span style={{color: C.mute}}>postgres=#</span> CREATE TABLE <span style={{color: D.cat}}>✓</span>
        </div>
      ) : null}

      <SchemaCard t={t} x={1150} y={190} w={710} name="customers" ar="الجدول الأب" accent={D.code} fields={FIELDS} rowH={84} at={S.l1 + 1.2} glow={24 + 20 * warm * (t > S.l7 ? 1 : 0)} />

      {/* gold key flying from the code to the schema */}
      {keyFly > 0 && keyFly < 1 ? (
        <svg width="64" height="64" viewBox="0 0 26 26" style={{position: 'absolute', left: mix(1000, 1640, eo(keyFly)), top: mix(260, 290 - 70 * Math.sin(keyFly * Math.PI), eo(keyFly)), filter: `drop-shadow(0 0 16px ${D.key})`}} fill="none" stroke={D.key} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="13" r="5" /><path d="M13 13h11M20 13v5M24 13v4" /></svg>
      ) : null}
      {keyGlow > 0 ? <div style={{position: 'absolute', left: 1150, top: 270, width: 710, height: 84, borderRadius: 16, boxShadow: `0 0 ${50 * keyGlow}px ${D.key}`, pointerEvents: 'none'}} /> : null}

      {/* B-Tree index note */}
      {t >= S.idx ? (
        <div style={{position: 'absolute', left: 1150, top: 720, width: 710, opacity: appear(t, S.idx, S.idx + 0.7), direction: 'rtl', fontFamily: FONT_AR, fontWeight: 700, fontSize: 27, color: D.cat}}>
          UNIQUE ينشئ فهرس B-Tree تلقائيًا
        </div>
      ) : null}

      {done > 0.01 ? (
        <div style={{position: 'absolute', left: 1150, top: 800, width: 710, opacity: Math.min(1, done * 1.5), transform: `scale(${0.85 + 0.15 * done})`, transformOrigin: '50% 0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', padding: '14px 26px', borderRadius: 18, background: `${D.cat}22`, border: `2px solid ${D.cat}`, fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: C.text}}>
            <svg width="38" height="38" viewBox="0 0 34 34" fill="none" stroke={D.cat} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18 L14 26 L29 8" /></svg>
            الجدول الأب جاهز بكل قيوده
          </div>
        </div>
      ) : null}
    </div>
  );
};
