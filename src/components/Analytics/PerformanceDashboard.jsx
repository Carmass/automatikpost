import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function PerformanceDashboard(){
  const[period,setPeriod]=useState("30d");
  const mult={"7d":.3,"30d":1,"90d":2.8,"12m":11}[period]||1;
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
        <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
          {["7d","30d","90d","12m"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{padding:"4px 13px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:period===p?C.p:"transparent",color:period===p?C.onP:C.onV,transition:"all .14s"}}>{p}</button>
          ))}
        </div>
      </div>
      <div className="mg">
        {[{l:"Visitas",v:Math.round(128000*mult).toLocaleString(),d:"↑ 23%",cls:"mcp"},{l:"CTR",v:"4.7%",d:"↑ 0.8 pp",cls:"mct"},{l:"Tempo Médio",v:"3m42s",d:"↑ 18s",cls:"mcs"},{l:"Conversões",v:Math.round(520*mult),d:"↑ 12%",cls:"mce"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Publicações por Mês</span><span className="chip cp">+34% anual</span></div><div className="cb"><Bar data={CHART_DATA} labels={MONTHS}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Top Posts</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {POSTS.filter(p=>p.views>0).sort((a,b)=>b.views-a.views).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<POSTS.filter(x=>x.views>0).length-1?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:22,height:22,borderRadius:6,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.onPC,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div></div>
                <div className="mono" style={{fontSize:12,fontWeight:800,color:C.p}}>{Math.round(p.views*mult).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">Score SEO por Categoria</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {[{c:"Email",s:91},{c:"SEO",s:91},{c:"IA",s:89},{c:"Dev",s:86},{c:"CMS",s:72},{c:"CRO",s:65}].map((x,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600}}>{x.c}</span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,color:x.s>=85?C.ter:x.s>=70?C.warn:C.err}}>{x.s}</span>
                </div>
                <div className="pb"><div className="pbf" style={{width:`${x.s}%`,background:x.s>=85?C.ter:x.s>=70?C.warn:C.err}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">Funil de Conversão</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {[{l:"Impressões",v:480000,pct:100},{l:"Cliques",v:22560,pct:4.7},{l:"Leads",v:520,pct:2.3},{l:"Vendas",v:89,pct:.4}].map((f,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12}}>{f.l}</span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,color:C.p}}>{Math.round(f.v*mult).toLocaleString()}</span>
                </div>
                <div className="pb"><div className="pbf" style={{width:`${Math.min(f.pct*15,100)}%`,background:C.p}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default PerformanceDashboard;
