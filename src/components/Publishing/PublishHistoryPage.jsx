import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function PublishHistoryPage(){
  const[filter,setFilter]=useState("all");
  const filtered=PUBLISH_HISTORY.filter(p=>filter==="all"||p.status===filter);
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
          {[{id:"all",l:"Todos"},{id:"success",l:"Sucesso"},{id:"error",l:"Falha"}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:filter===f.id?C.p:"transparent",color:filter===f.id?C.onP:C.onV,transition:"all .14s"}}>{f.l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <button className="btn bo bsm">⬇ Exportar CSV</button>
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr><th>Post</th><th>Site WordPress</th><th>Data/Hora</th><th>Tipo</th><th>Status</th><th>ID WP</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id}>
                <td style={{maxWidth:260}}><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div></td>
                <td style={{fontSize:12,color:C.onV}}>{p.wp}</td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.date}</td>
                <td><SChip status={p.type}/></td>
                <td><SChip status={p.status}/></td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.id_wp||"—"}</td>
                <td><div style={{display:"flex",gap:2}}>
                  {p.status==="error"&&<button className="btn ber bsm" style={{fontSize:11}}>↺ Retry</button>}
                  {p.status==="success"&&<button className="ib" style={{width:26,height:26,fontSize:12}}>↗</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default PublishHistoryPage;
