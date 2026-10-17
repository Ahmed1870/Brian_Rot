import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {camAt, layerTransform, layerVisible, logZoom, timeEff} from './lib/camera';
import {TypographyScene} from './components/TypographyScene';
import {SplitScreen} from './components/SplitScreen';
import {DashboardScene} from './components/DashboardScene';
import {SealScene} from './components/SealScene';

const SCENES = [TypographyScene, SplitScreen, DashboardScene, SealScene];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const f = timeEff(frame); // content clock (rewinds in the last 34 frames => exact loop)
  const S = Math.exp(logZoom(frame));
  const cam = camAt(S);
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      {/* sound design: stems fired on exact scene frames */}
      <Audio src={staticFile('voiceover.wav')} />
      <Sequence from={0} layout="none"><Audio src={staticFile('bass.mp3')} /></Sequence>
      <Sequence from={240} layout="none"><Audio src={staticFile('servo.mp3')} /></Sequence>
      <Sequence from={540} layout="none"><Audio src={staticFile('fluid.mp3')} /></Sequence>
      <Sequence from={780} layout="none"><Audio src={staticFile('ping.mp3')} /></Sequence>

      {/* one continuous camera: every scene is a layer nested inside the previous scene's portal */}
      {SCENES.map((Scene, i) => {
        if (!layerVisible(i, S)) return null;
        const {css} = layerTransform(i, S, cam);
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden', transformOrigin: '0 0', transform: css, background: C.bg}}>
            <Scene f={f} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
