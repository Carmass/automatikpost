import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function EvergreenPage() {
  const[analyzing,setAnalyzing]=useState(false);
  const[results,setResults]=useState(null);
  const analyze=async()=>{
    setAnalyzing(true);
    await new Promise(r=>setTimeout(r,1800));
    setResults([
      {id:1,title:"10 Estratégias de SEO para 2026",score:82,trend:"stable",monthlyViews:1200,category:"SEO",action:"update",suggestion:"Atualizar exemplos para 2026 e adicionar seção sobre IA + SEO"},
      {id:5,title:"E-mail Marketing: Táticas de Segmentação",score:91,trend:"growing",monthlyViews:980,category:"Email",action:"promote",suggestion:"Conteúdo evergreen forte. Promover nas redes sociais."},
      {id:6,title:"React 19: Nova Arquitetura",score:44,trend:"declining",monthlyViews:290,category:"Dev",action:"rewrite",suggestion:"Conteúdo datado. Reescrever com exemplos atuais."},
      {id:8,title:"IA no E-commerce em 2026",score:77,trend:"growing",monthlyViews:720,category:"IA",action:"expand",suggestion:"Expandir com seção sobre personalização avançada."},
    ]);
    setAnalyzing(false);
  };
  const trendIco={stable:"→","growing":"↑","declining":"↓"};
  const trendColor={stable:C.p,growing:C.ter,declining:C.err};
  const actionColor={update:C.warnC,promote:C.terC,rewrite:C.errC,expand:C.pC};
  const actionLabel={update:"Atualizar",promote:"Promover",rewrite:"Reescrever",expand:"Expandir"};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:13,alignItems:"center"}}>
        <div style={{fontSize:13,color:C.onV}}>Identifique posts com potencial evergreen e ações recomendadas.</div>
        <button className="btn bf bsm" onClick={analyze} disabled={analyzing}>{analyzing?<><div className="spinner"/>Analisando...</>:"🌿 Analisar Posts"}</button>
      </div>
      {results&&(
        <div className="fade-in">
          <div className="mg">{[{l:"Evergreen",v:results.filter(r=>r.score>=75).length,d:"de "+results.length,cls:"mcp"},{l:"Crescendo",v:results.filter(r=>r.trend==="growing").length,d:"tendência positiva",cls:"mct"},{l:"Precisam ação",v:results.filter(r=>r.action!=="promote").length,d:"recomendado",cls:"mcs"},{l:"Críticos",v:results.filter(r=>r.action==="rewrite").length,d:"reescrever",cls:"mce"}].map((m,i)=>(
            <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
          ))}</div>
          {results.map(r=>(
            <div key={r.id} className="card" style={{marginBottom:11}}>
              <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
                <Ring score={r.score} size={44}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:700}}>{r.title}</span><span className="chip" style={{background:trendColor[r.trend]+"22",color:trendColor[r.trend],fontSize:10}}>{trendIco[r.trend]} {r.trend==="growing"?"Crescendo":r.trend==="declining"?"Caindo":"Estável"}</span><span className="chip" style={{background:actionColor[r.action],color:C.on,fontSize:10}}>{actionLabel[r.action]}</span></div>
                  <div style={{fontSize:12,color:C.onV,marginBottom:7}}>{r.category} · {r.monthlyViews.toLocaleString()} views/mês</div>
                  <div style={{padding:"8px 11px",background:C.s1,borderRadius:8,fontSize:12,color:C.onV,marginBottom:9}}>💡 {r.suggestion}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn bt bsm" style={{fontSize:11}}>✏️ Editar</button>
                    {r.action==="rewrite"&&<button className="btn bf bsm" style={{fontSize:11}}>✨ Reescrever com IA</button>}
                    {r.action==="promote"&&<button className="btn bf bsm" style={{fontSize:11}}>📤 Promover</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!results&&!analyzing&&<Empty ico="🌿" title="Análise de conteúdo evergreen" sub="Descubra quais posts têm maior potencial de longo prazo."/>}
    </div>
  );
}


/* ══ READABILITY ANALYSIS ════════════════════════════════ */

export default EvergreenPage;
