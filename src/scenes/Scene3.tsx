// SC03 — Dynamic LastRow, If...Then & For Each (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // LastRow code reveal (0-360)
  const codeP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Arrow bounce (120-360) — bounces up from bottom
  const arrowBounce = interpolate(local, [120, 240, 300], [0, 1, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Loop scan (360-720)
  const loopP = interpolate(local, [360, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // If condition (720-1080)
  const ifP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // 50,000 rows detected
  const detectedRow = Math.min(50000, Math.floor(arrowBounce * 50000));

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Dynamic LastRow Detection ──► Cells(Rows.Count, 1).End(xlUp).Row" from={60} to={630} color={C.purple} />

      {/* LEFT: Code editor with LastRow + If + For Each */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 1000, height: 660, opacity: codeP}}>
        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 0, height: '100%', overflow: 'hidden', boxShadow: `0 0 30px ${C.purple}33`}}>
          <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, gap: 10}}>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Module1 — FormatSalesData()</span>
            <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 13, color: C.purple}}>Dynamic + Smart Logic</span>
          </div>

          <div style={{padding: 20, fontFamily: MONO, fontSize: 14, lineHeight: 2.2}}>
            {[
              {l: 'Sub FormatSalesData()', c: C.blue, delay: 0},
              {l: "    ' Dynamic LastRow + Conditional Loop", c: C.green, delay: 1},
              {l: '    Dim LastRow As Long', c: C.blue, delay: 2},
              {l: '    LastRow = Cells(Rows.Count, 1).End(xlUp).Row', c: C.purple, delay: 3, highlight: true},
              {l: '    Dim cell As Range', c: C.blue, delay: 4},
              {l: '    For Each cell In Range("E2:E" & LastRow)', c: C.purple, delay: 5},
              {l: '        If cell.Value > 50000 Then', c: C.amber, delay: 6},
              {l: '            cell.Interior.Color = RGB(239, 68, 68)', c: C.red, delay: 7},
              {l: '        End If', c: C.amber, delay: 8},
              {l: '    Next cell', c: C.purple, delay: 9},
              {l: 'End Sub', c: C.blue, delay: 10},
            ].map((line, i) => {
              const lp = interpolate(local, [60 + i * 30, 90 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{
                  opacity: lp,
                  transform: `translateX(${(1 - lp) * 16}px)`,
                  color: line.c,
                  background: line.highlight ? `${C.purple}22` : 'none',
                  borderLeft: line.highlight ? `3px solid ${C.purple}` : '3px solid transparent',
                  paddingLeft: 8,
                  marginLeft: -8,
                }}>
                  <span style={{color: C.muted, marginRight: 12, width: 24, display: 'inline-block'}}>{i + 1}</span>{line.l}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Excel grid showing xlUp arrow + LastRow detection */}
      <div style={{position: 'absolute', left: 1120, top: 180, width: 720, height: 660, opacity: codeP}}>
        <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14}}>Excel Sheet · اكتشاف آخر صف</div>

        <div style={{position: 'relative', width: '100%', height: 580, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, boxShadow: `0 0 30px ${C.purple}33`}}>
          {/* Mini Excel grid */}
          <div style={{position: 'relative', height: 380, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, fontFamily: MONO, fontSize: 11}}>
            <div style={{display: 'grid', gridTemplateColumns: '28px 60px 1fr 1fr', gap: 1, marginBottom: 4}}>
              <div style={{padding: '3px 0', textAlign: 'center', background: C.card, color: C.muted}} />
              <div style={{padding: '3px 0', textAlign: 'center', background: C.card, color: C.muted}}>A</div>
              <div style={{padding: '3px 0', textAlign: 'center', background: C.card, color: C.muted}}>D</div>
              <div style={{padding: '3px 0', textAlign: 'center', background: C.card, color: C.muted}}>E</div>
            </div>

            {/* Rows with values */}
            {Array.from({length: 8}).map((_, ri) => {
              const rowIdx = ri === 0 ? 1 : ri === 1 ? 2 : ri === 7 ? 50000 : ri * 6000;
              const isLast = ri === 7;
              const isLoopActive = loopP > 0.3 && ri >= 1;
              const isFlagged = ifP > 0.3 && ri >= 4;
              return (
                <div key={ri} style={{display: 'grid', gridTemplateColumns: '28px 60px 1fr 1fr', gap: 1, marginBottom: 1}}>
                  <div style={{padding: '4px 0', textAlign: 'center', background: C.card, color: C.muted, fontSize: 10}}>{rowIdx}</div>
                  <div style={{padding: '4px 6px', background: isLast ? `${C.purple}33` : C.bg, border: `1px solid ${isLast ? C.purple : C.border}`, fontSize: 10, color: C.text}}>{ri === 0 ? 'INV001' : `INV${rowIdx.toString().padStart(3, '0')}`}</div>
                  <div style={{padding: '4px 6px', background: C.bg, border: `1px solid ${C.border}`, fontSize: 10, color: C.text}}>{ri === 0 ? 'Date' : `2026-${String((ri % 12) + 1).padStart(2, '0')}-15`}</div>
                  <div style={{padding: '4px 6px', background: isFlagged ? `${C.red}33` : C.bg, border: `1px solid ${isFlagged ? C.red : C.border}`, fontSize: 10, color: isFlagged ? C.red : C.text, fontWeight: isFlagged ? 700 : 400}}>
                    {ri === 0 ? 'Amount' : isFlagged ? `${(45000 + ri * 3000).toLocaleString()} ⚠` : `${(12000 + ri * 5000).toLocaleString()}`}
                  </div>
                </div>
              );
            })}

            {/* Dotted row to indicate many rows */}
            <div style={{textAlign: 'center', padding: '8px 0', color: C.muted, fontSize: 10, fontFamily: MONO}}>⋮ (50,000 rows) ⋮</div>

            {/* xlUp arrow */}
            {arrowBounce > 0 && (
              <svg style={{position: 'absolute', right: 30, top: 20}} width="30" height="320">
                <line x1="15" y1={310} x2="15" y2={310 - arrowBounce * 290} stroke={C.purple} strokeWidth="2.5" strokeDasharray="5 3" />
                <polygon points="10,20 20,20 15,8" fill={C.purple} opacity={arrowBounce} transform={`translate(0, ${310 - arrowBounce * 290 - 20 < 8 ? 0 : 310 - arrowBounce * 290 - 20})`} />
              </svg>
            )}
          </div>

          {/* Detection result */}
          <div style={{marginTop: 16, padding: 14, background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 8}}>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>LastRow detected:</div>
            <div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.purple, marginTop: 4}}>
              {detectedRow.toLocaleString()} <span style={{fontSize: 16, color: C.muted}}>rows</span>
            </div>
          </div>

          {/* Loop indicator */}
          <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: loopP}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 a7 7 0 1 1 14 0 a7 7 0 0 1 -10 5 M7 13 L7 9 L4 12" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{fontFamily: FONT, fontSize: 13, color: C.purple}}>For Each · looping through cells</span>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={sealP} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>Smart Control Flow ──► If...Then...Else & For Each Loops</Mix>
        </div>
      </div>

      <Caption text="Dynamic LastRow Detection ──► Cells(Rows.Count, 1).End(xlUp).Row" from={60} to={630} tone="normal" />
      <Caption text="Smart Control Flow ──► Combine If...Then...Else & For Each Loops for Automated Logic" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
