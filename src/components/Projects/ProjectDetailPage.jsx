import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';
import PostTaskPanel from '../Tasks/PostTaskPanel.jsx';
import PerformanceDashboard from '../Analytics/PerformanceDashboard.jsx';

export function ProjectDetailPage({ project, onBack, go, showToast }) {
  const proj=project||{id:1,name:"Projeto SEO Q2 2026",desc:"Produção de 40 artigos SEO para o segundo trimestre",status:"active",priority:"high",progress:65,owner:"Ana Lima",deadline:"30/06/26",posts:12,tasks:24};
  const[tab,setTab]=useState("overview");
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Projetos</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{proj.name}</div><div style={{fontSize:12,color:C.onV}}>{proj.desc}</div></div>
        <button className="btn bf bsm" onClick={()=>showToast("⚙️ Configurações do projeto")}>⚙️ Configurar</button>
      </div>
      <div className="tabs">
        {["overview","posts","tasks","teams","analytics"].map(t=>(
          <div key={t} className={`tabi ${tab===t?"a":""}`} onClick={()=>setTab(t)}>
            {{"overview":"📊 Visão Geral","posts":"📄 Posts","tasks":"✅ Tarefas","teams":"👥 Equipes","analytics":"📈 Analytics"}[t]}
          </div>
        ))}
      </div>
      {tab==="overview"&&(
        <div>
          <div className="mg">{[{l:"Posts",v:proj.posts,d:"de 40 planejados",cls:"mcp"},{l:"Progresso",v:proj.progress+"%",d:"↑ 12% esta semana",cls:"mct"},{l:"Tarefas",v:proj.tasks,d:"8 pendentes",cls:"mcs"},{l:"Prazo",v:proj.deadline,d:"52 dias restantes",cls:"mce"}].map((m,i)=>(
            <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
          ))}</div>
          <div className="two">
            <div className="card">
              <div className="ch"><span className="ct">Progresso</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div className="pb" style={{height:12,marginBottom:12}}><div className="pbf" style={{width:`${proj.progress}%`,background:C.ter}}/></div>
                {[{l:"Backlog",v:8,c:C.sec},{l:"Produção",v:5,c:C.p},{l:"Revisão",v:2,c:C.warn},{l:"Publicado",v:12,c:C.ter}].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:`1px solid ${C.ovV}`,marginTop:4}}><span style={{fontSize:12}}>{s.l}</span><span className="mono" style={{fontSize:14,fontWeight:800,color:s.c}}>{s.v}</span></div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">ℹ️ Informações</span></div>
              <div className="cb" style={{paddingTop:6}}>
                {[{l:"Responsável",v:proj.owner},{l:"Prioridade",v:proj.priority.charAt(0).toUpperCase()+proj.priority.slice(1)},{l:"Status",v:proj.status==="active"?"Ativo":"Inativo"},{l:"Prazo",v:proj.deadline},{l:"Posts planejados",v:"40"},{l:"Criado em",v:"01/04/26"}].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?`1px solid ${C.ovV}`:"none"}}><span style={{fontSize:12,color:C.onV,fontWeight:600}}>{r.l}</span><span style={{fontSize:13,fontWeight:500}}>{r.v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="posts"&&<PostsPage go={go}/>}
      {tab==="tasks"&&<PostTaskPanel post={{id:1,title:proj.name}} showToast={showToast}/>}
      {tab==="teams"&&<ProjectTeamsPage project={proj} showToast={showToast}/>}
      {tab==="analytics"&&<PerformanceDashboard/>}
    </div>
  );
}


/* ══ MULTICHANNEL PUBLISHER ═══════════════════════════════ */

export default ProjectDetailPage;
