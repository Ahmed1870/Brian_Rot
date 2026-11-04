import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {ENTERPRISE_CUSTOMERS} from '../data';

// SC05 (170-210s): Enterprise Data Cleansing — Manzoma Store Pipeline
// Anchors (s): 171.1 enterprise | 175.0 INITCAP(LOWER) | 180.0 regex domain | 185.0 official domain | 192.0 governance | 200.0 standardized
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const tableP = clamp(lin(f, t(180), 16));
  const sealP = pop(f, t(192));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise Data Cleansing & Governance" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={980}
        h={250}
        title="Enterprise Cleaning Pipeline · manzooma_store_db"
        lines={[
          'SELECT customer_id,',
          '       INITCAP(LOWER(first_name)) AS clean_name,',
          '       LOWER(email) AS normalized_email',
          'FROM customers',
          "WHERE email ~* '^[A-Z0-9._%+-]+@manzooma\\.com$';",
        ]}
        start={t(171.5)}
        cps={0.85}
        size={22}
        hl={f >= t(180) ? 4 : f >= t(175) ? 1 : -1}
        hlColor={f >= t(180) ? C.green : C.blue}
      />

      {/* Report panel right */}
      <Win x={1100} y={170} w={740} h={250} title="report · clean_customers" accent={C.green} opacity={clamp(lin(f, t(186), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 14, fontFamily: MONO, fontSize: 22, color: C.green}}>
          High-Precision Data Governance
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 56, right: 28, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 20}}>INITCAP(LOWER())</Chip>
          <Chip color={C.green} style={{fontSize: 20}}>~* regex domain</Chip>
          <Chip color={C.amber} style={{fontSize: 20}}>zero mismatch</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 28, right: 28, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.text, fontWeight: 700}}>
            standardized outlets ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Cleaned customer table */}
      <Win x={80} y={450} w={1760} h={420} title="cleansed & filtered output" accent={C.green} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 56, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 180}}>raw_name</span>
          <span style={{width: 220, color: C.blue}}>clean_name</span>
          <span style={{flex: 1, color: C.green}}>normalized_email</span>
          <span style={{width: 200, textAlign: 'right'}}>domain_pass</span>
        </div>
        {ENTERPRISE_CUSTOMERS.map((c, i) => {
          const rowP = clamp(pop(f, t(181 + i * 0.8)));
          const domainPass = c.domain === 'manzooma.com';
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 16, right: 16, top: 64 + i * 50, height: 46, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 24, background: domainPass ? `${C.green}14` : 'transparent', border: `1px solid ${domainPass ? C.green : C.border}`, opacity: rowP, transform: `translateX(${(1 - rowP) * 30}px)`}}>
              <span style={{width: 180, color: C.muted}}>{c.raw}</span>
              <span style={{width: 220, color: C.blue, fontWeight: 700}}>
                ──► {c.clean}
              </span>
              <span style={{flex: 1, color: C.green}}>{c.email.toLowerCase()}</span>
              <span style={{width: 200, textAlign: 'right', color: domainPass ? C.green : C.red, fontWeight: 700}}>
                {domainPass ? '✓ official' : '✗ external'}
              </span>
            </div>
          );
        })}
      </Win>

      <Caption text="Enterprise Cleaning ──► INITCAP(LOWER(name)) + Regex Domain Filtering" from={t(175)} to={t(195)} />
      <Caption text="High-Precision Data Governance ──► Zero Mismatch & Standardized Outlets" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
