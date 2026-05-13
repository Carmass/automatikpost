import { useState, useRef } from 'react';
import { C } from '../../lib/tokens.js';
import { Empty, Field } from '../ui/index.jsx';
import { callClaude } from '../../lib/supabase.js';

export function ContentBriefPage() {
  const[kw,setKw]=useState("");
  const[niche,setNiche]=useState("marketing digital");
  const[loading,setLoading]=useState(false);
  const[brief,setBrief]=useState(null);
  const outRef=useRef(null);

  const gen=async()=>{
    if(!kw.trim())return;
    setLoading(true);setBrief(null);
    const prompt=`Crie um content brief detalhado para um artigo sobre: "${kw}" (nicho: ${niche}).

Responda SOMENTE em JSON sem markdown:
{
  "title_suggestions": ["título 1","título 2","título 3"],
  "search_intent": "informacional|transacional|navegacional",
  "target_audience": "descrição do público-alvo",
  "word_count": número,
  "outline": [{"h2":"subtítulo","points":["ponto 1","ponto 2"]}],
  "primary_keyword": "${kw}",
  "secondary_keywords": ["kw1","kw2","kw3","kw4"],
  "meta_description": "descrição em 155 chars",
  "tone": "tom recomendado",
  "competitors": ["tema concorrente 1","tema concorrente 2"],
  "cta": "chamada para ação recomendada"
}`;

    try{
      const data=await callClaude({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:prompt}]});
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setBrief(parsed);
    }catch{setBrief({title_suggestions:["Erro ao gerar brief"],search_intent:"—",target_audience:"—",word_count:0,outline:[],primary_keyword:kw,secondary_keywords:[],meta_description:"—",tone:"—",competitors:[],cta:"—"});}
    setLoading(false);
  };

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">📋 Gerador de Content Brief com IA</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="Palavra-chave / Tema *"><input className="fi" placeholder="Ex: estratégias de seo para blogs" value={kw} onChange={e=>setKw(e.target.value)}/></Field>
            <Field label="Nicho"><select className="fi fi-sel" value={niche} onChange={e=>setNiche(e.target.value)}>{["marketing digital","tecnologia","negócios","saúde","educação","finanças","e-commerce"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
          </div>
          <button className="btn bf bsm" onClick={gen} disabled={loading||!kw.trim()}>{loading?<><div className="spinner"/>Gerando brief...</>:"📋 Gerar Content Brief"}</button>
        </div>
      </div>

      {brief&&(
        <div className="fade-in">
          <div className="two" style={{marginBottom:14}}>
            <div className="card">
              <div className="ch"><span className="ct">🎯 Títulos Sugeridos</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {brief.title_suggestions?.map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"8px 0",borderBottom:i<brief.title_suggestions.length-1?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12,fontWeight:800,color:C.pC,background:C.p,borderRadius:5,padding:"1px 6px",flexShrink:0}}>{i+1}</span>
                    <span style={{fontSize:13,lineHeight:1.4}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card" style={{marginBottom:12}}>
                <div className="ch"><span className="ct">📊 Informações Gerais</span></div>
                <div className="cb" style={{paddingTop:4}}>
                  {[{l:"Intenção de busca",v:brief.search_intent},{l:"Público-alvo",v:brief.target_audience},{l:"Tom recomendado",v:brief.tone},{l:"Contagem de palavras",v:brief.word_count+" palavras"},{l:"CTA",v:brief.cta}].map((r,i)=>(
                    <div key={i} style={{padding:"7px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none"}}>
                      <div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:2}}>{r.l}</div>
                      <div style={{fontSize:13}}>{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="ch"><span className="ct">🔑 Keywords</span></div>
                <div className="cb" style={{paddingTop:4}}>
                  <div style={{marginBottom:8}}><div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:5}}>Principal</div><span className="chip cp">{brief.primary_keyword}</span></div>
                  <div><div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:5}}>Secundárias</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{brief.secondary_keywords?.map(k=><span key={k} className="chip cn">{k}</span>)}</div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{marginBottom:14}}>
            <div className="ch"><span className="ct">📑 Estrutura do Artigo (Outline)</span></div>
            <div className="cb" style={{paddingTop:6}}>
              {brief.outline?.map((sec,i)=>(
                <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<brief.outline.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.p,marginBottom:8}}>H2: {sec.h2}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {sec.points?.map((pt,j)=>(
                      <div key={j} style={{display:"flex",gap:8,fontSize:12,color:C.onV}}>
                        <span style={{color:C.ovV}}>•</span>{pt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📝 Meta Description sugerida</span></div>
            <div className="cb" style={{paddingTop:4}}>
              <div style={{padding:"11px 13px",background:C.s1,borderRadius:9,fontSize:13,lineHeight:1.6,fontStyle:"italic",color:C.onV}}>"{brief.meta_description}"</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:11,color:C.onV}}>{brief.meta_description?.length}/160 chars</span>
                <button className="btn bt bsm" style={{fontSize:11}}>📋 Copiar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!brief&&!loading&&<Empty ico="📋" title="Gere um Content Brief" sub="Informe a palavra-chave e a IA cria um guia completo de produção de conteúdo."/>}
    </div>
  );
}

/* ══ SYSTEM HEALTH ════════════════════════════════════════ */

export default ContentBriefPage;
