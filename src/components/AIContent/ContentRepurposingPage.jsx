import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function ContentRepurposingPage({ showToast }) {
  const[selPost,setSelPost]=useState(POSTS.find(p=>p.status==="published")||POSTS[0]);
  const[loading,setLoading]=useState(false);
  const[results,setResults]=useState(null);
  const repurpose=async()=>{
    setLoading(true);setResults(null);
    const prompt=`Especialista em repurposing. Post: "${selPost.title}" (cat: ${selPost.cat}). Responda SOMENTE em JSON:\n{"newsletter":"2 parágrafos de newsletter","twitter_thread":"5 tweets numerados 1/5 a 5/5","linkedin":"post profissional 3 parágrafos + hashtags","youtube_script":"roteiro 60s para vídeo","faq":"5 perguntas e respostas"}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setResults(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setResults({newsletter:"Erro ao gerar.",twitter_thread:"Erro.",linkedin:"Erro.",youtube_script:"Erro.",faq:"Erro."});}
    setLoading(false);
  };
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">♻️ Repurposing de Conteúdo com IA</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="Post de origem">
              <select className="fi fi-sel" value={selPost.id} onChange={e=>setSelPost(POSTS.find(p=>p.id===+e.target.value)||POSTS[0])}>
                {POSTS.filter(p=>p.status==="published").map(p=><option key={p.id} value={p.id}>{p.title.slice(0,55)}…</option>)}
              </select>
            </Field>
            <div><div className="fl">Formatos gerados</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Newsletter","Thread Twitter","LinkedIn","YouTube Script","FAQ"].map(f=><span key={f} className="chip cp">{f}</span>)}</div></div>
          </div>
          <button className="btn bf bsm" onClick={repurpose} disabled={loading}>{loading?<><div className="spinner"/>Gerando...</>:"♻️ Gerar Variações"}</button>
        </div>
      </div>
      {results&&(
        <div className="fade-in" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          {[{key:"newsletter",title:"📧 Newsletter"},{key:"twitter_thread",title:"𝕏 Thread Twitter"},{key:"linkedin",title:"LinkedIn Post"},{key:"youtube_script",title:"🎬 Script YouTube"},{key:"faq",title:"❓ FAQ"}].map(f=>(
            <div key={f.key} className="card">
              <div className="ch"><span className="ct">{f.title}</span><button className="btn bt bsm" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(results[f.key]||"");showToast(`📋 Copiado!`);}}>📋 Copiar</button></div>
              <div className="cb" style={{paddingTop:4}}><div style={{background:C.s1,borderRadius:9,padding:"11px 13px",fontSize:12,lineHeight:1.7,color:C.onV,maxHeight:150,overflowY:"auto",whiteSpace:"pre-wrap"}}>{results[f.key]}</div></div>
            </div>
          ))}
        </div>
      )}
      {!results&&!loading&&<Empty ico="♻️" title="Repurpose seu conteúdo" sub="Selecione um post publicado e a IA cria versões para diferentes canais."/>}
    </div>
  );
}

/* ══ CONTENT GAP ANALYZER ════════════════════════════════ */

export default ContentRepurposingPage;
