import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function IdeasPage(){
  const[topic,setTopic]=useState("");
  const[loading,setLoading]=useState(false);
  const[ideas,setIdeas]=useState([]);
  const gen=async()=>{
    if(!topic.trim())return;
    setLoading(true);setIdeas([]);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`Gere 8 ideias de artigos para o nicho: "${topic}". SOMENTE JSON:\n{"ideas":[{"title":"...","keyword":"...","category":"...","difficulty":"easy|medium|hard","potential":"low|medium|high"}]}`}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      const p=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setIdeas(p.ideas||[]);
    }catch{setIdeas([{title:"Erro ao gerar. Tente novamente.",keyword:"—",category:"Erro",difficulty:"easy",potential:"low"}]);}
    setLoading(false);
  };
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">✦ Gerador de Ideias com IA</span></div>
        <div className="cb" style={{paddingTop:5}}>
          <div style={{display:"flex",gap:8}}>
            <input className="fi" style={{flex:1,height:38}} placeholder="Digite nicho, tema ou palavra-chave..." value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&gen()}/>
            <button className="btn bf" onClick={gen} disabled={loading||!topic.trim()}>{loading?<><div className="spinner"/>Gerando...</>:"✨ Gerar 8 Ideias"}</button>
          </div>
        </div>
      </div>
      {ideas.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {ideas.map((idea,i)=>(
            <div key={i} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e2} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
              <div style={{padding:"13px 15px"}}>
                <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                  <span className="chip cp" style={{fontSize:10}}>{idea.category}</span>
                  <span className="chip" style={{background:{easy:C.terC,medium:C.warnC,hard:C.errC}[idea.difficulty]||C.s2,color:C.on,fontSize:10}}>{({easy:"Fácil",medium:"Médio",hard:"Difícil"})[idea.difficulty]||idea.difficulty}</span>
                  <span className="chip" style={{background:{low:C.s2,medium:C.secC,high:C.pC}[idea.potential]||C.s2,color:C.onV,fontSize:10}}>Pot. {({low:"Baixo",medium:"Médio",high:"Alto"})[idea.potential]||"—"}</span>
                </div>
                <div style={{fontSize:13,fontWeight:600,lineHeight:1.4,marginBottom:5}}>{idea.title}</div>
                <div className="mono" style={{fontSize:10,color:C.onV,marginBottom:8}}>🔑 {idea.keyword}</div>
                <button className="btn bt bsm" style={{fontSize:11}}>✨ Gerar artigo</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading&&ideas.length===0&&<Empty ico="💡" title="Gere ideias de conteúdo" sub="Digite um nicho e a IA retorna 8 ideias com título, keyword e dificuldade."/>}
    </div>
  );
}

export default IdeasPage;
