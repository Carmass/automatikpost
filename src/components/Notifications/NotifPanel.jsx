import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function NotifPanel({onClose}){
  const[ns,setNs]=useState(NOTIFS);
  const unread=ns.filter(n=>!n.read).length;
  return(
    <div className="np" onClick={e=>e.stopPropagation()}>
      <div style={{padding:"11px 13px",borderBottom:`1px solid ${C.ovV}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:700,fontSize:13}}>Notificações{unread>0&&<span className="chip ce" style={{marginLeft:6,fontSize:10}}>{unread}</span>}</div>
        <div style={{display:"flex",gap:3}}><button className="btn bx bsm" style={{fontSize:11}} onClick={()=>setNs(p=>p.map(n=>({...n,read:true})))}>Lidas</button><button className="ib" style={{width:24,height:24,fontSize:12}} onClick={onClose}>✕</button></div>
      </div>
      {ns.map((n,i)=>(
        <div key={n.id} style={{display:"flex",gap:8,padding:"10px 13px",borderBottom:i<ns.length-1?`1px solid ${C.ovV}`:"none",background:n.read?"transparent":`${C.pC}44`,cursor:"pointer"}} onClick={()=>setNs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
          <div style={{width:28,height:28,borderRadius:7,background:{success:C.terC,info:C.pC,warning:C.warnC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{n.ico}</div>
          <div style={{flex:1}}><div style={{fontSize:12,lineHeight:1.4,fontWeight:n.read?400:600}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{n.time}</div></div>
          {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:C.p,flexShrink:0,marginTop:5}}/>}
        </div>
      ))}
    </div>
  );
}


export default NotifPanel;
