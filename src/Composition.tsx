import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C, CAPTIONS} from './theme';
import {CAIRO} from './fonts';
import {Bg} from './lib/Bg';
import {Hud} from './lib/Hud';
import {Sculpture} from './lib/Sculpture';
import {Caption} from './lib/ui';

export const Main: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: CAIRO}}>
    <Audio src={staticFile('voiceover.wav')} />
    <Audio src={staticFile('sfx.wav')} volume={0.5} />
    <Bg />
    <Sculpture />
    {CAPTIONS.map((c, i) => <Caption key={i} text={c.text} from={c.from} to={c.to} y={1440} size={56} />)}
    <Hud />
  </AbsoluteFill>
);
