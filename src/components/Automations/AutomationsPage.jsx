import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function AutomationsPage({showToast}){
  const[autos,setAutos]=useState(AUTOS);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",trigger:"",cat:"Publicação"});
  const[running,setRunning]=useState(null);
  const catCls={Publicação:"chip ct3",Social:"chip cp",Notificação:"chip cw",Sistema:"chip cn",SEO:"chip cs",Analytics:"chip co"};
  const tog=id=>setAutos(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a));
  const run=async id=>{setRunning(id);await new Promise(r=>setTimeout(r,1500));setRunning(null);setAutos(p=>p.map(a=>a.id===id?{...a,runs:a.runs+1,last:"agora"}:a));showToast("⚡ Automação executada!");};
  const save=()=>{if(!form.name.trim())return;setAutos(p=>[...p,{id:Date.now(),...form,runs:0,last:"nunca",active:false}]);setDlg(false);setForm({name:"",trigger:"",cat:"Publicação"});};
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:10,marginBottom:13,alignItems:"center"}}>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{autos.filter(a=>a.active).length}/{autos.length} ativas</div><div style={{fontSize:12,color:C.onV}}>{autos.reduce((s,a)=>s+a.runs,0).toLocaleString()} execuções</div></div>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova</button>
      </div>
      <div className="card">
        {autos.map((a,i)=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 17px",borderBottom:i<autos.length-1?`1px solid ${C.ovV}`:"none"}}>
            <Tog on={a.active} onChange={()=>tog(a.id)}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:a.active?C.on:C.onV}}>{a.name}</span>
                <span className={catCls[a.cat]||"chip cn"}>{a.cat}</span>
              </div>
              <div style={{fontSize:11,color:C.onV}}>⚡ {a.trigger}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:6}}><div className="mono" style={{fontSize:13,fontWeight:700}}>{a.runs}×</div><div style={{fontSize:10,color:C.onV}}>{a.last}</div></div>
            <div style={{display:"flex",gap:2}}>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>run(a.id)} disabled={running===a.id}>{running===a.id?<div className="spinner" style={{width:11,height:11}}/>:"▶️"}</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setAutos(p=>p.filter(x=>x.id!==a.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Automação" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Auto-publicar ao finalizar" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Gatilho"><input className="fi" placeholder="Ex: Post marcado como Pronto" value={form.trigger} onChange={e=>setForm(f=>({...f,trigger:e.target.value}))}/></Field>
        <Field label="Categoria"><select className="fi fi-sel" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>{["Publicação","Social","Notificação","Sistema","SEO","Analytics"].map(c=><option key={c}>{c}</option>)}</select></Field>
      </Dlg>}
    </div>
  );
}

export default AutomationsPage;
