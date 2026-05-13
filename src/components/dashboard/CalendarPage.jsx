import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function CalendarPage({go,showToast}){
  const[month,setMonth]=useState(4);
  const[year]=useState(2026);
  const[viewMode,setViewMode]=useState("month");
  const[dlg,setDlg]=useState(null);
  const[events,setEvents]=useState({
    3:[{title:"SEO Weekly",cat:"SEO",wp:"Blog Principal",time:"09:00",color:C.p}],
    7:[{title:"IA Content",cat:"IA",wp:"Blog Principal",time:"10:00",color:C.ter},{title:"CMS Review",cat:"CMS",wp:"Portal",time:"14:00",color:C.sec}],
    9:[{title:"Email Marketing",cat:"Email",wp:"Portal Notícias",time:"09:00",color:C.warn}],
    14:[{title:"Dev Tutorial",cat:"Dev",wp:"Blog Principal",time:"11:00",color:C.err}],
    18:[{title:"SEO Deep Dive",cat:"SEO",wp:"Blog Principal",time:"09:00",color:C.p}],
    21:[{title:"IA Automation",cat:"IA",wp:"Blog Principal",time:"10:30",color:C.ter}],
    25:[{title:"CRO Guide",cat:"CRO",wp:"Portal",time:"08:00",color:C.sec}],
  });
  const[newEvent,setNewEvent]=useState({title:"",cat:"SEO",wp:WP_SITES[0].name,time:"09:00",day:1});
  const mons=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const days=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  const saveEvent=()=>{
    if(!newEvent.title.trim())return;
    const cat2color={SEO:C.p,IA:C.ter,Email:C.warn,Dev:C.err,CMS:C.sec,CRO:C.sec,Marketing:C.p,Tutorial:C.ter};
    setEvents(p=>({...p,[newEvent.day]:[...(p[newEvent.day]||[]),{title:newEvent.title,cat:newEvent.cat,wp:newEvent.wp,time:newEvent.time,color:cat2color[newEvent.cat]||C.p}]}));
    setDlg(null);showToast("📅 Post agendado!");
  };

  const upcoming=Object.entries(events).flatMap(([day,evs])=>evs.map(e=>({...e,day:+day}))).sort((a,b)=>a.day-b.day).filter(e=>e.day>=9);

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <button className="ib" onClick={()=>setMonth(m=>(m-1+12)%12)}>◀</button>
          <div style={{fontSize:16,fontWeight:700,width:110,textAlign:"center"}}>{mons[month]} {year}</div>
          <button className="ib" onClick={()=>setMonth(m=>(m+1)%12)}>▶</button>
          <button className="btn bx bsm" onClick={()=>setMonth(4)} style={{fontSize:11}}>Hoje</button>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",gap:2,background:C.s1,borderRadius:8,padding:2}}>
            {["month","week"].map(v=><button key={v} onClick={()=>setViewMode(v)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:viewMode===v?C.p:"transparent",color:viewMode===v?C.onP:C.onV,transition:"all .14s"}}>{v==="month"?"Mês":"Semana"}</button>)}
          </div>
          <button className="btn bf bsm" onClick={()=>setDlg("new")}>📅 Agendar Post</button>
        </div>
      </div>

      <div className="three" style={{marginBottom:13}}>
        <div className="card" style={{gridColumn:"1/3"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${C.ovV}`}}>
            {days.map(d=><div key={d} style={{padding:"8px 0",textAlign:"center",fontSize:11,fontWeight:700,color:C.onV,textTransform:"uppercase",letterSpacing:.4}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {[...Array(35)].map((_,i)=>{
              const day=i-3; const valid=day>=1&&day<=31;
              const dayEvents=events[day]||[];
              const isToday=day===9&&month===4;
              return(
                <div key={i} style={{minHeight:viewMode==="month"?80:120,padding:"5px 4px",borderRight:`1px solid ${C.ovV}`,borderBottom:`1px solid ${C.ovV}`,background:isToday?`${C.pC}66`:"transparent",cursor:valid?"pointer":"default",transition:"background .12s"}}
                  onMouseEnter={e=>{if(valid&&!isToday)e.currentTarget.style.background=C.s1;}}
                  onMouseLeave={e=>{if(valid&&!isToday)e.currentTarget.style.background="transparent";}}
                  onClick={()=>valid&&setDlg({day})}>
                  {valid&&<>
                    <div style={{fontSize:11,fontWeight:isToday?800:400,color:isToday?C.p:C.on,textAlign:"right",paddingRight:3,marginBottom:2}}>{day}</div>
                    {dayEvents.slice(0,viewMode==="month"?2:4).map((ev,pi)=>(
                      <div key={pi} style={{fontSize:9,background:ev.color,color:"#fff",borderRadius:3,padding:"2px 5px",marginBottom:2,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setDlg({event:ev,day});}}>
                        {ev.time} {ev.title}
                      </div>
                    ))}
                    {dayEvents.length>2&&viewMode==="month"&&<div style={{fontSize:9,color:C.onV,paddingLeft:3}}>+{dayEvents.length-2} mais</div>}
                  </>}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="ch"><span className="ct">📅 Próximas publicações</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {upcoming.slice(0,5).map((ev,i)=>(
                <div key={i} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<Math.min(4,upcoming.length-1)?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                  <div style={{width:34,height:34,borderRadius:8,background:ev.color+"22",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{fontSize:13,fontWeight:800,color:ev.color,lineHeight:1}}>{ev.day}</div>
                    <div style={{fontSize:9,color:ev.color,opacity:.8}}>{mons[month]}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                    <div style={{fontSize:10,color:C.onV}}>{ev.time} · {ev.wp}</div>
                  </div>
                  <span className="chip" style={{background:ev.color+"22",color:ev.color,fontSize:9}}>{ev.cat}</span>
                </div>
              ))}
              {upcoming.length===0&&<div style={{padding:"14px 0",textAlign:"center",color:C.onV,fontSize:12}}>Nenhum post agendado</div>}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📊 Este mês</span></div>
            <div className="cb" style={{paddingTop:6}}>
              {[{l:"Agendados",v:Object.values(events).flat().length,c:C.p},{l:"Publicados",v:4,c:C.ter},{l:"Rascunhos",v:3,c:C.warn}].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                  <span style={{fontSize:13,color:C.onV}}>{s.l}</span>
                  <span className="mono" style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {dlg==="new"&&(
        <Dlg title="Agendar Post" onClose={()=>setDlg(null)}
          footer={<><button className="btn bo" onClick={()=>setDlg(null)}>Cancelar</button><button className="btn bf" onClick={saveEvent}>📅 Agendar</button></>}>
          <Field label="Título do post *"><input className="fi" placeholder="Ex: Guia SEO para 2026" value={newEvent.title} onChange={e=>setNewEvent(p=>({...p,title:e.target.value}))}/></Field>
          <div className="two">
            <Field label="Dia do mês"><input className="fi" type="number" min={1} max={31} value={newEvent.day} onChange={e=>setNewEvent(p=>({...p,day:+e.target.value||1}))}/></Field>
            <Field label="Horário"><input className="fi" type="time" value={newEvent.time} onChange={e=>setNewEvent(p=>({...p,time:e.target.value}))}/></Field>
          </div>
          <div className="two">
            <Field label="Categoria"><select className="fi fi-sel" value={newEvent.cat} onChange={e=>setNewEvent(p=>({...p,cat:e.target.value}))}>{["SEO","IA","Email","Dev","CMS","CRO","Marketing","Tutorial"].map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Site WordPress"><select className="fi fi-sel" value={newEvent.wp} onChange={e=>setNewEvent(p=>({...p,wp:e.target.value}))}>{WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}</select></Field>
          </div>
        </Dlg>
      )}
      {dlg&&typeof dlg==="object"&&dlg.event&&(
        <Dlg title={dlg.event.title} onClose={()=>setDlg(null)}
          footer={<><button className="btn bo" onClick={()=>setDlg(null)}>Fechar</button><button className="btn bf" onClick={()=>{setDlg(null);go("editor",{title:dlg.event.title,cat:dlg.event.cat});}}>✏️ Editar Post</button></>}>
          <div style={{display:"flex",gap:10,alignItems:"center",padding:"12px",background:C.s1,borderRadius:10}}>
            <div style={{width:42,height:42,borderRadius:10,background:dlg.event.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📅</div>
            <div>
              <div style={{fontSize:14,fontWeight:700}}>{dlg.event.title}</div>
              <div style={{fontSize:12,color:C.onV}}>Dia {dlg.day} · {dlg.event.time} · {dlg.event.wp}</div>
            </div>
          </div>
          <div style={{marginTop:12,display:"flex",gap:7}}>
            <span className="chip" style={{background:dlg.event.color+"22",color:dlg.event.color}}>{dlg.event.cat}</span>
          </div>
        </Dlg>
      )}
      {dlg&&typeof dlg==="object"&&dlg.day&&!dlg.event&&(
        <Dlg title={`Dia ${dlg.day} de ${mons[month]}`} onClose={()=>setDlg(null)}
          footer={<><button className="btn bo" onClick={()=>setDlg(null)}>Fechar</button><button className="btn bf" onClick={()=>{setNewEvent(p=>({...p,day:dlg.day}));setDlg("new");}}>📅 Agendar neste dia</button></>}>
          {(events[dlg.day]||[]).length===0
            ?<Empty ico="📅" title="Nenhum post neste dia" sub="Clique em Agendar para programar uma publicação."/>
            :(events[dlg.day]||[]).map((ev,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<(events[dlg.day]||[]).length-1?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ev.color,flexShrink:0}}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{ev.title}</div><div style={{fontSize:11,color:C.onV}}>{ev.time} · {ev.wp}</div></div>
                <span className="chip" style={{background:ev.color+"22",color:ev.color,fontSize:10}}>{ev.cat}</span>
              </div>
            ))
          }
        </Dlg>
      )}
    </div>
  );
}

export default CalendarPage;
