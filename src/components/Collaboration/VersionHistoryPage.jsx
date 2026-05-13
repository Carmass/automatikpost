import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function VersionHistoryPage({ post, onBack, showToast }) {
  const[versions,setVersions]=useState([{id:1,postId:1,version:3,content:"Versão 3 — adicionadas 3 seções H2 e FAQ",savedBy:"Ana Lima",savedAt:"09/05/26 14:00"},{id:2,postId:1,version:2,content:"Versão 2 — revisão completa de SEO e meta",savedBy:"Carlos M.",savedAt:"08/05/26 11:30"},{id:3,postId:1,version:1,content:"Versão 1 — rascunho inicial gerado pela IA",savedBy:"IA",savedAt:"07/05/26 09:00"}].filter(v=>v.postId===(post?.id||1)));
  const[selected,setSelected]=useState(null);
  const[restoring,setRestoring]=useState(false);
  const restore=async(v)=>{setRestoring(true);await new Promise(r=>setTimeout(r,1200));setRestoring(false);showToast(`↩ Versão ${v.version} restaurada!`);};
  const saveNew=()=>{const v={id:Date.now(),postId:post?.id||1,version:versions.length+1,content:"Nova versão salva manualmente",savedBy:"Ana Lima",savedAt:new Date().toLocaleString("pt-BR").slice(0,16)};setVersions(p=>[v,...p]);showToast("💾 Versão salva!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>{versions.length} versões</div></div>
        <button className="btn bf bsm" onClick={saveNew}>💾 Salvar versão atual</button>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📚 Histórico</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {versions.length===0&&<Empty ico="📄" title="Sem versões" sub="Salve a versão atual para começar."/>}
            {versions.map((v,i)=>(
              <div key={v.id} style={{display:"flex",gap:10,padding:"12px 0",borderBottom:i<versions.length-1?`1px solid ${C.ovV}`:"none",cursor:"pointer",background:selected?.id===v.id?`${C.pC}44`:"transparent",borderRadius:8,paddingLeft:selected?.id===v.id?8:0,transition:"all .14s"}} onClick={()=>setSelected(v)}>
                <div style={{width:34,height:34,borderRadius:8,background:i===0?C.pC:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:i===0?C.onPC:C.onV,flexShrink:0}}>v{v.version}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:600}}>{v.content.slice(0,40)}</span>{i===0&&<span className="chip ct3" style={{fontSize:9}}>Atual</span>}</div>
                  <div style={{fontSize:11,color:C.onV}}>👤 {v.savedBy} · 🕐 {v.savedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>{selected
          ?<div className="card"><div className="ch"><span className="ct">Versão {selected.version}</span><button className="btn bf bsm" onClick={()=>restore(selected)} disabled={restoring}>{restoring?<><div className="spinner"/>Restaurando...</>:"↩ Restaurar"}</button></div><div className="cb" style={{paddingTop:6}}><div style={{padding:"12px",background:C.s1,borderRadius:9,fontSize:13,color:C.onV,lineHeight:1.7,marginBottom:10}}>{selected.content}</div><div style={{fontSize:12,color:C.onV}}>👤 {selected.savedBy} · 🕐 {selected.savedAt}</div></div></div>
          :<Empty ico="📖" title="Selecione uma versão" sub="Clique para ver e restaurar."/>
        }</div>
      </div>
    </div>
  );
}

/* ══ INLINE COMMENTS ══════════════════════════════════════ */

export default VersionHistoryPage;
