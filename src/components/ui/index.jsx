import { useState, useRef, useMemo } from 'react';
import { C } from '../lib/tokens.js';

function Ring({score,size=36}){
  const r=13,ci=2*Math.PI*r;
  const col=score>=85?C.ter:score>=65?C.warn:score>0?C.err:C.ovV;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 32 32" style={{transform:"rotate(-90deg)"}}>
        <circle cx="16" cy="16" r={r} fill="none" stroke={C.s2} strokeWidth="3"/>
        <circle cx="16" cy="16" r={r} fill="none" stroke={col} strokeWidth="3" strokeDasharray={`${(score/100)*ci} ${ci}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:col}}>{score||"—"}</div>
    </div>
  );
}
function Tog({on,onChange}){
  return <div className="tw" onClick={()=>onChange(!on)}><div className={`tt${on?" on":""}`}><div className="tth"/></div></div>;
}
function SChip({status}){
  const m={published:["chip ct3","Publicado"],scheduled:["chip cp","Agendado"],draft:["chip cn","Rascunho"],processing:["chip cs","Processando"],active:["chip ct3","Ativo"],inactive:["chip ce","Inativo"],ok:["chip ct3","OK"],warning:["chip cw","Aviso"],online:["chip ct3","Online"],offline:["chip ce","Offline"],success:["chip ct3","Sucesso"],error:["chip ce","Falhou"],agendado:["chip cp","Agendado"],publicado:["chip ct3","Publicado"],falhou:["chip ce","Falhou"],manual:["chip cs","Manual"],auto:["chip cp","Auto"]};
  const[cls,lbl]=m[status]||["chip cn",status];
  return <span className={cls}>{lbl}</span>;
}
function Bar({data,labels,color=C.p,h=90}){
  const mx=Math.max(...data);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:h}}>
      {data.map((v,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,height:"100%",justifyContent:"flex-end"}}>
          <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:i===data.length-1?color:`${color}50`,height:`${(v/mx)*(h-13)}px`,transition:"height .5s"}}/>
          <div style={{fontSize:8,color:C.onV,fontFamily:"'JetBrains Mono',monospace"}}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
function Spark({data,color=C.p}){
  const mx=Math.max(...data);
  return(
    <div className="spark">
      {data.map((v,i)=><div key={i} className="spark-b" style={{height:`${(v/mx)*28}px`,background:i===data.length-1?color:`${color}55`,width:"100%"}}/>)}
    </div>
  );
}
function Empty({ico,title,sub,action,onAction}){
  return(
    <div className="empty">
      <div style={{fontSize:40,marginBottom:12,opacity:.4}}>{ico}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:5,color:C.on}}>{title}</div>
      <div style={{fontSize:12,textAlign:"center",maxWidth:270,lineHeight:1.6}}>{sub}</div>
      {action&&<button className="btn bf bsm" style={{marginTop:14}} onClick={onAction}>{action}</button>}
    </div>
  );
}
function Dlg({title,onClose,children,footer,wide}){
  return(
    <div className="dlgb" onClick={onClose}>
      <div className={`dlg${wide?" dlg-wide":""}`} onClick={e=>e.stopPropagation()}>
        <div className="dlgh"><span className="dlgt">{title}</span><button className="ib" onClick={onClose}>✕</button></div>
        <div className="dlgbd">{children}</div>
        {footer&&<div className="dlgft">{footer}</div>}
      </div>
    </div>
  );
}
function Field({label,children}){
  return <div className="fld"><label className="fl">{label}</label>{children}</div>;
}

export { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field };
