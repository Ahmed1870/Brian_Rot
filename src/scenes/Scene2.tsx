import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {AHMED, AHMED_ROWS, NEW_PHONE, isAhmed} from '../data';
import {Bg, Glass} from '../components/Glass';
import {BODY_TOP, CellStyle, ROW_H, Sheet, colX, colW, rowY} from '../components/Sheet';
import {Cursor, Ripples, pressAt} from '../components/Cursor';
import {Bi, Pill, appear, pop} from '../components/Text';
import {CursorKey, bezier, clamp, cursorAt, eo, hash, mix, prog, pulse, rng, seg, soft, typed} from '../lib/anim';

const S = TL.cues.sc02;
const PX = 60;
const PY = 170;
const PW = 1250;
const PH = 800;
const T148 = (148 - 2) * ROW_H - 300;
const fastStop = bezier(0.4, 0, 0.9, 0.75);
const typeEnd = S.typeT + S.typeText.length * S.typeDt;
const commitT = typeEnd + 0.36;

const scrollAt = (t: number): number => {
  if (t < 38) return 0;
  if (t < 44.4) return rng(t, 38, 44.4, 0, 260, soft);
  if (t < S.scroll[0]) return 260;
  if (t < S.scroll[1]) return rng(t, S.scroll[0], S.scroll[1], 260, T148, fastStop);
  const d = t - S.scroll[1];
  return T148 + 30 * Math.exp(-d * 9) * Math.sin(d * 24);
};

// minimap helpers
const MX = 1316;
const MW = 38;
const mapY = (n: number) => PY + ((n - 2) / 199) * (PH - 6);
const thumbH = ((PH - BODY_TOP) / ROW_H / 199) * (PH - 6);
const thumbTop = (sc: number) => PY + (sc / ROW_H / 199) * (PH - 6);

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const lt = t - 35;
  const sc = scrollAt(t);
  const speed = Math.abs(sc - scrollAt(t - 1 / 30)) * 30;
  const blur = clamp(speed / 900, 0, 5);
  const split = seg(t, S.split, S.split + 0.9);
  const enter = appear(t, 35.2, 36.2);

  // ---- zoom on the edited cell ---------------------------------------------------------------
  const FX = PX + colX('phone') + colW('phone') / 2;
  const FY = PY + rowY(12, 260) + ROW_H / 2;
  const zIn = seg(t, S.zoomIn[0], S.zoomIn[0] + 1.6);
  const zOut = seg(t, S.zoomIn[1], S.zoomIn[1] + 0.9);
  const zoom = 1 + 0.4 * zIn * (1 - zOut);

  // ---- redundancy sweep (50 identical rows light up) -----------------------------------------
  const hlOf = (n: number): number => {
    if (!isAhmed(n)) return 0;
    const k = AHMED_ROWS.indexOf(n);
    const a = appear(t, 38.4 + k * 0.11, 38.4 + k * 0.11 + 0.5);
    return a * (0.7 + 0.3 * pulse(t - k * 0.1, 2.2)) * (1 - 0.55 * split);
  };
  const count = Math.round(rng(t, 39, 45.6, 1, 50, eo));

  // ---- editing row 12 --------------------------------------------------------------------------
  const typedTxt = typed(S.typeText, t, S.typeT, S.typeDt);
  const editing = t >= 45.45 && t < commitT;
  const committed = t >= commitT;
  const flash = committed ? 1 - prog(t, commitT, commitT + 0.9) : 0;
  const caretOn = Math.floor(t * 3) % 2 === 0;
  const cellOf = (n: number, key: string): CellStyle | undefined => {
    if (n === 12 && key === 'phone') {
      if (committed) return {text: NEW_PHONE, bg: `rgba(251,191,36,${0.2 + flash * 0.25})`, color: C.amber, glow: flash > 0.05 ? C.green : undefined};
      if (editing) {
        if (t < S.typeT) return {text: AHMED.phone, bg: 'rgba(56,189,248,0.4)', outline: C.accent};
        return {text: typedTxt, outline: C.accent, caret: caretOn, bg: 'rgba(56,189,248,0.12)'};
      }
    }
    if (n === 148 && key === 'phone' && t >= S.scroll[1] - 0.5) {
      const p = 0.5 + 0.5 * pulse(t, 1.2);
      return {bg: `rgba(239,68,68,${0.12 + 0.12 * p})`, color: '#FCA5A5', outline: t >= 57.7 ? C.red : undefined};
    }
    return undefined;
  };
  const selRow = t >= 45.2 && t < 48.2 ? 12 : t >= 57.7 ? 148 : null;

  // ---- cursor -------------------------------------------------------------------------------------
  const keysA: CursorKey[] = [
    {x: 780, y: 380, arrive: 0, depart: 43.7},
    {x: FX + 40, y: FY + 8, arrive: 44.8, depart: 47.95, click: [45.2, 45.45]},
    {x: MX + 19, y: thumbTop(260) + thumbH / 2, arrive: 48.8, depart: 49},
  ];
  const keysB: CursorKey[] = [
    {x: MX + 19, y: thumbTop(T148) + thumbH / 2, arrive: 0, depart: 56.3},
    {x: FX + 40, y: PY + rowY(148, T148) + ROW_H / 2 + 8, arrive: 57.4, depart: 58.4, click: [57.7]},
    {x: 1020, y: 620, arrive: 59.4, depart: 99},
  ];
  let cur = {x: 0, y: 0, moving: false};
  if (t < 49) cur = cursorAt(keysA, t);
  else if (t < 56.3) cur = {x: MX + 19, y: thumbTop(sc) + thumbH / 2, moving: true};
  else cur = cursorAt(keysB, t);
  const clicks = [45.2, 45.45, 49.05, 57.7];
  const cursorOpacity = appear(t, 35.5, 36.5) * (1 - seg(t, 59.2, 60));

  // ---- formula bar ---------------------------------------------------------------------------------
  let addr = '';
  let fx = '';
  if (t >= 57.7) {
    addr = 'E148';
    fx = AHMED.phone;
  } else if (t >= 45.2 && t < 48.2) {
    addr = 'E12';
    fx = committed ? NEW_PHONE : t < S.typeT ? AHMED.phone : typedTxt;
  }
  const centerRow = Math.round(2 + (sc + 330) / ROW_H);

  // ---- right card (redundancy) ----------------------------------------------------------------------
  const cardIn = pop(t, S.tag1[0], S.tag1[0] + 0.9);
  const cardOut = seg(t, S.tag1[1], S.tag1[1] + 0.8);
  const cardX = 1376 + (1 - cardIn) * 560 + cardOut * 560;

  // ---- split alert ----------------------------------------------------------------------------------
  const linkDraw = seg(t, S.split + 0.6, S.link, eo);
  const glitchP = prog(t, S.link, S.link + 0.45);
  const glitch = glitchP > 0 && glitchP < 1 ? (hash(Math.floor(t * 30) * 1.7) - 0.5) * 36 * (1 - glitchP) : 0;
  const alertIn = seg(t, S.split, S.split + 0.8);
  const warnPulse = 0.5 + 0.5 * pulse(t, 0.8);
  const mmTxt = 'Row 12: 01099999999 vs Row 148: 01000000001';
  const mm = typed(mmTxt, t, S.mismatch[0], 0.035);
  const mmVis = appear(t, S.mismatch[0] - 0.3, S.mismatch[0] + 0.3) * (1 - seg(t, S.tag2[1] + 0.4, S.tag2[1] + 1));

  const topTicketY = 330;
  const botTicketY = 690;
  const ticketX = 410;
  const ticketW = 1100;
  const ticketH = 120;
  const linkX = ticketX + 24 + 150 + 230 + 160;

  const ticket = (label: string, accent: string, phone: string, phoneColor: string, y: number, fromLeft: boolean, delay: number) => {
    const e = eo(prog(t, S.split + delay, S.split + delay + 0.8));
    const off = (1 - e) * (fromLeft ? -1500 : 1500);
    return (
      <div style={{position: 'absolute', left: ticketX + off + glitch * (fromLeft ? 1 : -1), top: y, width: ticketW, height: ticketH}}>
        <Glass w={ticketW} h={ticketH} r={22} tint={accent} glow={26} t={t} style={{border: `2px solid ${accent}`}}>
          <div style={{position: 'absolute', left: 24, top: 0, bottom: 0, width: 150, display: 'flex', alignItems: 'center'}}>
            <Pill bg={`${accent}26`} color={accent} border={accent} size={26} mono>{label}</Pill>
          </div>
          <div style={{position: 'absolute', left: 24 + 150, top: 0, bottom: 0, width: 230, display: 'flex', alignItems: 'center', fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: C.text, direction: 'rtl'}}>{AHMED.name}</div>
          <div style={{position: 'absolute', left: 24 + 150 + 230, top: 0, bottom: 0, width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 38, color: phoneColor, textShadow: `0 0 22px ${phoneColor}`}}>{phone}</div>
          <div style={{position: 'absolute', left: 24 + 150 + 230 + 320 + 10, top: 0, bottom: 0, right: 20, display: 'flex', alignItems: 'center', fontFamily: FONT_AR, fontWeight: 500, fontSize: 24, color: C.dim, direction: 'rtl'}}>{AHMED.address}</div>
        </Glass>
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      {/* ------- spreadsheet world (zooms on the edited cell) ------- */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, clipPath: 'inset(0px 0px 0px 0px)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${FX}px ${FY}px`, transform: `scale(${zoom}) translateY(${(1 - split) * 0 + split * 10}px)`, opacity: enter * (1 - split * 0.82)}}>
        {/* formula bar */}
        <div style={{position: 'absolute', left: PX, top: 96, width: PW, height: 56, display: 'flex', alignItems: 'center', gap: 0, background: '#111B31', border: `1.5px solid ${C.line}`, borderRadius: 14, overflow: 'hidden', opacity: 1 - split}}>
          <div style={{width: 120, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: addr ? C.accent : C.mute, borderRight: `1.5px solid ${C.line}`}}>{addr || '—'}</div>
          <div style={{width: 64, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontStyle: 'italic', fontSize: 24, color: C.mute, borderRight: `1.5px solid ${C.line}`}}>fx</div>
          <div style={{flex: 1, padding: '0 22px', fontFamily: FONT_MONO, fontSize: 26, color: C.text}}>
            {fx}
            {editing && t >= S.typeT && caretOn ? <span style={{display: 'inline-block', width: 3, height: 28, background: C.accent, marginLeft: 2, verticalAlign: 'middle'}} /> : null}
          </div>
          <div style={{padding: '0 22px', fontFamily: FONT_MONO, fontSize: 18, color: C.mute}}>Manzooma_Sales_FINAL_v2.xlsx</div>
        </div>

        <Sheet x={PX} y={PY} w={PW} h={PH} scrollY={sc} lastRow={200} hlOf={hlOf} cellOf={cellOf} selRow={selRow} selCol="phone" blur={blur} />

        {/* speed streaks while scrolling fast */}
        {blur > 0.6 ? <div style={{position: 'absolute', left: PX, top: PY + BODY_TOP, width: PW, height: PH - BODY_TOP, background: `repeating-linear-gradient(180deg, rgba(56,189,248,${0.05 * blur}) 0px, rgba(56,189,248,0) 14px, rgba(56,189,248,${0.04 * blur}) 30px)`, pointerEvents: 'none'}} /> : null}

        {/* minimap: where the 50 copies live */}
        <div style={{position: 'absolute', left: MX, top: PY, width: MW, height: PH, borderRadius: 12, background: '#0D1527', border: `1.5px solid ${C.line}`, opacity: 1 - split}}>
          {AHMED_ROWS.map((n, k) => {
            const a = appear(t, 38.4 + k * 0.11, 38.4 + k * 0.11 + 0.4);
            return <div key={n} style={{position: 'absolute', left: 5, width: MW - 10, top: mapY(n) - PY, height: 3, borderRadius: 2, background: n === 12 && committed ? C.amber : n === 148 && t >= S.scroll[1] ? C.red : C.accent, opacity: a * 0.9}} />;
          })}
          <div style={{position: 'absolute', left: 1, width: MW - 4, top: thumbTop(sc) - PY, height: thumbH, border: '2px solid #F8FAFC', borderRadius: 6, background: 'rgba(248,250,252,0.12)'}} />
          {committed ? <div style={{position: 'absolute', left: -2, top: mapY(12) - PY - 11, fontFamily: FONT_MONO, fontSize: 13, color: C.bg, background: C.amber, borderRadius: 4, padding: '0 3px', fontWeight: 700}}>12</div> : null}
          {t >= S.scroll[1] ? <div style={{position: 'absolute', left: -6, top: mapY(148) - PY - 11, fontFamily: FONT_MONO, fontSize: 13, color: '#fff', background: C.red, borderRadius: 4, padding: '0 3px', fontWeight: 700}}>148</div> : null}
        </div>

        <Ripples t={t} x={cur.x} y={cur.y} clicks={clicks} />
        <Cursor x={cur.x} y={cur.y} press={pressAt(t, clicks)} opacity={cursorOpacity} />
      </div>
      </div>

      {/* ------- redundancy card ------- */}
      {t >= S.tag1[0] - 0.1 && t < S.tag1[1] + 1 ? (
        <div style={{position: 'absolute', left: cardX, top: PY, width: 494, height: PH}}>
          <Glass w={494} h={PH} t={t} glow={34} tint={C.accent} fill="linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(22,32,52,0.985)">
            <div style={{padding: '34px 38px', display: 'flex', flexDirection: 'column', gap: 22, height: '100%', boxSizing: 'border-box'}}>
              <Bi ar="تكرار البيانات" en="Data Redundancy" size={56} t={t} start={S.tag1[0] + 0.15} stack />
              <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl'}}>
                <div style={{width: 76, height: 76, borderRadius: 38, background: `linear-gradient(135deg, ${C.accent}, ${C.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 900, fontSize: 40, color: C.bg}}>أ</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                  <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 36}}>{AHMED.name}</div>
                  <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.dim, direction: 'ltr', textAlign: 'right'}}>{AHMED.phone}</div>
                </div>
              </div>
              <div style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 24, color: C.dim, direction: 'rtl'}}>{AHMED.address}</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 14, direction: 'ltr'}}>
                <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 128, lineHeight: 1, color: count >= 50 ? C.amber : C.accent, textShadow: `0 0 40px ${count >= 50 ? C.amber : C.accent}`}}>×{count}</span>
                <span style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.text, direction: 'rtl'}}>صفاً</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6}}>
                {Array.from({length: 50}).map((_, i) => {
                  const on = i < count;
                  const fresh = on && i >= count - 3;
                  return (
                    <div key={i} style={{height: 40, borderRadius: 7, background: on ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${on ? (fresh ? '#fff' : 'rgba(56,189,248,0.7)') : 'rgba(255,255,255,0.08)'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '0 6px'}}>
                      {on ? (
                        <>
                          <div style={{height: 4, borderRadius: 2, background: C.accent, opacity: 0.9}} />
                          <div style={{height: 4, borderRadius: 2, background: C.accent, opacity: 0.6, width: '70%'}} />
                          <div style={{height: 4, borderRadius: 2, background: C.accent, opacity: 0.4}} />
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', direction: 'rtl', marginTop: 'auto'}}>
                {['الاسم', 'الهاتف', 'العنوان'].map((x, i) => (
                  <Pill key={x} size={22} style={{opacity: appear(t, 42 + i * 0.4)}}>
                    {x} × 50
                  </Pill>
                ))}
              </div>
            </div>
          </Glass>
        </div>
      ) : null}

      {/* rolling row indicator while the scroll runs */}
      {t >= S.scroll[0] && t < S.split + 0.5 ? (
        <div style={{position: 'absolute', left: 1376, top: PY, width: 494, opacity: appear(t, S.scroll[0], S.scroll[0] + 0.4) * (1 - split)}}>
          <Glass w={494} h={150} t={t} glow={20}>
            <div style={{padding: '22px 34px', display: 'flex', flexDirection: 'column', gap: 4}}>
              <div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.mute, letterSpacing: 3}}>SCROLL → ROW</div>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 82, lineHeight: 1.05, color: t >= S.scroll[1] ? C.red : C.accent}}>{String(Math.min(148, Math.max(2, centerRow))).padStart(4, '0')}</div>
            </div>
          </Glass>
        </div>
      ) : null}

      {/* ------- split alert: row 12 vs row 148 ------- */}
      {t >= S.split - 0.1 ? (
        <>
          {/* split alert box: two halves slide together */}
          <div style={{position: 'absolute', left: 0, top: 128, width: 1920, height: 112, opacity: alertIn * (1 - seg(t, S.tag2[1] + 0.4, S.tag2[1] + 1))}}>
            <div style={{position: 'absolute', left: 960 - 520 - (1 - alertIn) * 700 + glitch, top: 0, width: 515, height: 112, background: `linear-gradient(135deg, ${C.redDeep}, #B91C1C)`, border: `2px solid ${C.red}`, borderRadius: '24px 6px 6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${30 + warnPulse * 30}px rgba(239,68,68,.55)`}}>
              <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 40, color: '#fff'}}>Data Inconsistency</span>
            </div>
            <div style={{position: 'absolute', left: 960 + 5 + (1 - alertIn) * 700 - glitch, top: 0, width: 515, height: 112, background: `linear-gradient(135deg, #B91C1C, ${C.red})`, border: `2px solid ${C.red}`, borderRadius: '6px 24px 24px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${30 + warnPulse * 30}px rgba(239,68,68,.55)`}}>
              <span style={{fontFamily: FONT_AR, fontWeight: 900, fontSize: 52, color: '#fff', direction: 'rtl'}}>تضارب البيانات</span>
            </div>
            <div style={{position: 'absolute', left: 960 - 26, top: 28, width: 52, height: 52, borderRadius: 26, background: C.bg, border: `3px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: C.amber, opacity: alertIn}}>≠</div>
          </div>

          {ticket('ROW 12', C.amber, committed ? NEW_PHONE : AHMED.phone, C.green, topTicketY, true, 0.1)}
          {ticket('ROW 148', C.red, AHMED.phone, '#FCA5A5', botTicketY, false, 0.25)}

          {/* red dotted link with pulsing warning */}
          <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}}>
            <line x1={linkX + glitch} y1={topTicketY + ticketH} x2={linkX - glitch} y2={topTicketY + ticketH + (botTicketY - topTicketY - ticketH) * linkDraw} stroke={C.red} strokeWidth={5 + warnPulse * (t >= S.link ? 3 : 0)} strokeDasharray="4 14" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={0.95} />
          </svg>
          {linkDraw > 0.9 ? (
            <div style={{position: 'absolute', left: linkX - 52 + glitch, top: topTicketY + ticketH + 60, width: 104, height: 104, opacity: appear(t, S.link - 0.1, S.link + 0.25), transform: `scale(${0.9 + warnPulse * 0.18})`}}>
              <svg width="104" height="104" viewBox="0 0 104 104" style={{filter: `drop-shadow(0 0 ${14 + warnPulse * 18}px ${C.red})`}}>
                <path d="M52 8 L98 90 L6 90 Z" fill={C.red} stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
                <rect x="48" y="38" width="8" height="30" rx="4" fill="#fff" />
                <circle cx="52" cy="78" r="5" fill="#fff" />
              </svg>
            </div>
          ) : null}

          {/* red mismatch code box */}
          <div style={{position: 'absolute', left: 410, top: 870, width: 1100, height: 92, opacity: mmVis}}>
            <div style={{width: 1100, height: 92, borderRadius: 18, background: 'rgba(127,29,29,0.55)', border: `2px solid ${C.red}`, boxShadow: `0 0 36px rgba(239,68,68,${0.25 + warnPulse * 0.3})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 36, color: '#FECACA', letterSpacing: 0.5, direction: 'ltr'}}>
              <span>{mm}</span>
              <span style={{display: 'inline-block', width: 4, height: 38, background: '#FECACA', marginLeft: 4, opacity: Math.floor(t * 3) % 2 === 0 ? 1 : 0}} />
            </div>
          </div>
        </>
      ) : null}

      {/* scene label */}
      <div style={{position: 'absolute', left: PX, top: 40, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT_MONO, fontSize: 20, color: C.mute, opacity: enter * (1 - split) * (1 - zIn * (1 - zOut))}}>
        <span style={{color: C.accent}}>SC02</span>
        <span>flat_file / sales / {lt < 0 ? 0 : Math.round(lt)}s</span>
      </div>
    </div>
  );
};
