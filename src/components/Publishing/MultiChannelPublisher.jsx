import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';
import { Backend } from '../../api/backend.js';

export function MultiChannelPublisher({ post, onBack, showToast }) {
  const[channels,setChannels]=useState({wordpress:true,twitter:false,linkedin:false,instagram:false,facebook:false,newsletter:false});
  const[publishing,setPublishing]=useState(false);
  const[progress,setProgress]=useState({});
  const[done,setDone]=useState(false);
  const chInfo={wordpress:{ico:"⊞",name:"WordPress",desc:"Publicar como post no blog"},twitter:{ico:"𝕏",name:"Twitter/X",desc:"Tweet com link do post"},linkedin:{ico:"in",name:"LinkedIn",desc:"Artigo profissional"},instagram:{ico:"📸",name:"Instagram",desc:"Carrossel ou story"},facebook:{ico:"📘",name:"Facebook",desc:"Post no feed"},newsletter:{ico:"📧",name:"Newsletter",desc:"Enviar para lista de e-mail"}};
  const selected=Object.keys(channels).filter(k=>channels[k]);
  const publish=async()=>{
    setPublishing(true);setDone(false);
    for(const ch of selected){
      setProgress(p=>({...p,[ch]:"publishing"}));
      await new Promise(r=>setTimeout(r,900+Math.random()*600));
      try{
        if(ch==="wordpress") await Backend.publishToWordPress({siteUrl:"blog.exemplo.com.br",user:"admin",appPassword:"xxx",post:post||{id:1,title:"Post"}});
        else await Backend.publishToExternalPlatform({platform:ch,content:post?.title||"Post",postId:post?.id||1});
        setProgress(p=>({...p,[ch]:"done"}));
      }catch{setProgress(p=>({...p,[ch]:"error"}));}
    }
    await Backend.notifyPublishedTask({postId:post?.id||1,publishedBy:"Ana Lima"});
    setPublishing(false);setDone(true);
    showToast(`📤 Publicado em ${selected.length} canal${selected.length>1?"is":""}!`);
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Publicação Multicanal</div><div style={{fontSize:12,color:C.onV}}>{post?.title||"Post selecionado"}</div></div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📡 Selecionar Canais</span></div>
          <div style={{padding:"0 16px 14px"}}>
            {Object.entries(chInfo).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.ovV}`}}>
                <div style={{width:36,height:36,borderRadius:9,background:channels[k]?C.pC:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:k==="linkedin"?13:18,fontWeight:800,color:channels[k]?C.onPC:C.onV,flexShrink:0,transition:"all .14s"}}>{v.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{v.name}</div><div style={{fontSize:11,color:C.onV}}>{v.desc}</div></div>
                {progress[k]==="publishing"&&<div className="spinner"/>}
                {progress[k]==="done"&&<span className="chip ct3">✓</span>}
                {progress[k]==="error"&&<span className="chip ce">✗</span>}
                {!progress[k]&&<Tog on={channels[k]} onChange={v=>setChannels(p=>({...p,[k]:v}))}/>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">📋 Resumo</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:13,marginBottom:12}}>{selected.length===0?<span style={{color:C.onV}}>Selecione ao menos 1 canal.</span>:<span>Publicando em <strong>{selected.length}</strong> canal{selected.length>1?"is":""}: {selected.map(k=>chInfo[k].name).join(", ")}</span>}</div>
              {done&&<div style={{padding:"10px 12px",background:C.terC,borderRadius:9,fontSize:12,color:C.onTerC,marginBottom:12,fontWeight:600}}>🎉 Publicação concluída com sucesso!</div>}
              {Object.keys(progress).length>0&&<div style={{marginBottom:12}}>
                {Object.entries(progress).map(([ch,st])=>(
                  <div key={ch} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",fontSize:12}}>
                    <span style={{fontSize:14}}>{chInfo[ch]?.ico}</span>
                    <span style={{flex:1}}>{chInfo[ch]?.name}</span>
                    {st==="publishing"&&<><div className="spinner" style={{width:12,height:12}}/><span style={{color:C.onV}}>Publicando...</span></>}
                    {st==="done"&&<span style={{color:C.ter,fontWeight:600}}>✅ Publicado</span>}
                    {st==="error"&&<span style={{color:C.err,fontWeight:600}}>❌ Falhou</span>}
                  </div>
                ))}
              </div>}
              <button className="btn bf" style={{width:"100%",justifyContent:"center",padding:12,borderRadius:12}} onClick={publish} disabled={publishing||selected.length===0||done}>{publishing?<><div className="spinner"/>Publicando...</>:done?"✅ Concluído":"📤 Publicar Agora"}</button>
              {!done&&<button className="btn bo" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>showToast("📅 Agendamento configurado!")}>📅 Agendar</button>}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">⚡ Smart Scheduler</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,marginBottom:10}}>A IA analisa seus dados e sugere o melhor momento:</div>
              {[{day:"Segunda-feira",time:"09:00",score:94,reason:"Maior engajamento histórico"},{day:"Terça-feira",time:"10:30",score:88,reason:"CTR médio mais alto"},{day:"Quinta-feira",time:"08:00",score:82,reason:"Menor concorrência"}].map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.day}, {s.time}</div><div style={{fontSize:11,color:C.onV}}>{s.reason}</div></div>
                  <div className="mono" style={{fontSize:14,fontWeight:800,color:s.score>=90?C.ter:C.p}}>{s.score}</div>
                  <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>showToast(`📅 Agendado para ${s.day}!`)}>Agendar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══ CONTENT REPURPOSING ══════════════════════════════════ */

export default MultiChannelPublisher;
