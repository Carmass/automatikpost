import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function ReportsPage({showToast}){
  const[generating,setGenerating]=useState(false);
  const[genType,setGenType]=useState(null);
  const[type,setType]=useState("performance");
  const[period,setPeriod]=useState("30d");
  const[reports,setReports]=useState([
    {id:1,ico:"📊",name:"Performance — Abril 2026",type:"performance",period:"30d",rows:247,created:"01/05/26 09:00",status:"ready"},
    {id:2,ico:"🔍",name:"SEO Audit — Semana 18",type:"seo",period:"7d",rows:POSTS.length,created:"29/04/26 18:00",status:"ready"},
    {id:3,ico:"⚡",name:"Automações — Abril 2026",type:"automations",period:"30d",rows:AUTOS.length,created:"01/05/26 09:00",status:"ready"},
  ]);

  const gen=async()=>{
    setGenerating(true);setGenType(type);
    await new Promise(r=>setTimeout(r,2200));
    const labels={performance:"Performance",seo:"SEO",automations:"Automações",team:"Produtividade",wordpress:"WordPress"};
    const icons={performance:"📊",seo:"🔍",automations:"⚡",team:"👥",wordpress:"⊞"};
    const newRep={id:Date.now(),ico:icons[type]||"📈",name:`${labels[type]||type} — ${new Date().toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}`,type,period,rows:Math.floor(Math.random()*200)+50,created:new Date().toLocaleString("pt-BR").slice(0,16),status:"ready"};
    setReports(p=>[newRep,...p]);
    setGenerating(false);setGenType(null);
    showToast(`📊 Relatório "${newRep.name}" gerado!`);
  };

  const mult={"7d":.25,"30d":1,"90d":2.8,"all":11}[period]||1;
  const metrics=[
    {l:"Total de Views",v:Math.round(42800*mult).toLocaleString(),trend:"+23%",cls:"mcp"},
    {l:"Score SEO Médio",v:"88/100",trend:"↑ 5pts",cls:"mct"},
    {l:"Posts Publicados",v:Math.round(32*mult),trend:"+18%",cls:"mcs"},
    {l:"Automações",v:Math.round(211*mult),trend:"execuções",cls:"mce"},
  ];

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">📊 Gerar Novo Relatório</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two" style={{marginBottom:10}}>
            <Field label="Tipo de relatório">
              <select className="fi fi-sel" value={type} onChange={e=>setType(e.target.value)}>
                <option value="performance">📊 Performance de Conteúdo</option>
                <option value="seo">🔍 SEO & Palavras-chave</option>
                <option value="automations">⚡ Automações</option>
                <option value="team">👥 Produtividade da Equipe</option>
                <option value="wordpress">⊞ Publicações WordPress</option>
              </select>
            </Field>
            <Field label="Período">
              <select className="fi fi-sel" value={period} onChange={e=>setPeriod(e.target.value)}>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
            </Field>
          </div>
          <div className="mg" style={{marginBottom:12}}>
            {metrics.map((m,i)=><div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.trend}</div></div>)}
          </div>
          <button className="btn bf bsm" onClick={gen} disabled={generating}>{generating?<><div className="spinner"/>Gerando relatório...</>:"📊 Gerar Relatório"}</button>
        </div>
      </div>

      <div className="card">
        <div className="ch"><span className="ct">📋 Relatórios Salvos</span><button className="btn bo bsm" onClick={()=>showToast("🗑 Relatórios limpos!")}>🗑 Limpar</button></div>
        {reports.length===0&&<Empty ico="📊" title="Sem relatórios" sub="Gere seu primeiro relatório acima."/>}
        {reports.map((r,i)=>(
          <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:i<reports.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:38,height:38,borderRadius:9,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.ico}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{r.name}</div>
              <div style={{fontSize:11,color:C.onV,display:"flex",gap:10}}>
                <span className="mono">{r.rows} registros</span>
                <span>· Período: {r.period}</span>
                <span>· {r.created}</span>
              </div>
            </div>
            <SChip status="active"/>
            <div style={{display:"flex",gap:6}}>
              <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>showToast(`⬇ ${r.name} baixado como PDF!`)}>⬇ PDF</button>
              <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>showToast(`⬇ ${r.name} baixado como CSV!`)}>⬇ CSV</button>
              <button className="ib" style={{width:26,height:26,fontSize:11}} onClick={()=>setReports(p=>p.filter(x=>x.id!==r.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
