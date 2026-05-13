import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function TagsCategoriesPage({showToast}){
  const[tab,setTab]=useState("categories");
  const[cats,setCats]=useState(CATEGORIES_DATA);
  const[tags,setTags]=useState(TAGS_DATA);
  const[dlg,setDlg]=useState(null);
  const[form,setForm]=useState({name:"",slug:"",color:"#1A56DB",icon:""});
  const COLORS=["#1A56DB","#006B5D","#5B6396","#7A5900","#BA1A1A","#0B4A6A","#6B3500","#005240"];
  const save=()=>{
    if(!form.name.trim())return;
    if(dlg==="cat") setCats(p=>[...p,{id:Date.now(),...form,posts:0}]);
    else setTags(p=>[...p,{id:Date.now(),name:form.name,posts:0,color:form.color}]);
    setDlg(null);setForm({name:"",slug:"",color:"#1A56DB",icon:""});
    showToast(dlg==="cat"?"📁 Categoria criada!":"🏷 Tag criada!");
  };
  return(
    <div className="fade-in">
      <div className="tabs">
        <div className={`tabi ${tab==="categories"?"a":""}`} onClick={()=>setTab("categories")}>📁 Categorias <span className="tcnt">{cats.length}</span></div>
        <div className={`tabi ${tab==="tags"?"a":""}`} onClick={()=>setTab("tags")}>🏷 Tags <span className="tcnt">{tags.length}</span></div>
      </div>
      {tab==="categories"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>{setDlg("cat");setForm({name:"",slug:"",color:"#1A56DB",icon:"📝"});}}>➕ Nova Categoria</button>
          </div>
          <div className="card">
            <table className="dt">
              <thead><tr><th>Categoria</th><th>Slug</th><th>Posts</th><th>Cor</th><th></th></tr></thead>
              <tbody>
                {cats.map(c=>(
                  <tr key={c.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:18}}>{c.icon}</span><span style={{fontWeight:600}}>{c.name}</span></div></td>
                    <td className="mono" style={{fontSize:11,color:C.onV}}>{c.slug}</td>
                    <td><span className="chip cn">{c.posts} posts</span></td>
                    <td><div style={{width:20,height:20,borderRadius:5,background:c.color,border:`2px solid ${C.ovV}`}}/></td>
                    <td><div style={{display:"flex",gap:2}}><button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setCats(p=>p.filter(x=>x.id!==c.id))}>🗑</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==="tags"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>{setDlg("tag");setForm({name:"",slug:"",color:"#1A56DB",icon:""});}}>➕ Nova Tag</button>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {tags.map(t=>(
              <div key={t.id} className="cat-tag" style={{background:t.color+"22",color:t.color,border:`1.5px solid ${t.color}44`}}>
                #{t.name}
                <span style={{fontSize:10,opacity:.7,marginLeft:3}}>{t.posts}</span>
                <button style={{background:"transparent",border:"none",cursor:"pointer",fontSize:11,color:t.color,padding:0,marginLeft:2}} onClick={()=>setTags(p=>p.filter(x=>x.id!==t.id))}>✕</button>
              </div>
            ))}
          </div>
          <div className="card">
            <table className="dt">
              <thead><tr><th>Tag</th><th>Posts</th><th>Cor</th><th></th></tr></thead>
              <tbody>
                {tags.map(t=>(
                  <tr key={t.id}>
                    <td><span className="mono" style={{fontWeight:600}}>#{t.name}</span></td>
                    <td><span className="chip cn">{t.posts}</span></td>
                    <td><div style={{width:20,height:20,borderRadius:5,background:t.color,border:`2px solid ${C.ovV}`}}/></td>
                    <td><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTags(p=>p.filter(x=>x.id!==t.id))}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {dlg&&(
        <Dlg title={dlg==="cat"?"Nova Categoria":"Nova Tag"} onClose={()=>setDlg(null)}
          footer={<><button className="btn bo" onClick={()=>setDlg(null)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
          <Field label="Nome *"><input className="fi" placeholder={dlg==="cat"?"Ex: Marketing Digital":"Ex: seo-avancado"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value,slug:e.target.value.toLowerCase().replace(/ /g,"-")}))}/></Field>
          {dlg==="cat"&&<>
            <Field label="Slug"><input className="fi" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))}/></Field>
            <Field label="Ícone"><input className="fi" placeholder="📝" value={form.icon} onChange={e=>setForm(f=>({...f,icon:e.target.value}))}/></Field>
          </>}
          <Field label="Cor">
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {COLORS.map(c=>(
                <div key={c} className={`sw${form.color===c?" sel":""}`} style={{background:c}} onClick={()=>setForm(f=>({...f,color:c}))}/>
              ))}
            </div>
          </Field>
        </Dlg>
      )}
    </div>
  );
}


export default TagsCategoriesPage;
