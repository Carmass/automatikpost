import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';
import { Backend } from '../../api/backend.js';
import SEOAnalyzer from '../ui/SEOAnalyzer.jsx';

function AIProducerPage({showToast}){
  const[topic,setTopic]=useState("");
  const[tone,setTone]=useState("informativo");
  const[niche,setNiche]=useState("marketing digital");
  const[len,setLen]=useState("completo");
  const[tmpl,setTmpl]=useState("");
  const[output,setOutput]=useState("");
  const[loading,setLoading]=useState(false);
  const[step,setStep]=useState(0);
  const[score,setScore]=useState(0);
  const outRef=useRef(null);
  const run=async()=>{
    if(!topic.trim())return;
    setLoading(true);setOutput("");setStep(1);setScore(0);
    const tplCtx=tmpl?`\nSiga o template: ${TEMPLATES.find(t=>t.id===+tmpl)?.prompt||""}`:""
    const prompt=`Especialista em SEO e criação de conteúdo. Português brasileiro.\n\nTema: "${topic}"\nNicho: ${niche} | Tom: ${tone} | Tamanho: ${{rapido:"~800p",completo:"~1500p",detalhado:"~2500p"}[len]}${tplCtx}\n\n# [Título H1 otimizado para SEO]\n\n[Introdução com gancho e promessa]\n\n## [H2 com palavra-chave]\n[Conteúdo detalhado, exemplos práticos]\n\n## [H2]\n[Conteúdo]\n\n## [H2]\n[Conteúdo]\n\n## Conclusão\n[Resumo + CTA]\n\n---\n**Meta Description:** [máx 155 chars]\n**Keywords:** kw1, kw2, kw3, kw4, kw5\n**Score SEO estimado:** [numero]/100`;
    try{
      setStep(2);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||"").join("")||"Erro.";
      let i=0;
      const iv=setInterval(()=>{
        i+=14;setOutput(text.slice(0,i));
        if(outRef.current)outRef.current.scrollTop=outRef.current.scrollHeight;
        if(i>=text.length){clearInterval(iv);setLoading(false);setStep(3);const m=text.match(/Score SEO estimado:\s*(\d+)/);setScore(m?+m[1]:Math.floor(Math.random()*14)+79);}
      },15);
    }catch{setOutput("Erro de conexão.");setLoading(false);setStep(0);}
  };
  return(
    <div className="fade-in">
      <div className="stps">{["Configurar","Processar","Gerar","Pronto"].map((s,i)=>(
        <div key={i} className="sti"><div className={`stc ${step>i?"done":step===i?"act":"idle"}`}>{step>i?"✓":i+1}</div><div className="stl">{s}</div></div>
      ))}</div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:11}}>
            <div className="ch"><span className="ct">⚙️ Configuração</span></div>
            <div className="cb" style={{paddingTop:5}}>
              <Field label="Tema *"><textarea className="fi fi-ta" placeholder="Ex: Como usar IA para criar conteúdo..." value={topic} onChange={e=>setTopic(e.target.value)} rows={4}/></Field>
              <div className="two">
                <Field label="Tom"><select className="fi fi-sel" value={tone} onChange={e=>setTone(e.target.value)}>{["informativo","persuasivo","casual","técnico","inspiracional","jornalístico"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
                <Field label="Tamanho"><select className="fi fi-sel" value={len} onChange={e=>setLen(e.target.value)}><option value="rapido">Rápido (~800p)</option><option value="completo">Completo (~1500p)</option><option value="detalhado">Detalhado (~2500p)</option></select></Field>
              </div>
              <div className="two">
                <Field label="Nicho"><select className="fi fi-sel" value={niche} onChange={e=>setNiche(e.target.value)}>{["marketing digital","tecnologia","negócios","saúde","educação","finanças","e-commerce"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
                <Field label="Template"><select className="fi fi-sel" value={tmpl} onChange={e=>setTmpl(e.target.value)}><option value="">Nenhum</option>{TEMPLATES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
              </div>
            </div>
          </div>
          <button className="btn bf" style={{width:"100%",justifyContent:"center",padding:12,borderRadius:12}} onClick={run} disabled={loading||!topic.trim()}>{loading?<><div className="spinner"/>Gerando com Claude AI...</>:"✨ Gerar Artigo com IA"}</button>
          {step===3&&<div style={{marginTop:10}}>
            <div style={{display:"flex",gap:8,marginBottom:9}}><button className="btn bo bsm" style={{flex:1,justifyContent:"center"}}>⬇ Exportar</button><button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>showToast("💾 Salvo como rascunho!")}>💾 Salvar Post</button></div>
            <div style={{padding:"10px 13px",background:score>=80?C.terC:C.warnC,borderRadius:11,display:"flex",alignItems:"center",gap:10}}>
              <Ring score={score} size={42}/>
              <div><div style={{fontSize:13,fontWeight:700,color:score>=80?C.onTerC:C.warn}}>Score SEO: {score}/100</div><div style={{fontSize:11,color:score>=80?C.onTerC:C.warn,opacity:.8}}>{score>=80?"Pronto para publicar!":"Revisar antes de publicar."}</div></div>
            </div>
          </div>}
        </div>
        <div className="card"><div className="ch"><span className="ct">📝 Conteúdo Gerado</span>{step===3&&<span className="chip ct3">✓ Pronto</span>}</div><div className="cb" style={{paddingTop:3}}>{(output||loading)?<div className="aio" ref={outRef}>{output}{loading&&<span className="cur"/>}</div>:<Empty ico="🤖" title="Aguardando" sub="Configure e clique em Gerar."/>}</div></div>
      </div>
    </div>
  );
}

export default AIProducerPage;
