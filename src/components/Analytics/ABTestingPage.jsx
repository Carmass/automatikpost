import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function ABTestingPage({ showToast }) {
  const[tests,setTests]=useState([
    {id:1,name:"Título SEO vs Clickbait",postTitle:"10 Estratégias de SEO para 2026",varA:"10 Estratégias de SEO para 2026 que Você Precisa Conhecer",varB:"Esses 10 Truques de SEO Vão Triplicar seu Tráfego em 2026",status:"running",winner:null,aViews:1240,bViews:1180,aCtr:4.2,bCtr:5.8,startDate:"02/05/26",endDate:"—"},
    {id:2,name:"CTA no final vs meio do artigo",postTitle:"E-mail Marketing: Táticas de Segmentação",varA:"CTA posicionado no final do artigo",varB:"CTA posicionado após o segundo H2",status:"completed",winner:"B",aViews:980,bViews:950,aCtr:1.8,bCtr:3.2,startDate:"01/04/26",endDate:"30/04/26"},
  ]);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",postTitle:"",varA:"",varB:"",duration:14});

  const save=()=>{
    if(!form.name||!form.varA||!form.varB)return;
    setTests(p=>[...p,{id:Date.now(),...form,status:"running",winner:null,aViews:0,bViews:0,aCtr:0,bCtr:0,startDate:new Date().toLocaleDateString("pt-BR").slice(0,8),endDate:"—"}]);
    setDlg(false);setForm({name:"",postTitle:"",varA:"",varB:"",duration:14});
    showToast("🔬 Teste A/B iniciado!");
  };

  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo Teste A/B</button>
      </div>
      {tests.map(t=>(
        <div key={t.id} className="card" style={{marginBottom:13}}>
          <div style={{padding:"14px 17px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{t.name}</div>
                <div style={{fontSize:12,color:C.onV}}>{t.postTitle}</div>
              </div>
              <div style={{display:"flex",gap:7,flexShrink:0,alignItems:"center"}}>
                {t.winner&&<span className="chip ct3">✓ Variante {t.winner} venceu</span>}
                <SChip status={t.status==="running"?"active":"inactive"}/>
              </div>
            </div>
            <div className="two" style={{marginBottom:12}}>
              {[{l:"A",title:t.varA,views:t.aViews,ctr:t.aCtr,winner:t.winner==="A"},{l:"B",title:t.varB,views:t.bViews,ctr:t.bCtr,winner:t.winner==="B"}].map(v=>(
                <div key={v.l} style={{padding:"12px",background:v.winner?C.terC:C.s1,borderRadius:11,border:v.winner?`2px solid ${C.ter}`:`1.5px solid ${C.ovV}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span style={{fontSize:12,fontWeight:800,color:v.winner?C.ter:C.onV}}>Variante {v.l}{v.winner&&" 🏆"}</span>
                    <span className="mono" style={{fontSize:11,fontWeight:700,color:C.p}}>CTR: {v.ctr}%</span>
                  </div>
                  <div style={{fontSize:12,color:C.onV,lineHeight:1.5,marginBottom:8}}>{v.title}</div>
                  <div style={{display:"flex",gap:12}}>
                    <div><div className="mono" style={{fontSize:14,fontWeight:800,color:C.on}}>{v.views.toLocaleString()}</div><div style={{fontSize:10,color:C.onV}}>visualizações</div></div>
                    <div><div className="mono" style={{fontSize:14,fontWeight:800,color:v.ctr>=(v.l==="A"?t.bCtr:t.aCtr)?C.ter:C.onV}}>{v.ctr}%</div><div style={{fontSize:10,color:C.onV}}>CTR</div></div>
                  </div>
                  <div className="pb" style={{marginTop:8}}><div className="pbf" style={{width:`${(v.views/(t.aViews+t.bViews||1))*100}%`,background:v.winner?C.ter:C.p}}/></div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <div className="mono" style={{fontSize:11,color:C.onV,flex:1}}>Iniciado: {t.startDate}{t.endDate!=="—"?` · Concluído: ${t.endDate}`:""}</div>
              {t.status==="running"&&<button className="btn ber bsm" onClick={()=>{setTests(p=>p.map(x=>x.id===t.id?{...x,status:"completed",winner:t.bCtr>t.aCtr?"B":"A",endDate:new Date().toLocaleDateString("pt-BR").slice(0,8)}:x));showToast("🔬 Teste encerrado!");}}>Encerrar</button>}
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTests(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
            </div>
          </div>
        </div>
      ))}
      {dlg&&<Dlg title="Novo Teste A/B" onClose={()=>setDlg(false)}
        footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Iniciar Teste</button></>}>
        <Field label="Nome do Teste *"><input className="fi" placeholder="Ex: Título SEO vs Clickbait" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Post relacionado"><input className="fi" placeholder="Título do post..." value={form.postTitle} onChange={e=>setForm(f=>({...f,postTitle:e.target.value}))}/></Field>
        <Field label="Variante A *"><textarea className="fi fi-ta" rows={2} placeholder="Versão original / controle" value={form.varA} onChange={e=>setForm(f=>({...f,varA:e.target.value}))}/></Field>
        <Field label="Variante B *"><textarea className="fi fi-ta" rows={2} placeholder="Versão alternativa a testar" value={form.varB} onChange={e=>setForm(f=>({...f,varB:e.target.value}))}/></Field>
        <Field label="Duração (dias)"><input className="fi" type="number" min={7} max={90} value={form.duration} onChange={e=>setForm(f=>({...f,duration:+e.target.value||14}))}/></Field>
      </Dlg>}
    </div>
  );
}

/* ══ CONTENT BRIEF GENERATOR ═════════════════════════════ */

export default ABTestingPage;
