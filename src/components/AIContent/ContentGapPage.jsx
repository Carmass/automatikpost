import { useState } from 'react';
import { C } from '../../lib/tokens.js';
import { Empty } from '../ui/index.jsx';
import { callClaude } from '../../lib/supabase.js';

export function ContentGapPage() {
  const[analyzing,setAnalyzing]=useState(false);
  const[gaps,setGaps]=useState(null);
  const myTopics=["SEO","IA","Email Marketing","WordPress","CRO"];
  const competitorTopics=["SEO","IA","Social Media","Content Marketing","Email Marketing","PPC","Analytics","UX","Copywriting","Automação"];
  const analyze=async()=>{
    setAnalyzing(true);setGaps(null);
    const prompt=`Analise lacunas de conteúdo. Meus tópicos: ${myTopics.join(",")}. Concorrentes: ${competitorTopics.join(",")}. Responda SOMENTE em JSON:\n{"gaps":[{"topic":"...","opportunity":"alta|média|baixa","reason":"...","suggested_title":"..."}]}`;
    try{
      const data=await callClaude({model:"claude-sonnet-4-20250514",max_tokens:700,messages:[{role:"user",content:prompt}]});
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setGaps(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setGaps({gaps:[{topic:"Social Media",opportunity:"alta",reason:"Concorrentes têm forte presença",suggested_title:"Guia de Social Media para Blogs em 2026"},{topic:"PPC",opportunity:"alta",reason:"Alto volume, pouca cobertura",suggested_title:"Google Ads para Criadores de Conteúdo"},{topic:"Analytics",opportunity:"média",reason:"Tópico emergente",suggested_title:"GA4: Guia Prático para Bloggers"}]});}
    setAnalyzing(false);
  };
  const oppColor={alta:C.errC,média:C.warnC,baixa:C.s2};
  const oppText={alta:C.err,média:C.warn,baixa:C.onV};
  return(
    <div className="fade-in">
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">📚 Meus Tópicos</span><span className="chip ct3">{myTopics.length}</span></div><div className="cb" style={{paddingTop:6}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{myTopics.map(t=><span key={t} className="chip ct3">{t}</span>)}</div></div></div>
        <div className="card"><div className="ch"><span className="ct">🔍 Tópicos dos Concorrentes</span><span className="chip ce">{competitorTopics.length}</span></div><div className="cb" style={{paddingTop:6}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{competitorTopics.map(t=><span key={t} className={`chip ${myTopics.includes(t)?"ct3":"ce"}`}>{t}{myTopics.includes(t)?" ✓":""}</span>)}</div></div></div>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:13}}><button className="btn bf" onClick={analyze} disabled={analyzing}>{analyzing?<><div className="spinner"/>Analisando...</>:"🔍 Analisar Lacunas"}</button></div>
      {gaps?.gaps&&(
        <div className="fade-in">
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🎯 {gaps.gaps.length} oportunidades identificadas</div>
          {gaps.gaps.map((g,i)=>(
            <div key={i} className="card" style={{marginBottom:11}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:9}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:700}}>{g.topic}</span><span className="chip" style={{background:oppColor[g.opportunity],color:oppText[g.opportunity]}}>Oportunidade {g.opportunity}</span></div>
                    <div style={{fontSize:12,color:C.onV,marginBottom:8}}>{g.reason}</div>
                    <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:13,color:C.onPC,fontWeight:500}}>💡 "{g.suggested_title}"</div>
                  </div>
                </div>
                <button className="btn bt bsm" style={{fontSize:11}}>✨ Gerar artigo</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!gaps&&!analyzing&&<Empty ico="🔍" title="Analise lacunas de conteúdo" sub="Compare seus tópicos com os concorrentes e descubra oportunidades inexploradas."/>}
    </div>
  );
}

/* ══ EVERGREEN ANALYSIS ═══════════════════════════════════ */

export default ContentGapPage;
