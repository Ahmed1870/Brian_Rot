// SC04 — Ghost Formatting Cleanup & .xlsb Binary Compression (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';
import {FILE_SIZES} from '../data';

const SC = {from: 3900, dur: 1200};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Ctrl+End ghost detection (0-240)
  const ghostP = interpolate(local, [0, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Check Performance cleanup (240-540)
  const cleanP = interpolate(local, [240, 420], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // .xlsb compression (540-900)
  const xlsbP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const finalSeal = interpolate(local, [1020, 1140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Eliminate Ghost Formatting ──► Detect via Ctrl+End & Clean UsedRange with Check Performance" from={60} to={540} color={C.amber} />

      {/* LEFT: Ghost UsedRange detection */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 680, opacity: ghostP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{padding: '8px 16px', background: C.amber, color: '#0B1222', borderRadius: 6, fontFamily: MONO, fontSize: 16, fontWeight: 700, border: `2px solid ${C.amber}`}}>Ctrl</div>
          <span style={{fontFamily: FONT, fontSize: 18, color: C.muted}}>+</span>
          <div style={{padding: '8px 16px', background: C.amber, color: '#0B1222', borderRadius: 6, fontFamily: MONO, fontSize: 16, fontWeight: 700, border: `2px solid ${C.amber}`}}>End</div>
          <span style={{fontFamily: FONT, fontSize: 18, color: C.muted, marginLeft: 8}}>{'→ كشف التضخم'}</span>
        </div>

        <div style={{background: C.card, border: `2px solid ${cleanP > 0.3 ? C.green : C.red}`, borderRadius: 12, padding: 22, height: 560, boxShadow: `0 0 30px ${cleanP > 0.3 ? C.green : C.red}33`}}>
          {/* Ghost cell indicator */}
          <div style={{position: 'relative', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, height: 200}}>
            <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: cleanP > 0.3 ? C.green : C.red, marginBottom: 10}}>
              {cleanP > 0.3 ? '✓ Cleaned UsedRange' : '⚠ Ghost formatting detected'}
            </div>

            {/* Mini grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 2, fontFamily: MONO, fontSize: 9}}>
              {Array.from({length: 80}).map((_, i) => {
                const row = Math.floor(i / 20);
                const col = i % 20;
                const hasData = row < 3 && col < 6;
                const isGhost = !hasData && cleanP < 0.5;
                const isCleaned = !hasData && cleanP > 0.5;
                return (
                  <div key={i} style={{
                    padding: '4px 2px',
                    background: hasData ? C.green : isGhost ? `${C.red}22` : C.bg,
                    border: `1px solid ${hasData ? C.green : isGhost ? C.red : 'transparent'}`,
                    color: hasData ? '#0B1222' : isGhost ? C.red : C.muted,
                    textAlign: 'center',
                    fontSize: 8,
                  }}>
                    {hasData ? '●' : isGhost ? '⋯' : ''}
                  </div>
                );
              })}
            </div>

            {/* Cursor jump indicator */}
            {ghostP > 0.5 && cleanP < 0.5 && (
              <div style={{position: 'absolute', right: 12, bottom: 12, padding: '6px 12px', background: C.red, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                {'XFD1048576'}
              </div>
            )}
            {cleanP > 0.5 && (
              <div style={{position: 'absolute', right: 12, bottom: 12, padding: '6px 12px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                {'F50 ← cleaned'}
              </div>
            )}
          </div>

          {/* Check Performance button */}
          <div style={{marginTop: 18, padding: 16, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
              <div style={{width: 40, height: 40, borderRadius: 8, background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L8 16 L19 5" fill="none" stroke="#0B1222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.amber}}>{'Review → Check Performance'}</div>
                <div style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>{'Optimize Sheet'}</div>
              </div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>{'يمسح التنسيقات الشبحية ويعيد ضبط النطاق المستخدم'}</div>
          </div>

          {/* File size impact */}
          <div style={{marginTop: 14, display: 'flex', gap: 14, justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{'قبل التنظيف'}</div>
              <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.red}}>{'50 MB'}</div>
            </div>
            <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10 H32 M22 2 L32 10 L22 18" fill="none" stroke={C.green} strokeWidth="2" /></svg>
            <div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{'بعد التنظيف'}</div>
              <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>{'22 MB'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: .xlsb compression */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 880, height: 680, opacity: xlsbP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Binary Workbook (.xlsb) Compression'}</div>

        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 22, height: 580, boxShadow: `0 0 30px ${C.amber}33`}}>
          {/* Save As dialog mock */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
            <div style={{padding: '8px 14px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: FONT, fontSize: 13, color: C.muted}}>{'File → Save As'}</div>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M2 5 H10 M7 2 L10 5 L7 8" fill="none" stroke={C.amber} strokeWidth="1.5" /></svg>
            <div style={{padding: '8px 14px', background: C.amber, color: '#0B1222', borderRadius: 6, fontFamily: MONO, fontSize: 13, fontWeight: 700}}>{'.xlsb'}</div>
          </div>

          {/* Compression stages */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {FILE_SIZES.map((s, i) => {
              const p = interpolate(local, [540 + i * 60, 600 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 16}px)`}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                    <span style={{fontFamily: FONT, fontSize: 13, color: i === FILE_SIZES.length - 1 ? C.green : C.text, fontWeight: i === FILE_SIZES.length - 1 ? 700 : 400}}>{s.stage}</span>
                    <span style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: s.color}}>{s.label}</span>
                  </div>
                  <div style={{height: 14, background: C.deep, borderRadius: 7, overflow: 'hidden'}}>
                    <div style={{width: `${(s.size / 30) * 100}%`, height: '100%', background: s.color, transition: 'width 0.3s'}} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison summary */}
          <div style={{marginTop: 20, padding: 16, background: C.deep, border: `1px solid ${C.green}`, borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.red}}>{'30 MB'}</div>
                <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'xlsx original'}</div>
              </div>
              <svg width="40" height="20" viewBox="0 0 40 20"><path d="M2 10 H32 M22 2 L32 10 L22 18" fill="none" stroke={C.green} strokeWidth="2.5" /></svg>
              <div style={{textAlign: 'center'}}>
                <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>{'12 MB'}</div>
                <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'xlsb binary'}</div>
              </div>
              <div style={{padding: '6px 14px', background: C.green, color: '#0B1222', borderRadius: 6, fontFamily: MONO, fontSize: 16, fontWeight: 700}}>{'-60%'}</div>
            </div>
          </div>

          {/* Benefits */}
          <div style={{marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
            <div style={{padding: 12, background: C.deep, border: `1px solid ${C.green}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8}}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 L8 15 L17 5" fill="none" stroke={C.green} strokeWidth="2" /></svg>
              <span style={{fontFamily: FONT, fontSize: 13, color: C.green, fontWeight: 600}}>{'فتح أسرع'}</span>
            </div>
            <div style={{padding: 12, background: C.deep, border: `1px solid ${C.green}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8}}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 L8 15 L17 5" fill="none" stroke={C.green} strokeWidth="2" /></svg>
              <span style={{fontFamily: FONT, fontSize: 13, color: C.green, fontWeight: 600}}>{'حفظ أسرع'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'Binary Workbook Compression ──► Save Heavy Files as .xlsb (60% Smaller)'}</span>
        </div>
      </div>

      <Caption text="Eliminate Ghost Formatting ──► Detect via Ctrl+End & Clean UsedRange with Check Performance" from={60} to={540} tone="normal" />
      <Caption text="Binary Workbook Compression ──► Save Heavy Operational Files as .xlsb (50%-70% Smaller)" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
