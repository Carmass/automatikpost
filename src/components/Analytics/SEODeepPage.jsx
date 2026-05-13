import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function SEODeepPage(){
  const[url,setUrl]=useState("");
  const[kw,setKw]=useState("");
  const[analyzing,setAnalyzing]=useState(false);
  const[result,setResult]=useState(null);

  const analyze=async()=>{
    if(!kw.trim())return;
    setAnalyzing(true);setResult(null);
    await new Promise(r=>setTimeout(r,2200));
    setResult({
      score:84,
      title:{ok:true,val:"10 Estratégias de SEO para 2026 — Guia Completo"},
      metaDesc:{ok:true,len:148,val:"Descubra as 10 estratégias de SEO mais eficazes para 2026. Aprenda técnicas avançadas de link building, conteúdo e muito mais."},
      keywords:[{kw:kw,density:"2.1%",count:12,ok:true},{kw:kw+" 2026",density:"0.9%",count:5,ok:true},{kw:"estratégia "+kw,density:"0.4%",count:2,ok:false}],
      headings:{h1:1,h2:4,h3:6,ok:true},
      wordCount:1842,
      readability:{score:68,grade:"Fácil",ok:true},
      links:{internal:6,external:3,broken:0,ok:true},
      images:{total:4,withAlt:3,withoutAlt:1,ok:false},
      pageSpeed:{mobile:72,desktop:91},
      issues:[{severity:"warning",msg:"1 imagem sem atributo alt"},
        {severity:"info",msg:"Adicionar FAQ Schema para featured snippets"},
        {severity:"info",msg:"Incluir mais variações long-tail da keyword principal"}],
    });
    setAnalyzing(false);
  };

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">🔍 Análise SEO Aprofundada</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="URL do Post (opcional)"><input className="fi" placeholder="https://blog.exemplo.com.br/artigo" value={url} onChange={e=>setUrl(e.target.value)}/></Field>
            <Field label="Palavra-chave principal *"><input className="fi" placeholder="Ex: estratégias de seo" value={kw} onChange={e=>setKw(e.target.value)}/></Field>
          </div>
          <button className="btn bf bsm" onClick={analyze} disabled={analyzing||!kw.trim()}>{analyzing?<><div className="spinner"/>Analisando...</>:"🔍 Analisar SEO"}</button>
        </div>
      </div>

      {result&&(
        <div className="fade-in">
          <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",background:C.s0,borderRadius:16,boxShadow:C.e1,marginBottom:14}}>
            <Ring score={result.score} size={64}/>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:800,color:result.score>=80?C.ter:result.score>=60?C.warn:C.err}}>Score SEO: {result.score}/100</div>
              <div style={{fontSize:13,color:C.onV,marginTop:3}}>{result.score>=80?"Excelente — pronto para publicar!":result.score>=60?"Bom — alguns ajustes recomendados":"Melhorias necessárias antes de publicar"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Mobile",v:result.pageSpeed.mobile,c:result.pageSpeed.mobile>=80?C.ter:C.warn},{l:"Desktop",v:result.pageSpeed.desktop,c:result.pageSpeed.desktop>=80?C.ter:C.warn}].map(s=>(
                <div key={s.l} style={{background:C.s1,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.onV,fontWeight:700,marginBottom:3}}>{s.l}</div>
                  <div className="mono" style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {result.issues.length>0&&(
            <div className="card" style={{marginBottom:14}}>
              <div className="ch"><span className="ct">⚠️ Problemas Detectados</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {result.issues.map((iss,i)=>(
                  <div key={i} style={{display:"flex",gap:9,padding:"8px 0",borderBottom:i<result.issues.length-1?`1px solid ${C.ovV}`:"none",alignItems:"flex-start"}}>
                    <span className="chip" style={{background:{warning:C.warnC,info:C.pC,error:C.errC}[iss.severity],color:C.on,fontSize:9,flexShrink:0}}>{iss.severity.toUpperCase()}</span>
                    <span style={{fontSize:13,color:C.onV}}>{iss.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="two">
            <div className="card">
              <div className="ch"><span className="ct">📋 Checklist Detalhado</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {[
                  {l:"Título H1 otimizado",ok:result.title.ok,detail:result.title.val.slice(0,50)+"…"},
                  {l:"Meta description completa",ok:result.metaDesc.ok,detail:`${result.metaDesc.len}/160 chars`},
                  {l:"Estrutura de headings",ok:result.headings.ok,detail:`H1: ${result.headings.h1} · H2: ${result.headings.h2} · H3: ${result.headings.h3}`},
                  {l:"Contagem de palavras",ok:result.wordCount>=800,detail:`${result.wordCount} palavras`},
                  {l:"Links internos/externos",ok:result.links.ok,detail:`${result.links.internal} internos · ${result.links.external} externos`},
                  {l:"Imagens com alt text",ok:result.images.ok,detail:`${result.images.withAlt}/${result.images.total} com alt`},
                  {l:"Legibilidade",ok:result.readability.ok,detail:`Score: ${result.readability.score} — ${result.readability.grade}`},
                  {l:"Links quebrados",ok:result.links.broken===0,detail:result.links.broken===0?"Nenhum encontrado":`${result.links.broken} links quebrados`},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<7?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:14,flexShrink:0}}>{c.ok?"✅":"⚠️"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:c.ok?C.on:C.onV}}>{c.l}</div>
                      <div style={{fontSize:11,color:C.onV}}>{c.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">🔑 Análise de Keywords</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {result.keywords.map((k,i)=>(
                  <div key={i} style={{padding:"10px 0",borderBottom:i<result.keywords.length-1?`1px solid ${C.ovV}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span className="mono" style={{fontSize:12,fontWeight:600}}>{k.kw}</span>
                      <span style={{fontSize:12,fontWeight:700,color:k.ok?C.ter:C.warn,fontFamily:"'JetBrains Mono',monospace"}}>{k.density}</span>
                    </div>
                    <div className="pb"><div className="pbf" style={{width:`${parseFloat(k.density)*20}%`,background:k.ok?C.ter:C.warn}}/></div>
                    <div style={{fontSize:11,color:C.onV,marginTop:3}}>{k.count} ocorrências · {k.ok?"✓ densidade ideal":"⚠️ aumentar frequência"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {!result&&!analyzing&&<Empty ico="🔍" title="Analisar SEO do post" sub="Informe a palavra-chave e clique em Analisar para obter um relatório completo."/>}
    </div>
  );
}

/* ══ AB TESTING ═══════════════════════════════════════════ */

export default SEODeepPage;
