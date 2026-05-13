import { POSTS, PUBLISH_HISTORY, AUTOS, NOTIFS } from './data.js';

  const store = {
    Post: window.__DB_POSTS__||[],
    PostTask:[{id:1,postId:1,title:"Revisar meta description",done:true,assignee:"Ana Lima",due:"10/05/26"},{id:2,postId:1,title:"Adicionar imagens H2",done:false,assignee:"Carlos M.",due:"11/05/26"},{id:3,postId:5,title:"Atualizar CTAs",done:false,assignee:"Ana Lima",due:"12/05/26"}],
    PostVersion:[{id:1,postId:1,version:3,content:"Versão 3 — adicionadas 3 seções H2",savedBy:"Ana Lima",savedAt:"09/05/26 14:00"},{id:2,postId:1,version:2,content:"Versão 2 — revisão SEO",savedBy:"Carlos M.",savedAt:"08/05/26 11:30"},{id:3,postId:1,version:1,content:"Versão 1 — rascunho inicial IA",savedBy:"IA",savedAt:"07/05/26 09:00"}],
    InlineComment:[{id:1,postId:1,text:"Revisar esta frase, muito longa",author:"Carlos M.",position:120,resolved:false,createdAt:"09/05/26 10:00"},{id:2,postId:1,text:"Adicionar fonte aqui",author:"Ana Lima",position:340,resolved:true,createdAt:"08/05/26 15:20"}],
    ProjectTeam:[{id:1,projectId:1,name:"Equipe SEO",members:["Ana Lima","Carlos M."],lead:"Ana Lima"},{id:2,projectId:1,name:"Equipe Conteúdo",members:["Juliana Costa"],lead:"Juliana Costa"}],
    PublishLog:[],
    SocialAccount:[{id:1,platform:"Twitter",handle:"@automatikpost",status:"connected",followers:1240},{id:2,platform:"LinkedIn",handle:"AutomatikPOST",status:"connected",followers:890}],
  };
  return {
    find:(entity,pred)=>(store[entity]||[]).filter(pred||Boolean),
    findOne:(entity,pred)=>(store[entity]||[]).find(pred),
    create:(entity,data)=>{const rec={id:Date.now(),...data};if(!store[entity])store[entity]=[];store[entity].push(rec);return rec;},
    update:(entity,id,patch)=>{const i=(store[entity]||[]).findIndex(r=>r.id===id);if(i>=0)store[entity][i]={...store[entity][i],...patch};return store[entity]?.[i];},
    delete:(entity,id)=>{if(!store[entity])return;store[entity]=store[entity].filter(r=>r.id!==id);},
    count:(entity)=>(store[entity]||[]).length,
  };
})();


/* ══════════════════════════════════════════════════════════
   BACKEND FUNCTIONS  (Deno Functions — simulated)
══════════════════════════════════════════════════════════ */

export default DB;
export { DB };
