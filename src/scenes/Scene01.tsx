import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, lerp, prog} from '../common';

const EMAILS = ['ahmed@mail.com', 'sara@mail.com', 'mona@mail.com', 'ali@mail.com'];
const ORD = [['#101', 'active'], ['#102', 'archived'], ['#103', 'active'], ['#104', 'archived'], ['#105', 'archived'], ['#106', 'active']];

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const U = B.s1.unique, P = B.s1.partial;
  const shield = ease(prog(f, 181, 250));
  // duplicate INSERT: rises to the barrier, bounces back
  const up = ease(prog(f, 250, 330)), back = ease(prog(f, 340, 420));
  const chipY = lerp(560, 452, up) + back * 100;
  const bounced = f >= 340;
  const mask = prog(f, 181, 450) * 6; // blue mask sweeps down the rows
  const badge = ease(prog(f, 541, 600));

  return (
    <Scene dur={S.s1.dur} accent={C.purple}>
      <Title ar="الفهارس الفريدة والجزئية" en="UNIQUE & Partial Indexes" chip="SC 01 · CONCEPT" accent={C.purple} />

      <Card box={U} accent={C.purple} at={6}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.purple}>UNIQUE INDEX · users.email</Tag></div>
        {EMAILS.map((e, i) => (
          <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 80 + i * 70, height: 58, borderRadius: 12, border: `2px solid ${C.line}`, background: C.panel2, display: 'flex', alignItems: 'center', padding: '0 18px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text, opacity: prog(f, 20 + i * 12, 50 + i * 12)}}>{e}</div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, top: 360, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.purple, opacity: shield}}>UNIQUE BARRIER</div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 398, height: 18, borderRadius: 9, background: C.purple, opacity: shield, transform: `scaleX(${shield})`}} />
        {f >= 250 && (
          <div style={{position: 'absolute', left: 140, top: chipY - 28, width: 600, height: 56, borderRadius: 12, border: `3px solid ${bounced ? C.red : C.amber}`, background: bounced ? 'rgba(239,68,68,0.16)' : 'rgba(245,158,11,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.text}}>INSERT 'ahmed@mail.com'</div>
        )}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 36, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.red, opacity: prog(f, 380, 440)}}>إدخال مكرر ← اتصد ✗</div>
      </Card>

      <Card box={P} accent={C.blue} at={20}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.blue}>PARTIAL INDEX · orders</Tag></div>
        {ORD.map((o, i) => {
          const hit = mask > i + 0.5;
          const act = o[1] === 'active';
          return (
            <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 80 + i * 66, height: 54, borderRadius: 12, border: `3px solid ${hit ? (act ? C.green : C.line) : C.line}`, background: hit && act ? 'rgba(16,185,129,0.14)' : C.panel2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: hit && !act ? C.dim : C.text, opacity: Math.min(prog(f, 30 + i * 10, 60 + i * 10), hit && !act ? 0.45 : 1)}}>
              <span>{o[0]}</span><span style={{color: hit && act ? C.green : C.dim}}>{o[1]}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 14, right: 14, top: 74 + Math.min(mask, 6) * 66 - 66, height: 66, borderRadius: 14, border: `4px solid ${C.blue}`, background: 'rgba(56,189,248,0.08)', opacity: mask > 0 && mask < 6.2 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 24, right: 24, top: 500, textAlign: 'center', opacity: badge, transform: `scale(${0.9 + 0.1 * badge})`}}>
          <span style={{display: 'inline-block', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.bg, background: C.green, borderRadius: 999, padding: '6px 24px'}}>Surgical Data Indexing</span>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 36, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.blue, opacity: prog(f, 600, 660)}}>بيفهرس 3 صفوف نشطة بس من 6</div>
      </Card>
      <svg width={0} height={0}><Defs /></svg>

      <Caption from={60} to={540} ltr={false} color={C.purple}>الفهارس الفريدة والجزئية | UNIQUE & Partial Indexes</Caption>
      <Caption from={660} to={1140} color={C.blue}>UNIQUE Index ──► Integrity Barrier | Partial Index ──► Filtered Slice</Caption>
    </Scene>
  );
};
