import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Kpi, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC01 (0-42.5s): a sequential scan reads every page; CPU / IO saturate.
// Anchors (s): 0.2 welcome | 8.6 previous lessons | 15.6 discovering Seq Scan | 24.2 reads all pages | 30.9 CPU + memory cost
const S = START.s1;
const t = (g: number) => sec(g - S);
const ST = ['COMPLETED', 'PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'COMPLETED', 'PENDING', 'SHIPPED', 'COMPLETED', 'PENDING', 'COMPLETED'];
const ROWS = ST.map((st, i) => ({id: 1001 + i, code: String(101 + i), st, d: `2026-0${1 + (i % 9)}-${String(3 + i * 2).padStart(2, '0')}`}));
const RH = 50;

const Meter: React.FC<{y: number; label: string; ar: string; v: number; color: string; p: number}> = ({y, label, ar, v, color, p}) => (
  <div style={{position: 'absolute', left: 1200, top: y, width: 640, height: 112, borderRadius: 18, background: C.card, border: `2px solid ${v > 85 ? color : C.border}`, boxShadow: v > 85 ? `0 0 28px ${color}66` : 'none', opacity: clamp(p), padding: '14px 24px'}}>
    <div dir="ltr" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
      <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.text}}>{label} <Mix style={{fontSize: 20, color: C.muted}}>{ar}</Mix></span>
      <span style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: v > 85 ? color : C.text}}>{Math.round(v)}%</span>
    </div>
    <div style={{marginTop: 14, height: 24, borderRadius: 12, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
      <div style={{width: `${v}%`, height: '100%', background: v > 85 ? color : C.blue, borderRadius: 12}} />
    </div>
  </div>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const start = t(0.8);
  const head = f < start ? -5 : ((f - start) / 9) % (ROWS.length + 3);
  const cpu = 20 + 5 * Math.sin(f / 9) + 73 * clamp(lin(f, t(15.6), sec(8.6)));
  const io = 12 + 87 * clamp(lin(f, t(24.2), sec(6.7)));
  const pages = Math.floor(12000 * clamp(lin(f, t(24.2), sec(6.7))));
  const bad = clamp(pop(f, t(15.6)));
  const mod = clamp(pop(f, t(1.5)));
  return (
    <Stage dur={1275} inFx="zoom" outFx="zoom">
      <TopBadge text="تشخيص الاختناقات والمسح التتابعي | Identifying Bottlenecks & Sequential Scans" from={sec(2)} to={sec(18)} color={C.red} />

      <Win x={80} y={180} w={1080} h={700} title="manzooma_store_db · store_orders · heap pages" accent={head >= 0 ? C.red : C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 8, height: 44, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.muted}}>
          <span style={{width: 170}}>order_id</span>
          <span style={{width: 220}}>order_code</span>
          <span style={{width: 250}}>status</span>
          <span>order_date</span>
        </div>
        {ROWS.map((r, i) => {
          const beam = clamp(1 - Math.abs(head - (i + 0.5)) / 0.8);
          const seen = head > i ? 1 : 0;
          const a = 0.1 * seen + 0.4 * beam;
          return (
            <div key={r.id} dir="ltr" style={{position: 'absolute', left: 18, right: 18, top: 56 + i * RH, height: RH - 6, borderRadius: 10, background: `rgba(239,68,68,${a})`, border: beam > 0.3 ? `2px solid ${C.red}` : '2px solid transparent', boxShadow: beam > 0.3 ? `0 0 ${24 * beam}px ${C.red}` : 'none', display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: MONO, fontSize: 24, color: C.text}}>
              <span style={{width: 170}}>{r.id}</span>
              <span style={{width: 220}}>{r.code}</span>
              <span style={{width: 250, color: C.amber}}>{r.st}</span>
              <span style={{color: C.muted}}>{r.d}</span>
            </div>
          );
        })}
      </Win>

      <Meter y={180} label="CPU" ar="المعالج" v={cpu} color={C.red} p={1} />
      <Meter y={306} label="Disk I/O" ar="القرص" v={io} color={C.red} p={clamp(lin(f, t(8.6), 14))} />
      <div style={{position: 'absolute', left: 1200, top: 452, opacity: clamp(pop(f, t(8.6)))}}><Chip color={C.blue} style={{fontSize: 24}}>EXPLAIN ANALYZE</Chip></div>
      <div style={{position: 'absolute', left: 1480, top: 452, opacity: clamp(pop(f, t(10.4)))}}><Chip color={C.purple} style={{fontSize: 24}}>Index types</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: 1200, top: 526, width: 640, height: 92, borderRadius: 18, border: `3px solid ${C.red}`, background: `${C.red}1f`, opacity: bad, transform: `scale(${0.9 + 0.1 * bad})`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.red}}>
        <Warn size={54} /> Seq Scan Bottleneck Detected
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1200, top: 640, width: 640, height: 80, borderRadius: 18, border: `3px solid ${C.green}`, background: `${C.green}1f`, opacity: mod, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 25, fontWeight: 700, color: C.green}}>
        Module 12 · Performance Tuning
      </div>
      <Kpi x={1200} y={748} w={640} label="pages read from disk" ar="صفحات مقروءة" value={pages.toLocaleString('en-US')} color={C.red} p={lin(f, t(24.2), 14)} glow={clamp(lin(f, t(30.9), 14))} />
      <Caption text="Sequential Scan (Seq Scan) ──► Full Table Disk Scan Causing Extreme CPU/IO Bottlenecks" from={sec(24)} to={sec(40)} tone="danger" />
    </Stage>
  );
};
