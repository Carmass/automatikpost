import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function InlineCommentsPage({ post, onBack, showToast }) {
  const[comments,setComments]=useState([{id:1,postId:1,text:"Revisar esta frase, muito longa",author:"Carlos M.",position:120,resolved:false,createdAt:"09/05/26 10:00"},{id:2,postId:1,text:"Adicionar fonte aqui",author:"Ana Lima",position:340,resolved:true,createdAt:"08/05/26 15:20"}].filter(c=>c.postId===(post?.id||1)));
  const[newComment,setNewComment]=useState("");
  const addComment=()=>{if(!newComment.trim())return;setComments(p=>[...p,{id:Date.now(),postId:post?.id||1,text:newComment,author:"Ana Lima",position:Math.floor(Math.random()*500),resolved:false,createdAt:new Date().toLocaleString("pt-BR").slice(0,16)}]);setNewComment("");showToast("💬 Comentário adicionado!");};
  const resolve=id=>{setComments(p=>p.map(c=>c.id===id?{...c,resolved:true}:c));showToast("✅ Resolvido!");};
  const open=comments.filter(c=>!c.resolved);
  const resolved=comments.filter(c=>c.resolved);
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>{open.length} em aberto · {resolved.length} resolvidos</div></div>
      </div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="ch"><span className="ct">💬 Em Aberto</span><span className="chip ce">{open.length}</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {open.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Nenhum comentário em aberto 🎉</div>}
              {open.map((c,i)=>(
                <div key={c.id} style={{padding:"12px 0",borderBottom:i<open.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:7}}>
                    <div style={{width:26,height:26,borderRadius:7,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.onPC,flexShrink:0}}>{c.author.split(" ").map(w=>w[0]).join("")}</div>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{c.author}</div><div style={{fontSize:11,color:C.onV}}>pos.{c.position} · {c.createdAt}</div></div>
                  </div>
                  <div style={{fontSize:13,background:C.s1,borderRadius:8,padding:"9px 11px",marginBottom:8,lineHeight:1.5}}>{c.text}</div>
                  <div style={{display:"flex",gap:7}}>
                    <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>resolve(c.id)}>✅ Resolver</button>
                    <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.filter(x=>x.id!==c.id))}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">➕ Novo Comentário</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <textarea className="fi fi-ta" rows={3} placeholder="Adicione um comentário ou sugestão..." value={newComment} onChange={e=>setNewComment(e.target.value)}/>
              <button className="btn bf bsm" style={{marginTop:8}} onClick={addComment} disabled={!newComment.trim()}>💬 Comentar</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">✅ Resolvidos</span><span className="chip ct3">{resolved.length}</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {resolved.length===0&&<Empty ico="💬" title="Nenhum resolvido" sub="Resolva comentários para que apareçam aqui."/>}
            {resolved.map((c,i)=>(
              <div key={c.id} style={{padding:"10px 0",borderBottom:i<resolved.length-1?`1px solid ${C.ovV}`:"none",opacity:.6}}>
                <div style={{display:"flex",gap:8,marginBottom:4}}><div style={{width:22,height:22,borderRadius:6,background:C.terC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.onTerC,flexShrink:0}}>{c.author.split(" ").map(w=>w[0]).join("")}</div><span style={{fontSize:12,fontWeight:600}}>{c.author}</span><span className="chip ct3" style={{fontSize:9}}>Resolvido</span></div>
                <div style={{fontSize:12,color:C.onV}}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══ PROJECT TEAMS ════════════════════════════════════════ */

export default InlineCommentsPage;
