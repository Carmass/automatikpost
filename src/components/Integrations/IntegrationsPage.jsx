import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function IntegrationsPage({showToast}){
  const[tab,setTab]=useState("platforms");
  const[webhookDlg,setWebhookDlg]=useState(false);
  const[webhooks,setWebhooks]=useState([
    {id:1,name:"Notify Slack on publish",url:"https://hooks.slack.com/...",event:"post.published",active:true,calls:34},
    {id:2,name:"Update CRM on new post",url:"https://api.crm.com/webhook/...",event:"post.created",active:false,calls:8},
  ]);
  const[wForm,setWForm]=useState({name:"",url:"",event:"post.published"});

  const PLATFORMS=[
    {id:"wordpress",ico:"⊞",name:"WordPress",desc:"Publicação via REST API",status:"connected",count:"4 sites",color:C.terC},
    {id:"twitter",ico:"𝕏",name:"Twitter / X",desc:"Auto-compartilhamento de posts",status:"disconnected",count:"—",color:C.s1},
    {id:"linkedin",ico:"in",name:"LinkedIn",desc:"Publicar artigos automaticamente",status:"disconnected",count:"—",color:C.s1},
    {id:"instagram",ico:"📸",name:"Instagram",desc:"Compartilhar Web Stories e imagens",status:"disconnected",count:"—",color:C.s1},
    {id:"facebook",ico:"📘",name:"Facebook",desc:"Publicar no feed e grupos",status:"disconnected",count:"—",color:C.s1},
    {id:"mailchimp",ico:"🐒",name:"Mailchimp",desc:"Enviar newsletter ao publicar",status:"disconnected",count:"—",color:C.s1},
    {id:"analytics",ico:"📊",name:"Google Analytics",desc:"Métricas de tráfego e conversão",status:"disconnected",count:"—",color:C.s1},
    {id:"semrush",ico:"🔍",name:"Semrush",desc:"Dados de SEO e palavras-chave",status:"disconnected",count:"—",color:C.s1},
    {id:"slack",ico:"💬",name:"Slack",desc:"Notificações de publicação",status:"disconnected",count:"—",color:C.s1},
    {id:"zapier",ico:"⚡",name:"Zapier",desc:"Conectar com 5000+ apps",status:"disconnected",count:"—",color:C.s1},
  ];

  const saveWH=()=>{
    if(!wForm.name||!wForm.url)return;
    setWebhooks(p=>[...p,{id:Date.now(),...wForm,active:true,calls:0}]);
    setWebhookDlg(false);setWForm({name:"",url:"",event:"post.published"});
    showToast("🔗 Webhook criado!");
  };

  return(
    <div className="fade-in">
      <div className="tabs">
        {[{id:"platforms",l:"🔌 Plataformas"},{id:"webhooks",l:"🔗 Webhooks"},{id:"oauth",l:"🔐 OAuth Apps"},{id:"api",l:"🔑 API Keys"}].map(t=>(
          <div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>
        ))}
      </div>

      {tab==="platforms"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {PLATFORMS.map(p=>(
            <div key={p.id} className="card">
              <div style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:42,borderRadius:11,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:p.id==="linkedin"?15:20,fontWeight:800,flexShrink:0,color:p.id==="linkedin"?"#0A66C2":C.on}}>{p.ico}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.onV}}>{p.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <SChip status={p.status==="connected"?"active":"inactive"}/>
                  {p.count!=="—"&&<div className="mono" style={{fontSize:10,color:C.onV,marginTop:3}}>{p.count}</div>}
                </div>
              </div>
              <div style={{padding:"0 15px 13px"}}>
                <button className="btn bsm" style={{width:"100%",justifyContent:"center",background:p.status==="connected"?C.s2:C.p,color:p.status==="connected"?C.onV:C.onP,borderRadius:999}} onClick={()=>showToast(p.status==="connected"?`⚙️ Gerenciando ${p.name}...`:`🔌 Conectando ${p.name}...`)}>
                  {p.status==="connected"?"⚙️ Gerenciar":"🔌 Conectar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="webhooks"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>setWebhookDlg(true)}>➕ Novo Webhook</button>
          </div>
          <div className="card" style={{marginBottom:13}}>
            {webhooks.map((w,i)=>(
              <div key={w.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<webhooks.length-1?`1px solid ${C.ovV}`:"none"}}>
                <Tog on={w.active} onChange={()=>setWebhooks(p=>p.map(x=>x.id===w.id?{...x,active:!x.active}:x))}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{w.name}</div>
                  <div className="mono" style={{fontSize:10,color:C.onV,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.url}</div>
                  <span className="chip cn" style={{fontSize:9,marginTop:3}}>{w.event}</span>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginRight:8}}>
                  <div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{w.calls}</div>
                  <div style={{fontSize:10,color:C.onV}}>chamadas</div>
                </div>
                <button className="ib" style={{width:26,height:26,fontSize:12}}>▶️</button>
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setWebhooks(p=>p.filter(x=>x.id!==w.id))}>🗑</button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📋 Eventos disponíveis</span></div>
            <div className="cb" style={{paddingTop:4}}>
              {["post.created","post.published","post.updated","post.deleted","automation.triggered","wordpress.synced","backup.completed","seo.score_low"].map((e,i,arr)=>(
                <div key={e} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:i<arr.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <span className="mono" style={{fontSize:12}}>{e}</span>
                  <button className="btn bx bsm" style={{fontSize:11}} onClick={()=>{setWForm(f=>({...f,event:e}));setWebhookDlg(true);}}>+ Webhook</button>
                </div>
              ))}
            </div>
          </div>
          {webhookDlg&&<Dlg title="Novo Webhook" onClose={()=>setWebhookDlg(false)}
            footer={<><button className="btn bo" onClick={()=>setWebhookDlg(false)}>Cancelar</button><button className="btn bf" onClick={saveWH}>Criar</button></>}>
            <Field label="Nome *"><input className="fi" placeholder="Ex: Notify Slack on publish" value={wForm.name} onChange={e=>setWForm(f=>({...f,name:e.target.value}))}/></Field>
            <Field label="URL *"><input className="fi" placeholder="https://hooks.example.com/..." value={wForm.url} onChange={e=>setWForm(f=>({...f,url:e.target.value}))}/></Field>
            <Field label="Evento">
              <select className="fi fi-sel" value={wForm.event} onChange={e=>setWForm(f=>({...f,event:e.target.value}))}>
                {["post.created","post.published","post.updated","automation.triggered","backup.completed"].map(ev=><option key={ev}>{ev}</option>)}
              </select>
            </Field>
            <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:12,color:C.onPC}}>💡 Enviamos um POST JSON ao URL configurado quando o evento ocorrer.</div>
          </Dlg>}
        </div>
      )}

      {tab==="oauth"&&(
        <div className="card">
          <div className="ch"><span className="ct">🔐 Aplicações OAuth conectadas</span></div>
          <div className="cb">
            {[{name:"AutomatikPOST Mobile",scope:"posts:read posts:write",created:"01/04/26",last:"09/05/26"},{name:"Zapier Integration",scope:"posts:read automations:write",created:"15/03/26",last:"08/05/26"}].map((app,i)=>(
              <div key={i} style={{padding:"12px 0",borderBottom:i<1?`1px solid ${C.ovV}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontSize:13,fontWeight:600}}>{app.name}</div>
                  <button className="btn ber bsm" style={{fontSize:11}}>Revogar</button>
                </div>
                <div style={{fontSize:11,color:C.onV}}>Escopos: <span className="mono">{app.scope}</span></div>
                <div style={{fontSize:11,color:C.onV,marginTop:2}}>Criado: {app.created} · Último uso: {app.last}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="api"&&(
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">🔑 Sua API Key</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:10}}>
                <div className="fi mono" style={{flex:1,fontSize:12,color:C.onV,letterSpacing:1,padding:"9px 12px"}}>apk_live_••••••••••••••••••••••••••••••••</div>
                <button className="btn bt bsm" onClick={()=>showToast("📋 API Key copiada!")}>📋 Copiar</button>
                <button className="btn ber bsm" onClick={()=>showToast("🔄 Nova chave gerada!")}>🔄 Regenerar</button>
              </div>
              <div style={{padding:"9px 12px",background:C.warnC,borderRadius:9,fontSize:12,color:C.warn}}>⚠️ Nunca compartilhe sua API Key. Regenerar invalida a chave atual.</div>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📡 Endpoints da API REST</span></div>
            <div className="cb" style={{paddingTop:4}}>
              {[{m:"GET",ep:"/api/v1/posts",d:"Listar todos os posts"},{m:"POST",ep:"/api/v1/posts",d:"Criar novo post"},{m:"PUT",ep:"/api/v1/posts/:id",d:"Atualizar post"},{m:"DELETE",ep:"/api/v1/posts/:id",d:"Deletar post"},{m:"POST",ep:"/api/v1/generate",d:"Gerar conteúdo com IA"},{m:"GET",ep:"/api/v1/analytics",d:"Métricas de performance"}].map((e,i,arr)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <span className="chip" style={{background:{GET:C.terC,POST:C.pC,PUT:C.warnC,DELETE:C.errC}[e.m],color:C.on,fontSize:10,minWidth:42,justifyContent:"center"}}>{e.m}</span>
                  <span className="mono" style={{fontSize:12,flex:1}}>{e.ep}</span>
                  <span style={{fontSize:12,color:C.onV}}>{e.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default IntegrationsPage;
