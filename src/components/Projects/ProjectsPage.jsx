import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function ProjectsPage({go,showToast}){
  const[board,setBoard]=useState(KANBAN);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({col:"📋 Backlog",title:"",tag:"",pri:"med",due:"",assignee:""});
  const colBg={"📋 Backlog":C.secC,"✍️ Produção":C.pC,"👀 Revisão":C.warnC,"✅ Publicado":C.terC};
  const priCol={high:C.err,med:C.warn,low:C.ter};
  const PROJECTS=[{id:1,name:"Projeto SEO Q2 2026",progress:65,posts:12,deadline:"30/06/26"},{id:2,name:"Rebranding Blog",progress:30,posts:5,deadline:"15/07/26"}];
  const add=()=>{
    if(!form.title.trim())return;
    setBoard(b=>({...b,[form.col]:[...b[form.col],{id:Date.now(),title:form.title,tag:form.tag||"Geral",pri:form.pri,due:form.due||"—",assignee:form.assignee||"—"}]}));
    setDlg(false);setForm({col:"📋 Backlog",title:"",tag:"",pri:"med",due:"",assignee:""});
    showToast&&showToast("✅ Tarefa criada!");
  };
  return(
    <div className="fade-in">
      {/* Project switcher */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {PROJECTS.map(proj=>(
          <div key={proj.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:C.s0,borderRadius:12,boxShadow:C.e1,cursor:"pointer",border:`1.5px solid ${C.ovV}`,transition:"all .14s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=C.e2;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.ovV;e.currentTarget.style.boxShadow=C.e1;}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{proj.name}</div>
              <div style={{fontSize:10,color:C.onV,display:"flex",gap:8,marginTop:2}}>
                <span>{proj.posts} posts</span><span>📅 {proj.deadline}</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
              <span className="mono" style={{fontSize:12,fontWeight:800,color:C.p}}>{proj.progress}%</span>
              <div style={{width:60,height:4,background:C.s2,borderRadius:99}}><div style={{height:"100%",width:`${proj.progress}%`,background:C.p,borderRadius:99}}/></div>
            </div>
            <button className="btn bt bsm" style={{fontSize:11,flexShrink:0}} onClick={()=>go&&go("projectdetail",proj)}>Ver →</button>
          </div>
        ))}
        <div style={{flex:1}}/>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Tarefa</button>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:9,alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>{Object.entries(board).map(([k,v])=><span key={k} className="chip cn">{k.split(" ")[1]}: <strong>{v.length}</strong></span>)}</div>
      </div>
      <div className="kb">
        {Object.entries(board).map(([col,cards])=>(
          <div key={col} className="kc">
            <div className="kch"><span className="kct">{col}</span><span className="kcc">{cards.length}</span></div>
            {cards.map(c=>(
              <div key={c.id} className="kkc">
                <div style={{fontSize:12,fontWeight:500,lineHeight:1.4,marginBottom:8}}>{c.title}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:5}}>
                  <span className="chip" style={{background:colBg[col],color:C.on,fontSize:9,padding:"2px 7px"}}>{c.tag}</span>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    {c.due&&c.due!=="—"&&<span className="mono" style={{fontSize:9,color:C.onV}}>{c.due}</span>}
                    <span style={{width:7,height:7,borderRadius:"50%",background:priCol[c.pri],display:"inline-block"}}/>
                  </div>
                </div>
                {c.assignee&&c.assignee!=="—"&&<div style={{fontSize:10,color:C.onV,marginTop:5}}>👤 {c.assignee}</div>}
              </div>
            ))}
            <button className="kadd" onClick={()=>{setForm(f=>({...f,col}));setDlg(true);}}>+ Adicionar</button>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Tarefa" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={add}>Criar</button></>}>
        <Field label="Título *"><input className="fi" placeholder="Descreva a tarefa..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <div className="two">
          <Field label="Coluna"><select className="fi fi-sel" value={form.col} onChange={e=>setForm(f=>({...f,col:e.target.value}))}>{Object.keys(board).map(k=><option key={k} value={k}>{k}</option>)}</select></Field>
          <Field label="Prioridade"><select className="fi fi-sel" value={form.pri} onChange={e=>setForm(f=>({...f,pri:e.target.value}))}><option value="high">Alta</option><option value="med">Média</option><option value="low">Baixa</option></select></Field>
        </div>
        <div className="two">
          <Field label="Tag"><input className="fi" placeholder="SEO, IA..." value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}/></Field>
          <Field label="Prazo"><input className="fi" type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></Field>
        </div>
        <Field label="Responsável"><select className="fi fi-sel" value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))}><option value="">Não atribuído</option>{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
      </Dlg>}
    </div>
  );
}

export default ProjectsPage;
