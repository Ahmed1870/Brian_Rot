import {interpolate, Easing} from 'remotion';
export const clamp = (f:number, a:number, b:number) =>
  interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
export const springPop = (f:number, start:number, duration=24) => clamp(f,start,start+duration);
