import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function RecurringSchedulesPage({showToast}){
  const[scheds,setScheds]=useState(RECURRING);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",template:"",freq:"Toda segunda",time:"09:00",wp:WP_SITES[0].name,active:true});
  const save=()=>{
    if(!form.name.trim())return;
    setScheds(p=>[...p,{id:Date.now(),...form,generated:0,next:"12/05/26"}]);
    setDlg(false);setForm({name:"",template:"",freq:"Toda segunda",time:"09:00",wp:WP_SITES[0].name,active:true});
    showToast("🔄 Cronograma criado!");
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{scheds.filter(s=>s.active).length} cronogramas ativos</div>
          <div style={{fontSize:12,color:C.onV}}>{scheds.reduce((s,x)=>s+x.generated,0)} posts gerados automaticamente</div>
        </div>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo Cronograma</button>
      </div>
      <div className="card">
        {scheds.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:i<scheds.length-1?`1px solid ${C.ovV}`:"none"}}>
            <Tog on={s.active} onChange={()=>setScheds(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:s.active?C.on:C.onV}}>{s.name}</span>
                <span className="chip cn">{s.template}</span>
              </div>
              <div style={{fontSize:11,color:C.onV}}>🕐 {s.freq} às {s.time} → {s.wp}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:8}}>
              <div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{s.generated}</div>
              <div style={{fontSize:10,color:C.onV}}>gerados</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:10}}>
              <div style={{fontSize:11,color:C.onV}}>Próximo</div>
              <div className="mono" style={{fontSize:12,fontWeight:600,color:s.active?C.on:C.onV}}>{s.next}</div>
            </div>
            <div style={{display:"flex",gap:2}}>
              <button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setScheds(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {dlg&&(
        <Dlg title="Novo Cronograma" onClose={()=>setDlg(false)}
          footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
          <Field label="Nome *"><input className="fi" placeholder="Ex: SEO Semanal" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <div className="two">
            <Field label="Template">
              <select className="fi fi-sel" value={form.template} onChange={e=>setForm(f=>({...f,template:e.target.value}))}>
                <option value="">Selecionar...</option>
                {TEMPLATES.map(t=><option key={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Frequência">
              <select className="fi fi-sel" value={form.freq} onChange={e=>setForm(f=>({...f,freq:e.target.value}))}>
                {["Toda segunda","Toda terça","Toda quarta","Toda quinta","Toda sexta","A cada 7 dias","A cada 14 dias","Mensal"].map(f=><option key={f}>{f}</option>)}
              </select>
            </Field>
          </div>
          <div className="two">
            <Field label="Horário"><input className="fi" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></Field>
            <Field label="Site WordPress">
              <select className="fi fi-sel" value={form.wp} onChange={e=>setForm(f=>({...f,wp:e.target.value}))}>
                {WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
        </Dlg>
      )}
    </div>
  );
}


export default RecurringSchedulesPage;
