import React from 'react';
import {AbsoluteFill} from 'remotion';
import './fonts';
import {AudioSFX} from './audio';
import {Scene3D} from './components/Scene3D';
import {Counter} from './components/Counter';
import {Reveal} from './components/Reveal';
import {HUD} from './components/HUD';

export const BrainRotViral: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, #0C1A3A 0%, #070D1F 48%, #03050C 100%)'}}>
    <Scene3D />
    <Counter />
    <Reveal />
    <HUD />
    <AudioSFX />
  </AbsoluteFill>
);
