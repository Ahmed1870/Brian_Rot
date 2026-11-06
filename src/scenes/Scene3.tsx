import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {TRIGGER_FN_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Trigger Function & CREATE TRIGGER — RETURNS TRIGGER + CREATE TRIGGER ... EXECUTE FUNCTION + NEW/OLD/TG_OP magic vars
// Anchors: 86.0 RETURNS TRIGGER | 90.0 CREATE TRIGGER | 95.0 EXECUTE FUNCTION | 100.0 NEW | 110.0 OLD | 118.0 TG_OP | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const returnsP = pop(f, t(86));
  const createP = pop(f, t(90));
  const execP = pop(f, t(95));
  const newP = pop(f, t(100));
  const oldP = pop(f, t(110));
  const tgopP = pop(f, t(118));
  const sealP = pop(f, t(125));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.2);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="دوال المُحفّزات ومتغيراتها | Trigger Function (RETURNS TRIGGER) &amp; Magic Variables (NEW · OLD · TG_OP)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: Trigger function + CREATE TRIGGER editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={920}
          h={420}
          title="Query Editor · CREATE FUNCTION ... RETURNS TRIGGER + CREATE TRIGGER ... EXECUTE FUNCTION"
          lines={TRIGGER_FN_CODE.concat([
            '',
            '-- RETURNS TRIGGER is mandatory',
            '-- CREATE TRIGGER binds it to table + event',
            '-- EXECUTE FUNCTION wires the trigger to the fn',
          ])}
          start={t(86.5)}
          cps={0.5}
          size={15}
          accent={C.purple}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 610, width: 920, opacity: clamp(lin(f, t(90), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Trigger function anatomy:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={returnsP} size={16} color={C.blue} /> RETURNS TRIGGER
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={createP} size={16} color={C.purple} /> CREATE TRIGGER
          </Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={execP} size={16} color={C.amber} /> EXECUTE FUNCTION
          </Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={newP} size={16} color={C.blue} /> NEW
          </Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={oldP} size={16} color={C.amber} /> OLD
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={tgopP} size={16} color={C.purple} /> TG_OP
          </Chip>
        </div>
      </div>

      {/* Magic variables explanation panel */}
      <div style={{position: 'absolute', left: 80, top: 690, width: 920, opacity: clamp(pop(f, t(100)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.purple}`, borderRadius: 16, background: `${C.purple}0d`, boxShadow: `0 0 24px ${C.purple}33`}}>
          <Check p={sealP} size={44} color={C.purple} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.purple, fontWeight: 700}}>Magic Variables ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>NEW = incoming row · OLD = original row · TG_OP = operation type (INSERT/UPDATE/DELETE)</div>
          </div>
        </div>
      </div>

      {/* Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 800, width: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Trigger Function &amp; CREATE TRIGGER Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>RETURNS TRIGGER · EXECUTE FUNCTION · NEW · OLD · TG_OP — full trigger API</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Magic variable cards popping up */}
      <Win x={1020} y={170} w={820} h={720} title="magic variables ──► NEW (blue) · OLD (amber) · TG_OP (purple) pop into scope" accent={C.purple} opacity={clamp(lin(f, t(95), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          trigger function exposes magic variables ──► NEW · OLD · TG_OP available inside body
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>NEW</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>OLD</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>TG_OP</Chip>
        </div>

        {/* SVG: function with magic variable cards popping up */}
        <svg width={780} height={620} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Trigger function box (center) */}
          <g style={{opacity: clamp(returnsP)}}>
            <rect x={200} y={240} width={380} height={120} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.blue})`}} />
            <text x={390} y={270} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">fn_audit() RETURNS TRIGGER</text>
            <text x={390} y={294} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">trigger function body</text>
            <text x={390} y={316} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">accesses NEW / OLD / TG_OP</text>
            <text x={390} y={338} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETURN NEW;</text>
          </g>

          {/* EXECUTE FUNCTION arrow (right side, amber) */}
          <g style={{opacity: clamp(execP)}}>
            <line x1={580} y1={300} x2={660} y2={300} stroke={C.amber} strokeWidth={4} strokeDasharray="6 4" opacity={0.8} />
            <polygon points="656,294 656,306 670,300" fill={C.amber} />
            <text x={620} y={290} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">EXECUTE</text>

            {/* Bound table */}
            <rect x={660} y={265} width={120} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={720} y={290} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_customers</text>
            <text x={720} y={308} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">BEFORE UPDATE</text>
            <text x={720} y={324} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">FOR EACH ROW</text>
          </g>

          {/* === NEW card (top-left, blue) — pops up from above fn === */}
          <g style={{opacity: clamp(newP), transform: `translate(0px, ${(1 - clamp(newP)) * -30}px)`}}>
            <rect x={40} y={40} width={220} height={150} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={150} y={70} fill={C.blue} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">NEW</text>
            <text x={150} y={92} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">post-modification row</text>
            <line x1={60} y1={104} x2={240} y2={104} stroke={C.blue} strokeWidth={1} opacity={0.5} />
            <text x={150} y={124} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">scope:</text>
            <text x={150} y={142} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">INSERT · UPDATE</text>
            <text x={150} y={160} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">incoming values ✓</text>
            <text x={150} y={178} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">NEW.balance, NEW.id ...</text>
          </g>

          {/* NEW arrow down to function */}
          <g style={{opacity: clamp(newP)}}>
            <path d="M 200 190 Q 240 215 290 240" stroke={C.blue} strokeWidth={2.5} strokeDasharray="5 3" fill="none" opacity={0.7} />
            <text x={250} y={220} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">NEW ●</text>
          </g>

          {/* === OLD card (top-right, amber) — pops up from above fn === */}
          <g style={{opacity: clamp(oldP), transform: `translate(0px, ${(1 - clamp(oldP)) * -30}px)`}}>
            <rect x={520} y={40} width={220} height={150} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.amber})`}} />
            <text x={630} y={70} fill={C.amber} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">OLD</text>
            <text x={630} y={92} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">pre-modification row</text>
            <line x1={540} y1={104} x2={720} y2={104} stroke={C.amber} strokeWidth={1} opacity={0.5} />
            <text x={630} y={124} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">scope:</text>
            <text x={630} y={142} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">UPDATE · DELETE</text>
            <text x={630} y={160} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">original values ✓</text>
            <text x={630} y={178} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">OLD.balance, OLD.id ...</text>
          </g>

          {/* OLD arrow down to function */}
          <g style={{opacity: clamp(oldP)}}>
            <path d="M 600 190 Q 540 215 490 240" stroke={C.amber} strokeWidth={2.5} strokeDasharray="5 3" fill="none" opacity={0.7} />
            <text x={560} y={220} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">● OLD</text>
          </g>

          {/* === TG_OP card (bottom, purple) — pops up from below fn === */}
          <g style={{opacity: clamp(tgopP), transform: `translate(0px, ${(1 - clamp(tgopP)) * 30}px)`}}>
            <rect x={280} y={440} width={220} height={140} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={390} y={470} fill={C.purple} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">TG_OP</text>
            <text x={390} y={492} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">operation identifier</text>
            <line x1={300} y1={504} x2={480} y2={504} stroke={C.purple} strokeWidth={1} opacity={0.5} />
            <text x={390} y={524} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">values:</text>
            <text x={390} y={544} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">'INSERT' · 'UPDATE' · 'DELETE'</text>
            <text x={390} y={564} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">branch on operation type</text>
          </g>

          {/* TG_OP arrow up to function */}
          <g style={{opacity: clamp(tgopP)}}>
            <line x1={390} y1={440} x2={390} y2={360} stroke={C.purple} strokeWidth={2.5} strokeDasharray="5 3" opacity={0.7} />
            <polygon points="386,364 394,364 390,354" fill={C.purple} />
            <text x={420} y={400} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">TG_OP ●</text>
          </g>

          {/* CREATE TRIGGER banner at top */}
          <g style={{opacity: clamp(createP)}}>
            <rect x={40} y={600} width={700} height={30} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={1.5} strokeDasharray="5 3" rx={6} />
            <text x={390} y={620} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE TRIGGER ... BEFORE UPDATE ON store_customers FOR EACH ROW EXECUTE FUNCTION fn_audit();</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>NEW ✓</span>
          <span style={{color: C.amber}}>OLD ✓</span>
          <span style={{color: C.purple}}>TG_OP ✓</span>
        </div>
      </Win>

      <Caption text="RETURNS TRIGGER ──► CREATE TRIGGER ──► EXECUTE FUNCTION ──► NEW ──► OLD ──► TG_OP ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
