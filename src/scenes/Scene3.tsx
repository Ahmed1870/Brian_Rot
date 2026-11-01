import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {COLS, COLS_W, SheetRow} from '../data';
import {Bg, Glass} from '../components/Glass';
import {RowView} from '../components/Sheet';
import {Cursor, Ripples, pressAt} from '../components/Cursor';
import {Burst} from '../components/Particles';
import {Bi, Keycap, Pill, appear, pop} from '../components/Text';
import {CursorKey, cursorAt, eo, mix, prog, pulse, seg, soft} from '../lib/anim';

const S = TL.cues.sc03;
const TX = 90;
const TY = 250;
const HEAD = 56;
const RH = 66;
const SARA = 3; // index of Sara's single row

type Person = {name: string; email: string; initial: string; color: string};
const PEOPLE: Record<string, Person> = {
  mona: {name: 'منى حسن', email: 'mona.hassan@example.com', initial: 'م', color: C.accent},
  omar: {name: 'عمر عادل', email: 'omar.adel@example.com', initial: 'ع', color: C.violet},
  sara: {name: 'سارة علي', email: 'sara.ali@example.com', initial: 'س', color: C.green},
};
const ROWS: {who: string; phone: string; product: string; qty: string; date: string}[] = [
  {who: 'mona', phone: '01012345678', product: 'سماعة بلوتوث', qty: '1', date: '2026-10-02'},
  {who: 'omar', phone: '01198765432', product: 'ماوس لاسلكي', qty: '2', date: '2026-10-03'},
  {who: 'mona', phone: '01012345678', product: 'كيبورد ميكانيكي', qty: '1', date: '2026-10-05'},
  {who: 'sara', phone: '01112223334', product: 'سماعة بلوتوث', qty: '1', date: '2026-10-06'},
  {who: 'omar', phone: '01198765432', product: 'شاحن سريع 65W', qty: '1', date: '2026-10-07'},
  {who: 'mona', phone: '01012345678', product: 'حامل موبايل', qty: '3', date: '2026-10-08'},
];
const toRow = (r: (typeof ROWS)[number], i: number): SheetRow => ({n: 40 + i, id: '#10' + (40 + i), date: r.date, name: PEOPLE[r.who].name, phone: r.phone, address: PEOPLE[r.who].email, product: r.product, qty: r.qty, ahmed: false});
const HEAD_TITLES: Record<string, string> = {n: '#', id: 'الطلب', date: 'التاريخ', name: 'العميل', phone: 'الهاتف', address: 'البريد', product: 'المنتج', qty: 'الكمية'};

const Trash: React.FC<{c?: string; s?: number}> = ({c = C.red, s = 64}) => (
  <svg width={s} height={s} viewBox="0 0 64 64" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 18h40M24 18V10h16v8M16 18l3 36h26l3-36M27 28v16M37 28v16" />
  </svg>
);

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 75.1, 76);
  const selT = S.select;
  const delT = S.del;
  const confT = S.confirm;
  const dis = prog(t, S.dissolve[0], S.dissolve[1]);
  const rowGone = t >= S.dissolve[0] + 1.2;
  const shiftP = eo(prog(t, S.dissolve[0] + 2.2, S.dissolve[0] + 3.2));

  // camera: start close on Sara's row, then reveal the whole file + company memory
  const saraY = TY + HEAD + SARA * RH + RH / 2;
  const zoom = mix(1.38, 1, soft(prog(t, 75.6, 83)));

  const keys: CursorKey[] = [
    {x: 930, y: 150, arrive: 0, depart: 82.2},
    {x: 560, y: saraY + 6, arrive: 86.0, depart: 87.6, click: [selT]},
    {x: 1180, y: 770, arrive: 90.3, depart: 91.5},
    {x: 1229, y: 796, arrive: 91.7, depart: 99, click: [confT]},
  ];
  const cur = cursorAt(keys, t);
  const clicks = [selT, confT];
  const cursorOp = appear(t, 80, 81) * (1 - seg(t, 93, 94));

  const customers = t >= S.dissolve[0] + 2.5 ? 2 : 3;
  const saraCardP = prog(t, S.dissolve[0] + 0.7, S.dissolve[1] + 0.3);
  const people = ['mona', 'omar', 'sara'];
  const orderCount: Record<string, number> = {mona: 3, omar: 2, sara: 1};

  const tag1In = pop(t, S.tag1[0], S.tag1[0] + 0.9);
  const tag1Out = seg(t, S.tag1[1] - 0.5, S.tag1[1]);
  const tag2P = pop(t, S.tag2[0], S.tag2[0] + 0.9);
  const warn = 0.5 + 0.5 * pulse(t, 0.9);
  const lossGlow = seg(t, S.dissolve[0] + 1.5, S.tag2[0] + 1);

  const rowEls = ROWS.map((r, i) => {
    if (i === SARA && rowGone) return null;
    const row = toRow(r, i);
    let top = HEAD + i * RH;
    let op = 1;
    let sc = 1;
    if (i === SARA && t >= S.dissolve[0]) {
      op = 1 - eo(prog(t, S.dissolve[0], S.dissolve[0] + 1.1));
      sc = 1 - 0.05 * eo(prog(t, S.dissolve[0], S.dissolve[0] + 1.1));
    }
    if (i > SARA) top -= RH * shiftP;
    const selected = i === SARA && t >= selT;
    const newGlow = i === SARA && t < selT;
    return (
      <div key={i} style={{position: 'absolute', left: 0, top, width: COLS_W, height: RH, opacity: op, transform: `scale(${sc})`, transformOrigin: '50% 50%'}}>
        <RowView row={row} rowH={RH} selected={selected} bg={newGlow ? 'rgba(52,211,153,0.12)' : undefined} cell={(k) => (k === 'address' ? {color: C.dim} : undefined)} />
        {newGlow ? <div style={{position: 'absolute', left: 0, top: 8, bottom: 8, width: 5, borderRadius: 3, background: C.green, opacity: 0.5 + 0.5 * pulse(t, 1)}} /> : null}
      </div>
    );
  });

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: enter, transformOrigin: `640px ${saraY}px`, transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', left: TX, top: TY, width: COLS_W, height: HEAD + ROWS.length * RH + 24, borderRadius: 18, background: '#0D1527', border: `1.5px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: COLS_W, height: HEAD, display: 'flex', background: '#111B31', borderBottom: `2px solid ${C.line}`, zIndex: 3}}>
            {COLS.map((c) => (
              <div key={c.key as string} style={{width: c.w, display: 'flex', alignItems: 'center', padding: '0 14px', boxSizing: 'border-box', fontFamily: FONT_AR, fontWeight: 800, fontSize: 21, color: C.accent, borderRight: '1px solid rgba(71,85,105,0.35)'}}>{HEAD_TITLES[c.key as string]}</div>
            ))}
          </div>
          {rowEls}
          <Burst x={0} y={HEAD + SARA * RH} w={COLS_W} h={RH} p={dis} n={230} seed={11} colors={[C.accent, '#F8FAFC', C.green, C.violet]} spread={300} lift={150} size={11} />
        </div>

        {t >= delT - 0.3 && t < confT + 0.3 ? (
          <div style={{position: 'absolute', left: TX, top: 800, opacity: appear(t, delT - 0.3, delT) * (1 - seg(t, confT, confT + 0.3)), display: 'flex', alignItems: 'center', gap: 22}}>
            <Keycap label="Delete" down={t >= delT && t < delT + 0.5 ? 1 : 0} />
            <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 26, color: C.dim}}>إلغاء طلب سارة بناءً على رغبتها</span>
          </div>
        ) : null}
        {t >= delT + 0.3 && t < confT + 0.4 ? (
          <div style={{position: 'absolute', left: 700, top: 610, width: 660, height: 250, transform: `scale(${0.88 + 0.12 * pop(t, delT + 0.3, delT + 0.9)})`, opacity: appear(t, delT + 0.3, delT + 0.7) * (1 - seg(t, confT + 0.1, confT + 0.4)), zIndex: 30}}>
            <Glass w={660} h={250} r={24} tint={C.red} glow={36} t={t} fill="rgba(15,23,42,0.97)" style={{border: `2px solid ${C.line}`}}>
              <div style={{padding: '28px 36px', direction: 'rtl'}}>
                <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 38, color: C.text}}>حذف هذا الصف؟</div>
                <div style={{fontFamily: FONT_AR, fontWeight: 500, fontSize: 24, color: C.dim, marginTop: 8}}>الطلب رقم #1043 — سارة علي</div>
                <div style={{display: 'flex', gap: 16, marginTop: 34, justifyContent: 'flex-start'}}>
                  <div style={{width: 190, height: 64, borderRadius: 14, background: t >= confT ? '#0369a1' : C.accent2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 28, color: '#fff', boxShadow: '0 0 30px rgba(56,189,248,0.5)'}}>Delete</div>
                  <div style={{width: 190, height: 64, borderRadius: 14, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color: C.text}}>إلغاء</div>
                </div>
              </div>
            </Glass>
          </div>
        ) : null}

        {/* company memory */}
        <div style={{position: 'absolute', left: 1360, top: TY, width: 480, height: 560}}>
          <Glass w={480} h={560} t={t} glow={26}>
            <div style={{padding: '26px 30px', direction: 'rtl'}}>
              <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
                <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 36}}>ذاكرة الشركة</div>
                <div style={{fontFamily: FONT_MONO, fontSize: 17, color: C.mute, letterSpacing: 2, direction: 'ltr'}}>COMPANY MEMORY</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, marginBottom: 14}}>
                <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 24, color: C.dim}}>العملاء المسجلون</span>
                <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: customers === 2 ? C.red : C.accent, textShadow: customers === 2 ? `0 0 26px ${C.red}` : undefined}}>{customers}</span>
              </div>
              {people.map((k) => {
                const p = PEOPLE[k];
                const isSara = k === 'sara';
                const gone = isSara ? saraCardP : 0;
                const sel = isSara && t >= selT && gone === 0;
                return (
                  <div key={k} style={{position: 'relative', height: 108, marginBottom: 14}}>
                    <div style={{opacity: isSara ? 1 - eo(Math.min(1, gone * 1.6)) : 1, transform: `scale(${isSara ? 1 - 0.05 * gone : 1})`, display: 'flex', alignItems: 'center', gap: 18, height: 108, padding: '0 22px', borderRadius: 20, background: sel ? 'rgba(56,189,248,0.16)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${sel ? C.accent : 'rgba(255,255,255,0.12)'}`, boxSizing: 'border-box'}}>
                      <div style={{width: 62, height: 62, borderRadius: 31, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 900, fontSize: 34, color: C.bg}}>{p.initial}</div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 2, flex: 1}}>
                        <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30}}>{p.name}</div>
                        <div style={{fontFamily: FONT_MONO, fontSize: 17, color: C.dim, direction: 'ltr', textAlign: 'right'}}>{p.email}</div>
                      </div>
                      <Pill size={20} mono pad="4px 12px">{orderCount[k]}x</Pill>
                    </div>
                    {isSara ? <Burst x={0} y={0} w={420} h={108} p={gone} n={90} seed={21} colors={[C.green, '#F8FAFC', C.accent]} spread={220} lift={110} size={9} /> : null}
                    {isSara && gone > 0.5 ? (
                      <div style={{position: 'absolute', left: 0, top: 0, width: 420, height: 108, borderRadius: 20, border: `2px dashed ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: C.red, opacity: seg(gone, 0.5, 1) * (0.6 + 0.4 * warn), boxSizing: 'border-box'}}>?</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Glass>
        </div>

        <Ripples t={t} x={cur.x} y={cur.y} clicks={clicks} />
        <Cursor x={cur.x} y={cur.y} press={pressAt(t, clicks)} opacity={cursorOp} />
      </div>

      {t >= S.tag1[0] - 0.1 && t < S.tag1[1] + 0.3 ? (
        <div style={{position: 'absolute', left: 0, top: 70, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, tag1In * 1.4) * (1 - tag1Out), transform: `translateY(${(1 - tag1In) * -80 - tag1Out * 40}px) scale(${0.9 + 0.1 * tag1In})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, padding: '20px 54px 20px 40px', borderRadius: 30, background: 'rgba(15,23,42,0.95)', border: `2px solid ${C.red}`, boxShadow: '0 30px 90px rgba(0,0,0,0.6), 0 0 54px rgba(239,68,68,0.35)'}}>
            <Trash />
            <Bi ar="شذوذ الحذف" en="Deletion Anomaly" size={58} t={t} start={S.tag1[0] + 0.15} sep={C.red} />
          </div>
        </div>
      ) : null}

      {t >= S.tag2[0] - 0.1 ? (
        <div style={{position: 'absolute', left: 0, top: 800, width: 1920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, tag2P * 1.4), transform: `translateY(${(1 - tag2P) * 80}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, padding: '18px 50px', borderRadius: 26, background: `linear-gradient(180deg, ${C.red}, #B91C1C)`, boxShadow: `0 0 ${50 + warn * 40}px rgba(239,68,68,0.6)`}}>
            <svg width="68" height="68" viewBox="0 0 104 104"><path d="M52 8 L98 90 L6 90 Z" fill={C.amber} stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" /><rect x="48" y="38" width="8" height="30" rx="4" fill="#0F172A" /><circle cx="52" cy="78" r="5" fill="#0F172A" /></svg>
            <Bi ar="فقدان البيانات غير المقصود" en="Accidental Data Loss" size={52} t={t} start={S.tag2[0] + 0.15} color="#fff" sep={C.amber} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: appear(t, S.tag2[0] + 3, S.tag2[0] + 4)}}>
            <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 30, color: C.dim, direction: 'rtl'}}>اختفى اسم سارة وبريدها مع آخر طلب لها</span>
            <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: '#FCA5A5', background: 'rgba(127,29,29,0.5)', padding: '6px 18px', borderRadius: 12}}>customers: 3 → 2</span>
          </div>
        </div>
      ) : null}

      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none', boxShadow: `inset 0 0 ${180 * lossGlow}px rgba(239,68,68,${0.35 * lossGlow * (0.7 + 0.3 * warn)})`}} />
      <div style={{position: 'absolute', left: 90, top: 40, fontFamily: FONT_MONO, fontSize: 20, color: C.mute, opacity: enter}}><span style={{color: C.accent}}>SC03</span> flat_file / orders</div>
    </div>
  );
};
