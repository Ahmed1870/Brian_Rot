// SC04 — Performance Wrapper & F8 Step Debugging (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';

const SC = {from: 3900, dur: 1200};

const CODE_LINES = [
  {l: 'Sub FormatSalesData()', c: 'blue'},
  {l: "    ' Performance wrapper + error shield", c: 'green'},
  {l: '    On Error GoTo SafeExit', c: 'purple'},
  {l: '    Application.ScreenUpdating = False', c: 'amber'},
  {l: '    Application.Calculation = xlCalculationManual', c: 'amber'},
  {l: '    ', c: 'muted'},
  {l: '    Dim LastRow As Long', c: 'blue'},
  {l: '    LastRow = Cells(Rows.Count, 1).End(xlUp).Row', c: 'purple'},
  {l: '    ', c: 'muted'},
  {l: '    For Each cell In Range("E2:E" & LastRow)', c: 'purple'},
  {l: '        If cell.Value > 50000 Then', c: 'amber'},
  {l: "            cell.Interior.Color = RGB(239, 68, 68)", c: 'red'},
  {l: '        End If', c: 'amber'},
  {l: '    Next cell', c: 'purple'},
  {l: '    ', c: 'muted'},
  {l: 'SafeExit:', c: 'purple'},
  {l: '    Application.Calculation = xlCalculationAutomatic', c: 'amber'},
  {l: '    Application.ScreenUpdating = True', c: 'amber'},
  {l: 'End Sub', c: 'blue'},
];

const COLORS: Record<string, string> = {
  blue: '#38BDF8', green: '#10B981', amber: '#F59E0B', purple: '#A855F7', red: '#EF4444', muted: '#475569',
};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  const wrapP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stepLine = Math.min(CODE_LINES.length - 1, Math.floor((local - 360) / 30));
  const shieldP = interpolate(local, [840, 960], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const finalSeal = interpolate(local, [1020, 1140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const slowSpeed = 850;
  const fastSpeed = 1.8;
  const currentSpeed = interpolate(wrapP, [0, 1], [slowSpeed, fastSpeed]);

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Speed Optimization Wrapper ──► Application.ScreenUpdating = False & xlCalculationManual" from={60} to={540} color={C.amber} />

      {/* LEFT: VBE with code + F8 highlight */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 1080, height: 660}}>
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, height: '100%', overflow: 'hidden', boxShadow: `0 0 30px ${C.amber}33`}}>
          <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, gap: 10}}>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Module1 — FormatSalesData()</span>
            <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 13, color: wrapP > 0.5 ? C.amber : C.muted}}>
              {wrapP > 0.5 ? 'Turbo Mode ON' : 'Standard Mode'}
            </span>
          </div>

          <div style={{padding: 18, fontFamily: MONO, fontSize: 13, lineHeight: 2}}>
            {CODE_LINES.map((line, i) => {
              const isCurrent = i === stepLine && local >= 360 && local < 840;
              const isWrap = (i === 3 || i === 4 || i === 16 || i === 17);
              const wrapHighlight = isWrap && wrapP > 0.5;
              return (
                <div key={i} style={{
                  color: COLORS[line.c] || C.text,
                  background: isCurrent ? `${C.amber}33` : wrapHighlight ? `${C.amber}22` : 'transparent',
                  borderLeft: isCurrent ? `3px solid ${C.amber}` : wrapHighlight ? `3px solid ${C.amber}` : '3px solid transparent',
                  paddingLeft: 8,
                  marginLeft: -8,
                  boxShadow: isCurrent ? `0 0 12px ${C.amber}55` : 'none',
                  whiteSpace: 'pre',
                }}>
                  <span style={{color: C.muted, marginRight: 10, width: 20, display: 'inline-block'}}>{i + 1}</span>{line.l || ' '}
                  {isCurrent && <span style={{color: C.amber, marginLeft: 8}}>F8</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Performance + F8 panel */}
      <div style={{position: 'absolute', left: 1200, top: 180, width: 640, height: 660}}>
        {/* Speed comparison */}
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, marginBottom: 14, boxShadow: `0 0 20px ${C.amber}33`}}>
          <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14}}>Performance Boost</div>

          <div style={{marginBottom: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
              <span style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>Without wrapper</span>
              <span style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>850 ms</span>
            </div>
            <div style={{height: 10, background: C.deep, borderRadius: 5, overflow: 'hidden'}}>
              <div style={{width: '100%', height: '100%', background: C.red}} />
            </div>
          </div>

          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
              <span style={{fontFamily: MONO, fontSize: 12, color: C.green}}>With wrapper</span>
              <span style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>{currentSpeed.toFixed(1)} ms</span>
            </div>
            <div style={{height: 10, background: C.deep, borderRadius: 5, overflow: 'hidden'}}>
              <div style={{width: `${(currentSpeed / 850) * 100}%`, height: '100%', background: C.green, transition: 'width 0.2s'}} />
            </div>
          </div>

          <div style={{marginTop: 14, padding: '8px 12px', background: C.deep, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.amber}}>
            {Math.round(850 / currentSpeed)}x faster than standard
          </div>
        </div>

        {/* F8 key visualization */}
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, marginBottom: 14}}>
          <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14}}>Step-by-Step Debugging</div>

          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
            <div style={{
              padding: '12px 22px', background: local >= 360 && local < 840 ? C.amber : C.deep,
              color: local >= 360 && local < 840 ? '#0B1222' : C.text,
              border: `2px solid ${C.amber}`, borderRadius: 8, fontFamily: MONO, fontSize: 20, fontWeight: 700,
              transform: `translateY(${local >= 360 && local < 840 ? 4 : 0}px) scale(${local >= 360 && local < 840 ? 0.95 : 1})`,
              boxShadow: local >= 360 && local < 840 ? `0 0 20px ${C.amber}` : 'none',
            }}>F8</div>
            <div>
              <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.amber}}>Step Into</div>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>Line {Math.min(stepLine + 1, CODE_LINES.length)} / {CODE_LINES.length}</div>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
            {CODE_LINES.map((_, i) => {
              const done = i < stepLine;
              const current = i === stepLine;
              return (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: 2,
                  background: current ? C.amber : done ? C.green : C.deep,
                  border: `1px solid ${current ? C.amber : done ? C.green : C.border}`,
                }} />
              );
            })}
          </div>
        </div>

        {/* Error shield */}
        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, opacity: shieldP, boxShadow: `0 0 20px ${C.purple}33`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M20 4 L34 10 V20 C34 28 28 34 20 36 C12 34 6 28 6 20 V10 Z" fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M14 20 L18 24 L26 16" fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.purple}}>On Error GoTo SafeExit</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 2}}>{'Code protected from unexpected errors'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>Turbo + Debugging Ready ──► ScreenUpdating = False + F8 + On Error GoTo</span>
        </div>
      </div>

      <Caption text="Speed Optimization Wrapper ──► Application.ScreenUpdating = False & xlCalculationManual" from={60} to={540} tone="normal" />
      <Caption text="Debugging & Error Shield ──► Step-by-Step Execution via F8 + On Error GoTo Handler" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
