// SC03 — Non-Volatile Upgrades: INDEX vs OFFSET, XLOOKUP, TODAY cache (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {REPLACEMENTS} from '../data';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // Each replacement reveals sequentially
  const replP = (i: number) => interpolate(local, [0 + i * 360, 60 + i * 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Single-cell TODAY cache animation
  const cacheP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1200, 1320], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Non-Volatile Upgrades ──► Replace OFFSET with INDEX & INDIRECT with Tables/XLOOKUP" from={60} to={630} color={C.purple} />

      {/* Three replacement cards */}
      <div style={{position: 'absolute', left: 80, top: 180, right: 80}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {REPLACEMENTS.map((r, i) => {
            const p = replP(i);
            return (
              <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: C.card, border: `2px solid ${r.goodColor}`, borderRadius: 12, padding: 22, boxShadow: `0 0 25px ${r.goodColor}33`}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14}}>
                  <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.text}}>{r.desc}</div>
                  <div style={{padding: '6px 14px', background: `${r.goodColor}22`, border: `1px solid ${r.goodColor}`, borderRadius: 999, fontFamily: MONO, fontSize: 12, color: r.goodColor, fontWeight: 700}}>
                    {i + 1} / 3
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  {/* BAD: volatile */}
                  <div style={{flex: 1, padding: 18, background: C.deep, border: `2px solid ${r.badColor}`, borderRadius: 10, position: 'relative'}}>
                    <div style={{position: 'absolute', top: -10, left: 16, padding: '2px 10px', background: r.badColor, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{r.badLabel}</div>
                    <div style={{fontFamily: MONO, fontSize: 24, color: r.badColor, fontWeight: 700, marginTop: 8, textDecoration: 'line-through', textDecorationColor: r.badColor, textDecorationThickness: '2px'}}>
                      {r.bad}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg width="50" height="40" viewBox="0 0 50 40"><path d="M5 20 H40 M30 8 L42 20 L30 32" fill="none" stroke={r.goodColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>

                  {/* GOOD: non-volatile */}
                  <div style={{flex: 1.2, padding: 18, background: C.deep, border: `2px solid ${r.goodColor}`, borderRadius: 10, position: 'relative', boxShadow: `0 0 15px ${r.goodColor}44`}}>
                    <div style={{position: 'absolute', top: -10, left: 16, padding: '2px 10px', background: r.goodColor, color: '#0B1222', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{r.goodLabel}</div>
                    <div style={{fontFamily: MONO, fontSize: 24, color: r.goodColor, fontWeight: 700, marginTop: 8}}>
                      {r.good}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Single-cell cache visualization */}
      <div style={{position: 'absolute', left: 80, top: 720, right: 80, opacity: cacheP, padding: 20, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, boxShadow: `0 0 30px ${C.purple}33`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.purple}}>{'Single-Cell Cache:'}</div>
          <div style={{padding: '12px 20px', background: C.deep, border: `2px solid ${C.purple}`, borderRadius: 8, fontFamily: MONO, fontSize: 22, color: C.purple, fontWeight: 700}}>
            {'$B$1 = TODAY()'}
          </div>
          <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10 H32 M22 2 L32 10 L22 18" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" /></svg>
          <div style={{fontFamily: FONT, fontSize: 16, color: C.green}}>
            {'1 recalc instead of 50,000 → 500x faster'}
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={sealP} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>{'Single-Cell Caching ──► Isolate TODAY() in 1 Header Cell Instead of 50,000 Rows'}</Mix>
        </div>
      </div>

      <Caption text="Non-Volatile Upgrades ──► Replace OFFSET with INDEX & INDIRECT with Tables/XLOOKUP" from={60} to={630} tone="normal" />
      <Caption text="Single-Cell Date Caching ──► Isolate TODAY() in 1 Header Cell ($B$1) Instead of 50,000 Rows" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
