import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function MediaPage(){
  const[view,setView]=useState("grid");
  const[search,setSearch]=useState("");
  const tIco={image:"🖼",pdf:"📄",video:"🎬"};
  const tColor={image:C.pC,pdf:C.errC,video:C.terC};
  const filtered=MEDIA.filter(m=>m.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:13,alignItems:"center"}}>
        <input className="fi" style={{flex:1,height:36,padding:"7px 12px"}} placeholder="🔍  Buscar mídia..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <button onClick={()=>setView("grid")} className="ib" style={{background:view==="grid"?C.pC:"transparent",fontSize:14}}>⊞</button>
        <button onClick={()=>setView("list")} className="ib" style={{background:view==="list"?C.pC:"transparent",fontSize:14}}>☰</button>
        <button className="btn bf bsm">⬆ Upload</button>
      </div>
      {view==="grid"
        ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10}}>
          {filtered.map(m=><div key={m.id} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e3} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
            <div style={{height:85,background:tColor[m.type],display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{tIco[m.type]}</div>
            <div style={{padding:"8px 10px"}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{m.name}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{m.size}</div>{m.used>0&&<span className="chip cn" style={{marginTop:4,fontSize:9}}>usado {m.used}×</span>}</div>
          </div>)}
        </div>
        :<div className="card"><table className="dt"><thead><tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Data</th><th>Uso</th><th></th></tr></thead><tbody>{filtered.map(m=><tr key={m.id}><td><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{tIco[m.type]}</span><span style={{fontWeight:500}}>{m.name}</span></div></td><td><span className="chip cn" style={{fontSize:10}}>{m.type}</span></td><td className="mono" style={{fontSize:11,color:C.onV}}>{m.size}</td><td className="mono" style={{fontSize:11,color:C.onV}}>{m.date}</td><td className="mono">{m.used}×</td><td><button className="ib" style={{width:24,height:24,fontSize:12}}>🗑</button></td></tr>)}</tbody></table></div>
      }
    </div>
  );
}

export default MediaPage;
