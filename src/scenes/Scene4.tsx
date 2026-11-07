import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Card} from '../components/Card';
import {Code, CodeLine} from '../components/Code';
import {appear} from '../components/Text';
import {Tag} from '../components/Tag';
import {eo, fmt, prog, pulse} from '../lib/anim';

const S = TL.cues.sc04;
const CODE: CodeLine[] = [{text: 'EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, SUM(total_amount) FROM store_orders GROUP BY 1;', at: S.typeT, dt: 0.035}];

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const en = appear(t, TL.scenes[3].start + 0.3, TL.scenes[3].start + 1.3);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const hp = eo(prog(t, S.hit, S.hit + 3));
  const rp = prog(t, S.read, S.read + 6);
  const hits = Math.round(482 * hp), reads = Math.round(12 * rp);
  const litH = Math.floor(60 * hp), litR = Math.floor(12 * rp);
  const flows: React.ReactNode[] = [];
  if (t > S.read) for (let i = 0; i < 4; i++) {
    const u = ((t - S.read) * 0.45 + i / 4) % 1;
    flows.push(<rect key={i} x={1000 + 150 - u * 560} y={760 - Math.sin(u * Math.PI) * 120} width="30" height="30" rx="6" fill={D.key} opacity={1 - Math.abs(u - 0.5) * 0.6} style={{filter: `drop-shadow(0 0 8px ${D.key})`}} />);
  }
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="EXPLAIN (ANALYZE, BUFFERS)" body="──► Inspects RAM & Disk I/O Activity" color={D.code} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Shared Hit (RAM Speed)" body="vs Shared Read (Disk Physical I/O)" color={D.key} size={27} /></div>
      <div style={{opacity: en}}><Code lines={CODE} t={t} x={60} y={190} w={1800} h={130} title="buffers.sql" fontSize={26} lineH={56} /></div>
      <div style={{position: 'absolute', left: 60, top: 345, width: 1800, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: C.text, opacity: appear(t, S.hit - 0.5, S.hit + 0.3)}}>Buffers: <span style={{color: D.code}}>shared hit={hits}</span> <span style={{color: D.key}}>read={reads}</span></div>

      <Card x={60} y={430} w={860} h={390} c={D.code} glow={18 + 14 * warm * hp} op={en}>
        <div style={{padding: '20px 30px', display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.code}}><span>RAM · Shared Buffers</span><span>hit = {fmt(hits)}</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, padding: '0 30px'}}>
          {Array.from({length: 60}).map((_, i) => <div key={i} style={{height: 40, borderRadius: 8, background: i < litH ? D.code : 'rgba(255,255,255,0.07)', boxShadow: i < litH && i >= litH - 3 ? `0 0 14px ${D.code}` : undefined}} />)}
        </div>
        <div style={{padding: '14px 30px', fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color: C.dim, direction: 'rtl'}}>قراءة خاطفة من الذاكرة (كل مربع ≈ 8 صفحات)</div>
      </Card>
      <Card x={1000} y={430} w={860} h={390} c={D.key} glow={18 + 14 * warm * rp} op={en}>
        <div style={{padding: '20px 30px', display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.key}}><span>Disk · Physical I/O</span><span>read = {reads}</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, padding: '10px 30px'}}>
          {Array.from({length: 12}).map((_, i) => <div key={i} style={{height: 70, borderRadius: 12, background: i < litR ? D.key : 'rgba(255,255,255,0.07)', boxShadow: i < litR && i >= litR - 1 ? `0 0 16px ${D.key}` : undefined}} />)}
        </div>
        <div style={{padding: '14px 30px', fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color: C.dim, direction: 'rtl'}}>صفحات اضطر المحرك يجيبها من القرص الصلب</div>
      </Card>
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>{flows}</svg>
      <div style={{position: 'absolute', left: 60, top: 860, width: 1800, opacity: appear(t, S.read + 1, S.read + 2)}}>
        <div style={{display: 'flex', height: 34, borderRadius: 17, overflow: 'hidden'}}><div style={{width: '97.6%', background: D.code}} /><div style={{width: '2.4%', background: D.key}} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24}}><span style={{color: D.code}}>97.6% RAM hits</span><span style={{color: D.key}}>2.4% disk reads</span></div>
      </div>
    </div>
  );
};
