import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_AMOUNTS} from '../data';

// SC04 (130-170s): PostgreSQL 16 Engine — In-Memory Offset Buffering in work_mem
// Anchors (s): 131.0 engine | 136.0 work_mem | 140.0 WindowAgg | 145.0 pointers buffer | 150.0 single pass | 155.0 LAG LEAD | 160.0 zero disk | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const bufferP = clamp(lin(f, t(140), 16));
  const pointerP = clamp(lin(f, t(150), 16));
  const sealP = pop(f, t(160));

  // Pointer animation: LAG pointer moves backward, LEAD pointer moves forward
  const pointerProg = clamp(lin(f, t(151), sec(12)));
  const currentSlot = Math.floor(pointerProg * (DAILY_AMOUNTS.length - 1));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | In-Memory Offset Buffering" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={160}
          title="EXPLAIN · Window Function with LAG/LEAD"
          lines={[
            'WindowAgg  (cost=42.50..42.80 rows=12 width=24)',
            '  ->  Sort  (cost=42.20..42.35 rows=12 width=16)',
            '        Sort Key: order_date',
            '        ->  Seq Scan on daily_revenue',
          ]}
          start={t(131.5)}
          cps={1.0}
          size={18}
          accent={C.blue}
          hl={f >= t(140) ? 0 : -1}
          hlColor={C.blue}
        />
      </div>

      {/* work_mem buffer visualization */}
      <PipeNode x={80} y={340} w={1200} h={440} label="work_mem · In-Memory Buffer" sublabel="WindowAgg Node · ordered rows + pointer array" color={C.blue} p={bufferP} glow={f >= t(140)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          sorted rows buffered in RAM · zero disk I/O
        </div>
        {/* Memory slots — each slot holds a row */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {DAILY_AMOUNTS.map((row, i) => {
            const isCurrent = i === currentSlot;
            const isLAGTarget = i === currentSlot - 1 && pointerProg > 0 && pointerProg < 1;
            const isLEADTarget = i === currentSlot + 1 && pointerProg > 0 && pointerProg < 1;
            const inBuffer = i <= currentSlot + 1 && pointerProg > 0;
            return (
              <div key={row.day} dir="ltr" style={{width: 130, height: 90, borderRadius: 10, border: `2px solid ${isCurrent ? C.green : isLAGTarget ? C.blue : isLEADTarget ? C.amber : C.border}`, background: isCurrent ? `${C.green}22` : isLAGTarget ? `${C.blue}22` : isLEADTarget ? `${C.amber}22` : C.deep, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 16, color: C.text, opacity: inBuffer || pointerProg === 0 ? 1 : 0.4, boxShadow: isCurrent ? `0 0 16px ${C.green}` : isLAGTarget ? `0 0 16px ${C.blue}` : isLEADTarget ? `0 0 16px ${C.amber}` : 'none'}}>
                <div style={{color: C.muted, fontSize: 12}}>slot {i}</div>
                <div style={{color: C.blue, fontWeight: 700}}>{row.date}</div>
                <div style={{color: C.text, fontWeight: 700}}>${row.amount}</div>
                {isLAGTarget ? <div style={{color: C.blue, fontSize: 11, fontWeight: 700}}>◄ LAG</div> : null}
                {isLEADTarget ? <div style={{color: C.amber, fontSize: 11, fontWeight: 700}}>LEAD ►</div> : null}
                {isCurrent ? <div style={{color: C.green, fontSize: 11, fontWeight: 700}}>CURRENT</div> : null}
              </div>
            );
          })}
        </div>

        {/* Pointer arrows */}
        {pointerProg > 0 && pointerProg < 1 ? (
          <svg width={1160} height={200} style={{position: 'absolute', left: 20, top: 200, pointerEvents: 'none'}}>
            {/* LAG arrow: from current slot backward */}
            {currentSlot > 0 ? (
              <g>
                <line x1={70 + currentSlot * 138 + 65} y1={20} x2={70 + (currentSlot - 1) * 138 + 65} y2={20} stroke={C.blue} strokeWidth={3} strokeDasharray="5 3" />
                <polygon points={`${70 + (currentSlot - 1) * 138 + 65 + 6},14 ${70 + (currentSlot - 1) * 138 + 65 + 6},26 ${70 + (currentSlot - 1) * 138 + 65 - 4},20`} fill={C.blue} />
                <text x={70 + (currentSlot - 0.5) * 138 + 65} y={14} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">LAG ptr</text>
              </g>
            ) : null}
            {/* LEAD arrow: from current slot forward */}
            {currentSlot < DAILY_AMOUNTS.length - 1 ? (
              <g>
                <line x1={70 + currentSlot * 138 + 65} y1={20} x2={70 + (currentSlot + 1) * 138 + 65} y2={20} stroke={C.amber} strokeWidth={3} strokeDasharray="5 3" />
                <polygon points={`${70 + (currentSlot + 1) * 138 + 65 - 6},14 ${70 + (currentSlot + 1) * 138 + 65 - 6},26 ${70 + (currentSlot + 1) * 138 + 65 + 4},20`} fill={C.amber} />
                <text x={70 + (currentSlot + 0.5) * 138 + 65} y={14} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">LEAD ptr</text>
              </g>
            ) : null}
          </svg>
        ) : null}

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border}}>
          <span>0.0001s pointer access</span>
          <span>slot {currentSlot}/{DAILY_AMOUNTS.length - 1}</span>
        </div>
      </PipeNode>

      {/* Zero Disk I/O badge */}
      <div style={{position: 'absolute', right: 80, top: 320, width: 440, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
            <Check p={sealP} size={48} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700}}>Zero Disk I/O</div>
              <Mix style={{fontSize: 16, color: C.muted}}>بدون قراءة من القرص الصلب</Mix>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', border: `2px solid ${C.blue}`, borderRadius: 16, background: `${C.blue}0d`}}>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.blue, fontWeight: 700}}>⚡</div>
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.blue, fontWeight: 700}}>Single Pass</div>
              <Mix style={{fontSize: 16, color: C.muted}}>مسح أحادي خاطف</Mix>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', border: `2px solid ${C.amber}`, borderRadius: 16, background: `${C.amber}0d`}}>
            <div style={{fontFamily: MONO, fontSize: 28, color: C.amber, fontWeight: 700}}>RAM</div>
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.amber, fontWeight: 700}}>In-Memory</div>
              <Mix style={{fontSize: 16, color: C.muted}}>معالجة كاملة في الذاكرة</Mix>
            </div>
          </div>
        </div>
      </div>

      <Caption text="PostgreSQL Execution Engine ──► In-Memory Offset Buffering in work_mem" from={t(136)} to={t(150)} />
      <Caption text="Zero Disk I/O ──► High-Speed Pointer Access for LAG & LEAD Functions" from={t(152)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
