import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, pop, prog, sec, clamp, camLerp, CAM0} from '../kit';
import {RangeFx, rangeRect} from '../l7';
import {EtlPipe, Host, ManualCards, Panel, colW46} from '../l46';

// SC01 anchors (s, abs): 2.0 badge | 7.0 unit card | 17.9 "Power Query" | 21.0 ETL | 22.8-28 manual | 28.5 Extract | 31.9 Transform | 33.5 Load | 36 stream
const S = START.s1;
const t = (g: number) => sec(g - S);
const G46 = {colW: colW46};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const raw = prog(f, t(1.2), 12) * (1 - prog(f, t(6.5), 10));
  const panel = prog(f, t(6.8), 16) * (1 - prog(f, t(39.6), 14));
  const unit = prog(f, t(7.0), 14) * (1 - prog(f, t(22.4), 10));
  const eng = pop(f, t(17.9));
  const manual = prog(f, t(22.8), 12);
  const strike = prog(f, t(26.4), 14);
  const dim = 1 - 0.55 * prog(f, t(28.2), 14);
  const cam = camLerp(CAM0, CAM0, 0);
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="zoom">
      <Host cam={cam}>
        <RangeFx rect={rangeRect(1, 1, 17, 5, G46)} color={C.red} p={raw} fill={0.08} label="Raw data · blanks · text dates" labelBelow />
      </Host>
      <TopBadge text="الدرس 46 من 76 | الوحدة 10 من 14 ──► Power Query & ETL Engine" from={t(2.0)} to={t(17.5)} />
      <Panel p={panel}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 36, opacity: unit, transform: `translateY(${(1 - unit) * 16}px)`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.muted}}>Unit 10 of 14</div>
          <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16}}>
            {Array.from({length: 14}, (_, i) => (
              <div key={i} style={{width: i === 9 ? 70 : 34, height: 18, borderRadius: 9, background: i === 9 ? C.blue : i < 9 ? C.green : C.border, boxShadow: i === 9 ? `0 0 18px ${C.blue}` : 'none'}} />
            ))}
          </div>
          <Mix style={{fontSize: 46, fontWeight: 700, color: C.text, display: 'block', marginTop: 30}}>Power Query ومحرك تجهيز البيانات</Mix>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 560, top: 330, width: 600, textAlign: 'center', opacity: eng * (1 - prog(f, t(22.4), 10)), transform: `scale(${0.8 + 0.2 * eng})`}}>
          <div style={{display: 'inline-block', padding: '26px 54px', borderRadius: 28, border: `3px solid ${C.blue}`, background: C.card, boxShadow: `0 0 50px ${C.blue}66`}}>
            <div style={{fontFamily: MONO, fontSize: 56, fontWeight: 700, color: C.blue}}>Power Query</div>
            <div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginTop: 8}}>Extract · Transform · Load</div>
          </div>
        </div>
        <div style={{opacity: manual * (1 - 0.65 * prog(f, t(28.4), 12))}}><ManualCards p={1} strike={strike} y={60} /></div>
        <div style={{opacity: dim === 1 ? 0 : 1}}>
          <EtlPipe f={f} at={[t(28.2), t(28.6), t(31.9), t(33.5), t(35.2)]} flow={t(36.0)} y={300} hot={f >= t(33.5) ? 3 : f >= t(31.9) ? 2 : f >= t(28.6) ? 1 : -1} />
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 28, opacity: prog(f, t(34.6), 12)}}>
          <Chip color={C.green}>Source file never touched</Chip>
          <Chip color={C.blue}>Zero manual editing</Chip>
        </div>
      </Panel>
      <Caption text="Automated Data Ingestion ──► Extract ──► Transform ──► Load (Zero Manual Editing)" from={t(22.0)} to={t(38.4)} />
    </Stage>
  );
};
