import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function SupportPage({showToast}){
  const[msgs,setMsgs]=useState([
    {role:"assistant",text:"Olá! 👋 Sou o assistente do AutomatikPOST. Como posso ajudar você hoje?\n\nPosso auxiliar com:\n• Configuração do WordPress\n• Dúvidas sobre SEO\n• Uso das automações\n• Problemas técnicos"},
  ]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const endRef=useRef(null);
  const FAQS=[
    {q:"Como conectar meu WordPress?",a:"Vá em WordPress → Conectar Site. Use Application Password gerado em WP Admin → Usuários → Perfil → Senhas de aplicativo."},
    {q:"Por que meu score SEO está baixo?",a:"Verifique: palavra-chave no título H1, meta description definida, subtítulos H2 presentes e conteúdo com mais de 800 palavras."},
    {q:"Como agendar publicações?",a:"No editor do post, aba Configurações → Status → Agendar. Ou use Cronogramas Recorrentes para publicação automática periódica."},
    {q:"O que são Web Stories?",a:"São posts interativos em formato vertical, similares aos Stories do Instagram, suportados nativamente pelo Google e WordPress."},
  ];
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=async(text)=>{
    const msg=text||input.trim();
    if(!msg)return;
    setInput("");
    setMsgs(p=>[...p,{role:"user",text:msg}]);
    setLoading(true);
    try{
      const history=msgs.concat({role:"user",text:msg}).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:"Você é o assistente de suporte do AutomatikPOST, uma plataforma SaaS de gestão de conteúdo com IA e integração WordPress. Responda em português brasileiro, de forma concisa, amigável e técnica quando necessário. Foque em resolver problemas reais da plataforma.",messages:history})});
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"Desculpe, não consegui processar sua mensagem.";
      setMsgs(p=>[...p,{role:"assistant",text:reply}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",text:"⚠️ Erro de conexão. Tente novamente ou consulte a documentação."}]);}
    setLoading(false);
  };

  return(
    <div className="fade-in">
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">💬 Chat de Suporte com IA</span><span className="chip ct3">Online</span></div>
            <div style={{height:380,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:9,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:8,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🤖</div>}
                  <div style={{maxWidth:"80%",padding:"10px 13px",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.role==="user"?C.p:C.s1,color:m.role==="user"?C.onP:C.on,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.text}</div>
                  {m.role==="user"&&<div style={{width:28,height:28,borderRadius:8,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.onPC,flexShrink:0}}>A</div>}
                </div>
              ))}
              {loading&&<div style={{display:"flex",gap:9}}>
                <div style={{width:28,height:28,borderRadius:8,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
                <div style={{padding:"10px 14px",borderRadius:"12px 12px 12px 4px",background:C.s1,display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.ov,animation:`bl ${0.8+i*0.15}s infinite`}}/>)}
                </div>
              </div>}
              <div ref={endRef}/>
            </div>
            <div style={{padding:"10px 14px",borderTop:`1px solid ${C.ovV}`,display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:38,padding:"7px 12px"}} placeholder="Digite sua dúvida..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}/>
              <button className="btn bf bsm" onClick={()=>send()} disabled={loading||!input.trim()}>Enviar</button>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">❓ Perguntas Frequentes</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {FAQS.map((f,i)=>(
                <div key={i} style={{padding:"11px 0",borderBottom:i<FAQS.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:5,cursor:"pointer",color:C.p}} onClick={()=>send(f.q)}>→ {f.q}</div>
                  <div style={{fontSize:12,color:C.onV,lineHeight:1.6}}>{f.a}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📚 Recursos</span></div>
            <div style={{padding:"0 14px 10px"}}>
              {[{ico:"📖",t:"Documentação completa",u:"docs.automatikpost.com"},{ico:"🎬",t:"Vídeo-tutoriais",u:"youtube.com/@automatikpost"},{ico:"💬",t:"Comunidade no Discord",u:"discord.gg/automatikpost"},{ico:"📧",t:"suporte@automatikpost.com.br",u:"mailto:suporte@automatikpost.com.br"}].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{width:30,height:30,borderRadius:7,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{r.ico}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{r.t}</div>
                    <div className="mono" style={{fontSize:10,color:C.onV}}>{r.u}</div>
                  </div>
                  <button className="ib" style={{width:26,height:26,fontSize:13}}>↗</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SupportPage;
