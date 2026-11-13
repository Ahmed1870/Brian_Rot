// SC03 — 3-Color Rule & 3-Layer Workbook Architecture (01:25–02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';

const SC = {from: 2550, dur: 1350};

const LAYERS = [
  {n: '01', name: 'البيانات الخام', sub: 'Raw Data', desc: '50,000 صف معاملات مبيعات — ملف 01_Raw_Data', color: C.muted, lock: false},
  {n: '02', name: 'الحسابات والجداول', sub: 'Calculations / Staging', desc: 'PivotTables و DAX و Helper Columns — ملف 02_Calculations', color: C.blue, lock: false},
  {n: '03', name: 'لوحة القيادة التنفيذية', sub: 'Protected Dashboard UI', desc: 'واجهة عرض نظيفة — ملف 03_Executive_Dashboard', color: C.green, lock: true},
];

const BAD_COLORS = ['#EF4444', '#F59E0B', '#A855F7', '#FBBF24', '#06B6D4', '#10B981', '#38BDF8'];

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // Phase 1: rainbow → 3-color (2550→2820)
  const rainbowOp = interpolate(local, [0, 60, 240, 360], [1, 1, 0.1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cleanOp = interpolate(local, [120, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Phase 2: 3-layer architecture (2820→3450)
  const layerP = (i: number) => interpolate(local, [420 + i * 90, 540 + i * 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lockP = interpolate(local, [780, 960], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Phase 3: final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="3-Color Restraint Rule ──► Neutral Base + 1 Brand Color + Semantic Alerts" from={60} to={630} color={C.purple} />

      {/* LEFT: Color palette comparison */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 820, height: 720}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>سيكولوجية الألوان · Color Psychology</div>

        {/* Rainbow (bad) */}
        <div style={{position: 'relative', height: 200, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: 16, marginBottom: 14, opacity: rainbowOp}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
            <span style={{background: C.red, color: '#fff', padding: '4px 10px', borderRadius: 4, fontFamily: MONO, fontSize: 14, fontWeight: 700}}>✗ BAD</span>
            <span style={{fontFamily: FONT, fontSize: 16, color: C.red}}>لوحة قوس قزح صارخة · تشتت الإدارة</span>
          </div>
          <div style={{display: 'flex', gap: 8, height: 120}}>
            {BAD_COLORS.map((c, i) => (
              <div key={i} style={{flex: 1, background: c, borderRadius: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8}}>
                <span style={{fontFamily: MONO, fontSize: 10, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)'}}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-color (good) */}
        <div style={{position: 'relative', height: 260, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 16, boxShadow: `0 0 30px ${C.purple}44`, opacity: cleanOp, transform: `translateY(${(1 - cleanOp) * 20}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
            <span style={{background: C.green, color: '#0B1222', padding: '4px 10px', borderRadius: 4, fontFamily: MONO, fontSize: 14, fontWeight: 700}}>✓ GOOD</span>
            <span style={{fontFamily: FONT, fontSize: 16, color: C.purple}}>قاعدة الألوان الثلاثة · 3-Color Restraint</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, height: 200}}>
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{width: 40, height: 40, borderRadius: 6, background: C.bg, border: `2px solid ${C.muted}`}} />
              <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.muted, marginTop: 8}}>Neutral Base</div>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>#0F172A</div>
            </div>
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{width: 40, height: 40, borderRadius: 6, background: C.blue}} />
              <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.blue, marginTop: 8}}>Brand Color</div>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>#38BDF8</div>
            </div>
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6}}>
              <div style={{display: 'flex', gap: 6}}>
                <div style={{width: 18, height: 18, borderRadius: 4, background: C.green}} />
                <div style={{width: 18, height: 18, borderRadius: 4, background: C.red}} />
              </div>
              <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text, marginTop: 4}}>Semantic</div>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>Green/Red</div>
            </div>
          </div>
        </div>

        {/* Color rule examples */}
        <div style={{marginTop: 14, display: 'flex', gap: 8, opacity: cleanOp}}>
          <div style={{flex: 1, background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.green}`}}>
            <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>المستهدف</div>
            <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.green}}>▲ 102%</div>
          </div>
          <div style={{flex: 1, background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.red}`}}>
            <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>انحراف خطر</div>
            <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.red}}>▼ -8.4%</div>
          </div>
        </div>
      </div>

      {/* RIGHT: 3-Layer Architecture */}
      <div style={{position: 'absolute', left: 940, top: 180, width: 900, height: 720}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>فصل الطبقات · 3-Layer Workbook Model</div>

        <div style={{position: 'relative', height: 660}}>
          {LAYERS.map((L, i) => {
            const p = layerP(i);
            const offX = (1 - p) * 40;
            return (
              <React.Fragment key={i}>
                <div style={{position: 'absolute', left: 0, right: 0, top: i * 200, height: 180, background: C.card, border: `2px solid ${L.color}`, borderRadius: 12, padding: 18, opacity: p, transform: `translateX(${offX}px)`, boxShadow: L.color === C.green && lockP > 0 ? `0 0 30px ${C.green}44` : 'none'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                    <div style={{width: 50, height: 50, borderRadius: 8, background: L.color, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700}}>
                      {L.n}
                    </div>
                    <div>
                      <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text}}>{L.name}</div>
                      <div style={{fontFamily: MONO, fontSize: 14, color: L.color}}>{L.sub}</div>
                    </div>
                    {L.lock && lockP > 0 && (
                      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, opacity: lockP, transform: `scale(${0.6 + 0.4 * lockP})`}}>
                        <svg width="32" height="32" viewBox="0 0 32 32">
                          <rect x="6" y="14" width="20" height="14" rx="2" fill={C.green} />
                          <path d="M10 14 V9 a6 6 0 0 1 12 0 V14" fill="none" stroke={C.green} strokeWidth="2.5" />
                          <circle cx="16" cy="21" r="2" fill="#0B1222" />
                        </svg>
                        <span style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.green}}>Protected</span>
                      </div>
                    )}
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 16, color: C.muted, marginTop: 14}}>{L.desc}</div>
                  <div style={{marginTop: 10, fontFamily: MONO, fontSize: 12, color: C.muted, background: C.deep, padding: '6px 12px', borderRadius: 6, display: 'inline-block'}}>
                    {L.n === '01' && '01_Raw_Data'}
                    {L.n === '02' && '02_Calculations'}
                    {L.n === '03' && '03_Executive_Dashboard'}
                  </div>
                </div>

                {/* Arrow between layers */}
                {i < LAYERS.length - 1 && (
                  <div style={{position: 'absolute', left: 440, top: i * 200 + 180, width: 30, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: layerP(i + 1)}}>
                    <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2 L10 16 M4 10 L10 16 L16 10" fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={sealP} color={C.purple} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>3-Layer Workbook Model ──► Raw Data ──► Calculations ──► Protected Dashboard UI</span>
        </div>
      </div>

      <Caption text="3-Color Restraint Rule ──► Neutral Base + 1 Brand Color + Semantic Alerts (Green / Red)" from={60} to={630} tone="normal" />
      <Caption text="3-Layer Workbook Model ──► Raw Data ──► Calculations ──► Protected Dashboard UI" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
