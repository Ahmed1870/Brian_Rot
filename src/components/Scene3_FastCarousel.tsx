import React from 'react';
import {C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';
import {SceneShell} from '../lib/ui';
import {Paper} from './Paper';

const CW = 840, CH = 1040;
const FLIPS = [288, 318, 348]; // frames where card i turns away
const BTN = 366;

const Row: React.FC<{y: number; t: number; i: number; children: React.ReactNode; h?: number}> = ({y, t, i, children, h = 64}) => {
  const a = easeOut(ramp(t, i * 4, i * 4 + 12));
  return <div style={{position: 'absolute', left: 40, right: 40, top: y, height: h, opacity: a, transform: `translateX(${(1 - a) * 40}px)`, display: 'flex', alignItems: 'center', direction: 'rtl'}}>{children}</div>;
};
const cell = (w: number | string, fill?: string, color: string = C.carbon, bold = false): React.CSSProperties => ({
  width: w, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: fill, color, fontFamily: CAIRO, fontWeight: bold ? 900 : 700, fontSize: 30, border: `1.5px solid ${C.grid}`, boxSizing: 'border-box',
});

const Budget: React.FC<{t: number}> = ({t}) => (
  <>
    {[['إيجار', '4,500', 0.9], ['أكل', '3,200', 0.65], ['مواصلات', '900', 0.2], ['جمعية', '1,000', 0.25], ['ادخار', '1,500', 0.32]].map(([n, v, b], i) => (
      <Row key={i} y={330 + i * 80} t={t} i={i}>
        <div style={cell(190, i === 0 ? undefined : undefined)}>{n}</div>
        <div style={cell(170, undefined, C.carbon, true)}>{v}</div>
        <div style={{flex: 1, height: '100%', border: `1.5px solid ${C.grid}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 10px'}}>
          <div style={{height: 28, width: `${(b as number) * 100 * easeOut(ramp(t, 8 + i * 4, 26 + i * 4))}%`, background: C.emerald, borderRadius: 4}} />
        </div>
      </Row>
    ))}
    <Row y={750} t={t} i={5} h={78}><div style={cell(190, C.carbon, C.cream, true)}>المجموع</div><div style={{...cell(170, C.carbon, C.cream, true), fontSize: 34}}>11,100</div><div style={cell('auto', C.emerald, C.cream, true)}>متبقي 3,900</div></Row>
  </>
);
const Pricing: React.FC<{t: number}> = ({t}) => (
  <>
    {[['التكلفة', '180'], ['هامش الربح', '40%'], ['الضرايب', '14%']].map(([n, v], i) => (
      <Row key={i} y={330 + i * 86} t={t} i={i} h={70}><div style={cell(300, C.paperDark)}>{n}</div><div style={cell('auto', undefined, C.carbon, true)}>{v}</div></Row>
    ))}
    <div style={{position: 'absolute', left: 40, right: 40, top: 640, height: 200, background: C.emerald, color: C.cream, borderRadius: 10, direction: 'rtl', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: CAIRO, opacity: easeOut(ramp(t, 16, 30)), transform: `scale(${0.9 + 0.1 * easeOut(ramp(t, 16, 30))})`}}>
      <div style={{fontWeight: 700, fontSize: 34}}>سعر البيع المقترح</div>
      <div style={{fontWeight: 900, fontSize: 96, lineHeight: 1.05, direction: 'ltr'}}>252 <span style={{fontSize: 40}}>EGP</span></div>
    </div>
  </>
);
const Invoice: React.FC<{t: number}> = ({t}) => (
  <>
    <Row y={330} t={t} i={0} h={56}><div style={cell('auto', C.carbon, C.cream, true)}>فاتورة #0042</div></Row>
    {[['تصميم هوية', '2,000'], ['إدارة محتوى', '1,200'], ['ضريبة 14%', '650']].map(([n, v], i) => (
      <Row key={i} y={400 + i * 74} t={t} i={i + 1} h={64}><div style={cell('auto', undefined)}>{n}</div><div style={cell(210, undefined, C.carbon, true)}>{v}</div></Row>
    ))}
    <Row y={650} t={t} i={5} h={86}><div style={cell('auto', C.paperDark, C.carbon, true)}>الإجمالي</div><div style={{...cell(260, C.emerald, C.cream, true), fontSize: 38}}>3,850 EGP</div></Row>
    {t > 26 ? <div style={{position: 'absolute', left: 80, top: 790, padding: '4px 30px', border: `6px solid ${C.emerald}`, borderRadius: 10, color: C.emerald, fontFamily: CAIRO, fontWeight: 900, fontSize: 52, transform: `rotate(-9deg) scale(${0.6 + 0.4 * easeOut(ramp(t, 26, 36))})`, opacity: ramp(t, 26, 32)}}>مدفوعة</div> : null}
  </>
);
const Study: React.FC<{t: number}> = ({t}) => {
  const days = ['سبت', 'أحد', 'اثنين', 'ثلاثاء'];
  const subj: [string, string][][] = [[['رياضة', C.emerald], ['فيزياء', C.yellow]], [['لغة', C.yellow], ['رياضة', C.emerald]], [['كيمياء', C.emerald], ['مراجعة', C.paperDark]], [['فيزياء', C.yellow], ['لغة', C.emerald]]];
  return (
    <>
      <Row y={330} t={t} i={0} h={56}>{days.map((d) => <div key={d} style={cell('25%', C.carbon, C.cream, true)}>{d}</div>)}</Row>
      {[0, 1].map((r) => (
        <Row key={r} y={400 + r * 120} t={t} i={r + 1} h={104}>
          {days.map((_, c) => <div key={c} style={{...cell('25%', subj[c][r][1], subj[c][r][1] === C.emerald ? C.cream : C.carbon, true), fontSize: 28}}>{subj[c][r][0]}</div>)}
        </Row>
      ))}
      <div style={{position: 'absolute', left: 40, right: 40, top: 660, height: 170, border: `3px solid ${C.carbon}`, borderRadius: 10, direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px',
        fontFamily: CAIRO, opacity: easeOut(ramp(t, 16, 30))}}>
        <div style={{fontWeight: 900, fontSize: 44}}>المعدل التراكمي</div>
        <div style={{fontWeight: 900, fontSize: 100, color: C.emerald, direction: 'ltr'}}>3.8<span style={{fontSize: 36, color: C.carbon}}> GPA</span></div>
      </div>
    </>
  );
};

const CARDS = [
  {n: '01', title: 'ميزانية البيت والجمعيات', body: Budget},
  {n: '02', title: 'حاسبة تسعير التجارة', body: Pricing},
  {n: '03', title: 'فواتير الفريلانس والـ HR', body: Invoice},
  {n: '04', title: 'جدول المذاكرة والـ GPA', body: Study},
];

/** Frames 258-408: four tactile cards, snappy page-turns hinged on the right edge (Arabic reading order). */
export const Scene3_FastCarousel: React.FC<{f: number}> = ({f}) => {
  const enter = sp(f, SPRINGS.main, 258);
  const press = f >= BTN && f < BTN + 7;
  const btn = sp(f, SPRINGS.main, 340);
  const exit = easeOut(ramp(f, 392, 408));
  return (
    <SceneShell dur={SCENES.s3.dur} fadeIn={10} fadeOut={12}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 40, color: C.cream, letterSpacing: 1, direction: 'rtl', opacity: ramp(f, 262, 276)}}>
        مكتبة القوالب المجانية <span style={{color: C.yellow}}>·</span> <span style={{direction: 'ltr'}}>Free Templates Vault</span>
      </div>
      <div style={{position: 'absolute', left: 120, top: 250, width: CW, height: CH, perspective: 2600, perspectiveOrigin: '50% 50%', transform: `translateY(${(1 - Math.min(1.05, enter)) * 900 - exit * 900}px) scale(${0.9 + 0.1 * Math.min(1, enter)})`}}>
        {[...CARDS].map((c, i) => {
          const flipAt = FLIPS[i];
          const p = flipAt === undefined ? 0 : sp(f, SPRINGS.snap, flipAt);
          const ang = 178 * Math.min(1.04, p);
          const gone = ang > 172;
          const since = i === 0 ? f - 262 : f - (FLIPS[i - 1] + 8);
          const Body = c.body;
          if (gone) return null;
          if (i > 0 && f < FLIPS[i - 1] - 30) return null;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, width: CW, height: CH, zIndex: 10 - i, transformStyle: 'preserve-3d', transformOrigin: '100% 50%', transform: `rotateY(${ang}deg)`}}>
              <Paper r={18} style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden', direction: 'rtl'}}>
                <div style={{position: 'absolute', left: 40, right: 40, top: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: CAIRO, color: C.carbon}}>
                  <div style={{fontWeight: 900, fontSize: 36, color: C.emerald, direction: 'ltr'}}>{c.n}/04</div>
                  <div style={{fontWeight: 700, fontSize: 28, letterSpacing: 1}}>EXCEL · مجاني</div>
                </div>
                <div style={{position: 'absolute', left: 40, right: 40, top: 100, height: 5, background: C.carbon}} />
                <div style={{position: 'absolute', right: 40, left: 40, top: 130, fontFamily: CAIRO, fontWeight: 900, fontSize: 70, lineHeight: 1.15, color: C.carbon, direction: 'rtl'}}>{c.title}</div>
                <Body t={Math.max(0, since)} />
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: C.emerald}} />
                {ang > 2 ? <div style={{position: 'absolute', inset: 0, background: '#000', opacity: 0.35 * Math.sin((ang * Math.PI) / 180)}} /> : null}
              </Paper>
              <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: C.paperDark, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}} />
            </div>
          );
        })}
      </div>
      {/* one-press download */}
      {f >= 340 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1350, textAlign: 'center', opacity: clamp(btn * 3) * (1 - exit), transform: `translateY(${(1 - Math.min(1, btn)) * 60 + exit * 120}px)`}}>
          <div style={{display: 'inline-block', padding: '24px 80px', borderRadius: 22, background: C.emerald, color: C.cream, fontFamily: CAIRO, fontWeight: 900, fontSize: 58, direction: 'rtl',
            boxShadow: press ? '0 3px 0 #0A6F66' : '0 14px 0 #0A6F66, 0 26px 30px rgba(0,0,0,0.45)', transform: `translateY(${press ? 11 : 0}px)`}}>
            حمّل مجاناً
          </div>
        </div>
      ) : null}
    </SceneShell>
  );
};
