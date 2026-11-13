// SC02 — Automate Tab & TypeScript Workbook APIs (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {TS_SCRIPT, TS_COLORS} from '../data';

const SC = {from: 1200, dur: 1350};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Automate tab reveal (0-180)
  const tabP = interpolate(local, [0, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Code editor (120-480)
  const codeP = interpolate(local, [120, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Record Actions button (360-720)
  const recordP = interpolate(local, [360, 480], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Bulk array transfer (720-1080)
  const bulkP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Automate Tab & TypeScript ──► function main(workbook) + getUsedRange() + getValues/setValues" from={60} to={720} color={C.green} />

      {/* Ribbon with Automate tab */}
      <div style={{position: 'absolute', left: 80, top: 170, width: 1760, height: 90, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, opacity: tabP}}>
        {['File', 'Home', 'Insert', 'Data', 'Review', 'View'].map((t) => (
          <div key={t} style={{padding: '6px 12px', fontFamily: FONT, fontSize: 14, color: C.muted}}>{t}</div>
        ))}
        <div style={{padding: '8px 16px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: FONT, fontSize: 14, fontWeight: 700, boxShadow: `0 0 15px ${C.green}55`}}>Automate</div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginLeft: 14}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 15px ${C.green}55`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="6" fill="none" stroke={C.green} strokeWidth="2" /><circle cx="11" cy="11" r="2" fill={C.green} /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.green, fontWeight: 700}}>Record Actions</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="4" y="3" width="14" height="16" rx="1" fill="none" stroke={C.muted} strokeWidth="1.5" /><path d="M7 7 H15 M7 10 H15 M7 13 H12" stroke={C.muted} strokeWidth="1.5" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>New Script</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: C.deep, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 6 H19 M3 11 H19 M3 16 H13" stroke={C.muted} strokeWidth="1.5" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>All Scripts</span>
        </div>
      </div>

      {/* LEFT: Code editor with TypeScript */}
      <div style={{position: 'absolute', left: 80, top: 280, width: 1080, height: 580, opacity: codeP}}>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, height: '100%', overflow: 'hidden', boxShadow: `0 0 30px ${C.green}33`}}>
          <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, gap: 10}}>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'Code.ts — TypeScript'}</span>
            <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 13, color: C.green}}>{'.osts script on OneDrive'}</span>
          </div>

          <div style={{padding: 18, fontFamily: MONO, fontSize: 14, lineHeight: 2}}>
            {TS_SCRIPT.map((line, i) => {
              const lp = interpolate(local, [120 + i * 30, 150 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const isGetValues = line.code.includes('getValues') || line.code.includes('setValues');
              const isBulk = isGetValues && bulkP > 0.3;
              return (
                <div key={i} style={{
                  opacity: lp,
                  transform: `translateX(${(1 - lp) * 16}px)`,
                  color: TS_COLORS[line.c] || C.text,
                  background: isBulk ? `${C.purple}22` : 'transparent',
                  borderLeft: isBulk ? `3px solid ${C.purple}` : '3px solid transparent',
                  paddingLeft: 8,
                  marginLeft: -8,
                  boxShadow: isBulk ? `0 0 12px ${C.purple}55` : 'none',
                }}>
                  <span style={{color: C.muted, marginRight: 12, width: 20, display: 'inline-block'}}>{line.n}</span>{line.code}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: UsedRange + Bulk array transfer */}
      <div style={{position: 'absolute', left: 1200, top: 280, width: 640, height: 580, opacity: codeP}}>
        {/* getUsedRange */}
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, marginBottom: 14, boxShadow: `0 0 20px ${C.green}33`}}>
          <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10}}>{'getUsedRange() · التقاط البيانات'}</div>
          <div style={{background: C.deep, borderRadius: 6, padding: 12, fontFamily: MONO, fontSize: 12, color: C.green}}>
            sheet.getUsedRange()
          </div>
          {/* Mini grid */}
          <div style={{marginTop: 10, display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: 1, fontFamily: MONO, fontSize: 10}}>
            <div style={{padding: '3px', background: C.card, color: C.muted}} />
            {['A', 'B', 'C'].map((c) => <div key={c} style={{padding: '3px', background: C.card, color: C.muted, textAlign: 'center'}}>{c}</div>)}
            {[1, 2, 3, 4].map((r, ri) => (
              <React.Fragment key={r}>
                <div style={{padding: '3px', background: C.card, color: C.muted, textAlign: 'center'}}>{r}</div>
                {Array.from({length: 3}).map((_, ci) => <div key={ci} style={{padding: '4px', background: C.bg, border: `1px solid ${ri === 3 ? C.green : C.border}`, color: ri === 3 ? C.green : C.text}}>{ri === 3 ? '50K' : `data`}</div>)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bulk array transfer */}
        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, opacity: bulkP, boxShadow: `0 0 20px ${C.purple}33`}}>
          <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.purple, marginBottom: 10}}>{'Bulk Array Transfer'}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
            <div style={{padding: '8px 12px', background: C.deep, border: `1px solid ${C.green}`, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.green}}>{'getValues()'}</div>
            <svg width="20" height="14" viewBox="0 0 20 14"><path d="M2 7 H16 M11 2 L16 7 L11 12" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{padding: '8px 12px', background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.purple}}>{'[[...],[...]]'}</div>
            <svg width="20" height="14" viewBox="0 0 20 14"><path d="M2 7 H16 M11 2 L16 7 L11 12" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{padding: '8px 12px', background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.amber}}>{'setValues()'}</div>
          </div>
          <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{'دفعة واحدة · مش خلية بخلية'}</div>
        </div>

        {/* Record Actions badge */}
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: recordP, padding: 14, background: C.card, border: `1px solid ${C.green}`, borderRadius: 10}}>
          <div style={{width: 36, height: 36, borderRadius: 18, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="5" fill="#0B1222" /></svg>
          </div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.green}}>{'Record Actions · يسجل خطواتك'}</div>
            <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'يكتب كود TypeScript تلقائياً'}</div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} color={C.green} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'High-Speed Cloud APIs ──► getUsedRange + Bulk getValues/setValues'}</Mix>
        </div>
      </div>

      <Caption text="Automate Tab & TypeScript ──► function main(workbook) + Record Actions" from={60} to={720} tone="ok" />
      <Caption text="High-Speed Cloud APIs ──► getUsedRange() + Bulk getValues() & setValues() Arrays" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
