import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function SettingsPage({showToast}){
  const[tab,setTab]=useState("profile");
  const[vals,setVals]=useState({name:"Administrador",email:"admin@automatikpost.com.br",lang:"pt-BR",tz:"America/Recife",notif:true,weekly:true,seoAlert:false,twoFA:false});
  const set=k=>v=>setVals(p=>({...p,[k]:v}));
  const save=()=>showToast("💾 Configurações salvas!");
  return(
    <div className="fade-in">
      <div className="tabs">{[{id:"profile",l:"👤 Perfil"},{id:"notif",l:"🔔 Notificações"},{id:"integrations",l:"🔌 Integrações"},{id:"security",l:"🔐 Segurança"},{id:"logs",l:"📋 Logs"}].map(t=><div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>)}</div>
      {tab==="profile"&&<div className="two">
        <div className="card"><div className="ch"><span className="ct">Dados Pessoais</span></div><div className="cb" style={{paddingTop:5}}>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14,padding:12,background:C.s1,borderRadius:10}}>
            <div style={{width:48,height:48,borderRadius:13,background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,flexShrink:0}}>A</div>
            <div><div style={{fontWeight:700,fontSize:14}}>{vals.name}</div><div style={{fontSize:12,color:C.onV}}>{vals.email}</div><span className="chip ct3" style={{marginTop:3}}>Admin</span></div>
          </div>
          <Field label="Nome"><input className="fi" value={vals.name} onChange={e=>set("name")(e.target.value)}/></Field>
          <Field label="E-mail"><input className="fi" value={vals.email} onChange={e=>set("email")(e.target.value)}/></Field>
          <Field label="Nova senha"><input className="fi" type="password" placeholder="Deixe em branco para não alterar"/></Field>
          <button className="btn bf" style={{width:"100%",justifyContent:"center"}} onClick={save}>💾 Salvar Perfil</button>
        </div></div>
        <div className="card"><div className="ch"><span className="ct">Preferências</span></div><div className="cb" style={{paddingTop:5}}>
          <Field label="Idioma"><select className="fi fi-sel" value={vals.lang} onChange={e=>set("lang")(e.target.value)}><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option></select></Field>
          <Field label="Fuso Horário"><select className="fi fi-sel" value={vals.tz} onChange={e=>set("tz")(e.target.value)}><option value="America/Recife">America/Recife (UTC-3)</option><option value="America/Sao_Paulo">America/São Paulo</option></select></Field>
        </div></div>
      </div>}
      {tab==="notif"&&<div className="card"><div className="ch"><span className="ct">Notificações</span></div><div className="cb">
        {[{k:"notif",l:"Notificações in-app",s:"Publicações, erros e alertas"},{k:"weekly",l:"Relatório semanal",s:"Sexta-feira, 18:00"},{k:"seoAlert",l:"Alerta SEO baixo",s:"Quando score < 70"},{k:"twoFA",l:"Alertas de login",s:"Novos acessos"}].map((n,i)=>(
          <div key={n.k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{n.l}</div><div style={{fontSize:12,color:C.onV}}>{n.s}</div></div>
            <Tog on={vals[n.k]} onChange={set(n.k)}/>
          </div>
        ))}
      </div></div>}
      {tab==="integrations"&&<div className="card"><div className="ch"><span className="ct">Integrações</span></div><div className="cb">
        {[{n:"Claude AI",s:"Conectado · claude-sonnet-4",i:"🤖",c:C.terC},{n:"WordPress API",s:"4 sites",i:"⊞",c:C.pC},{n:"Google Analytics",s:"Não conectado",i:"📊",c:C.s1},{n:"Semrush",s:"Não conectado",i:"🔍",c:C.s1},{n:"Slack",s:"Não conectado",i:"💬",c:C.s1}].map((s,i,arr)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:8,background:s.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{s.i}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.n}</div><div style={{fontSize:12,color:C.onV}}>{s.s}</div></div>
            <button className="btn bo bsm">{s.s.includes("Não")?"Conectar":"Gerenciar"}</button>
          </div>
        ))}
      </div></div>}
      {tab==="security"&&<div className="card"><div className="ch"><span className="ct">Segurança</span></div><div className="cb">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.ovV}`}}>
          <div><div style={{fontSize:13,fontWeight:600}}>Autenticação em 2 fatores</div><div style={{fontSize:12,color:C.onV}}>Segurança adicional via app autenticador</div></div>
          <Tog on={vals.twoFA} onChange={set("twoFA")}/>
        </div>
        <div style={{padding:"12px 0"}}><div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Sessões ativas</div>
          {["Chrome — Windows · Recife, BR · Agora","Safari — iPhone · há 2h"].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12,color:C.onV,borderBottom:i<1?`1px solid ${C.ovV}`:"none"}}>
              <span>{s}</span><button className="btn bx bsm" style={{fontSize:11,color:C.err,padding:"2px 7px"}}>Encerrar</button>
            </div>
          ))}
        </div>
      </div></div>}
      {tab==="logs"&&<div className="card"><div className="ch"><span className="ct">Logs do Sistema</span><button className="btn bo bsm">⬇ Exportar</button></div><div style={{padding:"0 4px"}}>
        {[{t:"INFO",m:"Post ID 247 publicado: Blog Principal",ts:"09/05 14:32",c:C.terC},{t:"INFO",m:"Automação #5 executada",ts:"09/05 14:20",c:C.terC},{t:"WARN",m:"Sync falhou: loja.exemplo.com.br",ts:"09/05 12:15",c:C.warnC},{t:"ERROR",m:"Conexão WP: rest_not_logged_in",ts:"05/05 09:44",c:C.errC}].map((l,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",borderBottom:i<3?`1px solid ${C.ovV}`:"none",alignItems:"flex-start"}}>
            <span className="chip mono" style={{background:l.c,color:C.on,fontSize:9,flexShrink:0}}>{l.t}</span>
            <div style={{flex:1,fontSize:12,color:C.onV,lineHeight:1.5}}>{l.m}</div>
            <div className="mono" style={{fontSize:10,color:C.onV,flexShrink:0}}>{l.ts}</div>
          </div>
        ))}
      </div></div>}
    </div>
  );
}

export default SettingsPage;
