import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Editor, Kpi, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CUSTOMERS, TIERS} from '../data';

// SC05 (170-209s): enterprise loyalty tiers + dynamic discounts.
// Anchors (s): 171.2 enterprise | 181.9 three tiers | 184.2 Gold | 187.7 Silver | 191.2 Bronze | 192.7 discounts | 196.9 integrated technique
const S = START.s5;
const t = (g: number) => sec(g - S);
const COL: Record<string, string> = {gold: C.green, silver: C.amber, bronze: C.bronze};
const AT: Record<string, number> = {gold: 184.2, silver: 187.7, bronze: 191.2};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const seal = clamp(pop(f, t(196.9)));
  const keys = ['gold', 'silver', 'bronze'] as const;
  return (
    <Stage dur={1170} inFx="morph" outFx="fade">
      <TopBadge text="شرائح الولاء | Loyalty Tiers & Dynamic Discounts" from={sec(1)} to={sec(36)} color={C.green} />

      <Editor x={80} y={170} w={940} h={380} title="Query Editor" lines={['SELECT customer_name, total_spent,', '  CASE', "    WHEN total_spent >= 10000 THEN 'Gold (15% Off)'", "    WHEN total_spent >= 5000  THEN 'Silver (10% Off)'", "    ELSE 'Bronze (5% Off)'", '  END AS loyalty_segment', 'FROM customer_spending_summary;']} start={t(171.2)} cps={1.0} size={24} hl={f >= t(191.2) ? 4 : f >= t(187.7) ? 3 : f >= t(184.2) ? 2 : -1} hlColor={f >= t(191.2) ? C.bronze : f >= t(187.7) ? C.amber : C.green} />

      {keys.map((k, i) => {
        const tr = TIERS[k];
        const p = clamp(lin(f, t(192.7 + i * 0.6), 14));
        return <Kpi key={k} x={80} y={590 + i * 100} w={940} h={86} label={`${tr.name} · total_spent ≥ ${tr.min.toLocaleString('en-US')}`} ar={k === 'gold' ? 'عميل ذهبي' : k === 'silver' ? 'عميل فضي' : 'عميل برونزي'} value={tr.off} color={COL[k]} p={p} glow={p} />;
      })}

      <Win x={1060} y={170} w={780} h={720} title="loyalty_report" accent={C.green}>
        {keys.map((k, ti) => {
          const rows = CUSTOMERS.filter((c) => c.tier === k);
          const tp = clamp(lin(f, t(AT[k]), 14));
          return (
            <div key={k}>
              <div dir="ltr" style={{position: 'absolute', left: 28, top: 20 + ti * 196, fontFamily: MONO, fontSize: 28, fontWeight: 700, color: COL[k], opacity: tp}}>{TIERS[k].name} · {TIERS[k].off}</div>
              {rows.map((c, ci) => {
                const p = clamp(pop(f, t(AT[k] + 0.4 + ci * 0.5)));
                return (
                  <div key={c.name} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 28 + ci * 360, top: 68 + ti * 196, width: 340, height: 104, borderRadius: 18, border: `3px solid ${COL[k]}`, background: `${COL[k]}1c`, opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p})`, padding: '14px 22px', fontFamily: MONO}}>
                    <div style={{fontSize: 32, fontWeight: 700, color: C.text}}>{c.name}</div>
                    <div style={{fontSize: 26, color: COL[k], marginTop: 6}}>{c.spent.toLocaleString('en-US')}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Win>
      <div dir="ltr" style={{position: 'absolute', left: 1240, top: 818, display: 'flex', alignItems: 'center', gap: 14, opacity: seal, transform: `scale(${0.85 + 0.15 * seal})`, background: C.card, border: `3px solid ${C.green}`, borderRadius: 18, padding: '8px 26px', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.green}}>
        <Check p={seal} size={40} /> TIER APPROVED
      </div>
      <Caption text="Enterprise Classification ──► Dynamic Loyalty Tiering & Discount Rules" from={t(174)} to={t(190)} />
      <Caption text="Precision Marketing ──► Categorizes High-Value Cohorts Automatically" from={t(196)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
