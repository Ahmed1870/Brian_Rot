// SC03 — Storage Scope: .xlsm vs. PERSONAL.XLSB (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {RECORD_DIALOG, STORAGE_OPTIONS, FILE_TYPES} from '../data';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // Record Macro dialog (0-360)
  const dlgP = interpolate(local, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const storeSel = (i: number) => interpolate(local, [120 + i * 180, 180 + i * 180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // File type warning (360-720)
  const fileP = interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Personal broadcast (720-1200)
  const broadcastP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const finalSeal = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Workbook Macro Storage ──► Save as .xlsm — .xlsx Strips All Macros!" from={60} to={630} color={C.purple} />

      {/* LEFT: Record Macro dialog */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 720, height: 660, opacity: dlgP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Record Macro Dialog · Store macro in</div>

        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 22, boxShadow: `0 0 30px ${C.purple}33`}}>
          {/* Macro name */}
          <div style={{marginBottom: 18}}>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginBottom: 6}}>Macro name:</div>
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700}}>
              {RECORD_DIALOG.name}
            </div>
          </div>

          {/* Shortcut */}
          <div style={{marginBottom: 18}}>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginBottom: 6}}>Shortcut key:</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span style={{padding: '6px 10px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: MONO, fontSize: 14, color: C.muted}}>Ctrl +</span>
              <span style={{padding: '6px 10px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: MONO, fontSize: 14, color: C.muted}}>Shift +</span>
              <span style={{padding: '6px 14px', background: C.amber, color: '#0B1222', border: `1px solid ${C.amber}`, borderRadius: 4, fontFamily: MONO, fontSize: 14, fontWeight: 700}}>M</span>
            </div>
          </div>

          {/* Store macro in */}
          <div style={{marginBottom: 18}}>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginBottom: 8}}>Store macro in:</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {STORAGE_OPTIONS.map((opt, i) => {
                const p = storeSel(i);
                const sel = i === 1; // Personal selected
                return (
                  <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 20}px)`, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: sel ? `${opt.color}22` : C.deep, border: `2px solid ${sel ? opt.color : C.border}`, borderRadius: 8, cursor: 'pointer'}}>
                    <div style={{width: 16, height: 16, borderRadius: 8, border: `2px solid ${sel ? opt.color : C.muted}`, background: sel ? opt.color : 'transparent', flexShrink: 0, marginTop: 2}}>
                      {sel && <div style={{width: 4, height: 4, borderRadius: 2, background: '#fff', margin: '4px auto'}} />}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4}}>
                        <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: sel ? opt.color : C.text}}>{opt.name}</span>
                        <span style={{padding: '2px 8px', background: sel ? opt.color : C.border, color: sel ? '#0B1222' : '#fff', borderRadius: 3, fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{opt.ext}</span>
                      </div>
                      <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>{opt.desc}</div>
                      <div style={{fontFamily: FONT, fontSize: 12, color: opt.warn.includes('تحذير') || opt.warn.includes('حذف') ? C.red : opt.color, marginTop: 6, fontStyle: 'italic'}}>⚠ {opt.warn}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginBottom: 6}}>Description:</div>
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: FONT, fontSize: 14, color: C.text, minHeight: 50}}>
              {RECORD_DIALOG.desc}
            </div>
          </div>

          {/* Buttons */}
          <div style={{display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end'}}>
            <button style={{padding: '8px 22px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: FONT, fontSize: 14, cursor: 'pointer'}}>Cancel</button>
            <button style={{padding: '8px 22px', background: C.purple, color: '#fff', border: 'none', borderRadius: 6, fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: 'pointer'}}>OK</button>
          </div>
        </div>
      </div>

      {/* RIGHT: File type warnings + Personal broadcast */}
      <div style={{position: 'absolute', left: 840, top: 180, width: 1000, height: 660}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>File Extensions · صيغ الحفظ</div>

        {/* File type comparison */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18, opacity: fileP}}>
          {FILE_TYPES.map((ft, i) => (
            <div key={i} style={{background: C.card, border: `2px solid ${ft.color}`, borderRadius: 10, padding: 16, boxShadow: `0 0 20px ${ft.color}22`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
                <div style={{width: 36, height: 36, borderRadius: 6, background: ft.color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="2" width="14" height="16" rx="1" fill="none" stroke="#fff" strokeWidth="1.5" /><path d="M6 6 H14 M6 9 H14 M6 12 H10" stroke="#fff" strokeWidth="1.5" /></svg>
                </div>
                <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: ft.color}}>{ft.ext}</span>
              </div>
              <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6}}>{ft.name}</div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{ft.desc}</div>
              <div style={{marginTop: 10, padding: '4px 8px', background: ft.macro ? `${ft.color}22` : `${C.red}22`, border: `1px solid ${ft.macro ? ft.color : C.red}`, borderRadius: 4, fontFamily: MONO, fontSize: 11, color: ft.macro ? ft.color : C.red, fontWeight: 700, textAlign: 'center'}}>
                {ft.macro ? '✓ Macros Preserved' : '✗ Macros Deleted'}
              </div>
            </div>
          ))}
        </div>

        {/* Personal broadcast diagram */}
        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 10, padding: 18, opacity: broadcastP, boxShadow: `0 0 30px ${C.purple}44`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
            <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke={C.purple} strokeWidth="2" /><path d="M11 12 H21 M11 16 H21 M11 20 H17" stroke={C.purple} strokeWidth="1.5" /><circle cx="25" cy="6" r="4" fill={C.purple} /></svg>
            <div>
              <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.purple}}>PERSONAL.XLSB · Global Macro Library</div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>يحمل تلقائياً مع فتح Excel — متاح في كل الملفات</div>
            </div>
          </div>

          <div style={{position: 'relative', height: 200, marginTop: 14}}>
            {/* Central PERSONAL.XLSB */}
            <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', padding: '14px 24px', background: C.purple, color: '#fff', borderRadius: 10, fontFamily: MONO, fontSize: 16, fontWeight: 700, boxShadow: `0 0 30px ${C.purple}66`, zIndex: 2}}>
              PERSONAL.XLSB
              <div style={{fontFamily: FONT, fontSize: 11, fontWeight: 400, opacity: 0.9}}>hidden · global</div>
            </div>

            {/* Surrounding Excel files */}
            {[
              {x: 50, y: 30, name: 'Sales_Q1.xlsx'},
              {x: 750, y: 30, name: 'Reports.xlsx'},
              {x: 50, y: 130, name: 'Inventory.xlsm'},
              {x: 750, y: 130, name: 'Dashboard.xlsx'},
            ].map((file, i) => {
              const p = interpolate(local, [900 + i * 60, 960 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <React.Fragment key={i}>
                  <div style={{position: 'absolute', left: file.x, top: file.y, opacity: p, padding: '8px 14px', background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.text}}>
                    {file.name}
                  </div>
                  <svg style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}} width="900" height="200" opacity={p}>
                    <line x1={file.x + 70} y1={file.y + 20} x2="430" y2="100" stroke={C.purple} strokeWidth="1.5" strokeDasharray="4 4" />
                  </svg>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={finalSeal} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>Global Macro Library ──► PERSONAL.XLSB Runs Across All Files</Mix>
        </div>
      </div>

      <Caption text="Workbook Macro Storage ──► Save as .xlsm — .xlsx Strips All Macros!" from={60} to={630} tone="normal" />
      <Caption text="Global Macro Library ──► Personal Macro Workbook (PERSONAL.XLSB) Runs Across All Files" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
