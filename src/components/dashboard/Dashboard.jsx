import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function Dashboard({go}){
  return(
    <div className="fade-in">
      <div className="mg">
        {[{l:"Posts Publicados",v:"247",d:"↑ 18% este mês",cls:"mcp",pg:"posts"},{l:"Score SEO Médio",v:"88",d:"↑ 5 pts",cls:"mcs",pg:"performance"},{l:"Sites WordPress",v:"6",d:"2 sync ativo",cls:"mct",pg:"wordpress"},{l:"Automações",v:"14",d:"3 rodaram hoje",cls:"mce",pg:"automations"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`} onClick={()=>go(m.pg)}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="three" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Publicações — 12 meses</span><span className="chip ct3">+34% YoY</span></div><div className="cb"><Bar data={CHART_DATA} labels={MONTHS}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Fontes de Tráfego</span></div>
          <div className="cb">{[{l:"Orgânico",v:64,c:C.ter},{l:"Social",v:21,c:C.p},{l:"Direto",v:9,c:C.sec},{l:"Email",v:6,c:C.warn}].map((s,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:12,color:C.onV}}>{s.l}</span>
                <span className="mono" style={{fontSize:11,fontWeight:700,color:s.c}}>{s.v}%</span>
              </div>
              <div className="pb"><div className="pbf" style={{width:`${s.v}%`,background:s.c}}/></div>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">Posts Recentes</span><button className="btn bx bsm" onClick={()=>go("posts")}>Ver todos →</button></div>
          <div style={{padding:"0 14px 8px"}}>
            {POSTS.slice(0,5).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none",cursor:"pointer"}} onClick={()=>go("editor",p)}>
                <Ring score={p.score} size={32}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{p.cat} · {p.date}</div></div>
                <SChip status={p.status}/>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">Próximos Agendamentos</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {POSTS.filter(p=>p.status==="scheduled").concat([{id:99,title:"Guia de automação",date:"14/05/26",wp:"Portal",cat:"Auto"}]).slice(0,3).map((s,i)=>(
                <div key={s.id} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                  <div style={{width:34,height:34,borderRadius:8,background:C.pC,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.onPC,lineHeight:1}}>{s.date?.slice(0,2)||"—"}</div>
                    <div style={{fontSize:9,color:C.onPC,opacity:.7}}>{s.date?.slice(3,5)||""}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{s.wp}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">Atividade Recente</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {NOTIFS.slice(0,4).map((n,i)=>(
                <div key={n.id} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:{success:C.terC,info:C.pC,warning:C.warnC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{n.ico}</div>
                  <div><div style={{fontSize:12,lineHeight:1.4}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{n.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
