import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function PostTaskPanel({ post, showToast }) {
  const[tasks,setTasks]=useState([{id:1,postId:1,title:"Revisar meta description",done:true,assignee:"Ana Lima",due:"10/05/26"},{id:2,postId:1,title:"Adicionar imagens H2",done:false,assignee:"Carlos M.",due:"11/05/26"},{id:3,postId:1,title:"Atualizar CTAs",done:false,assignee:"Ana Lima",due:"12/05/26"}].filter(t=>t.postId===(post?.id||1)));
  const[input,setInput]=useState("");
  const add=()=>{if(!input.trim())return;setTasks(p=>[...p,{id:Date.now(),postId:post?.id||1,title:input,done:false,assignee:"Ana Lima",due:"—"}]);setInput("");};
  const toggle=id=>setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del=id=>setTasks(p=>p.filter(t=>t.id!==id));
  const done=tasks.filter(t=>t.done).length;
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>Tarefas: {done}/{tasks.length} concluídas</div></div>
      </div>
      <div className="pb" style={{height:8,marginBottom:14}}><div className="pbf" style={{width:`${tasks.length?((done/tasks.length)*100):0}%`,background:C.ter}}/></div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="ch"><span className="ct">✅ Checklist</span><span className="chip ct3">{done}/{tasks.length}</span></div>
            <div style={{padding:"0 16px 10px"}}>
              {tasks.map((t,i)=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<tasks.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} style={{width:16,height:16,cursor:"pointer",accentColor:C.p}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,textDecoration:t.done?"line-through":"none",color:t.done?C.onV:C.on}}>{t.title}</div>
                    <div style={{fontSize:11,color:C.onV}}>👤 {t.assignee}{t.due!=="—"?` · 📅 ${t.due}`:""}</div>
                  </div>
                  <button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>del(t.id)}>🗑</button>
                </div>
              ))}
              {tasks.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Nenhuma tarefa. Adicione abaixo.</div>}
            </div>
            <div style={{padding:"0 16px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:36,padding:"7px 12px"}} placeholder="Nova tarefa..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
              <button className="btn bf bsm" onClick={add} disabled={!input.trim()}>➕</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📊 Progresso</span></div>
          <div className="cb" style={{paddingTop:8}}>
            {[{l:"Concluídas",v:done,c:C.ter},{l:"Pendentes",v:tasks.length-done,c:C.warn},{l:"Total",v:tasks.length,c:C.p}].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                <span style={{fontSize:13}}>{s.l}</span>
                <span className="mono" style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 12px",background:tasks.length&&done===tasks.length?C.terC:C.pC,borderRadius:9,fontSize:12,color:tasks.length&&done===tasks.length?C.onTerC:C.onPC,fontWeight:600,textAlign:"center"}}>
              {tasks.length===0?"Adicione tarefas ao post":done===tasks.length?"🎉 Todas concluídas!":done===0?"⏳ Nenhuma concluída ainda":`📝 ${tasks.length-done} tarefa${tasks.length-done>1?"s":""} restante${tasks.length-done>1?"s":""}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ VERSION HISTORY ══════════════════════════════════════ */

export default PostTaskPanel;
