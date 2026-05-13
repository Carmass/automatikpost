import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

export function AdminPanel({ showToast }) {
  const[tab,setTab]=useState("users");
  const[users,setUsers]=useState(USERS);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",email:"",role:"editor"});
  const rCls={admin:"chip cp",editor:"chip ct3",viewer:"chip cn"};
  const saveUser=()=>{
    if(!form.name||!form.email)return;
    setUsers(p=>[...p,{id:Date.now(),...form,status:"active",posts:0,login:"nunca"}]);
    setDlg(false);setForm({name:"",email:"",role:"editor"});showToast("👤 Usuário adicionado!");
  };
  const storageItems=[{label:"Posts",used:4.2,total:20,color:C.p},{label:"Mídia",used:8.7,total:20,color:C.ter},{label:"Backups",used:2.1,total:10,color:C.warn},{label:"Logs",used:0.3,total:2,color:C.sec}];
  const perms=[{role:"Admin",create:true,edit:true,delete:true,publish:true,manage:true},{role:"Editor",create:true,edit:true,delete:false,publish:true,manage:false},{role:"Viewer",create:false,edit:false,delete:false,publish:false,manage:false}];
  return(
    <div className="fade-in">
      <div className="tabs">
        {[{id:"users",l:"👥 Usuários"},{id:"perms",l:"🔐 Permissões"},{id:"storage",l:"💾 Armazenamento"},{id:"activity",l:"📋 Atividade"}].map(t=>(
          <div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>
        ))}
      </div>
      {tab==="users"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Convidar</button></div>
          <div className="card">
            <table className="dt">
              <thead><tr><th>Usuário</th><th>E-mail</th><th>Cargo</th><th>Posts</th><th>Status</th><th>Último acesso</th><th></th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:28,height:28,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div><span style={{fontWeight:500}}>{u.name}</span></div></td>
                    <td className="mono" style={{fontSize:11,color:C.onV}}>{u.email}</td>
                    <td><select className="fi fi-sel" defaultValue={u.role} style={{width:110,padding:"3px 8px",fontSize:12,height:"auto"}} onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,role:e.target.value}:x))}><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select></td>
                    <td className="mono" style={{fontWeight:700}}>{u.posts}</td>
                    <td><select className="fi fi-sel" defaultValue={u.status} style={{width:110,padding:"3px 8px",fontSize:12,height:"auto"}} onChange={e=>setUsers(p=>p.map(x=>x.id===u.id?{...x,status:e.target.value}:x))}><option value="active">Ativo</option><option value="inactive">Inativo</option></select></td>
                    <td className="mono" style={{fontSize:11,color:C.onV}}>{u.login}</td>
                    <td><div style={{display:"flex",gap:2}}><button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>showToast("📧 E-mail enviado!")}>📧</button><button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))}>🗑</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dlg&&<Dlg title="Convidar Usuário" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={saveUser}>Convidar</button></>}>
            <Field label="Nome *"><input className="fi" placeholder="João da Silva" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
            <Field label="E-mail *"><input className="fi" type="email" placeholder="joao@empresa.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
            <Field label="Cargo"><select className="fi fi-sel" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select></Field>
          </Dlg>}
        </div>
      )}
      {tab==="perms"&&(
        <div className="card">
          <div className="ch"><span className="ct">🔐 Matriz de Permissões</span></div>
          <div className="cb" style={{paddingTop:4}}>
            <table className="dt">
              <thead><tr><th>Cargo</th><th>Criar</th><th>Editar</th><th>Excluir</th><th>Publicar</th><th>Administrar</th></tr></thead>
              <tbody>{perms.map((p,i)=><tr key={i}><td style={{fontWeight:700}}>{p.role}</td>{["create","edit","delete","publish","manage"].map(k=><td key={k}><span style={{fontSize:16}}>{p[k]?"✅":"❌"}</span></td>)}</tr>)}</tbody>
            </table>
            <div style={{marginTop:12,padding:"9px 12px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC}}>💡 Permissões customizadas por usuário disponíveis no plano Enterprise.</div>
          </div>
        </div>
      )}
      {tab==="storage"&&(
        <div>
          <div style={{display:"flex",gap:12,marginBottom:14}}>
            {[{l:"Total",v:"32 GB"},{l:"Utilizado",v:"15.3 GB"},{l:"Disponível",v:"16.7 GB"},{l:"% Usado",v:"48%"}].map((s,i)=>(
              <div key={i} className={`mc ${["mcp","mcs","mct","mce"][i]}`} style={{flex:1}}><div className="ml">{s.l}</div><div className="mv">{s.v}</div></div>
            ))}
          </div>
          <div className="card">
            <div className="ch"><span className="ct">💾 Uso por Categoria</span></div>
            <div className="cb" style={{paddingTop:6}}>
              {storageItems.map((s,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:600}}>{s.label}</span>
                    <span className="mono" style={{fontSize:12,fontWeight:700,color:s.color}}>{s.used}/{s.total} GB</span>
                  </div>
                  <div className="pb" style={{height:8}}><div className="pbf" style={{width:`${(s.used/s.total)*100}%`,background:s.color}}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="activity"&&(
        <div className="card">
          <div className="ch"><span className="ct">📋 Log de Atividade</span><button className="btn bo bsm">⬇ Exportar</button></div>
          <div style={{padding:"0 4px"}}>
            {[{user:"Ana Lima",action:"Publicou post no WordPress",ts:"09/05 14:32",type:"success"},{user:"Carlos M.",action:"Criou 3 posts via IA",ts:"09/05 13:10",type:"info"},{user:"Sistema",action:"Backup automático concluído",ts:"06/05 02:00",type:"success"},{user:"Ana Lima",action:"Conectou WordPress: Blog Principal",ts:"05/05 10:15",type:"info"},{user:"Carlos M.",action:"Excluiu post rascunho",ts:"04/05 16:44",type:"warning"},{user:"Sistema",action:"Automação #5 disparada",ts:"04/05 09:00",type:"info"},{user:"Juliana Costa",action:"Acesso ao painel admin",ts:"03/05 11:22",type:"info"},{user:"Sistema",action:"Erro de sync: loja.exemplo.com.br",ts:"03/05 07:30",type:"error"}].map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderBottom:i<7?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:{success:C.terC,info:C.pC,warning:C.warnC,error:C.errC}[a.type],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.on,flexShrink:0}}>{a.user[0]}{a.user.split(" ")[1]?.[0]||""}</div>
                <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600}}>{a.user}</span><span style={{fontSize:12,color:C.onV}}> — {a.action}</span></div>
                <div className="mono" style={{fontSize:10,color:C.onV,flexShrink:0}}>{a.ts}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


/* ══ POST TASKS ═══════════════════════════════════════════ */

export default AdminPanel;
