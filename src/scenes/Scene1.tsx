import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {COUNT_CANCELLED, ORDERS, TOTAL_COMPLETED, TOTAL_RETURNED, statusColor} from '../data';
import {Caption, Chip, Disk, Draw, Kpi, Mix, Sql, Stage, TopBadge, Warn, bez, clamp, pop, prog, sec} from '../kit';

// SC01 (global 0-40.5s): the multi-metric report problem -> traditional 3 queries + JOINs vs ONE conditional single-pass scan.
// Voiceover anchors (s): 1.3 report | 4.4 completed | 6.5 returned | 8.0 cancelled | 11.3 traditional | 15.5 JOINs | 19.2 three reads
// 20.4 smart solution | 24.3 "Conditional Aggregation" | 26 "single pass" | 29.3 "Single-Pass Scan" | 30.5 one trip | 35.1 saves 70%
const S = START.s1;
const t = (g: number) => sec(g - S);

const LX = 90;
const LW = 1740;
const TOP_Y = 180;
const TOP_H = 340;
const BOT_Y = 545;
const BOT_H = 380;

const QUERIES = [
  {txt: "SELECT SUM(total_amount) WHERE status = 'Completed'", at: 11.4},
  {txt: "SELECT SUM(total_amount) WHERE status = 'Returned'", at: 12.8},
  {txt: "SELECT COUNT(*) WHERE status = 'Cancelled'", at: 14.2},
];
const Q_CY = [282, 364, 446];
const TOP_CARD_Y = [235, 330, 425];
const BOT_CARD_Y = [588, 688, 788];
const KPI_AT = [4.4, 6.5, 8.0];
const KPIS = [
  {label: 'completed_sales', ar: 'المبيعات المكتملة', color: C.green},
  {label: 'returned_amount', ar: 'المبالغ المرتجعة', color: C.amber},
  {label: 'cancelled_orders', ar: 'الطلبات الملغاة', color: C.red},
];

const TBL_X = 130;
const TBL_Y = 612; // header top
const ROW_Y0 = TBL_Y + 34;
const ROW_H = 26;
const SCAN_AT = 26.6;
const SCAN_DUR = 3.6;
const FLY = 0.9; // seconds a data bubble needs to reach its card

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const lanes = prog(f, 0, 24);
  const smart = prog(f, t(20.4), 22);
  const topOp = 1 - 0.62 * smart;
  const reads = [t(16.4), t(17.8), t(19.15)].filter((x) => f >= x).length;
  const joinP = pop(f, t(15.5));
  const topValues = f >= t(19.7);
  const readFlash = prog(f, t(19.15), 10) * (1 - prog(f, t(21), 20));

  // single-pass scan
  const scanP = clamp((f - t(SCAN_AT)) / sec(SCAN_DUR));
  const laserY = ROW_Y0 + scanP * ROW_H * ORDERS.length;
  const scanning = scanP > 0 && scanP < 1;
  const launch = (i: number) => t(SCAN_AT) + ((i + 0.5) / ORDERS.length) * sec(SCAN_DUR);
  const idx = (s: string) => (s === 'Completed' ? 0 : s === 'Returned' ? 1 : 2);
  const arrived = ORDERS.filter((o) => f >= launch(o.id - 1) + sec(FLY));
  const vals = [
    arrived.filter((o) => o.status === 'Completed').reduce((a, o) => a + o.amount, 0),
    arrived.filter((o) => o.status === 'Returned').reduce((a, o) => a + o.amount, 0),
    arrived.filter((o) => o.status === 'Cancelled').length,
  ];
  const lastArr = [0, 1, 2].map((k) => {
    const a = ORDERS.filter((o) => idx(o.status) === k && f >= launch(o.id - 1) + sec(FLY)).map((o) => launch(o.id - 1) + sec(FLY));
    return a.length ? Math.max(...a) : -999;
  });
  const glows = lastArr.map((l) => (l < 0 ? 0 : clamp(1 - (f - l) / 16)));
  const tag1 = pop(f, t(24.3));
  const tag2 = pop(f, t(29.34));
  const save = prog(f, t(35.1), 26);
  const ring = prog(f, t(35.6), sec(1.4));
  const pathsOp = 0.14 * (1 - 0.7 * save);

  return (
    <Stage dur={1215} inFx="none" outFx="zoom">
      <TopBadge text="التجميع الشرطي المتقدم | Single-Pass Conditional Aggregation" from={t(2)} to={t(18)} />

      {/* ---------------- lane frames */}
      <div style={{opacity: lanes}}>
        <div style={{position: 'absolute', left: LX, top: TOP_Y, width: LW, height: TOP_H, borderRadius: 26, background: 'rgba(30,41,59,0.55)', border: `2px solid ${C.red}`, opacity: topOp}} />
        <div style={{position: 'absolute', left: LX, top: BOT_Y, width: LW, height: BOT_H, borderRadius: 26, background: 'rgba(30,41,59,0.55)', border: `2px solid ${smart > 0.5 ? C.blue : C.border}`, boxShadow: smart > 0.5 ? `0 0 40px ${C.blue}22` : 'none'}} />
      </div>

      {/* ---------------- TOP lane: traditional */}
      <div style={{opacity: topOp * lanes}}>
        <div style={{position: 'absolute', left: LX + 30, top: TOP_Y + 16}}>
          <Chip color={C.red} style={{fontSize: 21}}>
            <Mix>الطريقة التقليدية</Mix> · 3 queries + JOINs
          </Chip>
        </div>
        <Disk x={140} y={262} color={C.red} label="orders" glow={readFlash} />
        <div dir="ltr" style={{position: 'absolute', left: 120, top: 452, width: 190, textAlign: 'center', fontFamily: MONO, fontSize: 20, color: C.red}}>
          DISK READS <span style={{fontSize: 34, fontWeight: 700, color: reads === 3 ? C.red : C.text}}>{reads}×</span>
        </div>

        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {QUERIES.map((q, i) => (
            <g key={i}>
              <Draw d={`M 275 340 C 340 340, 350 ${Q_CY[i]}, 410 ${Q_CY[i]}`} p={prog(f, t(q.at), 18)} color={C.red} width={3} opacity={0.7} />
              {f >= t([16.4, 17.8, 19.15][i]) && f < t([16.4, 17.8, 19.15][i]) + sec(0.9) ? (
                <circle cx={275 + 135 * prog(f, t([16.4, 17.8, 19.15][i]), sec(0.9))} cy={340 + (Q_CY[i] - 340) * prog(f, t([16.4, 17.8, 19.15][i]), sec(0.9))} r={9} fill={C.red} />
              ) : null}
              <Draw d={`M 1070 ${Q_CY[i]} L 1290 ${TOP_CARD_Y[i] + 42}`} p={prog(f, t(15.5 + i * 0.25), 18)} color={C.amber} width={3} opacity={0.75} />
            </g>
          ))}
        </svg>

        {QUERIES.map((q, i) => {
          const p = pop(f, t(q.at));
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 410, top: Q_CY[i] - 32, width: 660, height: 64, borderRadius: 14, background: C.deep, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', fontFamily: MONO, fontSize: 19, opacity: clamp(p), transform: `scale(${0.9 + 0.1 * clamp(p)})`}}>
              <span style={{color: C.red, fontWeight: 700}}>Q{i + 1}</span>
              <Sql text={q.txt} />
            </div>
          );
        })}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 1135, top: (Q_CY[i] + TOP_CARD_Y[i] + 42) / 2 - 18, opacity: clamp(joinP)}}>
            <Chip color={C.amber} style={{fontSize: 16, padding: '2px 12px'}}>JOIN</Chip>
          </div>
        ))}
        {KPIS.map((k, i) => (
          <Kpi key={k.label} x={1290} y={TOP_CARD_Y[i]} label={k.label} ar={k.ar} color={k.color} p={pop(f, t(KPI_AT[i]))} value={topValues ? String([TOTAL_COMPLETED, TOTAL_RETURNED, COUNT_CANCELLED][i]) : '—'} />
        ))}
        <div style={{position: 'absolute', left: LX + 1380, top: TOP_Y + 16, opacity: prog(f, t(19.15), 14)}}>
          <Chip color={C.red} style={{fontSize: 20}}>
            <Warn size={22} /> slow · RAM heavy
          </Chip>
        </div>
      </div>

      {/* ---------------- BOTTOM lane: single pass */}
      <div style={{opacity: lanes}}>
        <div style={{position: 'absolute', left: LX + 30, top: BOT_Y + 14, opacity: 0.35 + 0.65 * smart}}>
          <Chip color={C.blue} style={{fontSize: 21}}>
            <Mix>المسار الذكي</Mix> · Single-Pass
          </Chip>
        </div>

        {/* orders table */}
        <div dir="ltr" style={{position: 'absolute', left: TBL_X, top: TBL_Y, width: 520, fontFamily: MONO, fontSize: 17, opacity: 0.45 + 0.55 * smart}}>
          <div style={{display: 'flex', height: 34, alignItems: 'center', color: C.muted, borderBottom: `2px solid ${C.border}`, paddingLeft: 12}}>
            <div style={{width: 70}}>id</div>
            <div style={{width: 200}}>status</div>
            <div style={{width: 140}}>total_amount</div>
          </div>
          {ORDERS.map((o, i) => {
            const rowY = ROW_Y0 + i * ROW_H;
            const seen = laserY > rowY + ROW_H * 0.5 && scanP > 0;
            const hot = scanning && Math.abs(laserY - (rowY + ROW_H / 2)) < ROW_H * 0.6;
            return (
              <div key={o.id} style={{display: 'flex', height: ROW_H, alignItems: 'center', paddingLeft: 12, background: hot ? `${statusColor(o.status)}44` : seen ? `${statusColor(o.status)}18` : 'transparent', color: seen ? C.text : C.muted, borderRadius: 6}}>
                <div style={{width: 70}}>{o.id}</div>
                <div style={{width: 200, color: seen ? statusColor(o.status) : C.muted, fontWeight: seen ? 700 : 400}}>{o.status}</div>
                <div style={{width: 140}}>{o.amount}</div>
              </div>
            );
          })}
        </div>

        {/* laser */}
        {scanning || (scanP >= 1 && f < t(31.5)) ? (
          <div style={{position: 'absolute', left: TBL_X - 16, top: laserY - 2, width: 552, height: 4, background: C.blue, borderRadius: 2, boxShadow: `0 0 22px 6px ${C.blue}88`, opacity: scanP >= 1 ? 1 - prog(f, t(30.2), 12) : 1}} />
        ) : null}

        {/* fan-out curves + bubbles */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {ORDERS.map((o, i) => {
            const y0 = ROW_Y0 + i * ROW_H + ROW_H / 2;
            const k = idx(o.status);
            const y3 = BOT_CARD_Y[k] + 42;
            const lf = launch(i);
            const p = clamp((f - lf) / sec(FLY));
            const show = f >= lf && p < 1;
            const e = prog(f, lf, sec(FLY));
            return (
              <g key={o.id}>
                <path d={`M 660 ${y0} C 920 ${y0}, 1020 ${y3}, 1290 ${y3}`} fill="none" stroke={statusColor(o.status)} strokeWidth={2} opacity={f >= lf ? pathsOp : 0} />
                {show ? (
                  <g>
                    <circle cx={bez(e, 660, 920, 1020, 1290)} cy={bez(e, y0, y0, y3, y3)} r={17} fill={statusColor(o.status)} opacity={0.25} />
                    <circle cx={bez(e, 660, 920, 1020, 1290)} cy={bez(e, y0, y0, y3, y3)} r={8} fill={statusColor(o.status)} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* concept tags */}
        <div style={{position: 'absolute', left: 740, top: 560, opacity: clamp(tag1), transform: `scale(${0.9 + 0.1 * clamp(tag1)})`, transformOrigin: 'left center'}}>
          <Chip color={C.blue} style={{fontSize: 22}}>Conditional Aggregation</Chip>
        </div>
        <div style={{position: 'absolute', left: 740, top: 604, opacity: clamp(tag2), transform: `scale(${0.9 + 0.1 * clamp(tag2)})`, transformOrigin: 'left center'}}>
          <Chip color={C.green} style={{fontSize: 22}}>Single-Pass Scan · 1× READ</Chip>
        </div>

        {/* KPI cards */}
        {KPIS.map((k, i) => (
          <Kpi key={k.label} x={1290} y={BOT_CARD_Y[i]} label={k.label} ar={k.ar} color={k.color} p={smart} glow={glows[i]} value={scanP > 0 ? String(vals[i]) : '—'} />
        ))}

        {/* savings card */}
        <div style={{position: 'absolute', left: 740, top: 670, width: 490, height: 235, borderRadius: 24, background: C.deep, border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}33`, opacity: save, transform: `translateY(${(1 - save) * 30}px)`}}>
          <svg width={190} height={190} viewBox="0 0 190 190" style={{position: 'absolute', left: 24, top: 22}}>
            <circle cx={95} cy={95} r={76} fill="none" stroke={C.border} strokeWidth={16} />
            <circle cx={95} cy={95} r={76} fill="none" stroke={C.green} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - 0.7 * ring} transform="rotate(-90 95 95)" />
            <text x={95} y={108} textAnchor="middle" fontFamily={MONO} fontSize={42} fontWeight={700} fill={C.text}>{`-${Math.round(70 * ring)}%`}</text>
          </svg>
          <div dir="ltr" style={{position: 'absolute', left: 240, top: 34, right: 20}}>
            <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>CPU · RAM · I/O</div>
            <Mix style={{display: 'block', fontSize: 30, fontWeight: 700, color: C.text, marginTop: 10, lineHeight: 1.3}}>توفير +70% من جهد السيرفر والذاكرة</Mix>
            <div style={{fontFamily: MONO, fontSize: 19, color: C.muted, marginTop: 12}}>1 scan instead of 3</div>
          </div>
        </div>
      </div>

      <Caption text="Single Table Scan ──► Computes Multiple Conditional Metrics Simultaneously" from={t(22)} to={t(38)} />
    </Stage>
  );
};
