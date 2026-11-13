// SC04 — Decision Matrix: When to use VBA vs Office Scripts (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';
import {VBA_USES, OFFICE_USES} from '../data';

const SC = {from: 3900, dur: 1200};

const VBA_ICONS: Record<string, React.ReactNode> = {
  disk: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="4" width="16" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="11" r="0.5" fill="currentColor" /></svg>,
  outlook: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="5" width="16" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3 6 L11 12 L19 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
  form: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="3" y="3" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M6 7 H16 M6 11 H16 M6 15 H12" stroke="currentColor" strokeWidth="1.5" /></svg>,
};

const OFFICE_ICONS: Record<string, React.ReactNode> = {
  web: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3 11 H19 M11 3 a8 8 0 0 1 0 16 a8 8 0 0 1 0 -16" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
  share: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="6" cy="11" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 11 H14 M8 10 L14 7 M8 12 L14 15" stroke="currentColor" strokeWidth="1.5" /></svg>,
  flow: <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 6 H7 L9 3 H19 M3 11 H11 L13 8 H19 M3 16 H7 L9 13 H15" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Two columns reveal (0-720)
  const vbaP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const officeP = interpolate(local, [360, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const useP = (col: 'vba' | 'office', i: number) => interpolate(local, [(col === 'vba' ? 60 : 420) + i * 90, (col === 'vba' ? 120 : 480) + i * 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const finalSeal = interpolate(local, [1020, 1140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Engineering Decision Matrix ──► When to use VBA vs Office Scripts" from={60} to={540} color={C.amber} />

      {/* LEFT: Choose VBA */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 660, opacity: vbaP, transform: `translateX(${(1 - vbaP) * -40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 50, height: 50, borderRadius: 8, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, fontWeight: 700, boxShadow: `0 0 20px ${C.amber}66`}}>VBA</div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'اختر VBA عندما تحتاج'}</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'Local desktop-only scenarios'}</div>
          </div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.amber}33`}}>
          {VBA_USES.map((u, i) => {
            const p = useP('vba', i);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 14px', opacity: p, borderBottom: i < VBA_USES.length - 1 ? `1px solid ${C.border}` : 'none', transform: `translateX(${(1 - p) * 16}px)`}}>
                <div style={{width: 56, height: 56, borderRadius: 10, background: C.deep, border: `2px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber}}>
                  {VBA_ICONS[u.icon]}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT, fontSize: 17, fontWeight: 600, color: C.text}}>{u.l}</div>
                </div>
                <div style={{width: 24, height: 24, borderRadius: 12, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>✓</div>
              </div>
            );
          })}

          {/* Bottom note */}
          <div style={{marginTop: 20, padding: 14, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8}}>
            <div style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 4}}>{'COM Objects · UserForms · Local Disk'}</div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.amber, fontWeight: 700}}>{'البطل الوحيد للمهام المحلية'}</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Choose Office Scripts */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 880, height: 660, opacity: officeP, transform: `translateX(${(1 - officeP) * 40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 50, height: 50, borderRadius: 8, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, boxShadow: `0 0 20px ${C.amber}66`, padding: '0 8px'}}>OS</div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'اختر Office Scripts عندما تحتاج'}</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'Cloud + cross-platform + automated'}</div>
          </div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.amber}33`}}>
          {OFFICE_USES.map((u, i) => {
            const p = useP('office', i);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 14px', opacity: p, borderBottom: i < OFFICE_USES.length - 1 ? `1px solid ${C.border}` : 'none', transform: `translateX(${(1 - p) * 16}px)`}}>
                <div style={{width: 56, height: 56, borderRadius: 10, background: C.deep, border: `2px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber}}>
                  {OFFICE_ICONS[u.icon]}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT, fontSize: 17, fontWeight: 600, color: C.text}}>{u.l}</div>
                </div>
                <div style={{width: 24, height: 24, borderRadius: 12, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>✓</div>
              </div>
            );
          })}

          {/* Bottom note */}
          <div style={{marginTop: 20, padding: 14, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8}}>
            <div style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 4}}>{'Power Automate · SharePoint · TypeScript'}</div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.amber, fontWeight: 700}}>{'الاختيار الذهبي والمستقبلي'}</div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>{'Smart Routing ──► Match Tech to Scenario'}</span>
        </div>
      </div>

      <Caption text="Choose VBA For ──► Local File System, Desktop Outlook/Word COM Control & UserForms" from={60} to={540} tone="normal" />
      <Caption text="Choose Office Scripts For ──► Cross-Platform Web/Desktop, Team Sharing & Power Automate Schedules" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
