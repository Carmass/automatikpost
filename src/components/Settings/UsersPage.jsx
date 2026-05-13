import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { C } from '../../lib/tokens.js';
import { POSTS, WP_SITES, USERS, AUTOS, TEMPLATES, SOURCES, MEDIA, BACKUPS, NOTIFS, CHART_DATA, MONTHS, CATEGORIES_DATA, TAGS_DATA, PUBLISH_HISTORY, RECURRING, COMPETITORS, WEBSTORIES, KANBAN } from '../../lib/data.js';
import { Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field } from '../ui/index.jsx';

function UsersPage({showToast}){
  const[users,setUsers]=useState(USERS);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",email:"",role:"editor"});
  const rCls={admin:"chip cp",editor:"chip ct3",viewer:"chip cn"};
  const save=()=>{if(!form.name||!form.email)return;setUsers(p=>[...p,{id:Date.now(),...form,status:"active",posts:0,login:"nunca"}]);setDlg(false);setForm({name:"",email:"",role:"editor"});showToast("👤 Convite enviado!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Convidar</button></div>
      <div className="card"><table className="dt"><thead><tr><th>Usuário</th><th>E-mail</th><th>Cargo</th><th>Posts</th><th>Status</th><th>Último acesso</th><th></th></tr></thead><tbody>
        {users.map(u=><tr key={u.id}><td><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:30,height:30,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div><span style={{fontWeight:500}}>{u.name}</span></div></td><td className="mono" style={{fontSize:11,color:C.onV}}>{u.email}</td><td><span className={rCls[u.role]||"chip cn"}>{u.role.charAt(0).toUpperCase()+u.role.slice(1)}</span></td><td className="mono" style={{fontWeight:700}}>{u.posts}</td><td><SChip status={u.status}/></td><td className="mono" style={{fontSize:11,color:C.onV}}>{u.login}</td><td><div style={{display:"flex",gap:2}}><button className="ib" style={{width:24,height:24,fontSize:12}}>✏️</button><button className="ib" style={{width:24,height:24,fontSize:12}} onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))}>🗑</button></div></td></tr>)}
      </tbody></table></div>
      {dlg&&<Dlg title="Convidar Usuário" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Enviar Convite</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="João da Silva" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="E-mail *"><input className="fi" type="email" placeholder="joao@empresa.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Field>
        <Field label="Cargo"><select className="fi fi-sel" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option value="admin">Admin — acesso total</option><option value="editor">Editor — criar e editar</option><option value="viewer">Viewer — somente leitura</option></select></Field>
      </Dlg>}
    </div>
  );
}

export default UsersPage;
