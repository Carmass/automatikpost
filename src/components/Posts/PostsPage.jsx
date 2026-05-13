import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function PostsPage({go}){
  const[tab,setTab]=useState("all");
  const[search,setSearch]=useState("");
  const[sel,setSel]=useState([]);
  const tabs=[{id:"all",l:"Todos",c:POSTS.length},{id:"published",l:"Publicados",c:POSTS.filter(p=>p.status==="published").length},{id:"scheduled",l:"Agendados",c:1},{id:"draft",l:"Rascunhos",c:POSTS.filter(p=>p.status==="draft").length}];
  const filtered=POSTS.filter(p=>(tab==="all"||p.status===tab)&&(p.title.toLowerCase().includes(search.toLowerCase())||p.cat.toLowerCase().includes(search.toLowerCase())));
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input className="fi" style={{flex:1,minWidth:180,height:36,padding:"7px 12px"}} placeholder="🔍  Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {sel.length>0&&<button className="btn ber bsm">🗑 ({sel.length})</button>}
        <button className="btn bo bsm">⬇ Exportar</button>
        <button className="btn bf bsm" onClick={()=>go("editor",{})}>➕ Novo Post</button>
      </div>
      <div className="tabs">{tabs.map(t=><div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}<span className="tcnt">{t.c}</span></div>)}</div>
      <div className="card">
        <table className="dt">
          <thead><tr><th style={{width:32}}><input type="checkbox" onChange={e=>setSel(e.target.checked?filtered.map(p=>p.id):[])}/></th><th>Título</th><th>Cat.</th><th>SEO</th><th>Status</th><th>Site</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} style={{cursor:"pointer"}} onClick={()=>go("editor",p)}>
                <td onClick={e=>e.stopPropagation()}><input type="checkbox" checked={sel.includes(p.id)} onChange={()=>setSel(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}/></td>
                <td style={{maxWidth:270}}><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>{p.views>0&&<div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{p.views.toLocaleString()} views</div>}</td>
                <td><span className="chip cp" style={{fontSize:10}}>{p.cat}</span></td>
                <td><Ring score={p.score} size={30}/></td>
                <td><SChip status={p.status}/></td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.wp}</td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.date}</td>
                <td onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:2}}>
                  <button className="ib" title="Analytics" style={{width:26,height:26,fontSize:12}} onClick={()=>go("postanalytics",p)}>📊</button>
                  <button className="ib" title="Editar" style={{width:26,height:26,fontSize:12}} onClick={()=>go("editor",p)}>✏️</button>
                  <button className="ib" title="Tarefas" style={{width:26,height:26,fontSize:12}} onClick={()=>go("posttask",p)}>✅</button>
                  <button className="ib" title="Versões" style={{width:26,height:26,fontSize:12}} onClick={()=>go("versionhistory",p)}>🕐</button>
                  <button className="ib" title="Publicar em canais" style={{width:26,height:26,fontSize:12}} onClick={()=>go("multichannel",p)}>📡</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<Empty ico="📄" title="Nenhum post" sub="Tente ajustar os filtros."/>}
      </div>
    </div>
  );
}


export default PostsPage;
