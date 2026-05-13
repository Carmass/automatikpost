import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function CompetitorPage(){
  const[analyzing,setAnalyzing]=useState(null);
  const[insights,setInsights]=useState({});
  const analyze=async id=>{
    setAnalyzing(id);await new Promise(r=>setTimeout(r,2200));
    const c=COMPETITORS.find(x=>x.id===id);
    setInsights(p=>({...p,[id]:`Análise concluída. ${c.name} publica ${c.freq} sobre ${c.topics.join(" e ")}. Lacunas: automação e CRO são pontos fracos. Oportunidade: artigos long-form sobre WordPress superam o DA ${c.da} atual.`}));
    setAnalyzing(null);
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm">➕ Monitorar</button></div>
      {COMPETITORS.map(c=>(
        <div key={c.id} className="card" style={{marginBottom:12}}>
          <div style={{padding:"14px 17px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:11,marginBottom:11}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:C.onPC,flexShrink:0}}>{c.name[0]}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{c.name}</div><div className="mono" style={{fontSize:11,color:C.onV}}>{c.url}</div></div>
              <div style={{textAlign:"right"}}><div className="mono" style={{fontSize:22,fontWeight:800,color:C.p}}>{c.da}</div><div style={{fontSize:10,color:C.onV}}>Domain Authority</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:11}}>
              {[["Posts",c.posts],["Freq.",c.freq],["Tráfego",c.traffic],["Tópicos",c.topics.length]].map(([k,v])=>(
                <div key={k} style={{background:C.s1,borderRadius:7,padding:"7px 9px",textAlign:"center"}}><div style={{fontSize:9,color:C.onV,fontWeight:700,marginBottom:2}}>{k}</div><div className="mono" style={{fontSize:12,fontWeight:700}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>{c.topics.map(t=><span key={t} className="chip cp">{t}</span>)}</div>
            {insights[c.id]&&<div style={{padding:"8px 11px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC,lineHeight:1.6,marginBottom:10}}>💡 {insights[c.id]}</div>}
            <button className="btn bf bsm" onClick={()=>analyze(c.id)} disabled={analyzing===c.id}>{analyzing===c.id?<><div className="spinner" style={{width:11,height:11}}/>Analisando...</>:"🔍 Analisar com IA"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CompetitorPage;
