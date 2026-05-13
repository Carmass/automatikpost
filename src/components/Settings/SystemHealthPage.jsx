import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function SystemHealthPage() {
  const[refreshing,setRefreshing]=useState(false);
  const[lastRefresh,setLastRefresh]=useState("há 2min");
  const refresh=async()=>{setRefreshing(true);await new Promise(r=>setTimeout(r,1500));setRefreshing(false);setLastRefresh("agora mesmo");};
  const services=[
    {name:"API REST WordPress",status:"online",latency:"142ms",uptime:"99.8%",checks:1248},
    {name:"Claude AI (Anthropic)",status:"online",latency:"890ms",uptime:"99.9%",checks:347},
    {name:"Banco de Dados",status:"online",latency:"8ms",uptime:"100%",checks:5820},
    {name:"Sistema de Backups",status:"online",latency:"—",uptime:"100%",checks:52},
    {name:"Processador de Imagens",status:"warning",latency:"2100ms",uptime:"97.2%",checks:234},
    {name:"Serviço de Email",status:"online",latency:"320ms",uptime:"99.1%",checks:89},
  ];
  const stats=[
    {l:"Posts processados",v:"1,247",trend:"+18%"},
    {l:"Requisições WordPress",v:"8,430",trend:"+34%"},
    {l:"Tokens IA utilizados",v:"2.1M",trend:"+41%"},
    {l:"Erros registrados",v:"12",trend:"-67%"},
  ];
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center"}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Status dos Serviços</div><div style={{fontSize:12,color:C.onV}}>Atualizado: {lastRefresh}</div></div>
        <button className="btn bo bsm" onClick={refresh} disabled={refreshing}>{refreshing?<><div className="spinner"/>Verificando...</>:"🔄 Atualizar"}</button>
      </div>
      <div className="mg" style={{marginBottom:14}}>
        {stats.map((s,i)=>(
          <div key={i} className={`mc ${["mcp","mct","mcs","mce"][i]}`}><div className="ml">{s.l}</div><div className="mv">{s.v}</div><div className="md">{s.trend} este mês</div></div>
        ))}
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">🔧 Status dos Serviços</span></div>
        <div className="cb" style={{paddingTop:4}}>
          {services.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<services.length-1?`1px solid ${C.ovV}`:"none"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:s.status==="online"?C.ter:s.status==="warning"?C.warn:C.err,flexShrink:0,boxShadow:s.status==="online"?`0 0 0 3px ${C.terC}`:"none"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{s.name}</div>
                <div style={{fontSize:11,color:C.onV}}>{s.checks.toLocaleString()} verificações</div>
              </div>
              <div style={{textAlign:"center",minWidth:80}}>
                <div className="mono" style={{fontSize:12,fontWeight:700,color:C.on}}>{s.latency}</div>
                <div style={{fontSize:10,color:C.onV}}>latência</div>
              </div>
              <div style={{textAlign:"center",minWidth:70}}>
                <div className="mono" style={{fontSize:12,fontWeight:700,color:C.ter}}>{s.uptime}</div>
                <div style={{fontSize:10,color:C.onV}}>uptime</div>
              </div>
              <SChip status={s.status==="online"?"active":s.status==="warning"?"warning":"inactive"}/>
            </div>
          ))}
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📈 Uso de Recursos (hoje)</span></div>
          <div className="cb" style={{paddingTop:6}}>
            {[{l:"CPU",v:34},{l:"Memória",v:61},{l:"Armazenamento",v:47},{l:"Bandwidth",v:28}].map((r,i)=>(
              <div key={i} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12}}>{r.l}</span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,color:r.v>80?C.err:r.v>60?C.warn:C.ter}}>{r.v}%</span>
                </div>
                <div className="pb"><div className="pbf" style={{width:`${r.v}%`,background:r.v>80?C.err:r.v>60?C.warn:C.ter}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">⚡ Últimos Eventos do Sistema</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {[{ico:"✅",t:"Backup automático concluído",ts:"06/05 02:00",c:C.terC},{ico:"⚡",t:"Automação #5 executada",ts:"09/05 14:20",c:C.pC},{ico:"⚠️",t:"Alta latência: Processador de Imagens",ts:"09/05 11:00",c:C.warnC},{ico:"🔄",t:"WordPress sincronizado: Blog Principal",ts:"09/05 09:05",c:C.pC},{ico:"✅",t:"Deploy concluído: v2.6.1",ts:"08/05 18:00",c:C.terC}].map((ev,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:26,height:26,borderRadius:7,background:ev.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{ev.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:12,lineHeight:1.4}}>{ev.t}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{ev.ts}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════
   ENTITY SCHEMAS  (Base44 / NoSQL — runtime store)
══════════════════════════════════════════════════════════ */

export default SystemHealthPage;
