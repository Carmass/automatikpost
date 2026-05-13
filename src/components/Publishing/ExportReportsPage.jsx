import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function ExportReportsPage({ showToast }) {
  const[exporting,setExporting]=useState(null);
  const[format,setFormat]=useState("pdf");
  const[period,setPeriod]=useState("30d");
  const doExport=async(type)=>{setExporting(type);await new Promise(r=>setTimeout(r,2000));setExporting(null);showToast(`⬇ "${type}" exportado como ${format.toUpperCase()}!`);};
  const reports=[{id:"performance",name:"Performance de Conteúdo",desc:"Visualizações, CTR, bounce e tempo médio",ico:"📊"},{id:"seo",name:"SEO & Palavras-chave",desc:"Score médio, posições e oportunidades",ico:"🔍"},{id:"automations",name:"Automações",desc:"Disparos, taxa de sucesso e erros",ico:"⚡"},{id:"team",name:"Produtividade da Equipe",desc:"Posts por autor, tempo e qualidade",ico:"👥"},{id:"wordpress",name:"Publicações WordPress",desc:"Histórico de publicações e falhas",ico:"⊞"},{id:"backup",name:"Histórico de Backups",desc:"Status, tamanho e datas",ico:"💾"}];
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">⚙️ Configurações de Exportação</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two" style={{marginBottom:8}}>
            <Field label="Formato">
              <div style={{display:"flex",gap:6}}>{["pdf","csv","xlsx","json"].map(f=><button key={f} onClick={()=>setFormat(f)} style={{padding:"6px 14px",borderRadius:999,border:`1.5px solid ${format===f?C.p:C.ovV}`,background:format===f?C.pC:"transparent",color:format===f?C.onPC:C.onV,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{f.toUpperCase()}</button>)}</div>
            </Field>
            <Field label="Período"><select className="fi fi-sel" value={period} onChange={e=>setPeriod(e.target.value)}><option value="7d">7 dias</option><option value="30d">30 dias</option><option value="90d">90 dias</option><option value="all">Todo o período</option></select></Field>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {reports.map(r=>(
          <div key={r.id} className="card">
            <div style={{padding:"13px 15px"}}>
              <div style={{display:"flex",gap:10,marginBottom:9}}>
                <div style={{width:36,height:36,borderRadius:9,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{r.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{r.name}</div><div style={{fontSize:11,color:C.onV}}>{r.desc}</div></div>
              </div>
              <button className="btn bf bsm" style={{width:"100%",justifyContent:"center"}} onClick={()=>doExport(r.id)} disabled={exporting===r.id}>{exporting===r.id?<><div className="spinner"/>Exportando...</>:`⬇ ${format.toUpperCase()}`}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ NOTIFICATION CENTER ══════════════════════════════════ */

export default ExportReportsPage;
