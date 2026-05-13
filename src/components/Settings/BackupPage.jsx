import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function BackupPage({showToast}){
  const[bkps,setBkps]=useState(BACKUPS);
  const[backing,setBacking]=useState(false);
  const doBackup=async()=>{setBacking(true);await new Promise(r=>setTimeout(r,2500));setBkps(p=>[{id:Date.now(),name:"backup-manual-"+new Date().toISOString().slice(0,10),date:new Date().toLocaleString("pt-BR").slice(0,16),posts:247,size:"12.4 MB",type:"manual",status:"ok"},...p]);setBacking(false);showToast("💾 Backup criado!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:9,marginBottom:13,alignItems:"center"}}>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{bkps.length} backups</div><div style={{fontSize:12,color:C.onV}}>Próximo automático: Segunda, 02:00</div></div>
        <button className="btn bf" onClick={doBackup} disabled={backing}>{backing?<><div className="spinner"/>Criando...</>:"💾 Backup Agora"}</button>
      </div>
      <div className="card" style={{marginBottom:13}}>
        {bkps.map((b,i)=>(
          <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<bkps.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:34,height:34,borderRadius:8,background:b.type==="auto"?C.pC:C.terC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{b.type==="auto"?"🤖":"💾"}</div>
            <div style={{flex:1}}><div className="mono" style={{fontSize:12,fontWeight:500}}>{b.name}</div><div style={{fontSize:11,color:C.onV,marginTop:1}}>{b.date} · {b.posts} posts · {b.size}</div></div>
            <SChip status={b.type}/><SChip status={b.status}/>
            <button className="btn bo bsm">⬇ Restaurar</button>
            <button className="ib" style={{width:24,height:24,fontSize:12}} onClick={()=>setBkps(p=>p.filter(x=>x.id!==b.id))}>🗑</button>
          </div>
        ))}
      </div>
      <div className="card"><div className="ch"><span className="ct">⚙️ Configuração</span></div><div className="cb" style={{paddingTop:6}}>
        <div className="two"><Field label="Frequência"><select className="fi fi-sel" defaultValue="weekly"><option value="daily">Diário</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option></select></Field><Field label="Horário"><input className="fi" defaultValue="02:00"/></Field></div>
        <div className="two"><Field label="Retenção"><select className="fi fi-sel" defaultValue="10">{["5","10","20"].map(v=><option key={v} value={v}>Últimos {v}</option>)}</select></Field><Field label="Destino"><select className="fi fi-sel"><option>Servidor local</option><option>Amazon S3</option><option>Google Drive</option></select></Field></div>
        <button className="btn bf bsm" onClick={()=>showToast("⚙️ Configuração salva!")}>💾 Salvar</button>
      </div></div>
    </div>
  );
}

export default BackupPage;
