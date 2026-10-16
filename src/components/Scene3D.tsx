import React, {useLayoutEffect, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {drawScene, H, shakeAt, W} from '../engine';

/** Canvas 3D: كل فريم بيترسم من الصفر كدالة في الزمن (حتمي 100%). */
export const Scene3D: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const t = f / fps;
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) drawScene(ctx, t);
  }, [t]);
  const sh = shakeAt(t, f);
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translate(${sh.x}px, ${sh.y}px)`}} />;
};
