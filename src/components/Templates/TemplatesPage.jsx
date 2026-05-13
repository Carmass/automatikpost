import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function TemplatesPage({showToast}){
  const[tmpls,setTmpls]=useState(TEMPLATES);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",desc:"",tags:"",prompt:""});
  const save=()=>{if(!form.name.trim())return;setTmpls(p=>[...p,{id:Date.now(),...form,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean),uses:0}]);setDlg(false);setForm({name:"",desc:"",tags:"",prompt:""});showToast("📋 Template criado!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo</button></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {tmpls.map(t=>(
          <div key={t.id} className="card">
            <div style={{padding:"13px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}><div style={{fontSize:13,fontWeight:700}}>{t.name}</div><span className="mono chip cn" style={{fontSize:10}}>{t.uses}×</span></div>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.5,marginBottom:8}}>{t.desc}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>{t.tags.map(tag=><span key={tag} className="chip cp" style={{fontSize:10}}>{tag}</span>)}</div>
              <div style={{display:"flex",gap:7}}><button className="btn bt bsm" style={{flex:1,justifyContent:"center"}}>✨ Usar</button><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTmpls(p=>p.filter(x=>x.id!==t.id))}>🗑</button></div>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Novo Template" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Salvar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Artigo de Revisão" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Descrição"><input className="fi" placeholder="Objetivo e estrutura..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></Field>
        <Field label="Tags (vírgula)"><input className="fi" placeholder="SEO, Blog..." value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}/></Field>
        <Field label="Prompt para IA"><textarea className="fi fi-ta" placeholder="Use {tema}, {nicho}, {tom} como variáveis." rows={6} value={form.prompt} onChange={e=>setForm(f=>({...f,prompt:e.target.value}))}/></Field>
      </Dlg>}
    </div>
  );
}

export default TemplatesPage;
