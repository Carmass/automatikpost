import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function WordPressPage({showToast}){
  const[testing,setTesting]=useState(null);
  const[results,setResults]=useState({});
  const[dlg,setDlg]=useState(false);
  const test=async id=>{setTesting(id);await new Promise(r=>setTimeout(r,1900));setResults(p=>({...p,[id]:WP_SITES.find(s=>s.id===id).status}));setTesting(null);};
  const stM={online:[C.terC,"✅","Online"],warning:[C.warnC,"⚠️","Aviso"],offline:[C.errC,"❌","Offline"]};
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:13}}>
        <span className="chip ct3">4 sites</span><span className="chip cn">1 aviso</span>
        <div style={{flex:1}}/>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Conectar</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13}}>
        {WP_SITES.map(s=>{
          const[bg,ico,lbl]=stM[s.status];
          return(
            <div key={s.id} className="card">
              <div style={{padding:"14px 17px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:11}}>
                  <div style={{width:40,height:40,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{ico}</div>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{s.name}</div><div className="mono" style={{fontSize:11,color:C.onV}}>{s.url}</div></div>
                  <SChip status={s.status}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:10}}>
                  {[["Posts",s.posts],["WP",s.ver],["User",s.user],["Sync",s.sync]].map(([k,v])=>(
                    <div key={k} style={{background:C.s1,borderRadius:7,padding:"6px 8px",textAlign:"center"}}><div style={{fontSize:9,color:C.onV,fontWeight:700,marginBottom:1}}>{k}</div><div className="mono" style={{fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div></div>
                  ))}
                </div>
                {s.plugin&&<div style={{padding:"5px 9px",background:C.pC,borderRadius:7,fontSize:11,color:C.onPC,marginBottom:9,textAlign:"center",fontWeight:600}}>✓ Plugin AutomatikPOST ativo</div>}
                <div style={{display:"flex",gap:7}}>
                  <button className="btn bo bsm" style={{flex:1}} onClick={()=>test(s.id)} disabled={testing===s.id}>{testing===s.id?<><div className="spinner" style={{width:11,height:11}}/>Testando...</>:"🔌 Testar"}</button>
                  <button className="btn bt bsm">📤 Publicar</button>
                </div>
                {results[s.id]&&<div style={{marginTop:8,padding:"7px 10px",background:results[s.id]==="online"?C.terC:C.errC,borderRadius:7,fontSize:12,color:results[s.id]==="online"?C.onTerC:"#690005"}}>{results[s.id]==="online"?"✅ Conexão OK":"❌ Falha — verifique credenciais"}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="card"><div className="ch"><span className="ct">🔧 Diagnóstico de Erros</span></div><div className="cb">
        {[{code:"rest_not_logged_in",sol:"No .htaccess: SetEnvIf Authorization \"(.*)\" HTTP_AUTHORIZATION=$1"},{code:"rest_forbidden",sol:"Use papel Editor ou Admin no WordPress."},{code:"rest_api_not_found",sol:"Salve os Links permanentes em Config. > Links permanentes."},{code:"rest_no_route",sol:"Verifique URL em Config. > Geral."}].map((e,i)=>(
          <div key={i} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none",alignItems:"flex-start"}}>
            <span className="mono chip ce" style={{fontSize:10,flexShrink:0,whiteSpace:"nowrap"}}>{e.code}</span>
            <div style={{fontSize:12,color:C.onV,lineHeight:1.5}}>{e.sol}</div>
          </div>
        ))}
      </div></div>
      {dlg&&<Dlg title="Conectar WordPress" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={()=>{setDlg(false);showToast("⊞ Site conectado!");}}>Conectar e Testar</button></>}>
        <Field label="Nome do Site"><input className="fi" placeholder="Ex: Blog Principal"/></Field>
        <Field label="URL *"><input className="fi" placeholder="https://seublog.com.br"/></Field>
        <div className="two"><Field label="Usuário"><input className="fi" placeholder="admin"/></Field><Field label="App Password"><input className="fi" type="password" placeholder="xxxx xxxx xxxx"/></Field></div>
        <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:12,color:C.onPC}}>💡 WP Admin → Usuários → Perfil → Senhas de aplicativo</div>
      </Dlg>}
    </div>
  );
}

export default WordPressPage;
