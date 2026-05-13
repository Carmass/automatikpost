import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function ProductivityDashboard(){
  return(
    <div className="fade-in">
      <div className="mg">
        {[{l:"Posts este mês",v:"32",d:"↑ 14% vs anterior",cls:"mcp"},{l:"Score médio equipe",v:"87",d:"↑ 3 pts",cls:"mct"},{l:"Tempo médio/post",v:"2h14m",d:"↓ 18min mais rápido",cls:"mcs"},{l:"Taxa de revisão",v:"94%",d:"2 posts reprovados",cls:"mce"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="two" style={{marginBottom:13}}>
        <div className="card">
          <div className="ch"><span className="ct">👥 Produtividade por Autor</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {[{name:"Ana Lima",posts:14,score:92,avg:"2h05m",role:"admin"},{name:"Carlos Mendes",posts:11,score:88,avg:"2h22m",role:"editor"},{name:"Juliana Costa",posts:7,score:84,avg:"2h31m",role:"editor"}].map((u,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{u.name.split(" ").map(w=>w[0]).join("")}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{u.name}</div>
                  <div style={{fontSize:11,color:C.onV}}>{u.posts} posts · Média: {u.avg}</div>
                </div>
                <Ring score={u.score} size={36}/>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div className="mono" style={{fontSize:15,fontWeight:800,color:C.p}}>{u.posts}</div>
                  <div style={{fontSize:10,color:C.onV}}>posts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📅 Posts por Dia da Semana</span></div>
          <div className="cb"><Bar data={[3,7,6,8,5,2,1]} labels={["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]} h={90}/></div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ct">📈 Evolução Semanal da Equipe</span></div>
        <div className="cb">
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[{name:"Ana Lima",data:[3,4,3,5,4,4,2],color:C.p},{name:"Carlos Mendes",data:[2,3,4,3,3,4,3],color:C.ter},{name:"Juliana Costa",data:[1,2,2,1,3,2,1],color:C.warn}].map(u=>(
              <div key={u.name} style={{padding:"12px",background:C.s1,borderRadius:11}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>{u.name}</div>
                <Spark data={u.data} color={u.color}/>
                <div className="mono" style={{fontSize:11,color:u.color,fontWeight:700,marginTop:5}}>{u.data.reduce((s,v)=>s+v,0)} posts/semana</div>
              </div>
            ))}
            <div style={{padding:"12px",background:C.s1,borderRadius:11}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Equipe total</div>
              <Spark data={CHART_DATA.slice(-7)} color={C.sec}/>
              <div className="mono" style={{fontSize:11,color:C.sec,fontWeight:700,marginTop:5}}>{CHART_DATA.slice(-7).reduce((s,v)=>s+v,0)} posts/semana</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductivityDashboard;
