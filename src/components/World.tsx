import React from 'react';
import {CX, CY} from '../theme';
import {HOLE} from '../camera';

type Props = {scale: number; hole?: boolean; children: React.ReactNode};

/**
 * عالم واحد: مقياس E حوالين مركز الشاشة + ثقب دائري في المنتصف (بيظهر منه العالم اللي بعده).
 * الخلفية (2400×2400) بتغطي نصف قطر ثقب العالم السابق حتى لما العالم يبقى صغير.
 */
export const World: React.FC<Props> = ({scale, hole = true, children}) => {
  const mask = hole ? `radial-gradient(circle at ${CX}px ${CY}px, transparent 0px, transparent ${HOLE - 0.4}px, #000 ${HOLE}px)` : undefined;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1080,
        height: 1920,
        transform: `scale(${scale})`,
        transformOrigin: `${CX}px ${CY}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <div style={{position: 'absolute', left: CX - 1200, top: CY - 1200, width: 2400, height: 2400, background: '#050505'}} />
      {children}
    </div>
  );
};
