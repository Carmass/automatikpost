import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function NotificationCenterPage() {
  const[notifs,setNotifs]=useState([...NOTIFS,{id:10,ico:"📊",text:"Relatório semanal disponível",time:"há 4h",read:false,type:"info"},{id:11,ico:"🔄",text:"Cronograma SEO Semanal executado",time:"há 5h",read:true,type:"success"},{id:12,ico:"👤",text:"Juliana Costa se juntou ao projeto",time:"há 1d",read:true,type:"info"},{id:13,ico:"⚡",text:"Automação #2: Variações sociais geradas",time:"há 1d",read:true,type:"success"}]);
  const[filter,setFilter]=useState("all");
  const[tab,setTab]=useState("inbox");
  const[prefs,setPrefs]=useState({email:true,inapp:true,weekly:true,deadlines:true,publishes:true,errors:true});
  const filtered=notifs.filter(n=>filter==="all"||(filter==="unread"&&!n.read)||(filter==="read"&&n.read));
  const unread=notifs.filter(n=>!n.read).length;
  return(
    <div className="fade-in">
      <div className="tabs">
        <div className={`tabi ${tab==="inbox"?"a":""}`} onClick={()=>setTab("inbox")}>📬 Inbox <span className="tcnt">{unread}</span></div>
        <div className={`tabi ${tab==="prefs"?"a":""}`} onClick={()=>setTab("prefs")}>⚙️ Preferências</div>
      </div>
      {tab==="inbox"&&(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:13,alignItems:"center"}}>
            <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
              {[{id:"all",l:`Todas (${notifs.length})`},{id:"unread",l:`Não lidas (${unread})`},{id:"read",l:"Lidas"}].map(f=><button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:filter===f.id?C.p:"transparent",color:filter===f.id?C.onP:C.onV}}>{f.l}</button>)}
            </div>
            <div style={{flex:1}}/>
            {unread>0&&<button className="btn bo bsm" onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}>✓ Marcar lidas</button>}
            <button className="btn ber bsm" onClick={()=>setNotifs([])}>🗑 Limpar</button>
          </div>
          <div className="card">
            {filtered.length===0&&<Empty ico="🔔" title="Nenhuma notificação" sub="Você está em dia!"/>}
            {filtered.map((n,i)=>(
              <div key={n.id} style={{display:"flex",gap:10,padding:"12px 16px",borderBottom:i<filtered.length-1?`1px solid ${C.ovV}`:"none",background:n.read?"transparent":`${C.pC}33`}}>
                <div style={{width:34,height:34,borderRadius:8,background:{success:C.terC,info:C.pC,warning:C.warnC,error:C.errC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{n.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:n.read?400:600,marginBottom:2}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{n.time}</div></div>
                <div style={{display:"flex",gap:3,flexShrink:0}}>
                  {!n.read&&<button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>✓</button>}
                  <button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>setNotifs(p=>p.filter(x=>x.id!==n.id))}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="prefs"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">🔔 Canais</span></div><div className="cb">{[{k:"inapp",l:"In-app",s:"Painel em tempo real"},{k:"email",l:"E-mail",s:"Resumo por e-mail"},{k:"weekly",l:"Relatório semanal",s:"Sexta, 18:00"}].map((p,i)=><div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.l}</div><div style={{fontSize:11,color:C.onV}}>{p.s}</div></div><Tog on={prefs[p.k]} onChange={v=>setPrefs(f=>({...f,[p.k]:v}))}/></div>)}</div></div>
          <div className="card"><div className="ch"><span className="ct">⚡ Tipos de Evento</span></div><div className="cb">{[{k:"publishes",l:"Publicações",s:"Posts publicados"},{k:"errors",l:"Erros",s:"WordPress, backups"},{k:"deadlines",l:"Prazos",s:"48h antes do deadline"}].map((p,i)=><div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.l}</div><div style={{fontSize:11,color:C.onV}}>{p.s}</div></div><Tog on={prefs[p.k]} onChange={v=>setPrefs(f=>({...f,[p.k]:v}))}/></div>)}</div></div>
        </div>
      )}
    </div>
  );
}

/* ══ NAV CONFIG ══════════════════════════════════════════ */

export default NotificationCenterPage;
