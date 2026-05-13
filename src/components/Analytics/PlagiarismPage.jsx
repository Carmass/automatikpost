import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function PlagiarismPage({ showToast }) {
  const[text,setText]=useState("");
  const[checking,setChecking]=useState(false);
  const[result,setResult]=useState(null);
  const check=async()=>{
    if(text.trim().length<100){showToast("⚠️ Mínimo 100 caracteres.");return;}
    setChecking(true);setResult(null);
    await new Promise(r=>setTimeout(r,2500));
    const unique=Math.floor(Math.random()*15)+83;
    setResult({unique,plagiarism:100-unique,sources:unique<100?[{url:"blog.concorrente.com.br",similarity:12,snippet:"estratégias de SEO são fundamentais para..."},{url:"medium.com/@author",similarity:5,snippet:"palavras-chave de cauda longa..."}]:[],checked:new Date().toLocaleString("pt-BR"),words:text.split(/\s+/).filter(Boolean).length});
    setChecking(false);
  };
  return(
    <div className="fade-in">
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">🔍 Verificador de Plágio</span></div>
          <div className="cb" style={{paddingTop:6}}>
            <Field label="Texto (mín. 100 chars)"><textarea className="fi fi-ta" rows={9} placeholder="Cole o texto do post aqui..." value={text} onChange={e=>setText(e.target.value)}/></Field>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="mono" style={{fontSize:11,color:C.onV}}>{text.length} chars</span>
              <button className="btn bf bsm" onClick={check} disabled={checking||text.length<100}>{checking?<><div className="spinner"/>Verificando...</>:"🔍 Verificar"}</button>
            </div>
          </div>
        </div>
        {result?(
          <div className="fade-in">
            <div className="card" style={{marginBottom:13}}>
              <div className="ch"><span className="ct">📊 Resultado</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{display:"flex",gap:14,marginBottom:12}}>
                  <div style={{flex:1,padding:"13px",background:C.terC,borderRadius:10,textAlign:"center"}}><div className="mono" style={{fontSize:26,fontWeight:800,color:C.ter}}>{result.unique}%</div><div style={{fontSize:12,color:C.onTerC,fontWeight:600}}>Único</div></div>
                  <div style={{flex:1,padding:"13px",background:result.plagiarism>10?C.errC:C.s1,borderRadius:10,textAlign:"center"}}><div className="mono" style={{fontSize:26,fontWeight:800,color:result.plagiarism>10?C.err:C.onV}}>{result.plagiarism}%</div><div style={{fontSize:12,color:result.plagiarism>10?C.err:C.onV,fontWeight:600}}>Plágio</div></div>
                </div>
                <div className="pb" style={{height:10,marginBottom:8}}><div className="pbf" style={{width:`${result.unique}%`,background:result.unique>=90?C.ter:result.unique>=75?C.warn:C.err}}/></div>
                <div style={{padding:"8px 11px",background:result.unique>=90?C.terC:result.unique>=75?C.warnC:C.errC,borderRadius:8,fontSize:12,fontWeight:600,color:result.unique>=90?C.onTerC:result.unique>=75?C.warn:C.err}}>
                  {result.unique>=90?"✅ Conteúdo altamente original.":result.unique>=75?"⚠️ Razoável, mas revise.":"❌ Alto índice de similaridade."}
                </div>
              </div>
            </div>
            {result.sources.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">🔗 Fontes similares</span></div>
                <div className="cb" style={{paddingTop:6}}>
                  {result.sources.map((s,i)=>(
                    <div key={i} style={{padding:"10px 0",borderBottom:i<result.sources.length-1?`1px solid ${C.ovV}`:"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span className="mono" style={{fontSize:11,color:C.p}}>{s.url}</span><span style={{fontSize:12,fontWeight:700,color:C.warn}}>{s.similarity}% similar</span></div>
                      <div style={{fontSize:12,color:C.onV,fontStyle:"italic"}}>"{s.snippet}..."</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ):<Empty ico="🔍" title="Verifique a originalidade" sub="Cole o texto para verificar plágio e comparar com fontes online."/>}
      </div>
    </div>
  );
}

/* ══ EXPORT REPORTS ═══════════════════════════════════════ */

export default PlagiarismPage;
