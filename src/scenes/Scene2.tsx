// SC02 — Enable Developer Tab & Absolute vs. Relative Recording (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 1200, dur: 1350};

const NAV_PATH = ['File', 'Options', 'Customize Ribbon', 'Developer'];

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Path trace progress (0-360)
  const pathP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Tabs reveal (240-480)
  const tabP = interpolate(local, [240, 480], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Absolute vs Relative comparison (480-900)
  const compP = interpolate(local, [480, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const relCursor = (local - 720) % 90;
  // No-undo alert (900-1200)
  const alertP = interpolate(local, [900, 1020], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Enable Developer Tab ──► File → Options → Customize Ribbon → Developer" from={60} to={720} color={C.green} />

      {/* TOP: Navigation path */}
      <div style={{position: 'absolute', left: 80, top: 170, right: 80, height: 80}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center'}}>
          {NAV_PATH.map((p, i) => {
            const pP = interpolate(local, [i * 90, i * 90 + 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <React.Fragment key={i}>
                <div style={{opacity: pP, transform: `scale(${0.8 + 0.2 * pP})`, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: i === 3 ? C.green : C.card, color: i === 3 ? '#0B1222' : C.text, border: `2px solid ${i === 3 ? C.green : C.border}`, borderRadius: 8, fontFamily: FONT, fontSize: 16, fontWeight: 700, boxShadow: i === 3 ? `0 0 20px ${C.green}66` : 'none'}}>
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    {i === 0 && <rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />}
                    {i === 1 && <><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="8" cy="8" r="2" fill="currentColor" /></>}
                    {i === 2 && <><rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" /></>}
                    {i === 3 && <><rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5 8 L7 10 L11 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>}
                  </svg>
                  {p}
                </div>
                {i < NAV_PATH.length - 1 && (
                  <svg width="24" height="20" viewBox="0 0 24 20" style={{opacity: pP}}><path d="M4 10 H18 M14 5 L19 10 L14 15" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Developer ribbon mock with Record Macro button */}
      <div style={{position: 'absolute', left: 80, top: 270, width: 1760, height: 90, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20, opacity: tabP}}>
        <div style={{padding: '8px 14px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: FONT, fontSize: 14, fontWeight: 700}}>Developer</div>
        <div style={{width: 1, height: 50, background: C.border}} />
        {/* Code group */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 15px ${C.green}55`}}>
            <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="none" stroke={C.green} strokeWidth="2" /><circle cx="12" cy="12" r="2.5" fill={C.green} /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.green, fontWeight: 700}}>Record Macro</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `2px solid ${relCursor < 45 ? C.green : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: relCursor < 45 ? `0 0 15px ${C.green}55` : 'none'}}>
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 12 H8 L10 6 L14 18 L16 12 H20" fill="none" stroke={relCursor < 45 ? C.green : C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: relCursor < 45 ? C.green : C.muted, fontWeight: 700}}>Use Relative References</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="4" y="4" width="14" height="14" fill="none" stroke={C.muted} strokeWidth="1.5" /><path d="M7 8 H15 M7 11 H15 M7 14 H12" stroke={C.muted} strokeWidth="1.5" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>Macros</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="3" width="16" height="16" fill="none" stroke={C.muted} strokeWidth="1.5" /><path d="M7 8 L7 14 M11 8 L11 14 M15 8 L15 14" stroke={C.muted} strokeWidth="1.5" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>Visual Basic</span>
        </div>
      </div>

      {/* Absolute vs Relative comparison */}
      <div style={{position: 'absolute', left: 80, top: 380, width: 880, height: 460, opacity: compP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
          <div style={{width: 36, height: 36, borderRadius: 6, background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#0B1222'}}>A</div>
          <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>Absolute Recording · مراجع مطلقة</div>
        </div>
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, height: 380}}>
          {/* Mini Excel grid */}
          <div style={{position: 'relative', height: 220, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20}}>
            <div style={{display: 'grid', gridTemplateColumns: '32px repeat(6, 1fr)', gap: 1, fontFamily: MONO, fontSize: 11}}>
              <div />
              {['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) => (
                <div key={i} style={{padding: '4px 0', textAlign: 'center', background: C.card, color: C.muted}}>{c}</div>
              ))}
              {[1, 2, 3].map((r, ri) => (
                <React.Fragment key={r}>
                  <div style={{padding: '4px 0', textAlign: 'center', background: C.card, color: C.muted}}>{r}</div>
                  {Array.from({length: 6}).map((_, ci) => {
                    const isHeader = ri === 0;
                    const isFixed = isHeader;
                    return (
                      <div key={ci} style={{padding: '6px 8px', background: isFixed ? C.amber : C.bg, border: `1px solid ${isFixed ? C.amber : C.border}`, color: isFixed ? '#0B1222' : C.text, fontWeight: isFixed ? 700 : 400, fontSize: 11}}>
                        {isFixed ? `H${ci + 1}` : ''}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.amber}}>
              Range("A1:F1").Select <span style={{color: C.muted}}>— إحداثيات ثابتة</span>
            </div>
          </div>
          <div style={{marginTop: 14, fontFamily: FONT, fontSize: 14, color: C.muted}}>✓ ممتاز للقوالب والترويسات الثابتة</div>
        </div>
      </div>

      <div style={{position: 'absolute', right: 80, top: 380, width: 880, height: 460, opacity: compP, transform: `translateY(${(1 - compP) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
          <div style={{width: 36, height: 36, borderRadius: 6, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#0B1222'}}>R</div>
          <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>Use Relative References · مراجع نسبية</div>
        </div>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, height: 380, boxShadow: `0 0 30px ${C.green}33`}}>
          <div style={{position: 'relative', height: 220, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20}}>
            <div style={{display: 'grid', gridTemplateColumns: '32px repeat(6, 1fr)', gap: 1, fontFamily: MONO, fontSize: 11}}>
              <div />
              {['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) => (
                <div key={i} style={{padding: '4px 0', textAlign: 'center', background: C.card, color: C.muted}}>{c}</div>
              ))}
              {[1, 2, 3, 4, 5].map((r, ri) => (
                <React.Fragment key={r}>
                  <div style={{padding: '4px 0', textAlign: 'center', background: C.card, color: C.muted}}>{r}</div>
                  {Array.from({length: 6}).map((_, ci) => {
                    const isActiveRow = ri === Math.floor((local - 480) / 60) % 5;
                    return (
                      <div key={ci} style={{padding: '6px 8px', background: isActiveRow ? `${C.green}33` : C.bg, border: `1px solid ${isActiveRow ? C.green : C.border}`, color: C.text, fontSize: 11}}>
                        {isActiveRow ? '↕' : ''}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div style={{marginTop: 10, fontFamily: MONO, fontSize: 13, color: C.green}}>
              ActiveCell.Offset(1, 0).Select <span style={{color: C.muted}}>— إزاحة ديناميكية</span>
            </div>
          </div>
          <div style={{marginTop: 14, fontFamily: FONT, fontSize: 14, color: C.green}}>✓ ضروري للجداول متغيرة الطول شهرياً</div>
        </div>
      </div>

      {/* No-Undo Alert */}
      <div style={{position: 'absolute', left: 80, top: 860, right: 80, display: 'flex', justifyContent: 'center', opacity: alertP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: '14px 30px', boxShadow: `0 0 30px ${C.red}44`}}>
          <svg width="36" height="36" viewBox="0 0 36 36"><path d="M18 4 L33 30 H3 Z" fill="none" stroke={C.red} strokeWidth="3" strokeLinejoin="round" /><line x1="18" y1="14" x2="18" y2="22" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><circle cx="18" cy="27" r="2" fill={C.red} /></svg>
          <div>
            <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.red}}>No Ctrl+Z Undo After Macro Execution</div>
            <div style={{fontFamily: FONT, fontSize: 14, color: C.muted, marginTop: 2}}>الماكرو ملوش تراجع — خد نسخة احتياطية قبل أي تجربة</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '8px 14px', background: C.red, color: '#fff', borderRadius: 6, fontFamily: MONO, fontSize: 14, fontWeight: 700}}>
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="5" width="10" height="9" rx="1" fill="none" stroke="#fff" strokeWidth="1.5" /><path d="M6 5 V3 a2 2 0 0 1 4 0 V5" fill="none" stroke="#fff" strokeWidth="1.5" /></svg>
            Backup First!
          </div>
        </div>
      </div>

      <Caption text="Enable Developer Tab ──► File → Options → Customize Ribbon → Developer" from={60} to={720} tone="ok" />
      <Caption text="Recording Reference Modes ──► Absolute (Fixed Cells) vs. Use Relative References (Dynamic Rows)" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
