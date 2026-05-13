import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function CreatePostPage({go}){
  return(
    <div className="fade-in">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        {[{id:"editor",data:{},ico:"⚡",t:"Quick Post",d:"Editor completo com SEO em tempo real",bg:C.pC},{id:"ai",data:null,ico:"✨",t:"Post via IA",d:"Configure tema, tom, nicho — IA escreve tudo",bg:C.terC},{id:"recurring",data:null,ico:"🔄",t:"Post Recorrente",d:"Configure cronograma com publicação automática",bg:C.secC}].map((m,i)=>(
          <div key={i} className="card" style={{cursor:"pointer",transition:"all .16s"}} onClick={()=>go(m.id,m.data)} onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.e3;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.e1;e.currentTarget.style.transform="none";}}>
            <div style={{padding:"22px 16px",textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:12,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 11px"}}>{m.ico}</div>
              <div style={{fontSize:13,fontWeight:800,marginBottom:5}}>{m.t}</div>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.6}}>{m.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 15px",background:C.terC,borderRadius:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:19}}>💡</div>
        <div style={{fontSize:12,color:C.onTerC,lineHeight:1.6}}>Use <strong>Post via IA</strong> para gerar artigos completos com SEO via Claude AI, ou <strong>Quick Post</strong> para escrever diretamente com análise SEO em tempo real.</div>
      </div>
    </div>
  );
}


export default CreatePostPage;
