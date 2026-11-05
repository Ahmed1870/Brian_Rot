import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC02 (40-85s): REFRESH vs REFRESH CONCURRENTLY — Lock Behavior
// Anchors: 41.0 refresh | 45.0 lock | 52.0 CONCURRENTLY | 60.0 background | 68.0 UNIQUE index | 75.0 safe | 80.0 condition
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  const shieldP = clamp(lin(f, t(60), 16));
  const sealP = pop(f, t(75));

  // Refresh progress animations
  const lockProg = clamp(lin(f, t(44), sec(20)));
  const concurrentProg = clamp(lin(f, t(54), sec(20)));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="آليات الإنعاش وسلوك الأقفال | REFRESH vs REFRESH CONCURRENTLY" from={sec(2)} to={sec(40)} color={C.red} />

      {/* LEFT: Standard REFRESH — blocks reads (AccessExclusiveLock) */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={130}
          title="REFRESH ──► AccessExclusiveLock"
          lines={['REFRESH MATERIALIZED VIEW mv_sales;']}
          start={t(41.5)}
          cps={0.9}
          size={20}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />
        <Win x={80} y={330} w={860} h={570} title="standard refresh · blocks all reads" accent={C.red} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
            🔒 AccessExclusiveLock — SELECT blocked
          </div>

          {/* Lock visualization */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 20}}>
            {/* Padlock icon */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <svg width={80} height={80} viewBox="0 0 80 80">
                <rect x={16} y={32} width={48} height={36} fill={C.red} stroke={C.red} strokeWidth={3} rx={6} />
                <path d="M24 32 V22 C24 12 56 12 56 22 V32" fill="none" stroke={C.red} strokeWidth={4} />
                <circle cx={40} cy={48} r={5} fill={C.deep} />
                <rect x={37} y={48} width={6} height={14} fill={C.deep} rx={2} />
              </svg>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>LOCKED</div>
            </div>

            {/* Blocked SELECT queries */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {['SELECT * FROM mv_sales;', 'SELECT * FROM mv_sales WHERE ...;', 'SELECT SUM(...) FROM mv_sales;'].map((q, i) => {
                const blocked = lockProg > i / 3;
                return (
                  <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: `2px solid ${blocked ? C.red : C.border}`, borderRadius: 8, background: blocked ? `${C.red}14` : 'transparent', fontFamily: MONO, fontSize: 14, opacity: blocked ? 1 : 0.4}}>
                    <span style={{color: blocked ? C.red : '#475569', fontWeight: 700}}>{blocked ? '✗' : '○'}</span>
                    <span style={{color: C.text, textDecoration: blocked ? 'line-through' : 'none'}}>{q}</span>
                    {blocked ? <span style={{color: C.red, fontSize: 12, marginLeft: 'auto'}}>blocked</span> : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning box */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 320, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}0d`}}>
            <Warn size={36} color={C.red} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>Read operations blocked</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>until refresh completes — production downtime risk</div>
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            ✗ REFRESH blocks reads (AccessExclusiveLock)
          </div>
        </Win>
      </div>

      {/* RIGHT: REFRESH CONCURRENTLY — non-blocking, requires UNIQUE index */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={130}
          title="REFRESH CONCURRENTLY ──► Non-Blocking"
          lines={['REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales;']}
          start={t(52.5)}
          cps={0.85}
          size={18}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />
        <Win x={980} y={330} w={860} h={570} title="concurrent refresh · reads continue" accent={C.green} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
            ✅ background refresh — zero read blocking
          </div>

          {/* Concurrent refresh visualization */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 20}}>
            {/* Background refresh sweep */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <div style={{width: 60, height: 60, borderRadius: 30, border: `3px solid ${C.blue}`, background: `${C.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: C.blue}}>↻</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700}}>refreshing</div>
            </div>

            {/* Active SELECT queries */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {['SELECT * FROM mv_sales;', 'SELECT * FROM mv_sales WHERE ...;', 'SELECT SUM(...) FROM mv_sales;'].map((q, i) => {
                const active = concurrentProg > i / 3;
                return (
                  <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: `2px solid ${active ? C.green : C.border}`, borderRadius: 8, background: active ? `${C.green}14` : 'transparent', fontFamily: MONO, fontSize: 14, opacity: active ? 1 : 0.4}}>
                    <span style={{color: active ? C.green : '#475569', fontWeight: 700}}>{active ? '✓' : '○'}</span>
                    <span style={{color: C.text}}>{q}</span>
                    {active ? <span style={{color: C.green, fontSize: 12, marginLeft: 'auto'}}>running</span> : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* UNIQUE Index requirement shield */}
          <div style={{position: 'absolute', left: 18, right: 18, top: 320, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `2px solid ${C.purple}`, borderRadius: 10, background: `${C.purple}0d`, opacity: shieldP}}>
            <div style={{fontSize: 28}}>🛡</div>
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>UNIQUE Index Required</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>must exist before CONCURRENTLY can be used</div>
            </div>
          </div>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
            ✓ CONCURRENTLY · zero read blocking (needs UNIQUE index)
          </div>
        </Win>
      </div>

      <Caption text="REFRESH ──► Blocks Reads (AccessExclusiveLock)" from={t(42)} to={t(60)} tone="danger" />
      <Caption text="REFRESH CONCURRENTLY ──► Zero Read Blocking (Requires UNIQUE Index)" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
