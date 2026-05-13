import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function PostAnalyticsPage({post,onBack}){
  if(!post){return <Empty ico="📊" title="Selecione um post" sub="Abra o analytics de um post específico."/>;}
  const daily=[120,180,240,310,280,420,380,510,460,590,480,620];
  const sources=[{l:"Busca Orgânica",v:68,c:C.ter},{l:"Redes Sociais",v:18,c:C.p},{l:"Direto",v:8,c:C.sec},{l:"Email",v:6,c:C.warn}];
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.title}</div>
          <div style={{fontSize:11,color:C.onV}}>{post.cat} · Publicado: {post.date} · {post.wp}</div>
        </div>
        <Ring score={post.score} size={44}/>
      </div>
      <div className="mg">
        {[{l:"Visualizações",v:(post.views||0).toLocaleString(),d:"+23% vs semana ant.",cls:"mcp"},{l:"Tempo Médio",v:post.avgTime||"—",d:"Meta: >3min",cls:"mct"},{l:"Taxa de Rejeição",v:post.bounce?post.bounce+"%":"—",d:post.bounce<50?"✓ Abaixo da média":"↑ Acima da média",cls:post.bounce&&post.bounce<50?"mcs":"mce"},{l:"Conversões",v:post.conversions||0,d:"Taxa: 0.7%",cls:"mcs"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Visualizações Diárias</span></div><div className="cb"><Bar data={daily} labels={["1","2","3","4","5","6","7","8","9","10","11","12"]}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Fontes de Tráfego</span></div>
          <div className="cb">{sources.map((s,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12}}>{s.l}</span><span className="mono" style={{fontSize:11,fontWeight:700,color:s.c}}>{s.v}%</span></div>
              <div className="pb"><div className="pbf" style={{width:`${s.v}%`,background:s.c}}/></div>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">🔍 SEO & Palavras-chave</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {post.tags?.filter(t=>t).map((kw,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.ovV}`}}>
                <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{kw}</span>
                <div style={{display:"flex",gap:10,fontSize:11,color:C.onV,fontFamily:"'JetBrains Mono',monospace"}}>
                  <span>pos. {[3,7,12,15][i%4]}</span>
                  <span style={{color:C.ter}}>↑ {[2,1,3,0][i%4]}</span>
                </div>
              </div>
            ))}
            {(!post.tags||post.tags.length===0)&&<Empty ico="🔑" title="Sem tags" sub="Adicione tags ao post para análise de keywords."/>}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📱 Engajamento Social</span></div>
          <div className="cb">
            {[{ico:"𝕏",net:"Twitter",shares:42,clicks:180},{ico:"in",net:"LinkedIn",shares:28,clicks:320},{ico:"📘",net:"Facebook",shares:15,clicks:95},{ico:"📸",net:"Instagram",shares:8,clicks:44}].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,fontWeight:800}}>{s.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{s.net}</div></div>
                <div className="mono" style={{fontSize:11,color:C.onV}}>{s.shares} shares</div>
                <div className="mono" style={{fontSize:11,color:C.p,fontWeight:700}}>{s.clicks} cliques</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default PostAnalyticsPage;
