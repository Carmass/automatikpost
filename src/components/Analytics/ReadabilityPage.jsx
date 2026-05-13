import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function ReadabilityPage() {
  const[text,setText]=useState("");
  const[result,setResult]=useState(null);
  const analyze=()=>{
    if(text.trim().length<50)return;
    const words=text.split(/\s+/).filter(Boolean).length;
    const sentences=text.split(/[.!?]+/).filter(s=>s.trim()).length||1;
    const syllables=text.split(/\s+/).reduce((a,w)=>a+Math.max(1,w.replace(/[^aeiouáéíóúàèìòùãõ]/gi,"").length),0);
    const avgW=words/sentences;
    const avgS=syllables/words;
    const score=Math.max(0,Math.min(100,Math.round(206.835-1.015*avgW-84.6*avgS)));
    const grade=score>=90?"Muito fácil":score>=70?"Fácil":score>=60?"Médio":score>=50?"Médio-difícil":score>=30?"Difícil":"Muito difícil";
    const longSent=text.split(/[.!?]+/).filter(s=>s.trim().split(/\s+/).length>25).length;
    const passive=(text.match(/\b(foi|foram|será|serão|é|são|está|estão)\s+\w+d[oa]s?\b/gi)||[]).length;
    setResult({score,grade,words,sentences,avgWords:avgW.toFixed(1),longSent,passive,readTime:Math.ceil(words/200)});
  };
  return(
    <div className="fade-in">
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📖 Analisador de Legibilidade</span></div>
          <div className="cb" style={{paddingTop:6}}>
            <Field label="Cole seu texto aqui"><textarea className="fi fi-ta" rows={9} placeholder="Cole o texto do post para análise de legibilidade..." value={text} onChange={e=>setText(e.target.value)}/></Field>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="mono" style={{fontSize:11,color:C.onV}}>{text.split(/\s+/).filter(Boolean).length} palavras</span>
              <button className="btn bf bsm" onClick={analyze} disabled={text.trim().length<50}>📖 Analisar</button>
            </div>
          </div>
        </div>
        {result?(
          <div className="fade-in">
            <div className="card" style={{marginBottom:13}}>
              <div className="ch"><span className="ct">📊 Score Flesch-Kincaid</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:13,padding:"12px",background:C.s1,borderRadius:10}}>
                  <Ring score={result.score} size={54}/>
                  <div><div style={{fontSize:20,fontWeight:800,color:result.score>=70?C.ter:result.score>=50?C.warn:C.err}}>{result.score}/100</div><div style={{fontSize:13,color:C.onV}}>{result.grade}</div><div style={{fontSize:11,color:C.onV}}>~{result.readTime} min de leitura</div></div>
                </div>
                {[{l:"Palavras",v:result.words},{l:"Sentenças",v:result.sentences},{l:"Palavras/frase",v:result.avgWords}].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12,color:C.onV}}>{s.l}</span>
                    <span className="mono" style={{fontSize:13,fontWeight:700}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">⚠️ Sugestões</span></div>
              <div className="cb" style={{paddingTop:6}}>
                {[{ok:result.avgWords<=20,l:"Frases curtas (≤20 palavras)",v:`Média: ${result.avgWords} pal/frase`},{ok:result.longSent===0,l:"Sem frases muito longas",v:result.longSent===0?"✓ Nenhuma":result.longSent+" frases longas"},{ok:result.passive<3,l:"Poucos verbos no passivo",v:result.passive===0?"✓ Nenhum":result.passive+" ocorrências"},{ok:result.score>=60,l:"Legibilidade adequada",v:result.grade}].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:14}}>{c.ok?"✅":"⚠️"}</span>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:c.ok?C.on:C.onV}}>{c.l}</div><div style={{fontSize:11,color:C.onV}}>{c.v}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ):<Empty ico="📖" title="Cole um texto para analisar" sub="Calcula score de Flesch, tempo de leitura e identifica frases complexas."/>}
      </div>
    </div>
  );
}

/* ══ PLAGIARISM CHECKER ═══════════════════════════════════ */

export default ReadabilityPage;
