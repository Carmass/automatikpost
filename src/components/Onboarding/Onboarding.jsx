import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Dlg, Field } from '../ui/index.jsx';

function Onboarding({onDone}){
  const[step,setStep]=useState(0);
  const[form,setForm]=useState({name:"",email:"",site:"",wp_url:"",wp_user:"",wp_pass:"",niche:"marketing digital"});
  const steps=[
    {
      ico:"🚀",title:"Bem-vindo ao AutomatikPOST!",sub:"A plataforma completa de produção, automação e gestão de conteúdo com IA. Vamos configurar tudo em 3 passos.",
      content:null,
    },
    {
      ico:"👤",title:"Seus dados",sub:"Informe suas informações básicas para personalizar a experiência.",
      content:(
        <div style={{textAlign:"left"}}>
          <Field label="Nome completo *"><input className="fi" placeholder="Ana Lima" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <Field label="E-mail *"><input className="fi" type="email" placeholder="ana@empresa.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
          <Field label="Nome do site / blog"><input className="fi" placeholder="Blog da Ana" value={form.site} onChange={e=>setForm(f=>({...f,site:e.target.value}))}/></Field>
          <Field label="Nicho principal">
            <select className="fi fi-sel" value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}>
              {["marketing digital","tecnologia","negócios","saúde","educação","finanças","e-commerce"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
            </select>
          </Field>
        </div>
      ),
    },
    {
      ico:"⊞",title:"Conectar WordPress",sub:"Conecte seu site WordPress para publicar diretamente. Você pode pular e adicionar depois.",
      content:(
        <div style={{textAlign:"left"}}>
          <Field label="URL do site"><input className="fi" placeholder="https://seublog.com.br" value={form.wp_url} onChange={e=>setForm(f=>({...f,wp_url:e.target.value}))}/></Field>
          <div className="two">
            <Field label="Usuário WP"><input className="fi" placeholder="admin" value={form.wp_user} onChange={e=>setForm(f=>({...f,wp_user:e.target.value}))}/></Field>
            <Field label="App Password"><input className="fi" type="password" placeholder="xxxx xxxx xxxx" value={form.wp_pass} onChange={e=>setForm(f=>({...f,wp_pass:e.target.value}))}/></Field>
          </div>
          <div style={{padding:"9px 12px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC}}>💡 Gere em: WP Admin → Usuários → Perfil → Senhas de aplicativo</div>
        </div>
      ),
    },
    {
      ico:"✅",title:"Tudo pronto!",sub:"Seu AutomatikPOST está configurado. Crie seu primeiro post com IA agora mesmo!",
      content:(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,textAlign:"left",marginTop:8}}>
          {[{ico:"✨",t:"Produtor IA",d:"Gere artigos completos"},
            {ico:"📊",t:"Dashboard",d:"Veja métricas em tempo real"},
            {ico:"⚡",t:"Automações",d:"Publique automaticamente"},
            {ico:"🔍",t:"SEO Audit",d:"Otimize cada post"},
          ].map((f,i)=>(
            <div key={i} style={{padding:"12px",background:C.s1,borderRadius:12,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{fontSize:22}}>{f.ico}</div>
              <div><div style={{fontSize:13,fontWeight:700}}>{f.t}</div><div style={{fontSize:11,color:C.onV}}>{f.d}</div></div>
            </div>
          ))}
        </div>
      ),
    },
  ];
  const cur=steps[step];
  return(
    <div className="ob">
      <div className="ob-card">
        <div className="ob-prog">{steps.map((_,i)=><div key={i} className={`ob-dot${i===step?" a":""}`}/>)}</div>
        <div className="ob-ico">{cur.ico}</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:10}}>{cur.title}</div>
        <div style={{fontSize:14,color:C.onV,lineHeight:1.6,marginBottom:24,maxWidth:380,margin:"0 auto 24px"}}>{cur.sub}</div>
        {cur.content}
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:24}}>
          {step>0&&<button className="btn bo" onClick={()=>setStep(s=>s-1)}>← Voltar</button>}
          {step<steps.length-1
            ?<button className="btn bf" onClick={()=>setStep(s=>s+1)}>
              {step===steps.length-2?"Pular →":"Continuar →"}
             </button>
            :<button className="btn bf" onClick={onDone}>🚀 Abrir o painel</button>
          }
        </div>
      </div>
    </div>
  );
}


export default Onboarding;
