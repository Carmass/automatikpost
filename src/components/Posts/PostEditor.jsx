import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Backend } from '../../api/backend.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';
import SEOAnalyzer from '../ui/SEOAnalyzer.jsx';

function PostEditor({post,onBack,showToast,go}){
  const[title,setTitle]=useState(post?.title||"");
  const[content,setContent]=useState(post?.content||"");
  const[keyword,setKeyword]=useState(post?.keyword||"");
  const[metaDesc,setMetaDesc]=useState(post?.metaDesc||"");
  const[cat,setCat]=useState(post?.cat||"SEO");
  const[tab,setTab]=useState("write");
  const[saving,setSaving]=useState(false);
  const[publishing,setPublishing]=useState(false);
  const[pubDlg,setPubDlg]=useState(false);
  const[socialVars,setSocialVars]=useState(null);
  const[genVars,setGenVars]=useState(false);
  const[genTitles,setGenTitles]=useState(false);
  const[titleSugs,setTitleSugs]=useState([]);
  const[genMeta,setGenMeta]=useState(false);
  const[tasks,setTasks]=useState([{id:1,title:"Revisar meta description",done:false},{id:2,title:"Adicionar imagem de destaque",done:false},{id:3,title:"Verificar links internos",done:false}]);
  const[taskInput,setTaskInput]=useState("");
  const[versions,setVersions]=useState([{id:1,version:1,content:"Rascunho inicial",savedBy:"IA",savedAt:"Hoje 09:00"}]);
  const[comments,setComments]=useState([]);
  const[commentInput,setCommentInput]=useState("");
  const contentRef=useRef(null);

  const save=async()=>{
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    setVersions(p=>[{id:Date.now(),version:p.length+1,content:title||"Sem título",savedBy:"Ana Lima",savedAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})},
      ...p]);
    setSaving(false);
    showToast("💾 Post salvo! Nova versão criada.");
  };

  const publish=async()=>{
    setPubDlg(false);setPublishing(true);
    try{
      const result=await Backend.publishToWordPress({siteUrl:"blog.exemplo.com.br",user:"admin",appPassword:"app_xxx",post:{id:post?.id||Date.now(),title}});
      showToast(`📤 Publicado! WP ID: ${result.wpId}`);
      await Backend.notifyPublishedTask({postId:post?.id||1,publishedBy:"Ana Lima"});
    }catch(e){showToast("❌ Erro ao publicar: "+e.message);}
    setPublishing(false);
  };

  const doGenTitles=async()=>{
    if(!keyword.trim()&&!title.trim())return;
    setGenTitles(true);setTitleSugs([]);
    try{
      const r=await Backend.generateOptimizedTitles({topic:keyword||title,niche:cat,count:5});
      setTitleSugs(r.titles||[]);
    }catch{setTitleSugs(["Erro ao gerar. Verifique a conexão."]);}
    setGenTitles(false);
  };

  const doGenMeta=async()=>{
    if(!title.trim())return;
    setGenMeta(true);
    try{
      const r=await Backend.generateOptimizedMeta({title,keyword});
      setMetaDesc(r.metaDescription||"");
      showToast("✅ Meta description gerada!");
    }catch{showToast("❌ Erro ao gerar meta.");}
    setGenMeta(false);
  };

  const genVarsAI=async()=>{
    setGenVars(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`Com base no título: "${title||"Novo Post"}", crie variações para redes sociais. Responda SOMENTE em JSON:\n{"twitter":"(max 280 chars com emojis)","linkedin":"(2 parágrafos profissionais)","instagram":"(legenda com emojis e 5 hashtags)"}`}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setSocialVars(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setSocialVars({twitter:"🚀 "+title,linkedin:title+" — novo artigo no blog.",instagram:"✨ "+title+"\n\n#blog #conteudo #marketing #digital #dicas"});}
    setGenVars(false);setTab("social");
  };

  const fmt=cmd=>document.execCommand(cmd,false,null);
  const doneTasks=tasks.filter(t=>t.done).length;

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14,flexWrap:"wrap"}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <span style={{fontSize:14,fontWeight:700,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{title||"Novo Post"}</span>
        <SChip status="draft"/>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          <button className="ib" title="Tarefas" onClick={()=>setTab("tasks")} style={{position:"relative"}}>
            ✅{doneTasks<tasks.length&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:C.warn}}/>}
          </button>
          <button className="ib" title="Versões" onClick={()=>setTab("versions")}>🕐</button>
          <button className="ib" title="Comentários" onClick={()=>setTab("comments")}>💬{comments.filter(c=>!c.resolved).length>0&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:C.err}}/>}</button>
          <button className="ib" title="Publicação multicanal" onClick={()=>go&&go("multichannel",post)}>📡</button>
        </div>
        <button className="btn bt bsm" onClick={save} disabled={saving}>{saving?<><div className="spinner"/>Salvando...</>:"💾 Salvar"}</button>
        <button className="btn bf bsm" onClick={()=>setPubDlg(true)} disabled={publishing}>{publishing?<><div className="spinner"/>Publicando...</>:"📤 Publicar"}</button>
      </div>
      <div className="tabs" style={{flexWrap:"wrap"}}>
        {[["write","✍️ Escrever"],["seo","🔍 SEO"],["social","📱 Social"],["preview","👁 Preview"],["settings","⚙️ Config"],["tasks","✅ Tarefas"],["versions","🕐 Versões"],["comments","💬 Notas"]].map(([id,label])=>(
          <div key={id} className={`tabi ${tab===id?"a":""}`} onClick={()=>setTab(id)}>{label}{id==="tasks"&&<span className="tcnt">{doneTasks}/{tasks.length}</span>}{id==="comments"&&comments.length>0&&<span className="tcnt">{comments.filter(c=>!c.resolved).length}</span>}</div>
        ))}
      </div>

      {tab==="write"&&(
        <div className="two">
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div style={{padding:"10px 13px"}}>
                <input className="fi" style={{fontSize:15,fontWeight:700,marginBottom:8}} placeholder="Título do Post..." value={title} onChange={e=>setTitle(e.target.value)}/>
                {titleSugs.length>0&&(
                  <div style={{marginBottom:8}}>
                    {titleSugs.map((s,i)=><div key={i} style={{padding:"5px 9px",fontSize:12,background:C.s1,borderRadius:7,marginBottom:4,cursor:"pointer",color:C.p,fontWeight:500}} onClick={()=>{setTitle(s);setTitleSugs([]);}}>{s}</div>)}
                  </div>
                )}
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <input className="fi" style={{flex:1,fontSize:12}} placeholder="🔑 Palavra-chave principal..." value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                  <button className="btn bt bsm" style={{flexShrink:0,fontSize:11}} onClick={doGenTitles} disabled={genTitles||(!keyword&&!title)}>{genTitles?<div className="spinner" style={{width:11,height:11}}/>:"✨ Títulos"}</button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="rtb">
                {[["B","bold"],["I","italic"],["U","underline"]].map(([l,c])=><button key={c} onClick={()=>fmt(c)}><b style={c==="bold"?{}:c==="italic"?{fontStyle:"italic",fontWeight:400}:{textDecoration:"underline",fontWeight:400}}>{l}</b></button>)}
                <div className="rtb-div"/>
                <button onClick={()=>document.execCommand("formatBlock",false,"h2")}>H2</button>
                <button onClick={()=>document.execCommand("formatBlock",false,"h3")}>H3</button>
                <button onClick={()=>document.execCommand("formatBlock",false,"p")}>¶</button>
                <div className="rtb-div"/>
                <button onClick={()=>fmt("insertUnorderedList")}>• Lista</button>
                <button onClick={()=>fmt("insertOrderedList")}>1. Num</button>
                <div className="rtb-div"/>
                <button onClick={()=>fmt("undo")}>↩</button>
                <button onClick={()=>fmt("redo")}>↪</button>
              </div>
              <div ref={contentRef} className="fi-rich" contentEditable suppressContentEditableWarning onInput={e=>setContent(e.target.innerText)} style={{borderRadius:"0 0 10px 10px",border:"none",borderTop:`1px solid ${C.ovV}`}}>{content}</div>
            </div>
          </div>
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div className="ch"><span className="ct">📊 SEO em tempo real</span></div>
              <div className="cb" style={{paddingTop:4}}><SEOAnalyzer content={title+" "+content} keyword={keyword}/></div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">📝 Meta Description</span><button className="btn bt bsm" style={{fontSize:11}} onClick={doGenMeta} disabled={genMeta||!title}>{genMeta?<div className="spinner" style={{width:11,height:11}}/>:"✨ Gerar"}</button></div>
              <div className="cb" style={{paddingTop:4}}>
                <textarea className="fi fi-ta" rows={3} placeholder="Descrição para SEO (máx 160 chars)..." value={metaDesc} onChange={e=>setMetaDesc(e.target.value.slice(0,160))}/>
                <div style={{fontSize:11,color:metaDesc.length>150?C.warn:C.onV,fontFamily:"'JetBrains Mono',monospace",textAlign:"right",marginTop:3}}>{metaDesc.length}/160</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="seo"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">🔍 Análise SEO Completa</span></div><div className="cb" style={{paddingTop:4}}><SEOAnalyzer content={title+" "+content} keyword={keyword}/></div></div>
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div className="ch"><span className="ct">🔎 Preview Google</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{padding:"12px 13px",background:C.s1,borderRadius:9}}>
                  <div style={{fontSize:11,color:C.onV,marginBottom:3,fontFamily:"'JetBrains Mono',monospace"}}>blog.exemplo.com.br › {(keyword||"artigo").replace(/ /g,"-")}</div>
                  <div style={{fontSize:17,color:"#1a0dab",fontWeight:500,marginBottom:3,lineHeight:1.3}}>{title||"Título do Post"}</div>
                  <div style={{fontSize:13,color:C.onV,lineHeight:1.5}}>{metaDesc||"Meta description aparecerá aqui..."}</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">🏷 Keywords Relacionadas</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {keyword?[keyword+" 2026","como "+keyword,"melhor "+keyword,keyword+" tutorial",keyword+" exemplos"].map((kw,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12}}>{kw}</span>
                    <div style={{display:"flex",gap:8,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>
                      <span>{[2400,1800,1200,800,600][i]}/mês</span>
                      <span style={{color:[C.ter,C.ter,C.warn,C.warn,C.err][i]}}>{["Fácil","Fácil","Médio","Médio","Difícil"][i]}</span>
                    </div>
                  </div>
                )):<Empty ico="🔑" title="Digite a keyword" sub="Sugestões aparecerão aqui."/>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="social"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button className="btn bf bsm" onClick={genVarsAI} disabled={genVars||!title}>{genVars?<><div className="spinner"/>Gerando...</>:"✨ Gerar com IA"}</button>
          </div>
          {socialVars
            ?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}>
              {[{net:"Twitter / X",ico:"𝕏",limit:280,f:"twitter"},{net:"LinkedIn",ico:"in",limit:700,f:"linkedin"},{net:"Instagram",ico:"📸",limit:2200,f:"instagram"}].map(s=>(
                <div key={s.net} style={{border:`1.5px solid ${C.ovV}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"9px 13px",background:C.s1,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:7}}><span style={{fontWeight:800}}>{s.ico}</span>{s.net}</div>
                  <div style={{padding:"12px"}}>
                    <textarea className="fi fi-ta" rows={5} value={socialVars[s.f]||""} onChange={e=>setSocialVars(p=>({...p,[s.f]:e.target.value}))}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                      <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>{(socialVars[s.f]||"").length}/{s.limit}</span>
                      <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(socialVars[s.f]||"");showToast("📋 Copiado!");}}>📋 Copiar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            :<Empty ico="📱" title="Gere variações sociais" sub="Clique em 'Gerar com IA' para criar versões para Twitter, LinkedIn e Instagram."/>
          }
        </div>
      )}

      {tab==="preview"&&(
        <div className="card">
          <div style={{padding:"24px 32px",maxWidth:720,margin:"0 auto"}}>
            <h1 style={{fontSize:26,fontWeight:800,marginBottom:14,lineHeight:1.3}}>{title||"Título do Post"}</h1>
            {keyword&&<div style={{marginBottom:14}}><span className="chip cp">{keyword}</span> <span className="chip cn">{cat}</span></div>}
            <div style={{fontSize:14,lineHeight:1.8,color:C.onV,whiteSpace:"pre-wrap"}}>{content||<span style={{color:C.ovV}}>Conteúdo aparecerá aqui...</span>}</div>
          </div>
        </div>
      )}

      {tab==="settings"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">⚙️ Metadados</span></div><div className="cb" style={{paddingTop:6}}>
            <Field label="Categoria"><select className="fi fi-sel" value={cat} onChange={e=>setCat(e.target.value)}>{["SEO","IA","CMS","Email","Dev","CRO","Marketing","Tutorial"].map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Autor"><select className="fi fi-sel">{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
            <Field label="Tags"><input className="fi" placeholder="seo, marketing, 2026..." defaultValue={post?.tags?.join(", ")||""}/></Field>
            <Field label="Imagem Destaque"><div style={{border:`2px dashed ${C.ovV}`,borderRadius:9,padding:"18px",textAlign:"center",cursor:"pointer",fontSize:13,color:C.onV}}>🖼 Upload ou arrastar imagem</div></Field>
          </div></div>
          <div className="card"><div className="ch"><span className="ct">📤 Publicação</span></div><div className="cb" style={{paddingTop:6}}>
            <Field label="Site WordPress"><select className="fi fi-sel">{WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Status"><select className="fi fi-sel"><option>Rascunho</option><option>Publicar imediatamente</option><option>Agendar</option></select></Field>
            <button className="btn bf" style={{width:"100%",justifyContent:"center",marginTop:6}} onClick={()=>setPubDlg(true)}>📤 Publicar no WordPress</button>
            <button className="btn bo" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>go&&go("multichannel",post)}>📡 Publicação Multicanal</button>
          </div></div>
        </div>
      )}

      {tab==="tasks"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">✅ Checklist do Post</span><span className="chip ct3">{doneTasks}/{tasks.length}</span></div>
            <div className="pb" style={{margin:"0 18px 8px",height:6}}><div className="pbf" style={{width:`${tasks.length?(doneTasks/tasks.length)*100:0}%`,background:C.ter}}/></div>
            <div style={{padding:"0 16px 10px"}}>
              {tasks.map((t,i)=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<tasks.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <input type="checkbox" checked={t.done} onChange={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{width:16,height:16,cursor:"pointer",accentColor:C.p}}/>
                  <span style={{fontSize:13,flex:1,textDecoration:t.done?"line-through":"none",color:t.done?C.onV:C.on}}>{t.title}</span>
                  <button className="ib" style={{width:22,height:22,fontSize:11}} onClick={()=>setTasks(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
                </div>
              ))}
            </div>
            <div style={{padding:"0 16px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:34,padding:"6px 10px",fontSize:12}} placeholder="Nova tarefa..." value={taskInput} onChange={e=>setTaskInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&taskInput.trim()&&(setTasks(p=>[...p,{id:Date.now(),title:taskInput,done:false}]),setTaskInput(""))}/>
              <button className="btn bf bsm" onClick={()=>{if(taskInput.trim()){setTasks(p=>[...p,{id:Date.now(),title:taskInput,done:false}]);setTaskInput("");}}} disabled={!taskInput.trim()}>➕</button>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📊 Status</span></div>
            <div className="cb" style={{paddingTop:8}}>
              {[{l:"Concluídas",v:doneTasks,c:C.ter},{l:"Pendentes",v:tasks.length-doneTasks,c:C.warn},{l:"Total",v:tasks.length,c:C.p}].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                  <span style={{fontSize:13}}>{s.l}</span><span className="mono" style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"9px 12px",background:doneTasks===tasks.length&&tasks.length>0?C.terC:C.pC,borderRadius:9,fontSize:12,fontWeight:600,textAlign:"center",color:doneTasks===tasks.length&&tasks.length>0?C.onTerC:C.onPC}}>
                {tasks.length===0?"Adicione tarefas ao post":doneTasks===tasks.length?"🎉 Pronto para publicar!":doneTasks===0?"⏳ Nenhuma concluída":`📝 ${tasks.length-doneTasks} pendente${tasks.length-doneTasks>1?"s":""}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="versions"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">🕐 Histórico de Versões</span><button className="btn bt bsm" style={{fontSize:11}} onClick={save}>💾 Salvar versão</button></div>
            <div style={{padding:"0 14px 8px"}}>
              {versions.map((v,i)=>(
                <div key={v.id} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:i<versions.length-1?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:i===0?C.pC:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i===0?C.onPC:C.onV,flexShrink:0}}>v{v.version}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:i===0?700:500}}>{v.content.slice(0,40)}{i===0&&<span className="chip ct3" style={{marginLeft:6,fontSize:9}}>Atual</span>}</div><div style={{fontSize:11,color:C.onV}}>👤 {v.savedBy} · {v.savedAt}</div></div>
                  {i>0&&<button className="btn bo bsm" style={{fontSize:11}} onClick={()=>showToast(`↩ Versão ${v.version} restaurada!`)}>↩</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">ℹ️ Sobre versões</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.8}}>Cada vez que você clica em <strong>💾 Salvar</strong>, uma nova versão é criada automaticamente.<br/><br/>Você pode restaurar qualquer versão anterior a qualquer momento.<br/><br/>Versões são mantidas por <strong>30 dias</strong> no plano atual.</div>
            </div>
          </div>
        </div>
      )}

      {tab==="comments"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">💬 Notas de Revisão</span><span className="chip ce">{comments.filter(c=>!c.resolved).length} abertas</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {comments.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Sem notas ainda. Adicione abaixo.</div>}
              {comments.map((c,i)=>(
                <div key={c.id} style={{padding:"12px 0",borderBottom:i<comments.length-1?`1px solid ${C.ovV}`:"none",opacity:c.resolved?.7:1}}>
                  <div style={{display:"flex",gap:8,marginBottom:7}}>
                    <div style={{width:26,height:26,borderRadius:7,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.onPC,flexShrink:0}}>AL</div>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>Ana Lima</div><div style={{fontSize:11,color:C.onV}}>{c.createdAt}</div></div>
                    {c.resolved&&<span className="chip ct3" style={{fontSize:9}}>Resolvida</span>}
                  </div>
                  <div style={{fontSize:13,background:C.s1,borderRadius:8,padding:"9px 11px",marginBottom:7,lineHeight:1.5}}>{c.text}</div>
                  {!c.resolved&&<div style={{display:"flex",gap:6}}>
                    <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.map(x=>x.id===c.id?{...x,resolved:true}:x))}>✅ Resolver</button>
                    <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.filter(x=>x.id!==c.id))}>🗑</button>
                  </div>}
                </div>
              ))}
            </div>
            <div style={{padding:"0 14px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:34,padding:"6px 10px",fontSize:12}} placeholder="Adicionar nota de revisão..." value={commentInput} onChange={e=>setCommentInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&commentInput.trim()&&(setComments(p=>[...p,{id:Date.now(),text:commentInput,resolved:false,createdAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]),setCommentInput(""))}/>
              <button className="btn bf bsm" onClick={()=>{if(commentInput.trim()){setComments(p=>[...p,{id:Date.now(),text:commentInput,resolved:false,createdAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);setCommentInput("");}}} disabled={!commentInput.trim()}>💬</button>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📋 Sobre revisões</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.8}}>Use as notas de revisão para comunicar ajustes necessários antes da publicação.<br/><br/>Resolva cada nota após aplicar a correção para manter o histórico limpo.</div>
            </div>
          </div>
        </div>
      )}

      {pubDlg&&(
        <Dlg title="Publicar Post" onClose={()=>setPubDlg(false)}
          footer={<><button className="btn bo" onClick={()=>setPubDlg(false)}>Cancelar</button><button className="btn bf" onClick={publish}>📤 Confirmar Publicação</button></>}>
          <Field label="Site de destino"><select className="fi fi-sel">{WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Status"><select className="fi fi-sel"><option>Publicar imediatamente</option><option>Agendar</option><option>Rascunho</option></select></Field>
          <div style={{padding:"9px 12px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC,marginTop:4}}>✅ Será publicado via WordPress REST API e a equipe será notificada.</div>
        </Dlg>
      )}
    </div>
  );
}

export default PostEditor;
