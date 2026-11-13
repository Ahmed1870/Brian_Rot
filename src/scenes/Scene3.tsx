// SC03 — Office Scripts vs VBA Architecture Comparison (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {COMPARISON} from '../data';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // Comparison table reveal (0-720)
  const rowP = (i: number) => interpolate(local, [0 + i * 80, 60 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Power Automate flow (720-1080)
  const flowP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const finalSeal = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Storage & IT Security ──► Scripts in OneDrive/SharePoint; File Stays Safe .xlsx" from={60} to={630} color={C.purple} />

      {/* LEFT: VBA Card */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 660}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="3" width="16" height="16" rx="1" fill="none" stroke="#fff" strokeWidth="2" /><line x1="3" y1="3" x2="19" y2="19" stroke="#fff" strokeWidth="2" /></svg>
          </div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.red}}>{'VBA · Desktop Legacy'}</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'.xlsm format · IT-blocked'}</div>
          </div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 20px ${C.red}22`}}>
          {/* File type warning */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: `${C.red}22`, borderRadius: 8, marginBottom: 14, border: `1px solid ${C.red}`}}>
            <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="1" fill="none" stroke={C.red} strokeWidth="2" /><path d="M11 12 H21 M11 16 H21 M11 20 H17" stroke={C.red} strokeWidth="1.5" /></svg>
            <div>
              <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.red}}>{'.xlsm'}</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.red}}>{'محظور من سياسات IT الأمنية'}</div>
            </div>
          </div>

          {/* Comparison rows for VBA */}
          <div>
            {COMPARISON.map((row, i) => {
              const p = rowP(i);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', opacity: p, borderBottom: i < COMPARISON.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                  <div style={{width: 18, height: 18, borderRadius: 9, background: C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 11, fontWeight: 700}}>✕</div>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.text}}>{row.aspect}</div>
                    <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{row.aspectEn}</div>
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 13, color: C.red, fontWeight: 600}}>{row.vba}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Office Scripts Card */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 880, height: 660}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.green}66`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L8 16 L19 5" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Office Scripts · Modern Cloud'}</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'.xlsx safe · OneDrive/SharePoint'}</div>
          </div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.green}33`}}>
          {/* Safe file */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: `${C.green}22`, borderRadius: 8, marginBottom: 14, border: `1px solid ${C.green}`}}>
            <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="1" fill="none" stroke={C.green} strokeWidth="2" /><path d="M11 12 H21 M11 16 H21 M11 20 H17" stroke={C.green} strokeWidth="1.5" /><path d="M14 22 L17 25 L23 18" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green}}>{'.xlsx'}</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.green}}>{'صيغة آمنة مقبولة من كل الإدارات'}</div>
            </div>
          </div>

          {/* Comparison rows for Office Scripts */}
          <div>
            {COMPARISON.map((row, i) => {
              const p = rowP(i);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', opacity: p, borderBottom: i < COMPARISON.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                  <div style={{width: 18, height: 18, borderRadius: 9, background: C.green, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 11, fontWeight: 700}}>✓</div>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.text}}>{row.aspect}</div>
                    <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{row.aspectEn}</div>
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 13, color: C.green, fontWeight: 600}}>{row.office}</div>
                </div>
              );
            })}
          </div>

          {/* Power Automate flow */}
          <div style={{marginTop: 14, padding: 14, background: `${C.purple}22`, border: `1px solid ${C.purple}`, borderRadius: 8, opacity: flowP}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 12 H7 L9 6 L13 18 L15 12 H21" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.purple}}>{'Power Automate · Unattended'}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
              <div style={{padding: '6px 10px', background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 4, fontFamily: MONO, fontSize: 11, color: C.purple}}>{'Email Trigger'}</div>
              <svg width="14" height="10" viewBox="0 0 14 10"><path d="M2 5 H10 M7 2 L10 5 L7 8" fill="none" stroke={C.purple} strokeWidth="1.5" /></svg>
              <div style={{padding: '6px 10px', background: C.purple, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'Run Script'}</div>
              <svg width="14" height="10" viewBox="0 0 14 10"><path d="M2 5 H10 M7 2 L10 5 L7 8" fill="none" stroke={C.purple} strokeWidth="1.5" /></svg>
              <div style={{padding: '6px 10px', background: C.deep, border: `1px solid ${C.green}`, borderRadius: 4, fontFamily: MONO, fontSize: 11, color: C.green}}>{'Updated .xlsx'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={finalSeal} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>{'Unattended Cloud Flows ──► Power Automate Triggers Run Scripts Automatically'}</Mix>
        </div>
      </div>

      <Caption text="Storage & IT Security ──► Scripts in OneDrive/SharePoint; File Stays Safe .xlsx" from={60} to={630} tone="normal" />
      <Caption text="Unattended Cloud Flows ──► Power Automate Triggers Run Scripts Automatically in Background" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
