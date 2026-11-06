import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_LOCK_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Inventory Concurrency — FOR UPDATE protects stock deduction
// Anchors: 171.0 enterprise | 175.0 inventory | 180.0 FOR UPDATE | 185.0 stock | 192.0 commit | 200.0 module 13 seal | 205.0 complete
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const reportP = clamp(lin(f, t(175), 14));
  const invP = clamp(lin(f, t(180), 14));
  // Stock decrement animation (FOR UPDATE locks row, then UPDATE deducts)
  const stockProg = clamp(lin(f, t(185), sec(8)));
  // Commit animation
  const commitProg = clamp(lin(f, t(192), sec(8)));
  const sealP = pop(f, t(200));
  const doneP = pop(f, t(205));

  // Interpolated stock values
  const stockBefore = 7;
  const stockAfter = lerp(7, 6, stockProg);

  // Concurrent TX attempting double-allocation (blocked)
  const tx2BlockP = clamp(lin(f, t(190), sec(4)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="تطبيق مؤسسي | Enterprise Inventory Concurrency — FOR UPDATE Stock Protection" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Editor with enterprise inventory lock transaction */}
      <Editor
        x={80}
        y={170}
        w={880}
        h={320}
        title="Enterprise · Inventory lock transaction (manzooma_store_db)"
        lines={ENTERPRISE_LOCK_LINES.concat([
          '',
          '-- FOR UPDATE locks product_id = 502',
          '-- stock deduction atomic & serialized',
        ])}
        start={t(171.5)}
        cps={0.55}
        size={15}
        accent={C.green}
        hl={2}
        hlColor={C.purple}
      />

      {/* RIGHT: Executive report panel */}
      <Win x={1000} y={170} w={840} h={320} title="executive report · inventory concurrency" accent={C.green} opacity={reportP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Inventory Lock · Module 13 Concurrency Capstone
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>FOR UPDATE</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>stock -1</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>no double-alloc ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>MVCC reads</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>COMMIT ✓</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 110, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.5}}>
          <span style={{color: '#64748B'}}>transaction strategy:</span> BEGIN ──► SELECT ... FOR UPDATE locks the row ──► UPDATE stock_qty = stock_qty - 1 ──► COMMIT. Other concurrent TXs block until lock released ──► zero double-allocation.
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 200, display: 'flex', gap: 12}}>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700}}>Product 502</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>stock: {stockBefore} → {stockAfter}</div>
          </div>
          <div style={{flex: 1, padding: '10px 12px', border: `2px solid ${C.purple}`, borderRadius: 10, background: `${C.purple}0d`}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.purple, fontWeight: 700}}>FOR UPDATE</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>row locked ✓</div>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.text, fontWeight: 700}}>
            atomic inventory block ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={36} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700}}>Module 13 Mastery Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* BOTTOM: Inventory execution panel */}
      <Win x={80} y={510} w={1760} h={380} title="inventory execution ──► stock updates safely · no double-allocation" accent={C.green} opacity={invP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          TX1 (FOR UPDATE) deducts stock ──► TX2 blocked ──► COMMIT ✓ ──► no oversell
        </div>

        {/* Two panels: TX1 success path / TX2 blocked */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 56, display: 'flex', gap: 18}}>
          {/* TX1 success path */}
          <div style={{flex: 1, padding: '16px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(pop(f, t(180))), boxShadow: commitProg > 0.6 ? `0 0 24px ${C.green}44` : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>TX1 · stock deduction (success path)</span>
              <Check p={1} size={28} color={C.green} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>steps:</div>
            <div dir="ltr" style={{padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 90, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`1. BEGIN;
2. SELECT ... FOR UPDATE;  ──► row 502 locked 🔒
3. UPDATE stock_qty = stock_qty - 1;
4. COMMIT;   ──► lock released ✓  (stock: ${stockBefore} → ${stockAfter})`}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
              <span>stock decremented</span>
              <span style={{color: C.green, fontWeight: 700}}>atomic ✓</span>
            </div>
            <div style={{height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(20, stockProg * 100)}%`, background: C.green, borderRadius: 7}} />
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>→ product 502 stock: {stockBefore} → {stockAfter} · COMMIT ✓</div>
          </div>

          {/* Arrow divider */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: 80}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, textAlign: 'center'}}>concurrent</div>
            <svg width={60} height={60}>
              <line x1={30} y1={10} x2={30} y2={50} stroke={C.amber} strokeWidth={3} />
              <polygon points="22,18 22,30 14,24" fill={C.green} />
              <polygon points="38,18 38,30 46,24" fill={C.red} />
            </svg>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, textAlign: 'center'}}>TX1 / TX2</div>
          </div>

          {/* TX2 blocked path */}
          <div style={{flex: 1, padding: '16px', border: `2px solid ${C.red}`, borderRadius: 14, background: `${C.red}0d`, opacity: clamp(pop(f, t(190)))}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <span style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>TX2 · concurrent deduction (blocked)</span>
              <svg width={28} height={28} viewBox="0 0 28 28">
                <circle cx={14} cy={14} r={12} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} />
                <line x1={8} y1={8} x2={20} y2={20} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
                <line x1={20} y1={8} x2={8} y2={20} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
              </svg>
            </div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>blocked:</div>
            <div dir="ltr" style={{padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, minHeight: 90, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 14}}>
              {`1. BEGIN;
2. SELECT ... FOR UPDATE;  ──► row 502 LOCKED by TX1
3. ⏳ TX2 BLOCKED ──► waiting for row lock
4. ↻ after TX1 COMMIT ──► re-read stock (${stockAfter})
5. UPDATE stock_qty = stock_qty - 1;`}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, color: C.muted, marginBottom: 4}}>
              <span>queued behind TX1</span>
              <span style={{color: C.red, fontWeight: 700}}>serialized ✓</span>
            </div>
            <div style={{height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(20, tx2BlockP * 100)}%`, background: C.amber, borderRadius: 7}} />
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700}}>→ no double-allocation · no oversell · zero lost updates ✓</div>
          </div>
        </div>

        {/* Module 13 Mastery Seal */}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Check p={sealP} size={42} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 13 Mastery Seal ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Row-Level &amp; Table-Level Locking · MVCC · SKIP LOCKED · Deadlock 40P01 · all mastered</div>
            </div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}66`}}>
            Capstone ✓
          </div>
        </div>
      </Win>

      {/* Complete seal badge bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(doneP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={doneP} size={32} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 13 Complete · Enterprise Inventory Protected ✓</div>
        </div>
      </div>

      <Caption text="Enterprise Lock ──► FOR UPDATE on product 502 ──► stock -1 ──► COMMIT ✓ ──► No Double-Allocation" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
