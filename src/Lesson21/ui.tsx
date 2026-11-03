import React from 'react';
import {C} from '../theme';
import {cairo,mono} from '../fonts';
export const Backdrop:React.FC<{eyebrow:string;title:string;sub?:string}> = ({eyebrow,title,sub}) => <div style={{position:'absolute',left:92,top:76}}>
  <div style={{fontSize:20,color:C.blue,letterSpacing:2,fontFamily:mono}}>{eyebrow}</div>
  <div style={{fontSize:46,fontWeight:700,marginTop:12}}>{title}</div>
  {sub&&<div style={{fontSize:24,color:C.muted,marginTop:8}}>{sub}</div>}
</div>;
export const Panel:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:22,padding:28,boxShadow:'0 18px 50px #02061755',...style}}>{children}</div>;
export const Code:React.FC<{lines:string[];highlight?:number;color?:string}> = ({lines,highlight=-1,color=C.blue})=><div style={{fontFamily:mono,fontSize:25,lineHeight:1.8,whiteSpace:'pre',color:C.white}}>{lines.map((l,i)=><div key={i} style={{padding:'0 12px',borderLeft:`4px solid ${i===highlight?color:'transparent'}`,background:i===highlight?'#0B1220':'transparent'}}>{l}</div>)}</div>;
export const Pill:React.FC<React.PropsWithChildren<{color?:string}>>=({children,color=C.green})=><span style={{display:'inline-block',border:`1px solid ${color}`,color,borderRadius:999,padding:'9px 18px',fontFamily:mono,fontSize:18}}>{children}</span>;
export const Cell:React.FC<{value:string;label?:string;color?:string}> = ({value,label,color=C.green})=><div style={{background:'#07131D',border:`2px solid ${color}`,boxShadow:`0 0 30px ${color}33`,borderRadius:16,padding:'22px 34px',textAlign:'center'}}><div style={{fontFamily:mono,fontSize:34,color}}>{value}</div>{label&&<div style={{fontSize:17,color:C.muted,marginTop:8}}>{label}</div>}</div>;
