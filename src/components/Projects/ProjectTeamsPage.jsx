import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

  const[teams,setTeams]=useState([{id:1,projectId:1,name:"Equipe SEO",members:["Ana Lima","Carlos M."],lead:"Ana Lima"},{id:2,projectId:1,name:"Equipe Conteúdo",members:["Juliana Costa"],lead:"Juliana Costa"}].filter(t=>t.projectId===(project?.id||1)));
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",lead:"",members:[]});
  const save=()=>{if(!form.name)return;setTeams(p=>[...p,{id:Date.now(),projectId:project?.id||1,...form}]);setDlg(false);setForm({name:"",lead:"",members:[]});showToast("👥 Equipe criada!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Equipe</button></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
        {teams.map(t=>(
          <div key={t.id} className="card">
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:11}}>
                <div><div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{t.name}</div><div style={{fontSize:12,color:C.onV}}>Líder: {t.lead||"—"}</div></div>
                <span className="chip cn">{(t.members||[]).length} membros</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {(t.members||[]).map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",background:C.s1,borderRadius:999,fontSize:12}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{m[0]}</div>{m}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:7}}>
                <button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>showToast("👥 Gerenciando equipe...")}>Gerenciar</button>
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTeams(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
              </div>
            </div>
          </div>
        ))}
        {teams.length===0&&<Empty ico="👥" title="Sem equipes" sub="Crie equipes para organizar o trabalho."/>}
      </div>
      {dlg&&<Dlg title="Nova Equipe" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Equipe SEO" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Líder"><select className="fi fi-sel" value={form.lead} onChange={e=>setForm(f=>({...f,lead:e.target.value}))}><option value="">Selecionar...</option>{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
        <Field label="Membros">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {USERS.filter(u=>u.status==="active").map(u=>(
              <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
                <input type="checkbox" checked={(form.members||[]).includes(u.name)} onChange={e=>setForm(f=>({...f,members:e.target.checked?[...(f.members||[]),u.name]:(f.members||[]).filter(m=>m!==u.name)}))} style={{accentColor:C.p}}/>
                {u.name}
              </label>
            ))}
          </div>
        </Field>
      </Dlg>}
    </div>
  );
}

/* ══ PROJECT DETAIL ═══════════════════════════════════════ */

export default ProjectTeamsPage;
