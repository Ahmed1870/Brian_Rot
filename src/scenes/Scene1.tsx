import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, clamp, prog, sec} from '../kit';
import {Tag} from '../l54';
import {Hist, Host63, ST, f2, fmt, salesCell} from '../l63';

// SC01 anchors (s, abs): 0.5 badge | 17.6 plain total | 26.2 total hides detail (red) | 34.7 stat engine | 36.4 mean/median | 37.9 decisions
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const sum = prog(f, t(17.6), 12), red = prog(f, t(26.2), 12), eng = prog(f, t(34.7), 18), mk = prog(f, t(36.4), 14);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  const gone = 1 - eng;
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="zoom">
      <Host63 cell={salesCell} sel={{r1: 2, c1: 7, r2: 21, c2: 7}} active={{r: 2, c: 7}} nameBox="G2" glow={eng > 0.3 ? C.blue : red > 0.3 ? C.red : undefined}>
        {sum > 0.01 ? (
          <div dir="ltr" style={{position: 'absolute', left: 790, top: 250, width: 420, padding: '14px 20px', background: '#0B1222', border: `3px solid ${red > 0.5 ? C.red : C.amber}`, borderRadius: 14, boxShadow: `0 0 ${24 * red * pulse}px ${C.red}`, opacity: clamp(sum) * gone, zIndex: 30, transform: `scale(${0.9 + 0.1 * sum})`}}>
            <div style={{fontFamily: MONO, fontSize: 15, color: C.muted}}>=SUM(G2:G50001)</div>
            <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.text}}>{fmt(ST.sum)}</div>
            <div style={{fontFamily: MONO, fontSize: 14, color: C.red, opacity: red}}>one number hides the spread, the outliers and the skew</div>
          </div>
        ) : null}
        {eng > 0.01 ? <Hist x={780} y={226} w={560} h={250} p={eng} mark={mk} /> : null}
        <Tag x={780} y={490} text={`Mean ${f2(ST.mean)} · Median ${fmt(ST.median)} · Mode ${fmt(ST.mode)}`} color={C.blue} p={prog(f, t(36.8), 10)} dark />
        <Tag x={780} y={526} text="✓ decisions based on facts, not just totals" color={C.green} p={prog(f, t(37.9), 10)} />
      </Host63>
      <TopBadge text="الدرس 63 من 76 | الوحدة 13 من 14 ──► Statistical Analysis Tools & Descriptive Statistics Engine" from={t(0.8)} to={t(17.0)} />
      <div style={{position: 'absolute', left: 100, top: 82}}>
        {red > 0.01 && eng < 0.5 ? <div style={{opacity: red}}><Chip color={C.red}>One total hides the behavior</Chip></div> : null}
        {eng > 0.5 ? <div style={{opacity: eng}}><Chip color={C.blue}>Statistical engine ──► reads the distribution</Chip></div> : null}
      </div>
      <Caption text="Unit 13 · Statistical Analysis & Business Intelligence ──► Lesson 63" from={t(7.5)} to={t(14.5)} />
      <Caption text="Data-Driven Intelligence ──► Uncovering Hidden Data Behavior Beyond Simple Totals" from={t(22.0)} to={t(39.8)} />
    </Stage>
  );
};
