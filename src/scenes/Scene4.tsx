import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Disk, Kpi, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (129.7-168.9s): Seq Scan floods Shared Buffers; Index Scan reads only a few pages.
// Anchors (s): 130.0 PostgreSQL 16 internals | 139.5 unindexed rows requested | 147.5 cache misses | 150.9 Index / Bitmap Index Scan
const S = START.s4;
const t = (g: number) => sec(g - S);
const COLS = 8;
const N = 40;
const IDX = [5, 14, 27];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const fix = t(150.9);
  const flood = (i: number) => t(139.5 + i * 0.27);
  const misses = f < t(139.5) ? 0 : Math.min(N, Math.floor((f - t(139.5)) / sec(0.27)) + 1);
  const fixed = f >= fix;
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  return (
    <Stage dur={1177} inFx="up" outFx="morph">
      <TopBadge text="كواليس PostgreSQL 16 | Shared Buffers" from={sec(1)} to={sec(37)} color={C.purple} />

      <Win x={80} y={180} w={1000} h={700} title="Shared Buffers · 40 slots" accent={fixed ? C.green : misses > 0 ? C.red : C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 14, display: 'flex', gap: 14}}>
          <Chip color={C.blue} style={{fontSize: 18, padding: '3px 14px'}}>hot data</Chip>
          <Chip color={C.red} style={{fontSize: 18, padding: '3px 14px'}}>Seq Scan page</Chip>
          <Chip color={C.green} style={{fontSize: 18, padding: '3px 14px'}}>Index Scan page</Chip>
        </div>
        {Array.from({length: N}, (_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const red = !fixed && f >= flood(i);
          const flash = !fixed && f >= flood(i) && f < flood(i) + 9;
          const idx = fixed && IDX.includes(i);
          const col = idx ? C.green : red ? C.red : C.blue;
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 30 + c * 118, top: 70 + r * 104, width: 100, height: 78, borderRadius: 12, border: `3px solid ${flash ? C.amber : col}`, background: `${col}${idx ? '55' : red ? '40' : '22'}`, boxShadow: idx ? `0 0 ${22 * pulse}px ${C.green}` : flash ? `0 0 18px ${C.amber}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>
              P{i + 1}
            </div>
          );
        })}
      </Win>

      <Disk x={1150} y={190} w={130} h={150} color={misses > 0 && !fixed ? C.red : fixed ? C.green : C.muted} label="heap pages" glow={misses > 0 && !fixed ? 1 : 0} />
      <div style={{position: 'absolute', left: 1330, top: 236, opacity: clamp(pop(f, t(130.4)))}}><Chip color={C.purple} style={{fontSize: 24}}>Heap Pages → 8KB</Chip></div>
      <div style={{position: 'absolute', left: 1330, top: 300, opacity: clamp(pop(f, t(133)))}}><Chip color={C.blue} style={{fontSize: 24}}>Buffer Manager</Chip></div>
      <Kpi x={1120} y={420} w={720} label="Cache Misses" ar="فشل الذاكرة المؤقتة" value={String(misses)} color={C.red} p={lin(f, t(139.5), 14)} glow={misses > 0 && !fixed ? 1 : 0} />
      <Kpi x={1120} y={530} w={720} label="Index Scan · pages read" ar="صفحات معدودة فقط" value="3" color={C.green} p={lin(f, fix, 14)} glow={clamp(lin(f, fix, 14))} />
      <div style={{position: 'absolute', left: 1120, top: 650, opacity: clamp(pop(f, t(147.5)))}}><Chip color={C.amber} style={{fontSize: 24}}>useful data evicted from cache</Chip></div>
      <div style={{position: 'absolute', left: 1120, top: 720, opacity: clamp(pop(f, fix + 12))}}><Chip color={C.green} style={{fontSize: 24}}>Seq Scan → Index / Bitmap Index Scan</Chip></div>

      <Caption text="Shared Buffers Impact ──► Seq Scan Floods Buffer Cache & Causes Heavy Evictions" from={t(132)} to={t(148)} tone="danger" />
      <Caption text="Targeted Index Scans ──► Reads Only Specific Pages, Preserving Memory Efficiency" from={t(151)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
