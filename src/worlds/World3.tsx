import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MONO} from '../fonts';
import {C, CX, CY, eo, hash, ss} from '../theme';
import {HOLE} from '../camera';
import {RiseText} from '../components/RiseText';
import {Typed} from '../components/Typed';

const PW = 430;
const PH = 560;
const N = 3;
const SW = PW / N;

const PageLeft: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, background: '#0A0A0A', color: C.white}}>
    <div style={{position: 'absolute', left: 30, top: 40, fontFamily: MONO, fontWeight: 700, fontSize: 64, lineHeight: 1.05, direction: 'ltr', textAlign: 'left'}}>
      FREE<br />
      <span style={{color: C.yellow}}>COURSES</span>
      <br />
      <span style={{fontSize: 34, color: C.cyan}}>& COMMUNITY</span>
    </div>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', left: 30, top: 340 + i * 36, width: 200 + hash(i, 2, 7) * 170, height: 8, background: 'rgba(255,255,255,0.55)'}} />
    ))}
  </div>
);
const PageRight: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, background: '#0A0A0A', color: C.white, direction: 'ltr'}}>
    {['01  EXCEL', '02  SQL', '03  PYTHON', '04  POWER BI'].map((l, i) => (
      <div key={l} style={{position: 'absolute', left: 36, top: 50 + i * 118, width: PW - 72}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34}}>{l}</div>
        <div style={{marginTop: 14, height: 8, background: 'rgba(255,255,255,0.2)'}}>
          <div style={{width: `${[88, 64, 47, 30][i]}%`, height: 8, background: i === 0 ? C.yellow : C.cyan}} />
        </div>
      </div>
    ))}
  </div>
);

type StripProps = {i: number; angle: number; dir: 1 | -1; content: React.ReactNode};
/** صفحة أوريغامي: 3 شرائح بتتفرد (Accordion Fold). dir=1 يمين، -1 شمال. */
const Strip: React.FC<StripProps> = ({i, angle, dir, content}) => {
  const a = angle * (i === 0 ? -1 : i === 1 ? 2 : -2) * dir;
  const inner =
    i < N - 1 ? (
      <Strip i={i + 1} angle={angle} dir={dir} content={content} />
    ) : null;
  const off = dir === 1 ? -i * SW : -(N - 1 - i) * SW;
  return (
    <div style={{position: 'absolute', top: i === 0 ? -PH / 2 : 0, left: dir === 1 ? (i === 0 ? 0 : SW) : i === 0 ? -SW : -SW, width: SW, height: PH, transformStyle: 'preserve-3d', transformOrigin: dir === 1 ? '0% 50%' : '100% 50%', transform: `rotateY(${a}deg)`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.7)'}}>
        <div style={{position: 'absolute', left: off, top: 0, width: PW, height: PH}}>{content}</div>
      </div>
      {inner}
    </div>
  );
};

/** العالم 3: Liquid Gold Dissolve → كتاب رقمي بفيزياء الأوريغامي + شعاع ضوئي بالرابط. */
export const World3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const unfold = (t0: number) => spring({frame: f - Math.round(t0 * fps), fps, config: {damping: 13, stiffness: 55, mass: 1.2}});
  const pR = unfold(17.4);
  const pL = unfold(17.2);
  const angR = 64 * (1 - pR);
  const angL = 64 * (1 - pL);
  const lift = 48 * (1 - eo((t - 17.0) / 1.2));
  const cover = ss(15.8, 16.7, t) * (1 - ss(17.0, 18.3, t));
  const beam = ss(18.6, 19.6, t);
  const flipT = 22.5;

  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: 'radial-gradient(ellipse at 50% 55%, rgba(255,230,0,0.14), rgba(0,0,0,0) 60%)'}} />

      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 2000, perspectiveOrigin: `${CX}px ${CY - 100}px`}}>
        <div style={{position: 'absolute', left: CX, top: CY + 40, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `rotateX(${46 - lift}deg)`}}>
          <Strip i={0} angle={angR} dir={1} content={<PageRight />} />
          <Strip i={0} angle={angL} dir={-1} content={<PageLeft />} />
          {new Array(6).fill(0).map((_, k) => {
            const u = (t - flipT - k * 0.06) / 0.34;
            if (u <= 0 || u >= 1) return null;
            return <div key={k} style={{position: 'absolute', left: 0, top: -PH / 2, width: PW, height: PH, transformOrigin: '0% 50%', transform: `rotateY(${-180 * eo(u)}deg)`, background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 2px ${C.cyan}`}} />;
          })}
        </div>
      </div>

      {/* الشعاع الضوئي */}
      <div style={{position: 'absolute', left: CX - 230, top: 360, width: 460, height: 640, opacity: beam * 0.85, clipPath: 'polygon(47% 100%, 53% 100%, 100% 0, 0 0)', background: 'linear-gradient(to top, rgba(255,230,0,0.75), rgba(255,230,0,0.05))', mixBlendMode: 'screen'}} />

      <Typed text="FREE COURSES & COMMUNITY" y={205} size={46} start={18.8} cps={30} />
      <Typed text="solutions.gomaaintelligence.me" y={290} size={52} start={19.4} cps={17} fill={C.yellow} />
      <RiseText text="FACEBOOK  ·  TIKTOK  ·  YOUTUBE  ·  INSTAGRAM" mono y={1380} size={30} start={21.4} weight={500} color={C.cyan} />
      <RiseText text="كورسات ودروس مجانية" y={1450} size={72} start={21.8} color={C.white} />

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={CX} cy={CY} r={HOLE + 4} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(t * 8)} />
        <defs>
          <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -13" />
          </filter>
          <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF28A" />
            <stop offset="55%" stopColor="#FFE600" />
            <stop offset="100%" stopColor="#E0A800" />
          </linearGradient>
        </defs>
        {cover > 0.002 && (
          <g filter="url(#goo)">
            {new Array(10).fill(0).map((_, i) => {
              const a = (i / 10) * Math.PI * 2 + t * 0.6;
              const rr = 380 * cover * (0.4 + hash(i, 1, 2));
              const r = 90 + 1500 * cover * (0.75 + 0.25 * hash(i, 4, 6)) + 20 * Math.sin(t * 6 + i);
              return <circle key={i} cx={CX + Math.cos(a) * rr} cy={CY + Math.sin(a) * rr} r={r} fill="url(#gold)" />;
            })}
          </g>
        )}
      </svg>
    </>
  );
};
