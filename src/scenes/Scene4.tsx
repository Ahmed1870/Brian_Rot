// SC04 — Assign Macro, QAT & Safe Shortcuts (02:10-02:50).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check} from '../kit';
import {RECORD_DIALOG, SHORTCUT_KEYS} from '../data';

const SC = {from: 3900, dur: 1200};

export const Scene4: React.FC = () => {
  const local = useCurrentFrame();

  // Three execution methods (0-720)
  const methodP = (i: number) => interpolate(local, [0 + i * 120, 60 + i * 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Shortcut demo (540-840)
  const shortcutP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const keyPress = (i: number) => interpolate(local, [600 + i * 60, 630 + i * 60, 690 + i * 60], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Clean recording tips (840-1200)
  const tipP = interpolate(local, [840, 960], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const finalSeal = interpolate(local, [1080, 1180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="One-Click Execution UI ──► Assign Macro to Shapes & Quick Access Toolbar" from={60} to={540} color={C.amber} />

      {/* Three execution methods */}
      <div style={{position: 'absolute', left: 80, top: 180, right: 80}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>3 طرق احترافية لتشغيل الماكرو</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
          {/* Method 1: Custom Shape + Assign Macro */}
          <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, opacity: methodP(0), boxShadow: `0 0 20px ${C.amber}33`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
              <div style={{width: 36, height: 36, borderRadius: 8, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700}}>1</div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.amber}}>Custom Shape Button</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>Insert → Shapes → Assign Macro</div>
              </div>
            </div>
            {/* Shape mock */}
            <div style={{position: 'relative', height: 120, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{padding: '14px 30px', background: `linear-gradient(135deg, ${C.amber}, ${C.gold})`, color: '#0B1222', borderRadius: 8, fontFamily: FONT, fontSize: 16, fontWeight: 700, boxShadow: `0 4px 12px ${C.amber}66`, cursor: 'pointer'}}>
                ▶ تنسيق التقرير
              </div>
              {/* Right-click menu */}
              {methodP(0) > 0.8 && (
                <div style={{position: 'absolute', right: 8, top: 8, background: C.card, border: `1px solid ${C.amber}`, borderRadius: 6, padding: '6px 10px', fontFamily: FONT, fontSize: 11, color: C.amber, fontWeight: 700}}>
                  Assign Macro →
                </div>
              )}
            </div>
          </div>

          {/* Method 2: QAT */}
          <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, opacity: methodP(1), boxShadow: `0 0 20px ${C.amber}33`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
              <div style={{width: 36, height: 36, borderRadius: 8, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700}}>2</div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.amber}}>Quick Access Toolbar</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>Pin to QAT · always visible</div>
              </div>
            </div>
            {/* QAT mock */}
            <div style={{position: 'relative', height: 120, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
              <div style={{display: 'flex', gap: 6, marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 10}}>
                {/* Standard QAT icons */}
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{width: 28, height: 28, borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: 12, height: 12, background: C.muted, borderRadius: 2}} />
                  </div>
                ))}
                {/* Our macro icon */}
                <div style={{width: 28, height: 28, borderRadius: 4, background: C.amber, border: `2px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${C.amber}`}}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="3,2 12,7 3,12" fill="#0B1222" /></svg>
                </div>
                <div style={{width: 28, height: 28, borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>▼</span>
                </div>
              </div>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.amber, textAlign: 'center'}}>▲ أيقونة الماكرو مثبّتة في QAT</div>
              <div style={{marginTop: 10, padding: '6px 10px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: MONO, fontSize: 11, color: C.muted, textAlign: 'center'}}>Excel Options → Quick Access Toolbar → Customize</div>
            </div>
          </div>

          {/* Method 3: Keyboard Shortcut */}
          <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: 18, opacity: methodP(2), boxShadow: `0 0 20px ${C.amber}33`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
              <div style={{width: 36, height: 36, borderRadius: 8, background: C.amber, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700}}>3</div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.amber}}>Safe Keyboard Shortcut</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>Ctrl + Shift + Letter</div>
              </div>
            </div>
            <div style={{position: 'relative', height: 120, background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
              {SHORTCUT_KEYS.map((k, i) => {
                const press = keyPress(i);
                return (
                  <div key={i} style={{
                    width: 60, height: 60, borderRadius: 8,
                    background: press > 0.3 ? k.color : C.card,
                    color: press > 0.3 ? '#0B1222' : C.muted,
                    border: `2px solid ${k.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: MONO, fontSize: 22, fontWeight: 700,
                    transform: `translateY(${press > 0.5 ? 4 : 0}px) scale(${press > 0.5 ? 0.95 : 1})`,
                    boxShadow: press > 0.5 ? `0 0 20px ${k.color}` : 'none',
                    transition: 'all 0.1s',
                  }}>
                    {k.k}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop: 8, fontFamily: FONT, fontSize: 12, color: C.green, textAlign: 'center'}}>✓ آمن · ما يتعارضش مع Ctrl+C / Ctrl+S</div>
          </div>
        </div>
      </div>

      {/* Clean recording tips */}
      <div style={{position: 'absolute', left: 80, top: 540, right: 80, opacity: tipP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Clean Recording Tips · خطوات نظيفة</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
          <div style={{background: C.card, border: `1px solid ${C.green}`, borderRadius: 10, padding: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
              <Check size={32} p={tipP} />
              <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.green}}>Do · اعمل</span>
            </div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.8}}>
              ✓ خطط خطواتك قبل التسجيل<br />
              ✓ استخدم Select بدقة<br />
              ✓ فعّل Relative References للجداول<br />
              ✓ اختبر الماكرو على نسخة احتياطية
            </div>
          </div>
          <div style={{background: C.card, border: `1px solid ${C.red}`, borderRadius: 10, padding: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
              <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke={C.red} strokeWidth="2" /><line x1="9" y1="9" x2="23" y2="23" stroke={C.red} strokeWidth="3" strokeLinecap="round" /></svg>
              <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.red}}>Don't · ت avoids</span>
            </div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.8}}>
              ✗ نقرات عشوائية أثناء التسجيل<br />
              ✗ تمرير Scroll غير ضروري<br />
              ✗ اختيار خلايا بالخطأ<br />
              ✗ حفظ بصيغة .xlsx العادية
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: finalSeal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.amber}33`}}>
          <Check size={40} p={finalSeal} color={C.amber} />
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.amber}}>One-Click Execution Ready ──► Button + QAT + Ctrl+Shift+M</span>
        </div>
      </div>

      <Caption text="One-Click Execution UI ──► Assign Macro to Custom Shapes & Quick Access Toolbar (QAT)" from={60} to={540} tone="normal" />
      <Caption text="Safe Keyboard Shortcuts ──► Use Ctrl + Shift + Letter & Record Clean Steps Only" from={660} to={1140} tone="normal" />
    </Stage>
  );
};
