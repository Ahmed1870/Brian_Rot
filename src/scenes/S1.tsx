import {useCurrentFrame, Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {A} from '../cues';
import type {Cues} from '../cues';
import {pop} from '../lib/anim';
import {Ltr} from '../lib/ui';
import {BG, Arrow} from '../lib/pres';

const T = {prev: A('a1_prev'), four: A('a1_four'), f: A('a1_filter'), a: A('a1_all'), r: A('a1_rm'), e: A('a1_ae'), diff: A('a1_diff')};
export const CUES1: Cues = {click: [], pop: [T.prev, T.four, T.f, T.a, T.r, T.e, T.diff, T.diff + 120], key: []};

const Tile = ({fr, at, x, color, name, sub, subAt}: {fr: number; at: number; x: number; color: string; name: string; sub: string; subAt: number}) => {
  const p = pop(fr, at, 12);
  const q = pop(fr, subAt, 12);
  return (
    <div style={{position: 'absolute', left: x, top: 480 + (1 - p) * 24, width: 400, opacity: p, textAlign: 'center', direction: 'ltr'}}>
      <div style={{height: 130, lineHeight: '130px', background: color, color: C.white, fontSize: name.length > 10 ? 38 : 56, fontWeight: 700}}>{name}</div>
      <div style={{marginTop: 18, fontSize: 34, color: '#E2E8F0', direction: 'rtl', opacity: q}}>{sub}</div>
    </div>
  );
};

export const Scene1 = ({from}: {from: number}) => {
  const fr = useCurrentFrame() + from;
  const t = pop(fr, 0, 18);
  const tOut = 1 - pop(fr, T.prev - 10, 12);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: BG, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: tOut, textAlign: 'center', direction: 'rtl'}}>
        <div style={{position: 'absolute', left: 810, top: 120 + (1 - t) * 30, width: 300, height: 300, background: C.white, borderRadius: 40, opacity: t, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('logo.svg')} style={{width: 230, height: 230}} />
        </div>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 470, fontSize: 52, color: C.yellow, fontWeight: 700, opacity: pop(fr, 8, 14)}}>الدرس الأربعين</div>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 560, fontSize: 70, color: C.white, fontWeight: 700, opacity: pop(fr, 14, 16)}}>
          <Ltr>FILTER</Ltr> و<Ltr>ALL</Ltr> و<Ltr>REMOVEFILTERS</Ltr> و<Ltr>ALLEXCEPT</Ltr>
        </div>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 700, fontSize: 38, color: '#BFD3F2', opacity: pop(fr, 28, 14)}}>
          الوحدة الخامسة: أساسيات <Ltr>DAX</Ltr>
        </div>
      </div>
      <div style={{opacity: 1 - tOut}}>
        <div style={{position: 'absolute', left: 260, top: 110, width: 1400, textAlign: 'center', direction: 'rtl', fontSize: 44, color: '#BFD3F2', opacity: pop(fr, T.prev, 12)}}>
          التحكم في <Ltr>Filter Context</Ltr> باستخدام <Ltr>CALCULATE</Ltr>
        </div>
        <Arrow x={905} y={190} w={110} op={pop(fr, T.four, 12)} />
        <div style={{position: 'absolute', left: 260, top: 280, width: 1400, textAlign: 'center', direction: 'rtl', fontSize: 54, fontWeight: 700, color: C.yellow, opacity: pop(fr, T.four, 12)}}>أربع دوال للتحكم في الفلاتر بشكل أدق</div>
        <Tile fr={fr} at={T.f} x={60} color={C.blue} name="FILTER" sub="بترجع جدول" subAt={T.diff} />
        <Tile fr={fr} at={T.a} x={500} color={C.purple} name="ALL" sub="بتتجاهل فلاتر" subAt={T.diff + 12} />
        <Tile fr={fr} at={T.r} x={940} color={C.orange} name="REMOVEFILTERS" sub="بتزيل الفلاتر" subAt={T.diff + 24} />
        <Tile fr={fr} at={T.e} x={1380} color={C.green} name="ALLEXCEPT" sub="بتحافظ على فلاتر أعمدة" subAt={T.diff + 36} />
        <div style={{position: 'absolute', left: 260, top: 800, width: 1400, textAlign: 'center', direction: 'rtl', fontSize: 44, fontWeight: 700, color: C.white, opacity: pop(fr, T.diff, 12)}}>كل دالة ليها استخدام مختلف</div>
        <div style={{position: 'absolute', left: 260, top: 890, width: 1400, textAlign: 'center', direction: 'rtl', fontSize: 38, color: '#BFD3F2', opacity: pop(fr, T.diff + 120, 12)}}>
          الهدف: <Ltr>Measures</Ltr> تجاوب على أسئلة الأعمال بشكل أدق
        </div>
      </div>
    </div>
  );
};
