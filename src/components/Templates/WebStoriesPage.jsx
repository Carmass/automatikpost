import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function WebStoriesPage({showToast}){
  const[stories,setStories]=useState(WEBSTORIES);
  const[dlg,setDlg]=useState(false);
  const[editing,setEditing]=useState(null);
  const[form,setForm]=useState({title:"",slides:5});
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13,gap:8}}><button className="btn bo bsm">📖 Do Post</button><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Story</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {stories.map(s=>(
          <div key={s.id} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e3} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
            <div style={{height:125,background:`linear-gradient(135deg,${C.p},${C.ter})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{textAlign:"center",color:"#fff",padding:"0 12px"}}><div style={{fontSize:24,marginBottom:4}}>📱</div><div style={{fontSize:13,fontWeight:700,lineHeight:1.3}}>{s.title}</div></div>
              <div style={{position:"absolute",top:7,right:7}}><SChip status={s.status}/></div>
            </div>
            <div style={{padding:"11px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><span className="mono" style={{fontSize:11,color:C.onV}}>{s.slides} slides · {s.date}</span>{s.views>0&&<span className="mono" style={{fontSize:12,color:C.p,fontWeight:700}}>{s.views.toLocaleString()} views</span>}</div>
              <div style={{display:"flex",gap:7}}>
                <button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>setEditing(s)}>✏️ Editar</button>
                {s.status==="published"&&<button className="btn bo bsm">📤 WP</button>}
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setStories(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Web Story" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={()=>{if(!form.title.trim())return;setStories(p=>[...p,{id:Date.now(),...form,status:"draft",views:0,date:"—"}]);setDlg(false);setForm({title:"",slides:5});showToast("📱 Story criada!");}}>✨ Criar</button></>}>
        <Field label="Título *"><input className="fi" placeholder="Ex: 5 dicas de SEO para 2026" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <Field label="Slides"><input className="fi" type="number" min={3} max={20} value={form.slides} onChange={e=>setForm(f=>({...f,slides:+e.target.value||5}))}/></Field>
        <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:12,color:C.onPC}}>✨ A IA gera o conteúdo de cada slide.</div>
      </Dlg>}
      {editing&&<Dlg title={`Editando: ${editing.title}`} onClose={()=>setEditing(null)} wide footer={<><button className="btn bo" onClick={()=>setEditing(null)}>Fechar</button><button className="btn bf" onClick={()=>{setEditing(null);showToast("📱 Story salva!");}}>💾 Salvar</button></>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {[...Array(editing.slides)].map((_,i)=>(
            <div key={i} style={{borderRadius:9,background:`linear-gradient(160deg,${[C.pC,C.terC,C.secC,C.warnC,C.errC][i%5]},${C.s2})`,aspectRatio:"9/16",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.on,cursor:"pointer",padding:"7px",textAlign:"center",border:`2px solid ${C.ovV}`,transition:"border .14s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.p}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.ovV}>
              <div style={{fontSize:18,marginBottom:3}}>{["🚀","💡","⚡","🎯","✅","🔥","📊","🌟","💎","🎨"][i%10]}</div>
              Slide {i+1}
            </div>
          ))}
        </div>
      </Dlg>}
    </div>
  );
}

export default WebStoriesPage;
