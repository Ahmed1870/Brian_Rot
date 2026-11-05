import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC02 (40-85s): pg_cron + Hybrid Architecture (UNION ALL)
// Anchors: 41.0 pg_cron | 45.0 schedule | 52.0 hybrid | 60.0 UNION ALL | 68.0 historic | 75.0 live | 80.0 merge
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  const mergeP = clamp(lin(f, t(60), 16));
  const sealP = pop(f, t(75));

  // pg_cron rotation
  const cronRotation = (f * 3) % 360;

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الأتمتة والمعمارية الهجينة | pg_cron & Hybrid Architecture" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: pg_cron scheduler */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={190}
          title="pg_cron · Automated Background Refresh"
          lines={[
            "SELECT cron.schedule(",
            "  'nightly_refresh',",
            "  '0 3 * * *',",
            "  $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales$$",
            ");",
          ]}
          start={t(41.5)}
          cps={0.65}
          size={15}
          accent={C.amber}
          hl={3}
          hlColor={C.amber}
        />
        <Win x={80} y={390} w={860} h={510} title="automated scheduler · nightly CONCURRENTLY" accent={C.amber} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
            pg_cron extension · zero human intervention
          </div>

          {/* Clock icon rotating */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, marginTop: 20}}>
            <svg width={100} height={100} viewBox="0 0 100 100" style={{transform: `rotate(${cronRotation}deg)`}}>
              <circle cx={50} cy={50} r={44} fill="none" stroke={C.amber} strokeWidth={4} />
              <line x1={50} y1={50} x2={50} y2={18} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
              <line x1={50} y1={50} x2={76} y2={50} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
              <circle cx={50} cy={50} r={5} fill={C.amber} />
            </svg>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.amber, fontWeight: 700}}>pg_cron</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>03:00 AM daily</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>✓ automated</div>
            </div>
          </div>

          {/* Schedule benefits */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 220, display: 'flex', flexDirection: 'column', gap: 12}}>
            {[
              {label: 'CONCURRENTLY refresh', desc: 'zero read blocking'},
              {label: 'low-traffic window', desc: '03:00 AM · minimal load'},
              {label: 'no human intervention', desc: 'fully automated pipeline'},
            ].map((item, i) => {
              const visible = clamp(pop(f, t(45 + i * 1.2)));
              return (
                <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`, opacity: visible, transform: `translateX(${(1 - visible) * 20}px)`}}>
                  <Check p={visible} size={28} color={C.amber} />
                  <span style={{fontFamily: MONO, fontSize: 18, color: C.text, fontWeight: 700, width: 200}}>{item.label}</span>
                  <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>{item.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            ✓ pg_cron · automated background refresh
          </div>
        </Win>
      </div>

      {/* RIGHT: Hybrid Architecture (UNION ALL) */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={210}
          title="Hybrid View · UNION ALL Overlay"
          lines={[
            'CREATE VIEW v_hybrid_sales AS',
            '  SELECT * FROM mv_sales_summary',
            '  WHERE sales_date < CURRENT_DATE',
            '  UNION ALL',
            '  SELECT * FROM live_sales_today',
            '  WHERE sales_date = CURRENT_DATE;',
          ]}
          start={t(52.5)}
          cps={0.7}
          size={15}
          accent={C.green}
          hl={3}
          hlColor={C.green}
        />
        <Win x={980} y={410} w={860} h={490} title="hybrid tiered architecture" accent={C.green} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
            historic MatView + live today data
          </div>

          {/* Two blocks being merged */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', flexDirection: 'column', gap: 16}}>
            {/* Historic MatView block */}
            <div style={{padding: '14px 18px', border: `3px solid ${C.blue}`, borderRadius: 12, background: `${C.blue}0d`, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp(pop(f, t(56)))}}>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.blue, fontWeight: 700}}>📦</div>
              <div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.blue, fontWeight: 700}}>Historic MatView</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>pre-aggregated · instant speed</div>
              </div>
            </div>

            {/* UNION ALL merge arc */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: clamp(mergeP)}}>
              <div style={{padding: '8px 20px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, boxShadow: `0 0 16px ${C.green}55`}}>UNION ALL</div>
              <svg width={40} height={20}>
                <path d="M0 10 L35 10" fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="4 3" />
                <polygon points="30,5 30,15 38,10" fill={C.green} />
              </svg>
            </div>

            {/* Live data block */}
            <div style={{padding: '14px 18px', border: `3px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp(pop(f, t(62)))}}>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.amber, fontWeight: 700}}>⚡</div>
              <div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700}}>Today's Live Data</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>real-time · 100% current</div>
              </div>
            </div>

            {/* Result */}
            <div style={{padding: '14px 18px', border: `3px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp(sealP), boxShadow: `0 0 20px ${C.green}44`}}>
              <Check p={sealP} size={36} color={C.green} />
              <div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Hybrid Overlay ✓</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>speed + freshness · best of both</div>
              </div>
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
            ✓ UNION ALL · historic + live data
          </div>
        </Win>
      </div>

      <Caption text="Automated Background Refresh ──► Scheduled pg_cron Execution" from={t(42)} to={t(60)} />
      <Caption text="Hybrid View Architecture ──► Historic MatView + Live Today Data (UNION ALL)" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
