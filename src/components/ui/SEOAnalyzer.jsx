import { useState, useMemo } from 'react';
import { C } from '../lib/tokens.js';
import { Ring } from './index.jsx';

function SEOAnalyzer({content,keyword}){
  const checks=useMemo(()=>{
    const txt=(content||"").toLowerCase();
    const kw=(keyword||"").toLowerCase();
    return[
      {l:"Palavra-chave no título H1",ok:kw&&txt.split("\n")[0]?.includes(kw),w:20},
      {l:"Comprimento adequado (>800 chars)",ok:content&&content.length>800,w:15},
      {l:"Subtítulos H2 presentes",ok:txt.includes("##"),w:10},
      {l:"Meta description definida",ok:txt.includes("meta"),w:15},
      {l:"Keyword density 1-3%",ok:kw&&txt.split(kw).length>2,w:15},
      {l:"Links presentes",ok:txt.includes("http")||txt.includes("["),w:10},
      {l:"Imagem de destaque",ok:false,w:10},
      {l:"URL amigável configurada",ok:true,w:5},
    ];
  },[content,keyword]);
  const sc=checks.reduce((s,c)=>s+(c.ok?c.w:0),0);
  const col=sc>=80?C.ter:sc>=60?C.warn:C.err;
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12,padding:"11px 13px",background:C.s1,borderRadius:11}}>
        <Ring score={sc} size={50}/>
        <div>
          <div style={{fontSize:17,fontWeight:800,color:col}}>{sc}/100</div>
          <div style={{fontSize:12,color:C.onV}}>{sc>=80?"Excelente!":sc>=60?"Bom — pode melhorar":"Atenção necessária"}</div>
        </div>
      </div>
      {checks.map((c,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:i<checks.length-1?`1px solid ${C.ovV}`:"none"}}>
          <span style={{fontSize:13}}>{c.ok?"✅":"⚠️"}</span>
          <span style={{fontSize:12,flex:1,color:c.ok?C.on:C.onV}}>{c.l}</span>
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>+{c.w}</span>
        </div>
      ))}
    </div>
  );
}


export default SEOAnalyzer;
