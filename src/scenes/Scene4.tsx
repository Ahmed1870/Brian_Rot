// SC04 — Hidden Volatility Traps: Conditional Formatting & A:A Ban (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';
import {TRAPS} from '../data';

const SC = {from: 3900, dur: 1200};

const TRAP_ICONS: Record<string, React.ReactNode> = {
  cf: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="3" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3 8 H19 M3 13 H19" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="3" width="16" height="5" fill="currentColor" opacity="0.3" /></svg>,
  dv: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M7 11 L10 14 L15 8" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
  nr: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="6" width="16" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M7 3 H15 V6 H7 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Traps reveal (0-540)
  const trapP = (i: number) => interpolate(local, [0 + i * 120, 60 + i * 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Range trimming visualization (540-840)
  const trimP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const finalSeal = interpolate(local, [1020, 1140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Hidden Volatility Traps ──► Conditional Formatting, Data Validation & Named Ranges" from={60} to={540} color={C.amber} />

      {/* TOP: 3 traps cards */}
      <div style={{position: 'absolute', left: 80, top: 180, right: 80}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
          {TRAPS.map((t, i) => {
            const p = trapP(i);
            return (
              <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 22, boxShadow: `0 0 25px ${C.amber}33`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                  <div style={{width: 48, height: 48, borderRadius: 8, background: C.deep, border: `2px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber}}>
                    {TRAP_ICONS[t.icon]}
                  </div>
                  <div>
                    <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>{t.n}</div>
                    <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{t.desc}</div>
                  </div>
                </div>
                <div style={{padding: 10, background: C.deep, borderRadius: 6, fontFamily: MONO, fontSize: 13, color: C.amber}}>
                  {'evaluated constantly'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM: Range trimming visualization */}
      <div style={{position: 'absolute', left: 80, top: 440, right: 80, opacity: trimP}}>
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 22, boxShadow: `0 0 30px ${C.amber}33`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
            <svg width="32" height="32" viewBox="0 0 32 32"><path d="M4 16 H28 M20 8 L28 16 L20 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'Bounded Range Discipline'}</div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            {/* BAD: Full column */}
            <div style={{padding: 18, background: C.deep, border: `2px solid ${C.red}`, borderRadius: 10, position: 'relative'}}>
              <div style={{position: 'absolute', top: -10, left: 14, padding: '2px 10px', background: C.red, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'BAD'}</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700, marginTop: 8, textDecoration: 'line-through', textDecorationColor: C.red}}>
                {'=$A:$A'}
              </div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginTop: 6}}>{'1,048,576 rows scanned'}</div>
              <div style={{marginTop: 12, display: 'flex', gap: 2}}>
                {Array.from({length: 50}).map((_, i) => (
                  <div key={i} style={{flex: 1, height: 4, background: i < 3 ? C.green : C.red, opacity: i < 3 ? 0.8 : 0.2}} />
                ))}
              </div>
              <div style={{marginTop: 6, fontFamily: MONO, fontSize: 11, color: C.red}}>{'3 rows of data · 1M+ empty cells checked'}</div>
            </div>

            {/* GOOD: Bounded range */}
            <div style={{padding: 18, background: C.deep, border: `2px solid ${C.green}`, borderRadius: 10, position: 'relative', boxShadow: `0 0 15px ${C.green}44`}}>
              <div style={{position: 'absolute', top: -10, left: 14, padding: '2px 10px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'GOOD'}</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, marginTop: 8}}>
                {'=$A$2:$A$50000'}
              </div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginTop: 6}}>{'50,000 active rows only'}</div>
              <div style={{marginTop: 12, display: 'flex', gap: 2}}>
                {Array.from({length: 50}).map((_, i) => (
                  <div key={i} style={{flex: 1, height: 4, background: i < 50 ? C.green : C.deep, opacity: 0.8}} />
                ))}
              </div>
              <div style={{marginTop: 6, fontFamily: MONO, fontSize: 11, color: C.green}}>{'50,000 rows of data · 0 wasted checks'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'Bounded Range Discipline ──► Trim Ranges & Ban Full-Column A:A in Arrays'}</span>
        </div>
      </div>

      <Caption text="Hidden Volatility Traps ──► Conditional Formatting, Data Validation & Named Ranges" from={60} to={540} tone="normal" />
      <Caption text="Bounded Range Discipline ──► Trim Ranges to Active Rows & Ban Full-Column A:A in Arrays" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
