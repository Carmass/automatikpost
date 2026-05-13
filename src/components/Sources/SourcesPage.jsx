import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function SourcesPage({showToast}){
  const[src,setSrc]=useState(SOURCES);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",type:"RSS",url:"",active:true});
  const tIco={RSS:"📡",YouTube:"▶️",Keyword:"🔑",Scraper:"🕷",Trend:"📈"};
  const save=()=>{setSrc(p=>[...p,{id:Date.now(),...form,items:0,fetch:"nunca"}]);setDlg(false);setForm({name:"",type:"RSS",url:"",active:true});showToast("📡 Fonte adicionada!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13,gap:8}}><button className="btn bo bsm">🔄 Processar todas</button><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Fonte</button></div>
      <div className="card">
        {src.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<src.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:9,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{tIco[s.type]||"📄"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:600}}>{s.name}</span><span className="chip co" style={{fontSize:10}}>{s.type}</span></div>
              <div className="mono" style={{fontSize:11,color:C.onV,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.url}</div>
            </div>
            <div style={{textAlign:"center",margin:"0 6px",flexShrink:0}}><div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{s.items}</div><div style={{fontSize:9,color:C.onV}}>itens</div></div>
            <div style={{fontSize:10,color:C.onV,marginRight:6,flexShrink:0}}>{s.fetch}</div>
            <Tog on={s.active} onChange={v=>setSrc(p=>p.map(x=>x.id===s.id?{...x,active:v}:x))}/>
            <button className="btn bt bsm">✨ Gerar</button>
            <button className="ib" style={{width:24,height:24,fontSize:12}} onClick={()=>setSrc(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Fonte" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Adicionar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Blog Referência" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <div className="two"><Field label="Tipo"><select className="fi fi-sel" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{["RSS","YouTube","Keyword","Scraper","Trend"].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Ativa"><div style={{display:"flex",alignItems:"center",height:36,gap:9}}><Tog on={form.active} onChange={v=>setForm(f=>({...f,active:v}))}/><span style={{fontSize:13,color:C.onV}}>{form.active?"Sim":"Não"}</span></div></Field></div>
        <Field label="URL / Termo"><input className="fi" placeholder="https://..." value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))}/></Field>
      </Dlg>}
    </div>
  );
}

export default SourcesPage;
