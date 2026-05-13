import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ══ TOKENS ══════════════════════════════════════════════ */
const C = {
  bg:"#F3F6FD",s0:"#FFF",s1:"#EEF2FA",s2:"#E3EAF8",s3:"#D8E3F5",
  p:"#1A56DB",pC:"#D9E4FF",onP:"#FFF",onPC:"#001551",
  sec:"#5B6396",secC:"#DFE0FF",onSec:"#FFF",onSecC:"#171B4B",
  ter:"#006B5D",terC:"#BFFFF5",onTer:"#FFF",onTerC:"#002019",
  err:"#BA1A1A",errC:"#FFDAD6",
  ov:"#74777F",ovV:"#C4C6D0",
  on:"#1A1C20",onV:"#44474F",
  warn:"#7A5900",warnC:"#FFDEa9",
  scrim:"rgba(0,0,0,.42)",
  e1:"0 1px 2px rgba(0,0,0,.07),0 1px 3px 1px rgba(0,0,0,.04)",
  e2:"0 1px 2px rgba(0,0,0,.09),0 2px 6px 2px rgba(0,0,0,.07)",
  e3:"0 4px 8px 3px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.09)",
  e4:"0 6px 10px 4px rgba(0,0,0,.07),0 2px 3px rgba(0,0,0,.11)",
};

/* ══ GLOBAL CSS ══════════════════════════════════════════ */
const G=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:${C.bg};color:${C.on};font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;line-height:1.5;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-thumb{background:${C.ovV};border-radius:3px;}::-webkit-scrollbar-track{background:transparent;}
.app{display:flex;min-height:100vh;}
.rail{width:72px;background:${C.s0};border-right:1px solid ${C.ovV};display:flex;flex-direction:column;padding:10px 0;position:fixed;top:0;left:0;bottom:0;z-index:30;transition:width .25s cubic-bezier(.2,0,0,1);overflow:hidden;}
.rail-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:4px;}
.rail-scroll::-webkit-scrollbar{width:3px;}
.rail-scroll::-webkit-scrollbar-thumb{background:${C.ovV};border-radius:3px;}
.rail-scroll::-webkit-scrollbar-track{background:transparent;}
.rail.open{width:252px;}
.rl{padding:6px 12px 16px;display:flex;align-items:center;gap:10px;overflow:hidden;}
.li{width:38px;height:38px;border-radius:10px;background:${C.p};display:flex;align-items:center;justify-content:center;color:${C.onP};font-weight:800;font-size:15px;flex-shrink:0;}
.lt{font-size:15px;font-weight:800;white-space:nowrap;opacity:0;transition:opacity .18s .04s;}
.rail.open .lt{opacity:1;}
.rsec{width:100%;padding:1px 0;}
.rsl{font-size:10px;font-weight:700;color:${C.ov};letter-spacing:.8px;text-transform:uppercase;padding:7px 14px 2px;white-space:nowrap;opacity:0;transition:opacity .15s;}
.rail.open .rsl{opacity:1;}
.rdiv{width:calc(100% - 20px);height:1px;background:${C.ovV};margin:3px 10px;}
.ni{display:flex;align-items:center;gap:10px;padding:0 10px;height:44px;border-radius:999px;cursor:pointer;transition:all .18s cubic-bezier(.2,0,0,1);width:50px;overflow:hidden;margin:1px 10px;}
.rail.open .ni{width:calc(100% - 20px);}
.ni:hover{background:${C.s2};}
.ni.a{background:${C.pC};}
.niw{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.nl{font-size:12px;font-weight:500;color:${C.onV};white-space:nowrap;opacity:0;transition:opacity .14s .04s;}
.rail.open .nl{opacity:1;}
.ni.a .nl{color:${C.onPC};font-weight:700;}
.nbadge{margin-left:auto;font-size:9px;font-weight:700;background:${C.err};color:#fff;border-radius:999px;padding:1px 6px;white-space:nowrap;opacity:0;transition:opacity .14s;}
.rail.open .nbadge{opacity:1;}
.main{margin-left:72px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left .25s cubic-bezier(.2,0,0,1);}
.main.ro{margin-left:252px;}
.tb{height:58px;background:${C.s0};border-bottom:1px solid ${C.ovV};display:flex;align-items:center;padding:0 14px 0 18px;gap:8px;position:sticky;top:0;z-index:20;box-shadow:${C.e1};}
.tbt{font-size:16px;font-weight:700;flex:1;}
.ib{width:34px;height:34px;border-radius:999px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;color:${C.onV};transition:background .14s;flex-shrink:0;}
.ib:hover{background:${C.s2};}
.card{background:${C.s0};border-radius:16px;box-shadow:${C.e1};overflow:hidden;}
.ch{padding:14px 18px 6px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;}
.ct{font-size:13px;font-weight:700;}
.cb{padding:0 18px 14px;}
.mg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
.mc{border-radius:16px;padding:16px 18px;cursor:pointer;transition:filter .14s;}
.mc:hover{filter:brightness(.97);}
.mc .ml{font-size:10px;font-weight:700;letter-spacing:.5px;margin-bottom:8px;text-transform:uppercase;opacity:.7;}
.mc .mv{font-size:26px;font-weight:800;line-height:1;margin-bottom:4px;}
.mc .md{font-size:11px;font-weight:500;opacity:.75;}
.mcp{background:${C.pC};color:${C.onPC};}.mcs{background:${C.secC};color:${C.onSecC};}.mct{background:${C.terC};color:${C.onTerC};}.mce{background:${C.errC};color:#690005;}
.chip{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:8px;font-size:11px;font-weight:600;line-height:1.4;white-space:nowrap;}
.cp{background:${C.pC};color:${C.onPC};}.cs{background:${C.secC};color:${C.onSecC};}.ct3{background:${C.terC};color:${C.onTerC};}.ce{background:${C.errC};color:${C.err};}.cn{background:${C.s2};color:${C.onV};}.cw{background:${C.warnC};color:${C.warn};}.co{background:transparent;border:1px solid ${C.ovV};color:${C.onV};}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;border:none;line-height:1;transition:all .15s;white-space:nowrap;}
.bf{background:${C.p};color:${C.onP};box-shadow:${C.e1};}.bf:hover{filter:brightness(1.07);box-shadow:${C.e2};}
.bt{background:${C.pC};color:${C.onPC};}.bt:hover{background:#c5d6ff;}
.bo{background:transparent;border:1px solid ${C.ovV};color:${C.p};}.bo:hover{background:${C.pC};}
.bx{background:transparent;color:${C.p};padding:6px 10px;}.bx:hover{background:${C.pC};}
.ber{background:${C.errC};color:${C.err};}
.bsm{padding:5px 13px;font-size:12px;}
.btn:disabled{opacity:.4;pointer-events:none;}
.fld{margin-bottom:12px;}
.fl{font-size:11px;font-weight:700;color:${C.onV};margin-bottom:4px;display:block;letter-spacing:.2px;text-transform:uppercase;}
.fi{width:100%;background:${C.s1};border:1.5px solid ${C.ovV};border-radius:10px;padding:9px 12px;font-size:13px;color:${C.on};font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border .14s,box-shadow .14s;}
.fi:focus{border-color:${C.p};box-shadow:0 0 0 3px ${C.pC};}
.fi::placeholder{color:#bbb;}
.fi-sel{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2374777F' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center;}
.fi-ta{resize:vertical;min-height:78px;line-height:1.6;}
.tabs{display:flex;border-bottom:2px solid ${C.ovV};margin-bottom:16px;overflow-x:auto;}
.tabi{padding:9px 16px;font-size:13px;font-weight:600;color:${C.onV};cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap;flex-shrink:0;}
.tabi:hover{color:${C.p};}.tabi.a{color:${C.p};border-bottom-color:${C.p};}
.tcnt{font-size:10px;background:${C.s2};color:${C.onV};border-radius:999px;padding:1px 5px;font-weight:700;}
.tabi.a .tcnt{background:${C.pC};color:${C.onPC};}
.dt{width:100%;border-collapse:collapse;}
.dt th{font-size:11px;font-weight:700;color:${C.onV};padding:10px 13px;text-align:left;border-bottom:2px solid ${C.ovV};letter-spacing:.4px;text-transform:uppercase;background:${C.s1};}
.dt td{padding:10px 13px;border-bottom:1px solid ${C.ovV};font-size:13px;vertical-align:middle;}
.dt tr:last-child td{border-bottom:none;}.dt tr:hover td{background:${C.s1};}
.pb{height:5px;border-radius:999px;background:${C.s2};overflow:hidden;}
.pbf{height:100%;border-radius:999px;transition:width .55s ease;}
.tw{width:44px;height:24px;position:relative;cursor:pointer;flex-shrink:0;}
.tt{position:absolute;inset:0;border-radius:999px;background:${C.ovV};transition:background .18s;}
.tt.on{background:${C.p};}
.tth{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:${C.e2};transition:transform .18s cubic-bezier(.2,0,0,1);}
.tt.on .tth{transform:translateX(20px);}
.kb{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;}
.kc{background:${C.s1};border-radius:14px;padding:12px;min-width:200px;flex-shrink:0;}
.kch{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.kct{font-size:12px;font-weight:700;}
.kcc{font-size:10px;font-weight:700;background:${C.s2};color:${C.onV};border-radius:999px;padding:1px 7px;}
.kkc{background:${C.s0};border-radius:10px;padding:11px;margin-bottom:7px;cursor:pointer;box-shadow:${C.e1};transition:all .14s;}
.kkc:hover{box-shadow:${C.e2};transform:translateY(-1px);}
.kadd{width:100%;padding:7px;border:1.5px dashed ${C.ovV};border-radius:10px;background:transparent;cursor:pointer;font-size:12px;color:${C.onV};font-family:'Plus Jakarta Sans',sans-serif;transition:all .14s;}
.kadd:hover{border-color:${C.p};color:${C.p};}
.dlgb{position:fixed;inset:0;background:${C.scrim};z-index:100;display:flex;align-items:center;justify-content:center;animation:fdi .18s ease;}
.dlg{background:${C.s0};border-radius:24px;width:540px;max-width:95vw;max-height:92vh;overflow-y:auto;box-shadow:${C.e4};}
.dlg-wide{width:760px;max-width:96vw;}
.dlgh{padding:20px 22px 0;display:flex;align-items:center;justify-content:space-between;}
.dlgt{font-size:17px;font-weight:800;}
.dlgbd{padding:14px 22px;}
.dlgft{padding:0 22px 18px;display:flex;justify-content:flex-end;gap:9px;}
.toast{position:fixed;bottom:82px;right:22px;background:${C.on};color:${C.s0};border-radius:12px;padding:12px 18px;font-size:13px;font-weight:500;z-index:200;display:flex;align-items:center;gap:9px;box-shadow:${C.e4};animation:ti .28s cubic-bezier(.2,0,0,1);}
@keyframes ti{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
.fab{position:fixed;bottom:22px;right:22px;z-index:50;height:50px;padding:0 18px;border-radius:14px;background:${C.p};color:${C.onP};border:none;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:${C.e3};transition:all .18s cubic-bezier(.2,0,0,1);}
.fab:hover{box-shadow:${C.e4};transform:translateY(-2px);}
.np{position:absolute;right:12px;top:62px;background:${C.s0};border:1px solid ${C.ovV};border-radius:14px;width:310px;box-shadow:${C.e4};z-index:40;animation:fdi .2s ease;}
.aio{background:${C.s1};border:1.5px solid ${C.ovV};border-radius:14px;padding:16px;font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:380px;overflow-y:auto;}
.cur{display:inline-block;width:2px;height:13px;background:${C.p};animation:bl .8s infinite;vertical-align:middle;border-radius:1px;}
@keyframes bl{0%,100%{opacity:1}50%{opacity:0}}
.stps{display:flex;margin-bottom:20px;}
.sti{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;}
.sti::before{content:'';position:absolute;top:14px;right:50%;width:100%;height:2px;background:${C.ovV};}
.sti:first-child::before{display:none;}
.stc{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;z-index:1;border:2px solid ${C.ovV};background:${C.s0};}
.stc.done{background:${C.p};color:${C.onP};border-color:${C.p};}.stc.act{color:${C.p};border-color:${C.p};}.stc.idle{color:${C.onV};}
.stl{font-size:9px;margin-top:4px;color:${C.onV};font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.spinner{width:15px;height:15px;border:2px solid ${C.pC};border-top-color:${C.p};border-radius:50%;animation:sp .8s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.fade-in{animation:fdi .2s ease;}
@keyframes fdi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.three{display:grid;grid-template-columns:2fr 1fr;gap:14px;}
.pg{padding:20px 22px;max-width:1280px;}
.mono{font-family:'JetBrains Mono',monospace;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 20px;color:${C.onV};}
.rtb{display:flex;gap:2px;padding:7px;border-bottom:1px solid ${C.ovV};flex-wrap:wrap;}
.rtb button{padding:4px 8px;border:none;background:transparent;border-radius:5px;cursor:pointer;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;color:${C.onV};transition:background .12s;}
.rtb button:hover,.rtb button.on{background:${C.pC};color:${C.onPC};}
.rtb-div{width:1px;height:18px;background:${C.ovV};margin:0 3px;align-self:center;}
.fi-rich{background:${C.s1};border:1.5px solid ${C.ovV};border-radius:10px;min-height:200px;padding:12px;font-size:13px;line-height:1.8;outline:none;overflow-y:auto;}
.fi-rich:focus{border-color:${C.p};box-shadow:0 0 0 3px ${C.pC};}
/* Onboarding */
.ob{position:fixed;inset:0;background:${C.bg};z-index:200;display:flex;align-items:center;justify-content:center;}
.ob-card{background:${C.s0};border-radius:24px;width:560px;max-width:95vw;padding:40px;box-shadow:${C.e4};text-align:center;}
.ob-ico{font-size:54px;margin-bottom:18px;}
.ob-prog{display:flex;gap:6px;justify-content:center;margin-bottom:30px;}
.ob-dot{width:8px;height:8px;border-radius:50%;background:${C.ovV};transition:all .2s;}
.ob-dot.a{background:${C.p};width:22px;border-radius:4px;}
/* Color swatches */
.sw{width:20px;height:20px;border-radius:5px;cursor:pointer;border:2px solid transparent;transition:border .14s;}
.sw.sel{border-color:${C.on};}
/* Mini sparkline */
.spark{display:flex;align-items:flex-end;gap:2px;height:32px;}
.spark-b{flex:1;border-radius:2px 2px 0 0;transition:height .4s ease;}
/* Timeline */
.tl-item{display:flex;gap:12px;padding:10px 0;}
.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.tl-line{position:absolute;left:4px;top:14px;bottom:0;width:2px;background:${C.ovV};}
/* Stat row */
.sr{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid ${C.ovV};}
.sr:last-child{border-bottom:none;}
/* Category tag */
.cat-tag{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;transition:all .14s;}
`;

/* ══ DATA ════════════════════════════════════════════════ */
const POSTS=[
  {id:1,title:"10 Estratégias de SEO para 2026 que Você Precisa Conhecer",status:"published",date:"09/05/26",score:94,cat:"SEO",views:12400,author:"Ana Lima",wp:"Blog Principal",tags:["seo","2026"],bounce:42,avgTime:"4m12s",conversions:87},
  {id:2,title:"Como Usar IA para Triplicar sua Produção de Conteúdo",status:"scheduled",date:"11/05/26",score:88,cat:"IA",views:0,author:"Carlos M.",wp:"Blog Principal",tags:["ia","produção"],bounce:0,avgTime:"—",conversions:0},
  {id:3,title:"WordPress vs Headless CMS: Qual Escolher em 2026?",status:"draft",date:"—",score:72,cat:"CMS",views:0,author:"Ana Lima",wp:"—",tags:["wordpress","cms"],bounce:0,avgTime:"—",conversions:0},
  {id:4,title:"Guia Completo de Link Building para Iniciantes",status:"processing",date:"—",score:0,cat:"SEO",views:0,author:"IA",wp:"—",tags:[],bounce:0,avgTime:"—",conversions:0},
  {id:5,title:"E-mail Marketing: Táticas Avançadas de Segmentação",status:"published",date:"07/05/26",score:91,cat:"Email",views:9800,author:"Carlos M.",wp:"Portal Notícias",tags:["email"],bounce:38,avgTime:"3m55s",conversions:64},
  {id:6,title:"React 19: O que Muda na Arquitetura de Componentes",status:"published",date:"05/05/26",score:86,cat:"Dev",views:7200,author:"Ana Lima",wp:"Blog Principal",tags:["react"],bounce:51,avgTime:"5m08s",conversions:31},
  {id:7,title:"Funil de Conversão: Como Otimizar Cada Etapa",status:"draft",date:"—",score:65,cat:"CRO",views:0,author:"IA",wp:"—",tags:["funil"],bounce:0,avgTime:"—",conversions:0},
  {id:8,title:"Inteligência Artificial no E-commerce em 2026",status:"published",date:"02/05/26",score:90,cat:"IA",views:5100,author:"Carlos M.",wp:"Blog Principal",tags:["ia","ecommerce"],bounce:44,avgTime:"3m30s",conversions:42},
];

const KANBAN={
  "📋 Backlog":[{id:101,title:"Artigo sobre LLMs no Marketing",tag:"IA",pri:"high",due:"15/05",assignee:"Ana"},{id:102,title:"Comparativo SEO tools 2026",tag:"SEO",pri:"med",due:"20/05",assignee:"Carlos"},{id:103,title:"Guia SERP features",tag:"SEO",pri:"low",due:"25/05",assignee:"—"}],
  "✍️ Produção":[{id:104,title:"Guia de automação de conteúdo",tag:"Auto",pri:"high",due:"12/05",assignee:"Ana"},{id:105,title:"Case: 0 a 100k visitas",tag:"Case",pri:"med",due:"18/05",assignee:"Carlos"}],
  "👀 Revisão":[{id:106,title:"Top 10 plugins WP 2026",tag:"WP",pri:"low",due:"10/05",assignee:"Ana"}],
  "✅ Publicado":[{id:107,title:"SEO para e-commerce",tag:"SEO",pri:"low",due:"—",assignee:"Carlos"},{id:108,title:"Email automation com IA",tag:"Email",pri:"med",due:"—",assignee:"Ana"}],
};

const WP_SITES=[
  {id:1,name:"Blog Principal",url:"blog.exemplo.com.br",status:"online",posts:247,sync:"há 5min",ver:"6.5",plugin:true,user:"admin"},
  {id:2,name:"Portal de Notícias",url:"noticias.exemplo.com.br",status:"online",posts:1823,sync:"há 23min",ver:"6.4",plugin:false,user:"editor"},
  {id:3,name:"Loja E-commerce",url:"loja.exemplo.com.br",status:"warning",posts:91,sync:"há 2h",ver:"6.3",plugin:false,user:"admin"},
  {id:4,name:"Site Institucional",url:"empresa.exemplo.com.br",status:"offline",posts:34,sync:"há 1d",ver:"6.2",plugin:false,user:"admin"},
];

const AUTOS=[
  {id:1,name:"Auto-publicar no WordPress",trigger:"Post marcado como Pronto",runs:142,last:"há 12min",active:true,cat:"Publicação"},
  {id:2,name:"Gerar variações para redes sociais",trigger:"Publicação bem-sucedida",runs:98,last:"há 1h",active:true,cat:"Social"},
  {id:3,name:"Alerta de prazo iminente",trigger:"48h antes do deadline",runs:34,last:"há 2d",active:false,cat:"Notificação"},
  {id:4,name:"Backup automático semanal",trigger:"Segunda-feira, 02:00",runs:52,last:"há 3d",active:true,cat:"Sistema"},
  {id:5,name:"SEO audit pós-publicação",trigger:"Post publicado",runs:211,last:"há 15min",active:true,cat:"SEO"},
  {id:6,name:"Relatório semanal",trigger:"Sexta-feira, 18:00",runs:12,last:"há 5d",active:false,cat:"Analytics"},
];

const TEMPLATES=[
  {id:1,name:"Artigo SEO Longo",desc:"2000+ palavras com H2/H3, FAQs e CTA",tags:["SEO","Blog"],uses:47,prompt:"Crie um artigo SEO longo sobre {tema} com: título H1 otimizado, introdução persuasiva, 4 seções H2, FAQ com 5 perguntas e CTA forte. Nicho: {nicho}. Tom: {tom}."},
  {id:2,name:"Tutorial Passo a Passo",desc:"Guia estruturado com intro, passos e conclusão",tags:["Tutorial"],uses:31,prompt:"Escreva um tutorial detalhado sobre {tema}. Inclua: contexto, pré-requisitos, passos numerados com explicações, dicas de expert e próximos passos."},
  {id:3,name:"Comparativo",desc:"Tabela, pros/cons e veredito final",tags:["Review","CRO"],uses:22,prompt:"Crie um comparativo completo sobre {tema}: overview, tabela de features, pros/cons de cada opção, critérios de escolha e veredito."},
  {id:4,name:"Newsletter",desc:"Destaques + dica + recurso + CTA",tags:["Email"],uses:18,prompt:"Redija uma newsletter sobre {tema}: saudação, 3 destaques, dica prática, recurso recomendado e CTA."},
  {id:5,name:"Case Study",desc:"Problema → solução → resultados métricas",tags:["Case"],uses:14,prompt:"Escreva case study sobre {tema}: contexto, desafio, estratégia, execução, resultados com métricas e lições."},
  {id:6,name:"Listicle",desc:"Lista numerada com insights acionáveis",tags:["Blog","SEO"],uses:38,prompt:"Crie listicle sobre {tema} com 10 itens. Cada um: título, 2 parágrafos, exemplo e insight acionável."},
];

const SOURCES=[
  {id:1,name:"TechCrunch",type:"RSS",url:"techcrunch.com/feed",active:true,items:34,fetch:"há 1h"},
  {id:2,name:"Canal YouTube IA",type:"YouTube",url:"youtube.com/@canal-ia",active:true,items:12,fetch:"há 3h"},
  {id:3,name:"Keywords Semrush",type:"Keyword",url:"—",active:false,items:0,fetch:"—"},
  {id:4,name:"Blog Concorrente A",type:"Scraper",url:"concorrente.com/blog",active:true,items:8,fetch:"há 6h"},
];

const USERS=[
  {id:1,name:"Ana Lima",email:"ana@empresa.com",role:"admin",status:"active",posts:89,login:"há 2min"},
  {id:2,name:"Carlos Mendes",email:"carlos@empresa.com",role:"editor",status:"active",posts:61,login:"há 1h"},
  {id:3,name:"Juliana Costa",email:"juliana@empresa.com",role:"editor",status:"active",posts:34,login:"há 3h"},
  {id:4,name:"Rafael Souza",email:"rafael@empresa.com",role:"viewer",status:"inactive",posts:0,login:"há 7d"},
];

const MEDIA=[
  {id:1,name:"hero-seo-2026.jpg",type:"image",size:"245 KB",date:"09/05",used:3},
  {id:2,name:"ia-producao.png",type:"image",size:"189 KB",date:"08/05",used:1},
  {id:3,name:"guia-linkbuilding.pdf",type:"pdf",size:"1.2 MB",date:"07/05",used:2},
  {id:4,name:"tutorial-wp.mp4",type:"video",size:"45 MB",date:"06/05",used:0},
  {id:5,name:"email-thumb.jpg",type:"image",size:"98 KB",date:"05/05",used:1},
];

const BACKUPS=[
  {id:1,name:"backup-mai-2026",date:"06/05 02:00",posts:247,size:"12.4 MB",type:"auto",status:"ok"},
  {id:2,name:"backup-abr-2026",date:"29/04 02:00",posts:231,size:"11.8 MB",type:"auto",status:"ok"},
  {id:3,name:"backup-manual-migracao",date:"20/04 15:30",posts:228,size:"11.5 MB",type:"manual",status:"ok"},
];

const NOTIFS=[
  {id:1,ico:"📤",text:"Post \"10 Estratégias de SEO\" publicado com sucesso",time:"há 12min",read:false,type:"success"},
  {id:2,ico:"⚡",text:"Automação #5: SEO audit concluído",time:"há 15min",read:false,type:"info"},
  {id:3,ico:"⚠️",text:"Sync falhou: loja.exemplo.com.br",time:"há 2h",read:false,type:"warning"},
  {id:4,ico:"✨",text:"8 ideias geradas pelo Produtor IA",time:"há 3h",read:true,type:"info"},
  {id:5,ico:"💾",text:"Backup automático concluído: 12.4 MB",time:"há 3d",read:true,type:"success"},
];

const CHART_DATA=[18,34,22,48,31,57,42,63,55,78,65,82];
const MONTHS=["Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar","Abr","Mai"];

const CATEGORIES_DATA=[
  {id:1,name:"SEO",slug:"seo",color:"#1A56DB",posts:89,icon:"🔍"},
  {id:2,name:"IA & Automação",slug:"ia-automacao",color:"#006B5D",posts:67,icon:"🤖"},
  {id:3,name:"Email Marketing",slug:"email-marketing",color:"#7A5900",posts:34,icon:"📧"},
  {id:4,name:"WordPress",slug:"wordpress",color:"#5B6396",posts:28,icon:"⊞"},
  {id:5,name:"Desenvolvimento",slug:"dev",color:"#BA1A1A",posts:19,icon:"💻"},
  {id:6,name:"CRO",slug:"cro",color:"#006B5D",posts:12,icon:"🎯"},
];

const TAGS_DATA=[
  {id:1,name:"seo",posts:89,color:"#1A56DB"},{id:2,name:"2026",posts:45,color:"#5B6396"},
  {id:3,name:"ia",posts:67,color:"#006B5D"},{id:4,name:"wordpress",posts:28,color:"#7A5900"},
  {id:5,name:"marketing",posts:52,color:"#BA1A1A"},{id:6,name:"automação",posts:34,color:"#1A56DB"},
  {id:7,name:"email",posts:34,color:"#006B5D"},{id:8,name:"conteúdo",posts:91,color:"#5B6396"},
  {id:9,name:"react",posts:12,color:"#BA1A1A"},{id:10,name:"funil",posts:8,color:"#7A5900"},
];

const PUBLISH_HISTORY=[
  {id:1,title:"10 Estratégias de SEO para 2026",wp:"Blog Principal",date:"09/05/26 14:32",status:"success",type:"publicado",id_wp:247},
  {id:2,title:"E-mail Marketing: Táticas de Segmentação",wp:"Portal Notícias",date:"07/05/26 09:15",status:"success",type:"publicado",id_wp:1823},
  {id:3,title:"React 19: Nova Arquitetura",wp:"Blog Principal",date:"05/05/26 10:00",status:"success",type:"publicado",id_wp:246},
  {id:4,title:"Guia Headless CMS",wp:"Blog Principal",date:"03/05/26 11:22",status:"error",type:"falhou",id_wp:null},
  {id:5,title:"IA no E-commerce",wp:"Blog Principal",date:"02/05/26 09:00",status:"success",type:"publicado",id_wp:245},
  {id:6,title:"Funil de Vendas B2B",wp:"Portal Notícias",date:"30/04/26 15:45",status:"success",type:"agendado",id_wp:1820},
];

const RECURRING=[
  {id:1,name:"SEO Semanal",template:"Artigo SEO Longo",freq:"Toda segunda",time:"09:00",wp:"Blog Principal",active:true,generated:12,next:"12/05/26"},
  {id:2,name:"Newsletter Mensal",template:"Newsletter",freq:"1º dia do mês",time:"08:00",wp:"Portal Notícias",active:true,generated:3,next:"01/06/26"},
  {id:3,name:"Tutorial Quinzenal",template:"Tutorial Passo a Passo",freq:"A cada 14 dias",time:"10:00",wp:"Blog Principal",active:false,generated:6,next:"—"},
];

const COMPETITORS=[
  {id:1,name:"Alpha Blog",url:"alpha.com.br",da:58,posts:312,freq:"5×/sem",topics:["SEO","Marketing"],traffic:"180K"},
  {id:2,name:"Beta Digital",url:"betadigital.com.br",da:71,posts:891,freq:"2×/dia",topics:["IA","Tech"],traffic:"420K"},
  {id:3,name:"Gamma Content",url:"gamma.com.br",da:44,posts:156,freq:"3×/sem",topics:["Email","CRO"],traffic:"95K"},
];

const WEBSTORIES=[
  {id:1,title:"5 Dicas de SEO para 2026",slides:5,status:"published",views:3420,date:"08/05"},
  {id:2,title:"Como IA muda o marketing",slides:7,status:"draft",views:0,date:"—"},
  {id:3,title:"WordPress em 60 segundos",slides:4,status:"published",views:1890,date:"05/05"},
];

/* ══ SHARED COMPONENTS ═══════════════════════════════════ */
function Ring({score,size=36}){
  const r=13,ci=2*Math.PI*r;
  const col=score>=85?C.ter:score>=65?C.warn:score>0?C.err:C.ovV;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 32 32" style={{transform:"rotate(-90deg)"}}>
        <circle cx="16" cy="16" r={r} fill="none" stroke={C.s2} strokeWidth="3"/>
        <circle cx="16" cy="16" r={r} fill="none" stroke={col} strokeWidth="3" strokeDasharray={`${(score/100)*ci} ${ci}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:col}}>{score||"—"}</div>
    </div>
  );
}
function Tog({on,onChange}){
  return <div className="tw" onClick={()=>onChange(!on)}><div className={`tt${on?" on":""}`}><div className="tth"/></div></div>;
}
function SChip({status}){
  const m={published:["chip ct3","Publicado"],scheduled:["chip cp","Agendado"],draft:["chip cn","Rascunho"],processing:["chip cs","Processando"],active:["chip ct3","Ativo"],inactive:["chip ce","Inativo"],ok:["chip ct3","OK"],warning:["chip cw","Aviso"],online:["chip ct3","Online"],offline:["chip ce","Offline"],success:["chip ct3","Sucesso"],error:["chip ce","Falhou"],agendado:["chip cp","Agendado"],publicado:["chip ct3","Publicado"],falhou:["chip ce","Falhou"],manual:["chip cs","Manual"],auto:["chip cp","Auto"]};
  const[cls,lbl]=m[status]||["chip cn",status];
  return <span className={cls}>{lbl}</span>;
}
function Bar({data,labels,color=C.p,h=90}){
  const mx=Math.max(...data);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:h}}>
      {data.map((v,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,height:"100%",justifyContent:"flex-end"}}>
          <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:i===data.length-1?color:`${color}50`,height:`${(v/mx)*(h-13)}px`,transition:"height .5s"}}/>
          <div style={{fontSize:8,color:C.onV,fontFamily:"'JetBrains Mono',monospace"}}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
function Spark({data,color=C.p}){
  const mx=Math.max(...data);
  return(
    <div className="spark">
      {data.map((v,i)=><div key={i} className="spark-b" style={{height:`${(v/mx)*28}px`,background:i===data.length-1?color:`${color}55`,width:"100%"}}/>)}
    </div>
  );
}
function Empty({ico,title,sub,action,onAction}){
  return(
    <div className="empty">
      <div style={{fontSize:40,marginBottom:12,opacity:.4}}>{ico}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:5,color:C.on}}>{title}</div>
      <div style={{fontSize:12,textAlign:"center",maxWidth:270,lineHeight:1.6}}>{sub}</div>
      {action&&<button className="btn bf bsm" style={{marginTop:14}} onClick={onAction}>{action}</button>}
    </div>
  );
}
function Dlg({title,onClose,children,footer,wide}){
  return(
    <div className="dlgb" onClick={onClose}>
      <div className={`dlg${wide?" dlg-wide":""}`} onClick={e=>e.stopPropagation()}>
        <div className="dlgh"><span className="dlgt">{title}</span><button className="ib" onClick={onClose}>✕</button></div>
        <div className="dlgbd">{children}</div>
        {footer&&<div className="dlgft">{footer}</div>}
      </div>
    </div>
  );
}
function Field({label,children}){
  return <div className="fld"><label className="fl">{label}</label>{children}</div>;
}

/* ══ ONBOARDING ══════════════════════════════════════════ */
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

/* ══ SEO ANALYZER ════════════════════════════════════════ */
function SEOAnalyzer({content,keyword}){
  const checks=useMemo(()=>{
    const txt=(content||"").toLowerCase();
    const kw=(keyword||"").toLowerCase();
    return[
      {l:"Palavra-chave no título H1",ok:kw&&txt.split("\n")[0]?.includes(kw),w:20},
      {l:"Comprimento adequado (>800 chars)",ok:content&&content.length>800,w:15},
      {l:"Subtítulos H2 presentes",ok:txt.includes("##"),w:10},
      {l:"Meta description definida",ok:txt.includes("meta"),w:15},
      {l:"Keyword density 1-3%",ok:kw&&txt.split(kw).length>2,w:15},
      {l:"Links presentes",ok:txt.includes("http")||txt.includes("["),w:10},
      {l:"Imagem de destaque",ok:false,w:10},
      {l:"URL amigável configurada",ok:true,w:5},
    ];
  },[content,keyword]);
  const sc=checks.reduce((s,c)=>s+(c.ok?c.w:0),0);
  const col=sc>=80?C.ter:sc>=60?C.warn:C.err;
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12,padding:"11px 13px",background:C.s1,borderRadius:11}}>
        <Ring score={sc} size={50}/>
        <div>
          <div style={{fontSize:17,fontWeight:800,color:col}}>{sc}/100</div>
          <div style={{fontSize:12,color:C.onV}}>{sc>=80?"Excelente!":sc>=60?"Bom — pode melhorar":"Atenção necessária"}</div>
        </div>
      </div>
      {checks.map((c,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:i<checks.length-1?`1px solid ${C.ovV}`:"none"}}>
          <span style={{fontSize:13}}>{c.ok?"✅":"⚠️"}</span>
          <span style={{fontSize:12,flex:1,color:c.ok?C.on:C.onV}}>{c.l}</span>
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>+{c.w}</span>
        </div>
      ))}
    </div>
  );
}

/* ══ POST EDITOR ═════════════════════════════════════════ */
function PostEditor({post,onBack,showToast,go}){
  const[title,setTitle]=useState(post?.title||"");
  const[content,setContent]=useState(post?.content||"");
  const[keyword,setKeyword]=useState(post?.keyword||"");
  const[metaDesc,setMetaDesc]=useState(post?.metaDesc||"");
  const[cat,setCat]=useState(post?.cat||"SEO");
  const[tab,setTab]=useState("write");
  const[saving,setSaving]=useState(false);
  const[publishing,setPublishing]=useState(false);
  const[pubDlg,setPubDlg]=useState(false);
  const[socialVars,setSocialVars]=useState(null);
  const[genVars,setGenVars]=useState(false);
  const[genTitles,setGenTitles]=useState(false);
  const[titleSugs,setTitleSugs]=useState([]);
  const[genMeta,setGenMeta]=useState(false);
  const[tasks,setTasks]=useState([{id:1,title:"Revisar meta description",done:false},{id:2,title:"Adicionar imagem de destaque",done:false},{id:3,title:"Verificar links internos",done:false}]);
  const[taskInput,setTaskInput]=useState("");
  const[versions,setVersions]=useState([{id:1,version:1,content:"Rascunho inicial",savedBy:"IA",savedAt:"Hoje 09:00"}]);
  const[comments,setComments]=useState([]);
  const[commentInput,setCommentInput]=useState("");
  const contentRef=useRef(null);

  const save=async()=>{
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    setVersions(p=>[{id:Date.now(),version:p.length+1,content:title||"Sem título",savedBy:"Ana Lima",savedAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})},
      ...p]);
    setSaving(false);
    showToast("💾 Post salvo! Nova versão criada.");
  };

  const publish=async()=>{
    setPubDlg(false);setPublishing(true);
    try{
      const result=await Backend.publishToWordPress({siteUrl:"blog.exemplo.com.br",user:"admin",appPassword:"app_xxx",post:{id:post?.id||Date.now(),title}});
      showToast(`📤 Publicado! WP ID: ${result.wpId}`);
      await Backend.notifyPublishedTask({postId:post?.id||1,publishedBy:"Ana Lima"});
    }catch(e){showToast("❌ Erro ao publicar: "+e.message);}
    setPublishing(false);
  };

  const doGenTitles=async()=>{
    if(!keyword.trim()&&!title.trim())return;
    setGenTitles(true);setTitleSugs([]);
    try{
      const r=await Backend.generateOptimizedTitles({topic:keyword||title,niche:cat,count:5});
      setTitleSugs(r.titles||[]);
    }catch{setTitleSugs(["Erro ao gerar. Verifique a conexão."]);}
    setGenTitles(false);
  };

  const doGenMeta=async()=>{
    if(!title.trim())return;
    setGenMeta(true);
    try{
      const r=await Backend.generateOptimizedMeta({title,keyword});
      setMetaDesc(r.metaDescription||"");
      showToast("✅ Meta description gerada!");
    }catch{showToast("❌ Erro ao gerar meta.");}
    setGenMeta(false);
  };

  const genVarsAI=async()=>{
    setGenVars(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`Com base no título: "${title||"Novo Post"}", crie variações para redes sociais. Responda SOMENTE em JSON:\n{"twitter":"(max 280 chars com emojis)","linkedin":"(2 parágrafos profissionais)","instagram":"(legenda com emojis e 5 hashtags)"}`}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setSocialVars(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setSocialVars({twitter:"🚀 "+title,linkedin:title+" — novo artigo no blog.",instagram:"✨ "+title+"\n\n#blog #conteudo #marketing #digital #dicas"});}
    setGenVars(false);setTab("social");
  };

  const fmt=cmd=>document.execCommand(cmd,false,null);
  const doneTasks=tasks.filter(t=>t.done).length;

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14,flexWrap:"wrap"}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <span style={{fontSize:14,fontWeight:700,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{title||"Novo Post"}</span>
        <SChip status="draft"/>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          <button className="ib" title="Tarefas" onClick={()=>setTab("tasks")} style={{position:"relative"}}>
            ✅{doneTasks<tasks.length&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:C.warn}}/>}
          </button>
          <button className="ib" title="Versões" onClick={()=>setTab("versions")}>🕐</button>
          <button className="ib" title="Comentários" onClick={()=>setTab("comments")}>💬{comments.filter(c=>!c.resolved).length>0&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:C.err}}/>}</button>
          <button className="ib" title="Publicação multicanal" onClick={()=>go&&go("multichannel",post)}>📡</button>
        </div>
        <button className="btn bt bsm" onClick={save} disabled={saving}>{saving?<><div className="spinner"/>Salvando...</>:"💾 Salvar"}</button>
        <button className="btn bf bsm" onClick={()=>setPubDlg(true)} disabled={publishing}>{publishing?<><div className="spinner"/>Publicando...</>:"📤 Publicar"}</button>
      </div>
      <div className="tabs" style={{flexWrap:"wrap"}}>
        {[["write","✍️ Escrever"],["seo","🔍 SEO"],["social","📱 Social"],["preview","👁 Preview"],["settings","⚙️ Config"],["tasks","✅ Tarefas"],["versions","🕐 Versões"],["comments","💬 Notas"]].map(([id,label])=>(
          <div key={id} className={`tabi ${tab===id?"a":""}`} onClick={()=>setTab(id)}>{label}{id==="tasks"&&<span className="tcnt">{doneTasks}/{tasks.length}</span>}{id==="comments"&&comments.length>0&&<span className="tcnt">{comments.filter(c=>!c.resolved).length}</span>}</div>
        ))}
      </div>

      {tab==="write"&&(
        <div className="two">
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div style={{padding:"10px 13px"}}>
                <input className="fi" style={{fontSize:15,fontWeight:700,marginBottom:8}} placeholder="Título do Post..." value={title} onChange={e=>setTitle(e.target.value)}/>
                {titleSugs.length>0&&(
                  <div style={{marginBottom:8}}>
                    {titleSugs.map((s,i)=><div key={i} style={{padding:"5px 9px",fontSize:12,background:C.s1,borderRadius:7,marginBottom:4,cursor:"pointer",color:C.p,fontWeight:500}} onClick={()=>{setTitle(s);setTitleSugs([]);}}>{s}</div>)}
                  </div>
                )}
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <input className="fi" style={{flex:1,fontSize:12}} placeholder="🔑 Palavra-chave principal..." value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                  <button className="btn bt bsm" style={{flexShrink:0,fontSize:11}} onClick={doGenTitles} disabled={genTitles||(!keyword&&!title)}>{genTitles?<div className="spinner" style={{width:11,height:11}}/>:"✨ Títulos"}</button>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="rtb">
                {[["B","bold"],["I","italic"],["U","underline"]].map(([l,c])=><button key={c} onClick={()=>fmt(c)}><b style={c==="bold"?{}:c==="italic"?{fontStyle:"italic",fontWeight:400}:{textDecoration:"underline",fontWeight:400}}>{l}</b></button>)}
                <div className="rtb-div"/>
                <button onClick={()=>document.execCommand("formatBlock",false,"h2")}>H2</button>
                <button onClick={()=>document.execCommand("formatBlock",false,"h3")}>H3</button>
                <button onClick={()=>document.execCommand("formatBlock",false,"p")}>¶</button>
                <div className="rtb-div"/>
                <button onClick={()=>fmt("insertUnorderedList")}>• Lista</button>
                <button onClick={()=>fmt("insertOrderedList")}>1. Num</button>
                <div className="rtb-div"/>
                <button onClick={()=>fmt("undo")}>↩</button>
                <button onClick={()=>fmt("redo")}>↪</button>
              </div>
              <div ref={contentRef} className="fi-rich" contentEditable suppressContentEditableWarning onInput={e=>setContent(e.target.innerText)} style={{borderRadius:"0 0 10px 10px",border:"none",borderTop:`1px solid ${C.ovV}`}}>{content}</div>
            </div>
          </div>
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div className="ch"><span className="ct">📊 SEO em tempo real</span></div>
              <div className="cb" style={{paddingTop:4}}><SEOAnalyzer content={title+" "+content} keyword={keyword}/></div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">📝 Meta Description</span><button className="btn bt bsm" style={{fontSize:11}} onClick={doGenMeta} disabled={genMeta||!title}>{genMeta?<div className="spinner" style={{width:11,height:11}}/>:"✨ Gerar"}</button></div>
              <div className="cb" style={{paddingTop:4}}>
                <textarea className="fi fi-ta" rows={3} placeholder="Descrição para SEO (máx 160 chars)..." value={metaDesc} onChange={e=>setMetaDesc(e.target.value.slice(0,160))}/>
                <div style={{fontSize:11,color:metaDesc.length>150?C.warn:C.onV,fontFamily:"'JetBrains Mono',monospace",textAlign:"right",marginTop:3}}>{metaDesc.length}/160</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="seo"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">🔍 Análise SEO Completa</span></div><div className="cb" style={{paddingTop:4}}><SEOAnalyzer content={title+" "+content} keyword={keyword}/></div></div>
          <div>
            <div className="card" style={{marginBottom:10}}>
              <div className="ch"><span className="ct">🔎 Preview Google</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{padding:"12px 13px",background:C.s1,borderRadius:9}}>
                  <div style={{fontSize:11,color:C.onV,marginBottom:3,fontFamily:"'JetBrains Mono',monospace"}}>blog.exemplo.com.br › {(keyword||"artigo").replace(/ /g,"-")}</div>
                  <div style={{fontSize:17,color:"#1a0dab",fontWeight:500,marginBottom:3,lineHeight:1.3}}>{title||"Título do Post"}</div>
                  <div style={{fontSize:13,color:C.onV,lineHeight:1.5}}>{metaDesc||"Meta description aparecerá aqui..."}</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">🏷 Keywords Relacionadas</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {keyword?[keyword+" 2026","como "+keyword,"melhor "+keyword,keyword+" tutorial",keyword+" exemplos"].map((kw,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12}}>{kw}</span>
                    <div style={{display:"flex",gap:8,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>
                      <span>{[2400,1800,1200,800,600][i]}/mês</span>
                      <span style={{color:[C.ter,C.ter,C.warn,C.warn,C.err][i]}}>{["Fácil","Fácil","Médio","Médio","Difícil"][i]}</span>
                    </div>
                  </div>
                )):<Empty ico="🔑" title="Digite a keyword" sub="Sugestões aparecerão aqui."/>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="social"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button className="btn bf bsm" onClick={genVarsAI} disabled={genVars||!title}>{genVars?<><div className="spinner"/>Gerando...</>:"✨ Gerar com IA"}</button>
          </div>
          {socialVars
            ?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}>
              {[{net:"Twitter / X",ico:"𝕏",limit:280,f:"twitter"},{net:"LinkedIn",ico:"in",limit:700,f:"linkedin"},{net:"Instagram",ico:"📸",limit:2200,f:"instagram"}].map(s=>(
                <div key={s.net} style={{border:`1.5px solid ${C.ovV}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"9px 13px",background:C.s1,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:7}}><span style={{fontWeight:800}}>{s.ico}</span>{s.net}</div>
                  <div style={{padding:"12px"}}>
                    <textarea className="fi fi-ta" rows={5} value={socialVars[s.f]||""} onChange={e=>setSocialVars(p=>({...p,[s.f]:e.target.value}))}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                      <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:C.onV}}>{(socialVars[s.f]||"").length}/{s.limit}</span>
                      <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(socialVars[s.f]||"");showToast("📋 Copiado!");}}>📋 Copiar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            :<Empty ico="📱" title="Gere variações sociais" sub="Clique em 'Gerar com IA' para criar versões para Twitter, LinkedIn e Instagram."/>
          }
        </div>
      )}

      {tab==="preview"&&(
        <div className="card">
          <div style={{padding:"24px 32px",maxWidth:720,margin:"0 auto"}}>
            <h1 style={{fontSize:26,fontWeight:800,marginBottom:14,lineHeight:1.3}}>{title||"Título do Post"}</h1>
            {keyword&&<div style={{marginBottom:14}}><span className="chip cp">{keyword}</span> <span className="chip cn">{cat}</span></div>}
            <div style={{fontSize:14,lineHeight:1.8,color:C.onV,whiteSpace:"pre-wrap"}}>{content||<span style={{color:C.ovV}}>Conteúdo aparecerá aqui...</span>}</div>
          </div>
        </div>
      )}

      {tab==="settings"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">⚙️ Metadados</span></div><div className="cb" style={{paddingTop:6}}>
            <Field label="Categoria"><select className="fi fi-sel" value={cat} onChange={e=>setCat(e.target.value)}>{["SEO","IA","CMS","Email","Dev","CRO","Marketing","Tutorial"].map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Autor"><select className="fi fi-sel">{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
            <Field label="Tags"><input className="fi" placeholder="seo, marketing, 2026..." defaultValue={post?.tags?.join(", ")||""}/></Field>
            <Field label="Imagem Destaque"><div style={{border:`2px dashed ${C.ovV}`,borderRadius:9,padding:"18px",textAlign:"center",cursor:"pointer",fontSize:13,color:C.onV}}>🖼 Upload ou arrastar imagem</div></Field>
          </div></div>
          <div className="card"><div className="ch"><span className="ct">📤 Publicação</span></div><div className="cb" style={{paddingTop:6}}>
            <Field label="Site WordPress"><select className="fi fi-sel">{WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Status"><select className="fi fi-sel"><option>Rascunho</option><option>Publicar imediatamente</option><option>Agendar</option></select></Field>
            <button className="btn bf" style={{width:"100%",justifyContent:"center",marginTop:6}} onClick={()=>setPubDlg(true)}>📤 Publicar no WordPress</button>
            <button className="btn bo" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>go&&go("multichannel",post)}>📡 Publicação Multicanal</button>
          </div></div>
        </div>
      )}

      {tab==="tasks"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">✅ Checklist do Post</span><span className="chip ct3">{doneTasks}/{tasks.length}</span></div>
            <div className="pb" style={{margin:"0 18px 8px",height:6}}><div className="pbf" style={{width:`${tasks.length?(doneTasks/tasks.length)*100:0}%`,background:C.ter}}/></div>
            <div style={{padding:"0 16px 10px"}}>
              {tasks.map((t,i)=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<tasks.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <input type="checkbox" checked={t.done} onChange={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{width:16,height:16,cursor:"pointer",accentColor:C.p}}/>
                  <span style={{fontSize:13,flex:1,textDecoration:t.done?"line-through":"none",color:t.done?C.onV:C.on}}>{t.title}</span>
                  <button className="ib" style={{width:22,height:22,fontSize:11}} onClick={()=>setTasks(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
                </div>
              ))}
            </div>
            <div style={{padding:"0 16px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:34,padding:"6px 10px",fontSize:12}} placeholder="Nova tarefa..." value={taskInput} onChange={e=>setTaskInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&taskInput.trim()&&(setTasks(p=>[...p,{id:Date.now(),title:taskInput,done:false}]),setTaskInput(""))}/>
              <button className="btn bf bsm" onClick={()=>{if(taskInput.trim()){setTasks(p=>[...p,{id:Date.now(),title:taskInput,done:false}]);setTaskInput("");}}} disabled={!taskInput.trim()}>➕</button>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📊 Status</span></div>
            <div className="cb" style={{paddingTop:8}}>
              {[{l:"Concluídas",v:doneTasks,c:C.ter},{l:"Pendentes",v:tasks.length-doneTasks,c:C.warn},{l:"Total",v:tasks.length,c:C.p}].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                  <span style={{fontSize:13}}>{s.l}</span><span className="mono" style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:"9px 12px",background:doneTasks===tasks.length&&tasks.length>0?C.terC:C.pC,borderRadius:9,fontSize:12,fontWeight:600,textAlign:"center",color:doneTasks===tasks.length&&tasks.length>0?C.onTerC:C.onPC}}>
                {tasks.length===0?"Adicione tarefas ao post":doneTasks===tasks.length?"🎉 Pronto para publicar!":doneTasks===0?"⏳ Nenhuma concluída":`📝 ${tasks.length-doneTasks} pendente${tasks.length-doneTasks>1?"s":""}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="versions"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">🕐 Histórico de Versões</span><button className="btn bt bsm" style={{fontSize:11}} onClick={save}>💾 Salvar versão</button></div>
            <div style={{padding:"0 14px 8px"}}>
              {versions.map((v,i)=>(
                <div key={v.id} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:i<versions.length-1?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:i===0?C.pC:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i===0?C.onPC:C.onV,flexShrink:0}}>v{v.version}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:i===0?700:500}}>{v.content.slice(0,40)}{i===0&&<span className="chip ct3" style={{marginLeft:6,fontSize:9}}>Atual</span>}</div><div style={{fontSize:11,color:C.onV}}>👤 {v.savedBy} · {v.savedAt}</div></div>
                  {i>0&&<button className="btn bo bsm" style={{fontSize:11}} onClick={()=>showToast(`↩ Versão ${v.version} restaurada!`)}>↩</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">ℹ️ Sobre versões</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.8}}>Cada vez que você clica em <strong>💾 Salvar</strong>, uma nova versão é criada automaticamente.<br/><br/>Você pode restaurar qualquer versão anterior a qualquer momento.<br/><br/>Versões são mantidas por <strong>30 dias</strong> no plano atual.</div>
            </div>
          </div>
        </div>
      )}

      {tab==="comments"&&(
        <div className="two">
          <div className="card">
            <div className="ch"><span className="ct">💬 Notas de Revisão</span><span className="chip ce">{comments.filter(c=>!c.resolved).length} abertas</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {comments.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Sem notas ainda. Adicione abaixo.</div>}
              {comments.map((c,i)=>(
                <div key={c.id} style={{padding:"12px 0",borderBottom:i<comments.length-1?`1px solid ${C.ovV}`:"none",opacity:c.resolved?.7:1}}>
                  <div style={{display:"flex",gap:8,marginBottom:7}}>
                    <div style={{width:26,height:26,borderRadius:7,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.onPC,flexShrink:0}}>AL</div>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>Ana Lima</div><div style={{fontSize:11,color:C.onV}}>{c.createdAt}</div></div>
                    {c.resolved&&<span className="chip ct3" style={{fontSize:9}}>Resolvida</span>}
                  </div>
                  <div style={{fontSize:13,background:C.s1,borderRadius:8,padding:"9px 11px",marginBottom:7,lineHeight:1.5}}>{c.text}</div>
                  {!c.resolved&&<div style={{display:"flex",gap:6}}>
                    <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.map(x=>x.id===c.id?{...x,resolved:true}:x))}>✅ Resolver</button>
                    <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.filter(x=>x.id!==c.id))}>🗑</button>
                  </div>}
                </div>
              ))}
            </div>
            <div style={{padding:"0 14px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:34,padding:"6px 10px",fontSize:12}} placeholder="Adicionar nota de revisão..." value={commentInput} onChange={e=>setCommentInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&commentInput.trim()&&(setComments(p=>[...p,{id:Date.now(),text:commentInput,resolved:false,createdAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]),setCommentInput(""))}/>
              <button className="btn bf bsm" onClick={()=>{if(commentInput.trim()){setComments(p=>[...p,{id:Date.now(),text:commentInput,resolved:false,createdAt:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);setCommentInput("");}}} disabled={!commentInput.trim()}>💬</button>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📋 Sobre revisões</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.8}}>Use as notas de revisão para comunicar ajustes necessários antes da publicação.<br/><br/>Resolva cada nota após aplicar a correção para manter o histórico limpo.</div>
            </div>
          </div>
        </div>
      )}

      {pubDlg&&(
        <Dlg title="Publicar Post" onClose={()=>setPubDlg(false)}
          footer={<><button className="btn bo" onClick={()=>setPubDlg(false)}>Cancelar</button><button className="btn bf" onClick={publish}>📤 Confirmar Publicação</button></>}>
          <Field label="Site de destino"><select className="fi fi-sel">{WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Status"><select className="fi fi-sel"><option>Publicar imediatamente</option><option>Agendar</option><option>Rascunho</option></select></Field>
          <div style={{padding:"9px 12px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC,marginTop:4}}>✅ Será publicado via WordPress REST API e a equipe será notificada.</div>
        </Dlg>
      )}
    </div>
  );
}

/* ══ PAGES ═══════════════════════════════════════════════ */

function Dashboard({go}){
  return(
    <div className="fade-in">
      <div className="mg">
        {[{l:"Posts Publicados",v:"247",d:"↑ 18% este mês",cls:"mcp",pg:"posts"},{l:"Score SEO Médio",v:"88",d:"↑ 5 pts",cls:"mcs",pg:"performance"},{l:"Sites WordPress",v:"6",d:"2 sync ativo",cls:"mct",pg:"wordpress"},{l:"Automações",v:"14",d:"3 rodaram hoje",cls:"mce",pg:"automations"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`} onClick={()=>go(m.pg)}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="three" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Publicações — 12 meses</span><span className="chip ct3">+34% YoY</span></div><div className="cb"><Bar data={CHART_DATA} labels={MONTHS}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Fontes de Tráfego</span></div>
          <div className="cb">{[{l:"Orgânico",v:64,c:C.ter},{l:"Social",v:21,c:C.p},{l:"Direto",v:9,c:C.sec},{l:"Email",v:6,c:C.warn}].map((s,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:12,color:C.onV}}>{s.l}</span>
                <span className="mono" style={{fontSize:11,fontWeight:700,color:s.c}}>{s.v}%</span>
              </div>
              <div className="pb"><div className="pbf" style={{width:`${s.v}%`,background:s.c}}/></div>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">Posts Recentes</span><button className="btn bx bsm" onClick={()=>go("posts")}>Ver todos →</button></div>
          <div style={{padding:"0 14px 8px"}}>
            {POSTS.slice(0,5).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none",cursor:"pointer"}} onClick={()=>go("editor",p)}>
                <Ring score={p.score} size={32}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{p.cat} · {p.date}</div></div>
                <SChip status={p.status}/>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">Próximos Agendamentos</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {POSTS.filter(p=>p.status==="scheduled").concat([{id:99,title:"Guia de automação",date:"14/05/26",wp:"Portal",cat:"Auto"}]).slice(0,3).map((s,i)=>(
                <div key={s.id} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none",alignItems:"center"}}>
                  <div style={{width:34,height:34,borderRadius:8,background:C.pC,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.onPC,lineHeight:1}}>{s.date?.slice(0,2)||"—"}</div>
                    <div style={{fontSize:9,color:C.onPC,opacity:.7}}>{s.date?.slice(3,5)||""}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{s.wp}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">Atividade Recente</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {NOTIFS.slice(0,4).map((n,i)=>(
                <div key={n.id} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:{success:C.terC,info:C.pC,warning:C.warnC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{n.ico}</div>
                  <div><div style={{fontSize:12,lineHeight:1.4}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{n.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsPage({go}){
  const[tab,setTab]=useState("all");
  const[search,setSearch]=useState("");
  const[sel,setSel]=useState([]);
  const tabs=[{id:"all",l:"Todos",c:POSTS.length},{id:"published",l:"Publicados",c:POSTS.filter(p=>p.status==="published").length},{id:"scheduled",l:"Agendados",c:1},{id:"draft",l:"Rascunhos",c:POSTS.filter(p=>p.status==="draft").length}];
  const filtered=POSTS.filter(p=>(tab==="all"||p.status===tab)&&(p.title.toLowerCase().includes(search.toLowerCase())||p.cat.toLowerCase().includes(search.toLowerCase())));
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input className="fi" style={{flex:1,minWidth:180,height:36,padding:"7px 12px"}} placeholder="🔍  Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {sel.length>0&&<button className="btn ber bsm">🗑 ({sel.length})</button>}
        <button className="btn bo bsm">⬇ Exportar</button>
        <button className="btn bf bsm" onClick={()=>go("editor",{})}>➕ Novo Post</button>
      </div>
      <div className="tabs">{tabs.map(t=><div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}<span className="tcnt">{t.c}</span></div>)}</div>
      <div className="card">
        <table className="dt">
          <thead><tr><th style={{width:32}}><input type="checkbox" onChange={e=>setSel(e.target.checked?filtered.map(p=>p.id):[])}/></th><th>Título</th><th>Cat.</th><th>SEO</th><th>Status</th><th>Site</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} style={{cursor:"pointer"}} onClick={()=>go("editor",p)}>
                <td onClick={e=>e.stopPropagation()}><input type="checkbox" checked={sel.includes(p.id)} onChange={()=>setSel(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}/></td>
                <td style={{maxWidth:270}}><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>{p.views>0&&<div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{p.views.toLocaleString()} views</div>}</td>
                <td><span className="chip cp" style={{fontSize:10}}>{p.cat}</span></td>
                <td><Ring score={p.score} size={30}/></td>
                <td><SChip status={p.status}/></td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.wp}</td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.date}</td>
                <td onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:2}}>
                  <button className="ib" title="Analytics" style={{width:26,height:26,fontSize:12}} onClick={()=>go("postanalytics",p)}>📊</button>
                  <button className="ib" title="Editar" style={{width:26,height:26,fontSize:12}} onClick={()=>go("editor",p)}>✏️</button>
                  <button className="ib" title="Tarefas" style={{width:26,height:26,fontSize:12}} onClick={()=>go("posttask",p)}>✅</button>
                  <button className="ib" title="Versões" style={{width:26,height:26,fontSize:12}} onClick={()=>go("versionhistory",p)}>🕐</button>
                  <button className="ib" title="Publicar em canais" style={{width:26,height:26,fontSize:12}} onClick={()=>go("multichannel",p)}>📡</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<Empty ico="📄" title="Nenhum post" sub="Tente ajustar os filtros."/>}
      </div>
    </div>
  );
}

/* ══ POST ANALYTICS ══════════════════════════════════════ */
function PostAnalyticsPage({post,onBack}){
  if(!post){return <Empty ico="📊" title="Selecione um post" sub="Abra o analytics de um post específico."/>;}
  const daily=[120,180,240,310,280,420,380,510,460,590,480,620];
  const sources=[{l:"Busca Orgânica",v:68,c:C.ter},{l:"Redes Sociais",v:18,c:C.p},{l:"Direto",v:8,c:C.sec},{l:"Email",v:6,c:C.warn}];
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.title}</div>
          <div style={{fontSize:11,color:C.onV}}>{post.cat} · Publicado: {post.date} · {post.wp}</div>
        </div>
        <Ring score={post.score} size={44}/>
      </div>
      <div className="mg">
        {[{l:"Visualizações",v:(post.views||0).toLocaleString(),d:"+23% vs semana ant.",cls:"mcp"},{l:"Tempo Médio",v:post.avgTime||"—",d:"Meta: >3min",cls:"mct"},{l:"Taxa de Rejeição",v:post.bounce?post.bounce+"%":"—",d:post.bounce<50?"✓ Abaixo da média":"↑ Acima da média",cls:post.bounce&&post.bounce<50?"mcs":"mce"},{l:"Conversões",v:post.conversions||0,d:"Taxa: 0.7%",cls:"mcs"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Visualizações Diárias</span></div><div className="cb"><Bar data={daily} labels={["1","2","3","4","5","6","7","8","9","10","11","12"]}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Fontes de Tráfego</span></div>
          <div className="cb">{sources.map((s,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12}}>{s.l}</span><span className="mono" style={{fontSize:11,fontWeight:700,color:s.c}}>{s.v}%</span></div>
              <div className="pb"><div className="pbf" style={{width:`${s.v}%`,background:s.c}}/></div>
            </div>
          ))}</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">🔍 SEO & Palavras-chave</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {post.tags?.filter(t=>t).map((kw,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.ovV}`}}>
                <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{kw}</span>
                <div style={{display:"flex",gap:10,fontSize:11,color:C.onV,fontFamily:"'JetBrains Mono',monospace"}}>
                  <span>pos. {[3,7,12,15][i%4]}</span>
                  <span style={{color:C.ter}}>↑ {[2,1,3,0][i%4]}</span>
                </div>
              </div>
            ))}
            {(!post.tags||post.tags.length===0)&&<Empty ico="🔑" title="Sem tags" sub="Adicione tags ao post para análise de keywords."/>}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📱 Engajamento Social</span></div>
          <div className="cb">
            {[{ico:"𝕏",net:"Twitter",shares:42,clicks:180},{ico:"in",net:"LinkedIn",shares:28,clicks:320},{ico:"📘",net:"Facebook",shares:15,clicks:95},{ico:"📸",net:"Instagram",shares:8,clicks:44}].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,fontWeight:800}}>{s.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{s.net}</div></div>
                <div className="mono" style={{fontSize:11,color:C.onV}}>{s.shares} shares</div>
                <div className="mono" style={{fontSize:11,color:C.p,fontWeight:700}}>{s.clicks} cliques</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ PERFORMANCE DASHBOARD ═══════════════════════════════ */
function PerformanceDashboard(){
  const[period,setPeriod]=useState("30d");
  const mult={"7d":.3,"30d":1,"90d":2.8,"12m":11}[period]||1;
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
        <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
          {["7d","30d","90d","12m"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{padding:"4px 13px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:period===p?C.p:"transparent",color:period===p?C.onP:C.onV,transition:"all .14s"}}>{p}</button>
          ))}
        </div>
      </div>
      <div className="mg">
        {[{l:"Visitas",v:Math.round(128000*mult).toLocaleString(),d:"↑ 23%",cls:"mcp"},{l:"CTR",v:"4.7%",d:"↑ 0.8 pp",cls:"mct"},{l:"Tempo Médio",v:"3m42s",d:"↑ 18s",cls:"mcs"},{l:"Conversões",v:Math.round(520*mult),d:"↑ 12%",cls:"mce"}].map((m,i)=>(
          <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
        ))}
      </div>
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">Publicações por Mês</span><span className="chip cp">+34% anual</span></div><div className="cb"><Bar data={CHART_DATA} labels={MONTHS}/></div></div>
        <div className="card">
          <div className="ch"><span className="ct">Top Posts</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {POSTS.filter(p=>p.views>0).sort((a,b)=>b.views-a.views).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<POSTS.filter(x=>x.views>0).length-1?`1px solid ${C.ovV}`:"none"}}>
                <div style={{width:22,height:22,borderRadius:6,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.onPC,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div></div>
                <div className="mono" style={{fontSize:12,fontWeight:800,color:C.p}}>{Math.round(p.views*mult).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">Score SEO por Categoria</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {[{c:"Email",s:91},{c:"SEO",s:91},{c:"IA",s:89},{c:"Dev",s:86},{c:"CMS",s:72},{c:"CRO",s:65}].map((x,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600}}>{x.c}</span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,color:x.s>=85?C.ter:x.s>=70?C.warn:C.err}}>{x.s}</span>
                </div>
                <div className="pb"><div className="pbf" style={{width:`${x.s}%`,background:x.s>=85?C.ter:x.s>=70?C.warn:C.err}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">Funil de Conversão</span></div>
          <div className="cb" style={{paddingTop:4}}>
            {[{l:"Impressões",v:480000,pct:100},{l:"Cliques",v:22560,pct:4.7},{l:"Leads",v:520,pct:2.3},{l:"Vendas",v:89,pct:.4}].map((f,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12}}>{f.l}</span>
                  <span className="mono" style={{fontSize:11,fontWeight:700,color:C.p}}>{Math.round(f.v*mult).toLocaleString()}</span>
                </div>
                <div className="pb"><div className="pbf" style={{width:`${Math.min(f.pct*15,100)}%`,background:C.p}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ PRODUCTIVITY DASHBOARD ══════════════════════════════ */
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

/* ══ TAGS & CATEGORIES ═══════════════════════════════════ */
function TagsCategoriesPage({showToast}){
  const[tab,setTab]=useState("categories");
  const[cats,setCats]=useState(CATEGORIES_DATA);
  const[tags,setTags]=useState(TAGS_DATA);
  const[dlg,setDlg]=useState(null);
  const[form,setForm]=useState({name:"",slug:"",color:"#1A56DB",icon:""});
  const COLORS=["#1A56DB","#006B5D","#5B6396","#7A5900","#BA1A1A","#0B4A6A","#6B3500","#005240"];
  const save=()=>{
    if(!form.name.trim())return;
    if(dlg==="cat") setCats(p=>[...p,{id:Date.now(),...form,posts:0}]);
    else setTags(p=>[...p,{id:Date.now(),name:form.name,posts:0,color:form.color}]);
    setDlg(null);setForm({name:"",slug:"",color:"#1A56DB",icon:""});
    showToast(dlg==="cat"?"📁 Categoria criada!":"🏷 Tag criada!");
  };
  return(
    <div className="fade-in">
      <div className="tabs">
        <div className={`tabi ${tab==="categories"?"a":""}`} onClick={()=>setTab("categories")}>📁 Categorias <span className="tcnt">{cats.length}</span></div>
        <div className={`tabi ${tab==="tags"?"a":""}`} onClick={()=>setTab("tags")}>🏷 Tags <span className="tcnt">{tags.length}</span></div>
      </div>
      {tab==="categories"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>{setDlg("cat");setForm({name:"",slug:"",color:"#1A56DB",icon:"📝"});}}>➕ Nova Categoria</button>
          </div>
          <div className="card">
            <table className="dt">
              <thead><tr><th>Categoria</th><th>Slug</th><th>Posts</th><th>Cor</th><th></th></tr></thead>
              <tbody>
                {cats.map(c=>(
                  <tr key={c.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:18}}>{c.icon}</span><span style={{fontWeight:600}}>{c.name}</span></div></td>
                    <td className="mono" style={{fontSize:11,color:C.onV}}>{c.slug}</td>
                    <td><span className="chip cn">{c.posts} posts</span></td>
                    <td><div style={{width:20,height:20,borderRadius:5,background:c.color,border:`2px solid ${C.ovV}`}}/></td>
                    <td><div style={{display:"flex",gap:2}}><button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setCats(p=>p.filter(x=>x.id!==c.id))}>🗑</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==="tags"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>{setDlg("tag");setForm({name:"",slug:"",color:"#1A56DB",icon:""});}}>➕ Nova Tag</button>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {tags.map(t=>(
              <div key={t.id} className="cat-tag" style={{background:t.color+"22",color:t.color,border:`1.5px solid ${t.color}44`}}>
                #{t.name}
                <span style={{fontSize:10,opacity:.7,marginLeft:3}}>{t.posts}</span>
                <button style={{background:"transparent",border:"none",cursor:"pointer",fontSize:11,color:t.color,padding:0,marginLeft:2}} onClick={()=>setTags(p=>p.filter(x=>x.id!==t.id))}>✕</button>
              </div>
            ))}
          </div>
          <div className="card">
            <table className="dt">
              <thead><tr><th>Tag</th><th>Posts</th><th>Cor</th><th></th></tr></thead>
              <tbody>
                {tags.map(t=>(
                  <tr key={t.id}>
                    <td><span className="mono" style={{fontWeight:600}}>#{t.name}</span></td>
                    <td><span className="chip cn">{t.posts}</span></td>
                    <td><div style={{width:20,height:20,borderRadius:5,background:t.color,border:`2px solid ${C.ovV}`}}/></td>
                    <td><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTags(p=>p.filter(x=>x.id!==t.id))}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {dlg&&(
        <Dlg title={dlg==="cat"?"Nova Categoria":"Nova Tag"} onClose={()=>setDlg(null)}
          footer={<><button className="btn bo" onClick={()=>setDlg(null)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
          <Field label="Nome *"><input className="fi" placeholder={dlg==="cat"?"Ex: Marketing Digital":"Ex: seo-avancado"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value,slug:e.target.value.toLowerCase().replace(/ /g,"-")}))}/></Field>
          {dlg==="cat"&&<>
            <Field label="Slug"><input className="fi" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))}/></Field>
            <Field label="Ícone"><input className="fi" placeholder="📝" value={form.icon} onChange={e=>setForm(f=>({...f,icon:e.target.value}))}/></Field>
          </>}
          <Field label="Cor">
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {COLORS.map(c=>(
                <div key={c} className={`sw${form.color===c?" sel":""}`} style={{background:c}} onClick={()=>setForm(f=>({...f,color:c}))}/>
              ))}
            </div>
          </Field>
        </Dlg>
      )}
    </div>
  );
}

/* ══ PUBLISH HISTORY ═════════════════════════════════════ */
function PublishHistoryPage(){
  const[filter,setFilter]=useState("all");
  const filtered=PUBLISH_HISTORY.filter(p=>filter==="all"||p.status===filter);
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
          {[{id:"all",l:"Todos"},{id:"success",l:"Sucesso"},{id:"error",l:"Falha"}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:filter===f.id?C.p:"transparent",color:filter===f.id?C.onP:C.onV,transition:"all .14s"}}>{f.l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <button className="btn bo bsm">⬇ Exportar CSV</button>
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr><th>Post</th><th>Site WordPress</th><th>Data/Hora</th><th>Tipo</th><th>Status</th><th>ID WP</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id}>
                <td style={{maxWidth:260}}><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div></td>
                <td style={{fontSize:12,color:C.onV}}>{p.wp}</td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.date}</td>
                <td><SChip status={p.type}/></td>
                <td><SChip status={p.status}/></td>
                <td className="mono" style={{fontSize:11,color:C.onV}}>{p.id_wp||"—"}</td>
                <td><div style={{display:"flex",gap:2}}>
                  {p.status==="error"&&<button className="btn ber bsm" style={{fontSize:11}}>↺ Retry</button>}
                  {p.status==="success"&&<button className="ib" style={{width:26,height:26,fontSize:12}}>↗</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══ RECURRING SCHEDULES ══════════════════════════════════ */
function RecurringSchedulesPage({showToast}){
  const[scheds,setScheds]=useState(RECURRING);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",template:"",freq:"Toda segunda",time:"09:00",wp:WP_SITES[0].name,active:true});
  const save=()=>{
    if(!form.name.trim())return;
    setScheds(p=>[...p,{id:Date.now(),...form,generated:0,next:"12/05/26"}]);
    setDlg(false);setForm({name:"",template:"",freq:"Toda segunda",time:"09:00",wp:WP_SITES[0].name,active:true});
    showToast("🔄 Cronograma criado!");
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{scheds.filter(s=>s.active).length} cronogramas ativos</div>
          <div style={{fontSize:12,color:C.onV}}>{scheds.reduce((s,x)=>s+x.generated,0)} posts gerados automaticamente</div>
        </div>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo Cronograma</button>
      </div>
      <div className="card">
        {scheds.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:i<scheds.length-1?`1px solid ${C.ovV}`:"none"}}>
            <Tog on={s.active} onChange={()=>setScheds(p=>p.map(x=>x.id===s.id?{...x,active:!x.active}:x))}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:s.active?C.on:C.onV}}>{s.name}</span>
                <span className="chip cn">{s.template}</span>
              </div>
              <div style={{fontSize:11,color:C.onV}}>🕐 {s.freq} às {s.time} → {s.wp}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:8}}>
              <div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{s.generated}</div>
              <div style={{fontSize:10,color:C.onV}}>gerados</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:10}}>
              <div style={{fontSize:11,color:C.onV}}>Próximo</div>
              <div className="mono" style={{fontSize:12,fontWeight:600,color:s.active?C.on:C.onV}}>{s.next}</div>
            </div>
            <div style={{display:"flex",gap:2}}>
              <button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setScheds(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {dlg&&(
        <Dlg title="Novo Cronograma" onClose={()=>setDlg(false)}
          footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
          <Field label="Nome *"><input className="fi" placeholder="Ex: SEO Semanal" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <div className="two">
            <Field label="Template">
              <select className="fi fi-sel" value={form.template} onChange={e=>setForm(f=>({...f,template:e.target.value}))}>
                <option value="">Selecionar...</option>
                {TEMPLATES.map(t=><option key={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Frequência">
              <select className="fi fi-sel" value={form.freq} onChange={e=>setForm(f=>({...f,freq:e.target.value}))}>
                {["Toda segunda","Toda terça","Toda quarta","Toda quinta","Toda sexta","A cada 7 dias","A cada 14 dias","Mensal"].map(f=><option key={f}>{f}</option>)}
              </select>
            </Field>
          </div>
          <div className="two">
            <Field label="Horário"><input className="fi" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></Field>
            <Field label="Site WordPress">
              <select className="fi fi-sel" value={form.wp} onChange={e=>setForm(f=>({...f,wp:e.target.value}))}>
                {WP_SITES.filter(s=>s.status==="online").map(s=><option key={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
        </Dlg>
      )}
    </div>
  );
}

/* ══ AI PRODUCER ══════════════════════════════════════════ */
function AIProducerPage({showToast}){
  const[topic,setTopic]=useState("");
  const[tone,setTone]=useState("informativo");
  const[niche,setNiche]=useState("marketing digital");
  const[len,setLen]=useState("completo");
  const[tmpl,setTmpl]=useState("");
  const[output,setOutput]=useState("");
  const[loading,setLoading]=useState(false);
  const[step,setStep]=useState(0);
  const[score,setScore]=useState(0);
  const outRef=useRef(null);
  const run=async()=>{
    if(!topic.trim())return;
    setLoading(true);setOutput("");setStep(1);setScore(0);
    const tplCtx=tmpl?`\nSiga o template: ${TEMPLATES.find(t=>t.id===+tmpl)?.prompt||""}`:""
    const prompt=`Especialista em SEO e criação de conteúdo. Português brasileiro.\n\nTema: "${topic}"\nNicho: ${niche} | Tom: ${tone} | Tamanho: ${{rapido:"~800p",completo:"~1500p",detalhado:"~2500p"}[len]}${tplCtx}\n\n# [Título H1 otimizado para SEO]\n\n[Introdução com gancho e promessa]\n\n## [H2 com palavra-chave]\n[Conteúdo detalhado, exemplos práticos]\n\n## [H2]\n[Conteúdo]\n\n## [H2]\n[Conteúdo]\n\n## Conclusão\n[Resumo + CTA]\n\n---\n**Meta Description:** [máx 155 chars]\n**Keywords:** kw1, kw2, kw3, kw4, kw5\n**Score SEO estimado:** [numero]/100`;
    try{
      setStep(2);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||"").join("")||"Erro.";
      let i=0;
      const iv=setInterval(()=>{
        i+=14;setOutput(text.slice(0,i));
        if(outRef.current)outRef.current.scrollTop=outRef.current.scrollHeight;
        if(i>=text.length){clearInterval(iv);setLoading(false);setStep(3);const m=text.match(/Score SEO estimado:\s*(\d+)/);setScore(m?+m[1]:Math.floor(Math.random()*14)+79);}
      },15);
    }catch{setOutput("Erro de conexão.");setLoading(false);setStep(0);}
  };
  return(
    <div className="fade-in">
      <div className="stps">{["Configurar","Processar","Gerar","Pronto"].map((s,i)=>(
        <div key={i} className="sti"><div className={`stc ${step>i?"done":step===i?"act":"idle"}`}>{step>i?"✓":i+1}</div><div className="stl">{s}</div></div>
      ))}</div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:11}}>
            <div className="ch"><span className="ct">⚙️ Configuração</span></div>
            <div className="cb" style={{paddingTop:5}}>
              <Field label="Tema *"><textarea className="fi fi-ta" placeholder="Ex: Como usar IA para criar conteúdo..." value={topic} onChange={e=>setTopic(e.target.value)} rows={4}/></Field>
              <div className="two">
                <Field label="Tom"><select className="fi fi-sel" value={tone} onChange={e=>setTone(e.target.value)}>{["informativo","persuasivo","casual","técnico","inspiracional","jornalístico"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
                <Field label="Tamanho"><select className="fi fi-sel" value={len} onChange={e=>setLen(e.target.value)}><option value="rapido">Rápido (~800p)</option><option value="completo">Completo (~1500p)</option><option value="detalhado">Detalhado (~2500p)</option></select></Field>
              </div>
              <div className="two">
                <Field label="Nicho"><select className="fi fi-sel" value={niche} onChange={e=>setNiche(e.target.value)}>{["marketing digital","tecnologia","negócios","saúde","educação","finanças","e-commerce"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
                <Field label="Template"><select className="fi fi-sel" value={tmpl} onChange={e=>setTmpl(e.target.value)}><option value="">Nenhum</option>{TEMPLATES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
              </div>
            </div>
          </div>
          <button className="btn bf" style={{width:"100%",justifyContent:"center",padding:12,borderRadius:12}} onClick={run} disabled={loading||!topic.trim()}>{loading?<><div className="spinner"/>Gerando com Claude AI...</>:"✨ Gerar Artigo com IA"}</button>
          {step===3&&<div style={{marginTop:10}}>
            <div style={{display:"flex",gap:8,marginBottom:9}}><button className="btn bo bsm" style={{flex:1,justifyContent:"center"}}>⬇ Exportar</button><button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>showToast("💾 Salvo como rascunho!")}>💾 Salvar Post</button></div>
            <div style={{padding:"10px 13px",background:score>=80?C.terC:C.warnC,borderRadius:11,display:"flex",alignItems:"center",gap:10}}>
              <Ring score={score} size={42}/>
              <div><div style={{fontSize:13,fontWeight:700,color:score>=80?C.onTerC:C.warn}}>Score SEO: {score}/100</div><div style={{fontSize:11,color:score>=80?C.onTerC:C.warn,opacity:.8}}>{score>=80?"Pronto para publicar!":"Revisar antes de publicar."}</div></div>
            </div>
          </div>}
        </div>
        <div className="card"><div className="ch"><span className="ct">📝 Conteúdo Gerado</span>{step===3&&<span className="chip ct3">✓ Pronto</span>}</div><div className="cb" style={{paddingTop:3}}>{(output||loading)?<div className="aio" ref={outRef}>{output}{loading&&<span className="cur"/>}</div>:<Empty ico="🤖" title="Aguardando" sub="Configure e clique em Gerar."/>}</div></div>
      </div>
    </div>
  );
}

function IdeasPage(){
  const[topic,setTopic]=useState("");
  const[loading,setLoading]=useState(false);
  const[ideas,setIdeas]=useState([]);
  const gen=async()=>{
    if(!topic.trim())return;
    setLoading(true);setIdeas([]);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`Gere 8 ideias de artigos para o nicho: "${topic}". SOMENTE JSON:\n{"ideas":[{"title":"...","keyword":"...","category":"...","difficulty":"easy|medium|hard","potential":"low|medium|high"}]}`}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      const p=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setIdeas(p.ideas||[]);
    }catch{setIdeas([{title:"Erro ao gerar. Tente novamente.",keyword:"—",category:"Erro",difficulty:"easy",potential:"low"}]);}
    setLoading(false);
  };
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">✦ Gerador de Ideias com IA</span></div>
        <div className="cb" style={{paddingTop:5}}>
          <div style={{display:"flex",gap:8}}>
            <input className="fi" style={{flex:1,height:38}} placeholder="Digite nicho, tema ou palavra-chave..." value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&gen()}/>
            <button className="btn bf" onClick={gen} disabled={loading||!topic.trim()}>{loading?<><div className="spinner"/>Gerando...</>:"✨ Gerar 8 Ideias"}</button>
          </div>
        </div>
      </div>
      {ideas.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {ideas.map((idea,i)=>(
            <div key={i} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e2} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
              <div style={{padding:"13px 15px"}}>
                <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                  <span className="chip cp" style={{fontSize:10}}>{idea.category}</span>
                  <span className="chip" style={{background:{easy:C.terC,medium:C.warnC,hard:C.errC}[idea.difficulty]||C.s2,color:C.on,fontSize:10}}>{({easy:"Fácil",medium:"Médio",hard:"Difícil"})[idea.difficulty]||idea.difficulty}</span>
                  <span className="chip" style={{background:{low:C.s2,medium:C.secC,high:C.pC}[idea.potential]||C.s2,color:C.onV,fontSize:10}}>Pot. {({low:"Baixo",medium:"Médio",high:"Alto"})[idea.potential]||"—"}</span>
                </div>
                <div style={{fontSize:13,fontWeight:600,lineHeight:1.4,marginBottom:5}}>{idea.title}</div>
                <div className="mono" style={{fontSize:10,color:C.onV,marginBottom:8}}>🔑 {idea.keyword}</div>
                <button className="btn bt bsm" style={{fontSize:11}}>✨ Gerar artigo</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading&&ideas.length===0&&<Empty ico="💡" title="Gere ideias de conteúdo" sub="Digite um nicho e a IA retorna 8 ideias com título, keyword e dificuldade."/>}
    </div>
  );
}

function ProjectsPage({go,showToast}){
  const[board,setBoard]=useState(KANBAN);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({col:"📋 Backlog",title:"",tag:"",pri:"med",due:"",assignee:""});
  const colBg={"📋 Backlog":C.secC,"✍️ Produção":C.pC,"👀 Revisão":C.warnC,"✅ Publicado":C.terC};
  const priCol={high:C.err,med:C.warn,low:C.ter};
  const PROJECTS=[{id:1,name:"Projeto SEO Q2 2026",progress:65,posts:12,deadline:"30/06/26"},{id:2,name:"Rebranding Blog",progress:30,posts:5,deadline:"15/07/26"}];
  const add=()=>{
    if(!form.title.trim())return;
    setBoard(b=>({...b,[form.col]:[...b[form.col],{id:Date.now(),title:form.title,tag:form.tag||"Geral",pri:form.pri,due:form.due||"—",assignee:form.assignee||"—"}]}));
    setDlg(false);setForm({col:"📋 Backlog",title:"",tag:"",pri:"med",due:"",assignee:""});
    showToast&&showToast("✅ Tarefa criada!");
  };
  return(
    <div className="fade-in">
      {/* Project switcher */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {PROJECTS.map(proj=>(
          <div key={proj.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:C.s0,borderRadius:12,boxShadow:C.e1,cursor:"pointer",border:`1.5px solid ${C.ovV}`,transition:"all .14s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=C.e2;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.ovV;e.currentTarget.style.boxShadow=C.e1;}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{proj.name}</div>
              <div style={{fontSize:10,color:C.onV,display:"flex",gap:8,marginTop:2}}>
                <span>{proj.posts} posts</span><span>📅 {proj.deadline}</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
              <span className="mono" style={{fontSize:12,fontWeight:800,color:C.p}}>{proj.progress}%</span>
              <div style={{width:60,height:4,background:C.s2,borderRadius:99}}><div style={{height:"100%",width:`${proj.progress}%`,background:C.p,borderRadius:99}}/></div>
            </div>
            <button className="btn bt bsm" style={{fontSize:11,flexShrink:0}} onClick={()=>go&&go("projectdetail",proj)}>Ver →</button>
          </div>
        ))}
        <div style={{flex:1}}/>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Tarefa</button>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:9,alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>{Object.entries(board).map(([k,v])=><span key={k} className="chip cn">{k.split(" ")[1]}: <strong>{v.length}</strong></span>)}</div>
      </div>
      <div className="kb">
        {Object.entries(board).map(([col,cards])=>(
          <div key={col} className="kc">
            <div className="kch"><span className="kct">{col}</span><span className="kcc">{cards.length}</span></div>
            {cards.map(c=>(
              <div key={c.id} className="kkc">
                <div style={{fontSize:12,fontWeight:500,lineHeight:1.4,marginBottom:8}}>{c.title}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:5}}>
                  <span className="chip" style={{background:colBg[col],color:C.on,fontSize:9,padding:"2px 7px"}}>{c.tag}</span>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    {c.due&&c.due!=="—"&&<span className="mono" style={{fontSize:9,color:C.onV}}>{c.due}</span>}
                    <span style={{width:7,height:7,borderRadius:"50%",background:priCol[c.pri],display:"inline-block"}}/>
                  </div>
                </div>
                {c.assignee&&c.assignee!=="—"&&<div style={{fontSize:10,color:C.onV,marginTop:5}}>👤 {c.assignee}</div>}
              </div>
            ))}
            <button className="kadd" onClick={()=>{setForm(f=>({...f,col}));setDlg(true);}}>+ Adicionar</button>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Tarefa" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={add}>Criar</button></>}>
        <Field label="Título *"><input className="fi" placeholder="Descreva a tarefa..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <div className="two">
          <Field label="Coluna"><select className="fi fi-sel" value={form.col} onChange={e=>setForm(f=>({...f,col:e.target.value}))}>{Object.keys(board).map(k=><option key={k} value={k}>{k}</option>)}</select></Field>
          <Field label="Prioridade"><select className="fi fi-sel" value={form.pri} onChange={e=>setForm(f=>({...f,pri:e.target.value}))}><option value="high">Alta</option><option value="med">Média</option><option value="low">Baixa</option></select></Field>
        </div>
        <div className="two">
          <Field label="Tag"><input className="fi" placeholder="SEO, IA..." value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}/></Field>
          <Field label="Prazo"><input className="fi" type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></Field>
        </div>
        <Field label="Responsável"><select className="fi fi-sel" value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))}><option value="">Não atribuído</option>{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
      </Dlg>}
    </div>
  );
}

function AutomationsPage({showToast}){
  const[autos,setAutos]=useState(AUTOS);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",trigger:"",cat:"Publicação"});
  const[running,setRunning]=useState(null);
  const catCls={Publicação:"chip ct3",Social:"chip cp",Notificação:"chip cw",Sistema:"chip cn",SEO:"chip cs",Analytics:"chip co"};
  const tog=id=>setAutos(p=>p.map(a=>a.id===id?{...a,active:!a.active}:a));
  const run=async id=>{setRunning(id);await new Promise(r=>setTimeout(r,1500));setRunning(null);setAutos(p=>p.map(a=>a.id===id?{...a,runs:a.runs+1,last:"agora"}:a));showToast("⚡ Automação executada!");};
  const save=()=>{if(!form.name.trim())return;setAutos(p=>[...p,{id:Date.now(),...form,runs:0,last:"nunca",active:false}]);setDlg(false);setForm({name:"",trigger:"",cat:"Publicação"});};
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:10,marginBottom:13,alignItems:"center"}}>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{autos.filter(a=>a.active).length}/{autos.length} ativas</div><div style={{fontSize:12,color:C.onV}}>{autos.reduce((s,a)=>s+a.runs,0).toLocaleString()} execuções</div></div>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova</button>
      </div>
      <div className="card">
        {autos.map((a,i)=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 17px",borderBottom:i<autos.length-1?`1px solid ${C.ovV}`:"none"}}>
            <Tog on={a.active} onChange={()=>tog(a.id)}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:a.active?C.on:C.onV}}>{a.name}</span>
                <span className={catCls[a.cat]||"chip cn"}>{a.cat}</span>
              </div>
              <div style={{fontSize:11,color:C.onV}}>⚡ {a.trigger}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginRight:6}}><div className="mono" style={{fontSize:13,fontWeight:700}}>{a.runs}×</div><div style={{fontSize:10,color:C.onV}}>{a.last}</div></div>
            <div style={{display:"flex",gap:2}}>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>run(a.id)} disabled={running===a.id}>{running===a.id?<div className="spinner" style={{width:11,height:11}}/>:"▶️"}</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}}>✏️</button>
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setAutos(p=>p.filter(x=>x.id!==a.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Automação" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Auto-publicar ao finalizar" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Gatilho"><input className="fi" placeholder="Ex: Post marcado como Pronto" value={form.trigger} onChange={e=>setForm(f=>({...f,trigger:e.target.value}))}/></Field>
        <Field label="Categoria"><select className="fi fi-sel" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>{["Publicação","Social","Notificação","Sistema","SEO","Analytics"].map(c=><option key={c}>{c}</option>)}</select></Field>
      </Dlg>}
    </div>
  );
}

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

function TemplatesPage({showToast}){
  const[tmpls,setTmpls]=useState(TEMPLATES);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",desc:"",tags:"",prompt:""});
  const save=()=>{if(!form.name.trim())return;setTmpls(p=>[...p,{id:Date.now(),...form,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean),uses:0}]);setDlg(false);setForm({name:"",desc:"",tags:"",prompt:""});showToast("📋 Template criado!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo</button></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {tmpls.map(t=>(
          <div key={t.id} className="card">
            <div style={{padding:"13px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}><div style={{fontSize:13,fontWeight:700}}>{t.name}</div><span className="mono chip cn" style={{fontSize:10}}>{t.uses}×</span></div>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.5,marginBottom:8}}>{t.desc}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>{t.tags.map(tag=><span key={tag} className="chip cp" style={{fontSize:10}}>{tag}</span>)}</div>
              <div style={{display:"flex",gap:7}}><button className="btn bt bsm" style={{flex:1,justifyContent:"center"}}>✨ Usar</button><button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTmpls(p=>p.filter(x=>x.id!==t.id))}>🗑</button></div>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Novo Template" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Salvar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Artigo de Revisão" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Descrição"><input className="fi" placeholder="Objetivo e estrutura..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></Field>
        <Field label="Tags (vírgula)"><input className="fi" placeholder="SEO, Blog..." value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}/></Field>
        <Field label="Prompt para IA"><textarea className="fi fi-ta" placeholder="Use {tema}, {nicho}, {tom} como variáveis." rows={6} value={form.prompt} onChange={e=>setForm(f=>({...f,prompt:e.target.value}))}/></Field>
      </Dlg>}
    </div>
  );
}

function SourcesPage({showToast}){
  const[src,setSrc]=useState(SOURCES);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",type:"RSS",url:"",active:true});
  const tIco={RSS:"📡",YouTube:"▶️",Keyword:"🔑",Scraper:"🕷",Trend:"📈"};
  const save=()=>{setSrc(p=>[...p,{id:Date.now(),...form,items:0,fetch:"nunca"}]);setDlg(false);setForm({name:"",type:"RSS",url:"",active:true});showToast("📡 Fonte adicionada!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13,gap:8}}><button className="btn bo bsm">🔄 Processar todas</button><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Fonte</button></div>
      <div className="card">
        {src.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<src.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:9,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{tIco[s.type]||"📄"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:600}}>{s.name}</span><span className="chip co" style={{fontSize:10}}>{s.type}</span></div>
              <div className="mono" style={{fontSize:11,color:C.onV,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.url}</div>
            </div>
            <div style={{textAlign:"center",margin:"0 6px",flexShrink:0}}><div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{s.items}</div><div style={{fontSize:9,color:C.onV}}>itens</div></div>
            <div style={{fontSize:10,color:C.onV,marginRight:6,flexShrink:0}}>{s.fetch}</div>
            <Tog on={s.active} onChange={v=>setSrc(p=>p.map(x=>x.id===s.id?{...x,active:v}:x))}/>
            <button className="btn bt bsm">✨ Gerar</button>
            <button className="ib" style={{width:24,height:24,fontSize:12}} onClick={()=>setSrc(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Fonte" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Adicionar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Blog Referência" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <div className="two"><Field label="Tipo"><select className="fi fi-sel" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{["RSS","YouTube","Keyword","Scraper","Trend"].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Ativa"><div style={{display:"flex",alignItems:"center",height:36,gap:9}}><Tog on={form.active} onChange={v=>setForm(f=>({...f,active:v}))}/><span style={{fontSize:13,color:C.onV}}>{form.active?"Sim":"Não"}</span></div></Field></div>
        <Field label="URL / Termo"><input className="fi" placeholder="https://..." value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))}/></Field>
      </Dlg>}
    </div>
  );
}

function MediaPage(){
  const[view,setView]=useState("grid");
  const[search,setSearch]=useState("");
  const tIco={image:"🖼",pdf:"📄",video:"🎬"};
  const tColor={image:C.pC,pdf:C.errC,video:C.terC};
  const filtered=MEDIA.filter(m=>m.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:8,marginBottom:13,alignItems:"center"}}>
        <input className="fi" style={{flex:1,height:36,padding:"7px 12px"}} placeholder="🔍  Buscar mídia..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <button onClick={()=>setView("grid")} className="ib" style={{background:view==="grid"?C.pC:"transparent",fontSize:14}}>⊞</button>
        <button onClick={()=>setView("list")} className="ib" style={{background:view==="list"?C.pC:"transparent",fontSize:14}}>☰</button>
        <button className="btn bf bsm">⬆ Upload</button>
      </div>
      {view==="grid"
        ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10}}>
          {filtered.map(m=><div key={m.id} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e3} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
            <div style={{height:85,background:tColor[m.type],display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{tIco[m.type]}</div>
            <div style={{padding:"8px 10px"}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{m.name}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{m.size}</div>{m.used>0&&<span className="chip cn" style={{marginTop:4,fontSize:9}}>usado {m.used}×</span>}</div>
          </div>)}
        </div>
        :<div className="card"><table className="dt"><thead><tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Data</th><th>Uso</th><th></th></tr></thead><tbody>{filtered.map(m=><tr key={m.id}><td><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{tIco[m.type]}</span><span style={{fontWeight:500}}>{m.name}</span></div></td><td><span className="chip cn" style={{fontSize:10}}>{m.type}</span></td><td className="mono" style={{fontSize:11,color:C.onV}}>{m.size}</td><td className="mono" style={{fontSize:11,color:C.onV}}>{m.date}</td><td className="mono">{m.used}×</td><td><button className="ib" style={{width:24,height:24,fontSize:12}}>🗑</button></td></tr>)}</tbody></table></div>
      }
    </div>
  );
}

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

function BackupPage({showToast}){
  const[bkps,setBkps]=useState(BACKUPS);
  const[backing,setBacking]=useState(false);
  const doBackup=async()=>{setBacking(true);await new Promise(r=>setTimeout(r,2500));setBkps(p=>[{id:Date.now(),name:"backup-manual-"+new Date().toISOString().slice(0,10),date:new Date().toLocaleString("pt-BR").slice(0,16),posts:247,size:"12.4 MB",type:"manual",status:"ok"},...p]);setBacking(false);showToast("💾 Backup criado!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",gap:9,marginBottom:13,alignItems:"center"}}>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{bkps.length} backups</div><div style={{fontSize:12,color:C.onV}}>Próximo automático: Segunda, 02:00</div></div>
        <button className="btn bf" onClick={doBackup} disabled={backing}>{backing?<><div className="spinner"/>Criando...</>:"💾 Backup Agora"}</button>
      </div>
      <div className="card" style={{marginBottom:13}}>
        {bkps.map((b,i)=>(
          <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<bkps.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:34,height:34,borderRadius:8,background:b.type==="auto"?C.pC:C.terC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{b.type==="auto"?"🤖":"💾"}</div>
            <div style={{flex:1}}><div className="mono" style={{fontSize:12,fontWeight:500}}>{b.name}</div><div style={{fontSize:11,color:C.onV,marginTop:1}}>{b.date} · {b.posts} posts · {b.size}</div></div>
            <SChip status={b.type}/><SChip status={b.status}/>
            <button className="btn bo bsm">⬇ Restaurar</button>
            <button className="ib" style={{width:24,height:24,fontSize:12}} onClick={()=>setBkps(p=>p.filter(x=>x.id!==b.id))}>🗑</button>
          </div>
        ))}
      </div>
      <div className="card"><div className="ch"><span className="ct">⚙️ Configuração</span></div><div className="cb" style={{paddingTop:6}}>
        <div className="two"><Field label="Frequência"><select className="fi fi-sel" defaultValue="weekly"><option value="daily">Diário</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option></select></Field><Field label="Horário"><input className="fi" defaultValue="02:00"/></Field></div>
        <div className="two"><Field label="Retenção"><select className="fi fi-sel" defaultValue="10">{["5","10","20"].map(v=><option key={v} value={v}>Últimos {v}</option>)}</select></Field><Field label="Destino"><select className="fi fi-sel"><option>Servidor local</option><option>Amazon S3</option><option>Google Drive</option></select></Field></div>
        <button className="btn bf bsm" onClick={()=>showToast("⚙️ Configuração salva!")}>💾 Salvar</button>
      </div></div>
    </div>
  );
}

function CompetitorPage(){
  const[analyzing,setAnalyzing]=useState(null);
  const[insights,setInsights]=useState({});
  const analyze=async id=>{
    setAnalyzing(id);await new Promise(r=>setTimeout(r,2200));
    const c=COMPETITORS.find(x=>x.id===id);
    setInsights(p=>({...p,[id]:`Análise concluída. ${c.name} publica ${c.freq} sobre ${c.topics.join(" e ")}. Lacunas: automação e CRO são pontos fracos. Oportunidade: artigos long-form sobre WordPress superam o DA ${c.da} atual.`}));
    setAnalyzing(null);
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm">➕ Monitorar</button></div>
      {COMPETITORS.map(c=>(
        <div key={c.id} className="card" style={{marginBottom:12}}>
          <div style={{padding:"14px 17px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:11,marginBottom:11}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:C.onPC,flexShrink:0}}>{c.name[0]}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{c.name}</div><div className="mono" style={{fontSize:11,color:C.onV}}>{c.url}</div></div>
              <div style={{textAlign:"right"}}><div className="mono" style={{fontSize:22,fontWeight:800,color:C.p}}>{c.da}</div><div style={{fontSize:10,color:C.onV}}>Domain Authority</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:11}}>
              {[["Posts",c.posts],["Freq.",c.freq],["Tráfego",c.traffic],["Tópicos",c.topics.length]].map(([k,v])=>(
                <div key={k} style={{background:C.s1,borderRadius:7,padding:"7px 9px",textAlign:"center"}}><div style={{fontSize:9,color:C.onV,fontWeight:700,marginBottom:2}}>{k}</div><div className="mono" style={{fontSize:12,fontWeight:700}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>{c.topics.map(t=><span key={t} className="chip cp">{t}</span>)}</div>
            {insights[c.id]&&<div style={{padding:"8px 11px",background:C.pC,borderRadius:9,fontSize:12,color:C.onPC,lineHeight:1.6,marginBottom:10}}>💡 {insights[c.id]}</div>}
            <button className="btn bf bsm" onClick={()=>analyze(c.id)} disabled={analyzing===c.id}>{analyzing===c.id?<><div className="spinner" style={{width:11,height:11}}/>Analisando...</>:"🔍 Analisar com IA"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WebStoriesPage({showToast}){
  const[stories,setStories]=useState(WEBSTORIES);
  const[dlg,setDlg]=useState(false);
  const[editing,setEditing]=useState(null);
  const[form,setForm]=useState({title:"",slides:5});
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13,gap:8}}><button className="btn bo bsm">📖 Do Post</button><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Story</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {stories.map(s=>(
          <div key={s.id} className="card" style={{cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.e3} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.e1}>
            <div style={{height:125,background:`linear-gradient(135deg,${C.p},${C.ter})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{textAlign:"center",color:"#fff",padding:"0 12px"}}><div style={{fontSize:24,marginBottom:4}}>📱</div><div style={{fontSize:13,fontWeight:700,lineHeight:1.3}}>{s.title}</div></div>
              <div style={{position:"absolute",top:7,right:7}}><SChip status={s.status}/></div>
            </div>
            <div style={{padding:"11px 13px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><span className="mono" style={{fontSize:11,color:C.onV}}>{s.slides} slides · {s.date}</span>{s.views>0&&<span className="mono" style={{fontSize:12,color:C.p,fontWeight:700}}>{s.views.toLocaleString()} views</span>}</div>
              <div style={{display:"flex",gap:7}}>
                <button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>setEditing(s)}>✏️ Editar</button>
                {s.status==="published"&&<button className="btn bo bsm">📤 WP</button>}
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setStories(p=>p.filter(x=>x.id!==s.id))}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {dlg&&<Dlg title="Nova Web Story" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={()=>{if(!form.title.trim())return;setStories(p=>[...p,{id:Date.now(),...form,status:"draft",views:0,date:"—"}]);setDlg(false);setForm({title:"",slides:5});showToast("📱 Story criada!");}}>✨ Criar</button></>}>
        <Field label="Título *"><input className="fi" placeholder="Ex: 5 dicas de SEO para 2026" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></Field>
        <Field label="Slides"><input className="fi" type="number" min={3} max={20} value={form.slides} onChange={e=>setForm(f=>({...f,slides:+e.target.value||5}))}/></Field>
        <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:12,color:C.onPC}}>✨ A IA gera o conteúdo de cada slide.</div>
      </Dlg>}
      {editing&&<Dlg title={`Editando: ${editing.title}`} onClose={()=>setEditing(null)} wide footer={<><button className="btn bo" onClick={()=>setEditing(null)}>Fechar</button><button className="btn bf" onClick={()=>{setEditing(null);showToast("📱 Story salva!");}}>💾 Salvar</button></>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {[...Array(editing.slides)].map((_,i)=>(
            <div key={i} style={{borderRadius:9,background:`linear-gradient(160deg,${[C.pC,C.terC,C.secC,C.warnC,C.errC][i%5]},${C.s2})`,aspectRatio:"9/16",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.on,cursor:"pointer",padding:"7px",textAlign:"center",border:`2px solid ${C.ovV}`,transition:"border .14s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.p}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.ovV}>
              <div style={{fontSize:18,marginBottom:3}}>{["🚀","💡","⚡","🎯","✅","🔥","📊","🌟","💎","🎨"][i%10]}</div>
              Slide {i+1}
            </div>
          ))}
        </div>
      </Dlg>}
    </div>
  );
}

function ReportsPage({showToast}){
  const[generating,setGenerating]=useState(false);
  const[genType,setGenType]=useState(null);
  const[type,setType]=useState("performance");
  const[period,setPeriod]=useState("30d");
  const[reports,setReports]=useState([
    {id:1,ico:"📊",name:"Performance — Abril 2026",type:"performance",period:"30d",rows:247,created:"01/05/26 09:00",status:"ready"},
    {id:2,ico:"🔍",name:"SEO Audit — Semana 18",type:"seo",period:"7d",rows:POSTS.length,created:"29/04/26 18:00",status:"ready"},
    {id:3,ico:"⚡",name:"Automações — Abril 2026",type:"automations",period:"30d",rows:AUTOS.length,created:"01/05/26 09:00",status:"ready"},
  ]);

  const gen=async()=>{
    setGenerating(true);setGenType(type);
    await new Promise(r=>setTimeout(r,2200));
    const labels={performance:"Performance",seo:"SEO",automations:"Automações",team:"Produtividade",wordpress:"WordPress"};
    const icons={performance:"📊",seo:"🔍",automations:"⚡",team:"👥",wordpress:"⊞"};
    const newRep={id:Date.now(),ico:icons[type]||"📈",name:`${labels[type]||type} — ${new Date().toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}`,type,period,rows:Math.floor(Math.random()*200)+50,created:new Date().toLocaleString("pt-BR").slice(0,16),status:"ready"};
    setReports(p=>[newRep,...p]);
    setGenerating(false);setGenType(null);
    showToast(`📊 Relatório "${newRep.name}" gerado!`);
  };

  const mult={"7d":.25,"30d":1,"90d":2.8,"all":11}[period]||1;
  const metrics=[
    {l:"Total de Views",v:Math.round(42800*mult).toLocaleString(),trend:"+23%",cls:"mcp"},
    {l:"Score SEO Médio",v:"88/100",trend:"↑ 5pts",cls:"mct"},
    {l:"Posts Publicados",v:Math.round(32*mult),trend:"+18%",cls:"mcs"},
    {l:"Automações",v:Math.round(211*mult),trend:"execuções",cls:"mce"},
  ];

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">📊 Gerar Novo Relatório</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two" style={{marginBottom:10}}>
            <Field label="Tipo de relatório">
              <select className="fi fi-sel" value={type} onChange={e=>setType(e.target.value)}>
                <option value="performance">📊 Performance de Conteúdo</option>
                <option value="seo">🔍 SEO & Palavras-chave</option>
                <option value="automations">⚡ Automações</option>
                <option value="team">👥 Produtividade da Equipe</option>
                <option value="wordpress">⊞ Publicações WordPress</option>
              </select>
            </Field>
            <Field label="Período">
              <select className="fi fi-sel" value={period} onChange={e=>setPeriod(e.target.value)}>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
            </Field>
          </div>
          <div className="mg" style={{marginBottom:12}}>
            {metrics.map((m,i)=><div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.trend}</div></div>)}
          </div>
          <button className="btn bf bsm" onClick={gen} disabled={generating}>{generating?<><div className="spinner"/>Gerando relatório...</>:"📊 Gerar Relatório"}</button>
        </div>
      </div>

      <div className="card">
        <div className="ch"><span className="ct">📋 Relatórios Salvos</span><button className="btn bo bsm" onClick={()=>showToast("🗑 Relatórios limpos!")}>🗑 Limpar</button></div>
        {reports.length===0&&<Empty ico="📊" title="Sem relatórios" sub="Gere seu primeiro relatório acima."/>}
        {reports.map((r,i)=>(
          <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderBottom:i<reports.length-1?`1px solid ${C.ovV}`:"none"}}>
            <div style={{width:38,height:38,borderRadius:9,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.ico}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{r.name}</div>
              <div style={{fontSize:11,color:C.onV,display:"flex",gap:10}}>
                <span className="mono">{r.rows} registros</span>
                <span>· Período: {r.period}</span>
                <span>· {r.created}</span>
              </div>
            </div>
            <SChip status="active"/>
            <div style={{display:"flex",gap:6}}>
              <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>showToast(`⬇ ${r.name} baixado como PDF!`)}>⬇ PDF</button>
              <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>showToast(`⬇ ${r.name} baixado como CSV!`)}>⬇ CSV</button>
              <button className="ib" style={{width:26,height:26,fontSize:11}} onClick={()=>setReports(p=>p.filter(x=>x.id!==r.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function CreatePostPage({go}){
  return(
    <div className="fade-in">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        {[{id:"editor",data:{},ico:"⚡",t:"Quick Post",d:"Editor completo com SEO em tempo real",bg:C.pC},{id:"ai",data:null,ico:"✨",t:"Post via IA",d:"Configure tema, tom, nicho — IA escreve tudo",bg:C.terC},{id:"recurring",data:null,ico:"🔄",t:"Post Recorrente",d:"Configure cronograma com publicação automática",bg:C.secC}].map((m,i)=>(
          <div key={i} className="card" style={{cursor:"pointer",transition:"all .16s"}} onClick={()=>go(m.id,m.data)} onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.e3;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.e1;e.currentTarget.style.transform="none";}}>
            <div style={{padding:"22px 16px",textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:12,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 11px"}}>{m.ico}</div>
              <div style={{fontSize:13,fontWeight:800,marginBottom:5}}>{m.t}</div>
              <div style={{fontSize:12,color:C.onV,lineHeight:1.6}}>{m.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 15px",background:C.terC,borderRadius:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:19}}>💡</div>
        <div style={{fontSize:12,color:C.onTerC,lineHeight:1.6}}>Use <strong>Post via IA</strong> para gerar artigos completos com SEO via Claude AI, ou <strong>Quick Post</strong> para escrever diretamente com análise SEO em tempo real.</div>
      </div>
    </div>
  );
}

/* ══ NOTIF PANEL ══════════════════════════════════════════ */
function NotifPanel({onClose}){
  const[ns,setNs]=useState(NOTIFS);
  const unread=ns.filter(n=>!n.read).length;
  return(
    <div className="np" onClick={e=>e.stopPropagation()}>
      <div style={{padding:"11px 13px",borderBottom:`1px solid ${C.ovV}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:700,fontSize:13}}>Notificações{unread>0&&<span className="chip ce" style={{marginLeft:6,fontSize:10}}>{unread}</span>}</div>
        <div style={{display:"flex",gap:3}}><button className="btn bx bsm" style={{fontSize:11}} onClick={()=>setNs(p=>p.map(n=>({...n,read:true})))}>Lidas</button><button className="ib" style={{width:24,height:24,fontSize:12}} onClick={onClose}>✕</button></div>
      </div>
      {ns.map((n,i)=>(
        <div key={n.id} style={{display:"flex",gap:8,padding:"10px 13px",borderBottom:i<ns.length-1?`1px solid ${C.ovV}`:"none",background:n.read?"transparent":`${C.pC}44`,cursor:"pointer"}} onClick={()=>setNs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
          <div style={{width:28,height:28,borderRadius:7,background:{success:C.terC,info:C.pC,warning:C.warnC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{n.ico}</div>
          <div style={{flex:1}}><div style={{fontSize:12,lineHeight:1.4,fontWeight:n.read?400:600}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV,marginTop:1}}>{n.time}</div></div>
          {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:C.p,flexShrink:0,marginTop:5}}/>}
        </div>
      ))}
    </div>
  );
}

/* ══ SUPPORT CENTER ══════════════════════════════════════ */
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

/* ══ INTEGRATIONS HUB ════════════════════════════════════ */
function IntegrationsPage({showToast}){
  const[tab,setTab]=useState("platforms");
  const[webhookDlg,setWebhookDlg]=useState(false);
  const[webhooks,setWebhooks]=useState([
    {id:1,name:"Notify Slack on publish",url:"https://hooks.slack.com/...",event:"post.published",active:true,calls:34},
    {id:2,name:"Update CRM on new post",url:"https://api.crm.com/webhook/...",event:"post.created",active:false,calls:8},
  ]);
  const[wForm,setWForm]=useState({name:"",url:"",event:"post.published"});

  const PLATFORMS=[
    {id:"wordpress",ico:"⊞",name:"WordPress",desc:"Publicação via REST API",status:"connected",count:"4 sites",color:C.terC},
    {id:"twitter",ico:"𝕏",name:"Twitter / X",desc:"Auto-compartilhamento de posts",status:"disconnected",count:"—",color:C.s1},
    {id:"linkedin",ico:"in",name:"LinkedIn",desc:"Publicar artigos automaticamente",status:"disconnected",count:"—",color:C.s1},
    {id:"instagram",ico:"📸",name:"Instagram",desc:"Compartilhar Web Stories e imagens",status:"disconnected",count:"—",color:C.s1},
    {id:"facebook",ico:"📘",name:"Facebook",desc:"Publicar no feed e grupos",status:"disconnected",count:"—",color:C.s1},
    {id:"mailchimp",ico:"🐒",name:"Mailchimp",desc:"Enviar newsletter ao publicar",status:"disconnected",count:"—",color:C.s1},
    {id:"analytics",ico:"📊",name:"Google Analytics",desc:"Métricas de tráfego e conversão",status:"disconnected",count:"—",color:C.s1},
    {id:"semrush",ico:"🔍",name:"Semrush",desc:"Dados de SEO e palavras-chave",status:"disconnected",count:"—",color:C.s1},
    {id:"slack",ico:"💬",name:"Slack",desc:"Notificações de publicação",status:"disconnected",count:"—",color:C.s1},
    {id:"zapier",ico:"⚡",name:"Zapier",desc:"Conectar com 5000+ apps",status:"disconnected",count:"—",color:C.s1},
  ];

  const saveWH=()=>{
    if(!wForm.name||!wForm.url)return;
    setWebhooks(p=>[...p,{id:Date.now(),...wForm,active:true,calls:0}]);
    setWebhookDlg(false);setWForm({name:"",url:"",event:"post.published"});
    showToast("🔗 Webhook criado!");
  };

  return(
    <div className="fade-in">
      <div className="tabs">
        {[{id:"platforms",l:"🔌 Plataformas"},{id:"webhooks",l:"🔗 Webhooks"},{id:"oauth",l:"🔐 OAuth Apps"},{id:"api",l:"🔑 API Keys"}].map(t=>(
          <div key={t.id} className={`tabi ${tab===t.id?"a":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>
        ))}
      </div>

      {tab==="platforms"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {PLATFORMS.map(p=>(
            <div key={p.id} className="card">
              <div style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:42,borderRadius:11,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:p.id==="linkedin"?15:20,fontWeight:800,flexShrink:0,color:p.id==="linkedin"?"#0A66C2":C.on}}>{p.ico}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.onV}}>{p.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <SChip status={p.status==="connected"?"active":"inactive"}/>
                  {p.count!=="—"&&<div className="mono" style={{fontSize:10,color:C.onV,marginTop:3}}>{p.count}</div>}
                </div>
              </div>
              <div style={{padding:"0 15px 13px"}}>
                <button className="btn bsm" style={{width:"100%",justifyContent:"center",background:p.status==="connected"?C.s2:C.p,color:p.status==="connected"?C.onV:C.onP,borderRadius:999}} onClick={()=>showToast(p.status==="connected"?`⚙️ Gerenciando ${p.name}...`:`🔌 Conectando ${p.name}...`)}>
                  {p.status==="connected"?"⚙️ Gerenciar":"🔌 Conectar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="webhooks"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}>
            <button className="btn bf bsm" onClick={()=>setWebhookDlg(true)}>➕ Novo Webhook</button>
          </div>
          <div className="card" style={{marginBottom:13}}>
            {webhooks.map((w,i)=>(
              <div key={w.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<webhooks.length-1?`1px solid ${C.ovV}`:"none"}}>
                <Tog on={w.active} onChange={()=>setWebhooks(p=>p.map(x=>x.id===w.id?{...x,active:!x.active}:x))}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{w.name}</div>
                  <div className="mono" style={{fontSize:10,color:C.onV,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.url}</div>
                  <span className="chip cn" style={{fontSize:9,marginTop:3}}>{w.event}</span>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginRight:8}}>
                  <div className="mono" style={{fontSize:13,fontWeight:700,color:C.p}}>{w.calls}</div>
                  <div style={{fontSize:10,color:C.onV}}>chamadas</div>
                </div>
                <button className="ib" style={{width:26,height:26,fontSize:12}}>▶️</button>
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setWebhooks(p=>p.filter(x=>x.id!==w.id))}>🗑</button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📋 Eventos disponíveis</span></div>
            <div className="cb" style={{paddingTop:4}}>
              {["post.created","post.published","post.updated","post.deleted","automation.triggered","wordpress.synced","backup.completed","seo.score_low"].map((e,i,arr)=>(
                <div key={e} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:i<arr.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <span className="mono" style={{fontSize:12}}>{e}</span>
                  <button className="btn bx bsm" style={{fontSize:11}} onClick={()=>{setWForm(f=>({...f,event:e}));setWebhookDlg(true);}}>+ Webhook</button>
                </div>
              ))}
            </div>
          </div>
          {webhookDlg&&<Dlg title="Novo Webhook" onClose={()=>setWebhookDlg(false)}
            footer={<><button className="btn bo" onClick={()=>setWebhookDlg(false)}>Cancelar</button><button className="btn bf" onClick={saveWH}>Criar</button></>}>
            <Field label="Nome *"><input className="fi" placeholder="Ex: Notify Slack on publish" value={wForm.name} onChange={e=>setWForm(f=>({...f,name:e.target.value}))}/></Field>
            <Field label="URL *"><input className="fi" placeholder="https://hooks.example.com/..." value={wForm.url} onChange={e=>setWForm(f=>({...f,url:e.target.value}))}/></Field>
            <Field label="Evento">
              <select className="fi fi-sel" value={wForm.event} onChange={e=>setWForm(f=>({...f,event:e.target.value}))}>
                {["post.created","post.published","post.updated","automation.triggered","backup.completed"].map(ev=><option key={ev}>{ev}</option>)}
              </select>
            </Field>
            <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:12,color:C.onPC}}>💡 Enviamos um POST JSON ao URL configurado quando o evento ocorrer.</div>
          </Dlg>}
        </div>
      )}

      {tab==="oauth"&&(
        <div className="card">
          <div className="ch"><span className="ct">🔐 Aplicações OAuth conectadas</span></div>
          <div className="cb">
            {[{name:"AutomatikPOST Mobile",scope:"posts:read posts:write",created:"01/04/26",last:"09/05/26"},{name:"Zapier Integration",scope:"posts:read automations:write",created:"15/03/26",last:"08/05/26"}].map((app,i)=>(
              <div key={i} style={{padding:"12px 0",borderBottom:i<1?`1px solid ${C.ovV}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontSize:13,fontWeight:600}}>{app.name}</div>
                  <button className="btn ber bsm" style={{fontSize:11}}>Revogar</button>
                </div>
                <div style={{fontSize:11,color:C.onV}}>Escopos: <span className="mono">{app.scope}</span></div>
                <div style={{fontSize:11,color:C.onV,marginTop:2}}>Criado: {app.created} · Último uso: {app.last}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="api"&&(
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">🔑 Sua API Key</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:10}}>
                <div className="fi mono" style={{flex:1,fontSize:12,color:C.onV,letterSpacing:1,padding:"9px 12px"}}>apk_live_••••••••••••••••••••••••••••••••</div>
                <button className="btn bt bsm" onClick={()=>showToast("📋 API Key copiada!")}>📋 Copiar</button>
                <button className="btn ber bsm" onClick={()=>showToast("🔄 Nova chave gerada!")}>🔄 Regenerar</button>
              </div>
              <div style={{padding:"9px 12px",background:C.warnC,borderRadius:9,fontSize:12,color:C.warn}}>⚠️ Nunca compartilhe sua API Key. Regenerar invalida a chave atual.</div>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📡 Endpoints da API REST</span></div>
            <div className="cb" style={{paddingTop:4}}>
              {[{m:"GET",ep:"/api/v1/posts",d:"Listar todos os posts"},{m:"POST",ep:"/api/v1/posts",d:"Criar novo post"},{m:"PUT",ep:"/api/v1/posts/:id",d:"Atualizar post"},{m:"DELETE",ep:"/api/v1/posts/:id",d:"Deletar post"},{m:"POST",ep:"/api/v1/generate",d:"Gerar conteúdo com IA"},{m:"GET",ep:"/api/v1/analytics",d:"Métricas de performance"}].map((e,i,arr)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <span className="chip" style={{background:{GET:C.terC,POST:C.pC,PUT:C.warnC,DELETE:C.errC}[e.m],color:C.on,fontSize:10,minWidth:42,justifyContent:"center"}}>{e.m}</span>
                  <span className="mono" style={{fontSize:12,flex:1}}>{e.ep}</span>
                  <span style={{fontSize:12,color:C.onV}}>{e.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ SEO DEEP ANALYSIS ═══════════════════════════════════ */
function SEODeepPage(){
  const[url,setUrl]=useState("");
  const[kw,setKw]=useState("");
  const[analyzing,setAnalyzing]=useState(false);
  const[result,setResult]=useState(null);

  const analyze=async()=>{
    if(!kw.trim())return;
    setAnalyzing(true);setResult(null);
    await new Promise(r=>setTimeout(r,2200));
    setResult({
      score:84,
      title:{ok:true,val:"10 Estratégias de SEO para 2026 — Guia Completo"},
      metaDesc:{ok:true,len:148,val:"Descubra as 10 estratégias de SEO mais eficazes para 2026. Aprenda técnicas avançadas de link building, conteúdo e muito mais."},
      keywords:[{kw:kw,density:"2.1%",count:12,ok:true},{kw:kw+" 2026",density:"0.9%",count:5,ok:true},{kw:"estratégia "+kw,density:"0.4%",count:2,ok:false}],
      headings:{h1:1,h2:4,h3:6,ok:true},
      wordCount:1842,
      readability:{score:68,grade:"Fácil",ok:true},
      links:{internal:6,external:3,broken:0,ok:true},
      images:{total:4,withAlt:3,withoutAlt:1,ok:false},
      pageSpeed:{mobile:72,desktop:91},
      issues:[{severity:"warning",msg:"1 imagem sem atributo alt"},
        {severity:"info",msg:"Adicionar FAQ Schema para featured snippets"},
        {severity:"info",msg:"Incluir mais variações long-tail da keyword principal"}],
    });
    setAnalyzing(false);
  };

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">🔍 Análise SEO Aprofundada</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="URL do Post (opcional)"><input className="fi" placeholder="https://blog.exemplo.com.br/artigo" value={url} onChange={e=>setUrl(e.target.value)}/></Field>
            <Field label="Palavra-chave principal *"><input className="fi" placeholder="Ex: estratégias de seo" value={kw} onChange={e=>setKw(e.target.value)}/></Field>
          </div>
          <button className="btn bf bsm" onClick={analyze} disabled={analyzing||!kw.trim()}>{analyzing?<><div className="spinner"/>Analisando...</>:"🔍 Analisar SEO"}</button>
        </div>
      </div>

      {result&&(
        <div className="fade-in">
          <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",background:C.s0,borderRadius:16,boxShadow:C.e1,marginBottom:14}}>
            <Ring score={result.score} size={64}/>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:800,color:result.score>=80?C.ter:result.score>=60?C.warn:C.err}}>Score SEO: {result.score}/100</div>
              <div style={{fontSize:13,color:C.onV,marginTop:3}}>{result.score>=80?"Excelente — pronto para publicar!":result.score>=60?"Bom — alguns ajustes recomendados":"Melhorias necessárias antes de publicar"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Mobile",v:result.pageSpeed.mobile,c:result.pageSpeed.mobile>=80?C.ter:C.warn},{l:"Desktop",v:result.pageSpeed.desktop,c:result.pageSpeed.desktop>=80?C.ter:C.warn}].map(s=>(
                <div key={s.l} style={{background:C.s1,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.onV,fontWeight:700,marginBottom:3}}>{s.l}</div>
                  <div className="mono" style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {result.issues.length>0&&(
            <div className="card" style={{marginBottom:14}}>
              <div className="ch"><span className="ct">⚠️ Problemas Detectados</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {result.issues.map((iss,i)=>(
                  <div key={i} style={{display:"flex",gap:9,padding:"8px 0",borderBottom:i<result.issues.length-1?`1px solid ${C.ovV}`:"none",alignItems:"flex-start"}}>
                    <span className="chip" style={{background:{warning:C.warnC,info:C.pC,error:C.errC}[iss.severity],color:C.on,fontSize:9,flexShrink:0}}>{iss.severity.toUpperCase()}</span>
                    <span style={{fontSize:13,color:C.onV}}>{iss.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="two">
            <div className="card">
              <div className="ch"><span className="ct">📋 Checklist Detalhado</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {[
                  {l:"Título H1 otimizado",ok:result.title.ok,detail:result.title.val.slice(0,50)+"…"},
                  {l:"Meta description completa",ok:result.metaDesc.ok,detail:`${result.metaDesc.len}/160 chars`},
                  {l:"Estrutura de headings",ok:result.headings.ok,detail:`H1: ${result.headings.h1} · H2: ${result.headings.h2} · H3: ${result.headings.h3}`},
                  {l:"Contagem de palavras",ok:result.wordCount>=800,detail:`${result.wordCount} palavras`},
                  {l:"Links internos/externos",ok:result.links.ok,detail:`${result.links.internal} internos · ${result.links.external} externos`},
                  {l:"Imagens com alt text",ok:result.images.ok,detail:`${result.images.withAlt}/${result.images.total} com alt`},
                  {l:"Legibilidade",ok:result.readability.ok,detail:`Score: ${result.readability.score} — ${result.readability.grade}`},
                  {l:"Links quebrados",ok:result.links.broken===0,detail:result.links.broken===0?"Nenhum encontrado":`${result.links.broken} links quebrados`},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<7?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:14,flexShrink:0}}>{c.ok?"✅":"⚠️"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:c.ok?C.on:C.onV}}>{c.l}</div>
                      <div style={{fontSize:11,color:C.onV}}>{c.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">🔑 Análise de Keywords</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {result.keywords.map((k,i)=>(
                  <div key={i} style={{padding:"10px 0",borderBottom:i<result.keywords.length-1?`1px solid ${C.ovV}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span className="mono" style={{fontSize:12,fontWeight:600}}>{k.kw}</span>
                      <span style={{fontSize:12,fontWeight:700,color:k.ok?C.ter:C.warn,fontFamily:"'JetBrains Mono',monospace"}}>{k.density}</span>
                    </div>
                    <div className="pb"><div className="pbf" style={{width:`${parseFloat(k.density)*20}%`,background:k.ok?C.ter:C.warn}}/></div>
                    <div style={{fontSize:11,color:C.onV,marginTop:3}}>{k.count} ocorrências · {k.ok?"✓ densidade ideal":"⚠️ aumentar frequência"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {!result&&!analyzing&&<Empty ico="🔍" title="Analisar SEO do post" sub="Informe a palavra-chave e clique em Analisar para obter um relatório completo."/>}
    </div>
  );
}

/* ══ AB TESTING ═══════════════════════════════════════════ */
function ABTestingPage({showToast}){
  const[tests,setTests]=useState([
    {id:1,name:"Título SEO vs Clickbait",postTitle:"10 Estratégias de SEO para 2026",varA:"10 Estratégias de SEO para 2026 que Você Precisa Conhecer",varB:"Esses 10 Truques de SEO Vão Triplicar seu Tráfego em 2026",status:"running",winner:null,aViews:1240,bViews:1180,aCtr:4.2,bCtr:5.8,startDate:"02/05/26",endDate:"—"},
    {id:2,name:"CTA no final vs meio do artigo",postTitle:"E-mail Marketing: Táticas de Segmentação",varA:"CTA posicionado no final do artigo",varB:"CTA posicionado após o segundo H2",status:"completed",winner:"B",aViews:980,bViews:950,aCtr:1.8,bCtr:3.2,startDate:"01/04/26",endDate:"30/04/26"},
  ]);
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",postTitle:"",varA:"",varB:"",duration:14});

  const save=()=>{
    if(!form.name||!form.varA||!form.varB)return;
    setTests(p=>[...p,{id:Date.now(),...form,status:"running",winner:null,aViews:0,bViews:0,aCtr:0,bCtr:0,startDate:new Date().toLocaleDateString("pt-BR").slice(0,8),endDate:"—"}]);
    setDlg(false);setForm({name:"",postTitle:"",varA:"",varB:"",duration:14});
    showToast("🔬 Teste A/B iniciado!");
  };

  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Novo Teste A/B</button>
      </div>
      {tests.map(t=>(
        <div key={t.id} className="card" style={{marginBottom:13}}>
          <div style={{padding:"14px 17px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{t.name}</div>
                <div style={{fontSize:12,color:C.onV}}>{t.postTitle}</div>
              </div>
              <div style={{display:"flex",gap:7,flexShrink:0,alignItems:"center"}}>
                {t.winner&&<span className="chip ct3">✓ Variante {t.winner} venceu</span>}
                <SChip status={t.status==="running"?"active":"inactive"}/>
              </div>
            </div>
            <div className="two" style={{marginBottom:12}}>
              {[{l:"A",title:t.varA,views:t.aViews,ctr:t.aCtr,winner:t.winner==="A"},{l:"B",title:t.varB,views:t.bViews,ctr:t.bCtr,winner:t.winner==="B"}].map(v=>(
                <div key={v.l} style={{padding:"12px",background:v.winner?C.terC:C.s1,borderRadius:11,border:v.winner?`2px solid ${C.ter}`:`1.5px solid ${C.ovV}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span style={{fontSize:12,fontWeight:800,color:v.winner?C.ter:C.onV}}>Variante {v.l}{v.winner&&" 🏆"}</span>
                    <span className="mono" style={{fontSize:11,fontWeight:700,color:C.p}}>CTR: {v.ctr}%</span>
                  </div>
                  <div style={{fontSize:12,color:C.onV,lineHeight:1.5,marginBottom:8}}>{v.title}</div>
                  <div style={{display:"flex",gap:12}}>
                    <div><div className="mono" style={{fontSize:14,fontWeight:800,color:C.on}}>{v.views.toLocaleString()}</div><div style={{fontSize:10,color:C.onV}}>visualizações</div></div>
                    <div><div className="mono" style={{fontSize:14,fontWeight:800,color:v.ctr>=(v.l==="A"?t.bCtr:t.aCtr)?C.ter:C.onV}}>{v.ctr}%</div><div style={{fontSize:10,color:C.onV}}>CTR</div></div>
                  </div>
                  <div className="pb" style={{marginTop:8}}><div className="pbf" style={{width:`${(v.views/(t.aViews+t.bViews||1))*100}%`,background:v.winner?C.ter:C.p}}/></div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <div className="mono" style={{fontSize:11,color:C.onV,flex:1}}>Iniciado: {t.startDate}{t.endDate!=="—"?` · Concluído: ${t.endDate}`:""}</div>
              {t.status==="running"&&<button className="btn ber bsm" onClick={()=>{setTests(p=>p.map(x=>x.id===t.id?{...x,status:"completed",winner:t.bCtr>t.aCtr?"B":"A",endDate:new Date().toLocaleDateString("pt-BR").slice(0,8)}:x));showToast("🔬 Teste encerrado!");}}>Encerrar</button>}
              <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTests(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
            </div>
          </div>
        </div>
      ))}
      {dlg&&<Dlg title="Novo Teste A/B" onClose={()=>setDlg(false)}
        footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Iniciar Teste</button></>}>
        <Field label="Nome do Teste *"><input className="fi" placeholder="Ex: Título SEO vs Clickbait" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Post relacionado"><input className="fi" placeholder="Título do post..." value={form.postTitle} onChange={e=>setForm(f=>({...f,postTitle:e.target.value}))}/></Field>
        <Field label="Variante A *"><textarea className="fi fi-ta" rows={2} placeholder="Versão original / controle" value={form.varA} onChange={e=>setForm(f=>({...f,varA:e.target.value}))}/></Field>
        <Field label="Variante B *"><textarea className="fi fi-ta" rows={2} placeholder="Versão alternativa a testar" value={form.varB} onChange={e=>setForm(f=>({...f,varB:e.target.value}))}/></Field>
        <Field label="Duração (dias)"><input className="fi" type="number" min={7} max={90} value={form.duration} onChange={e=>setForm(f=>({...f,duration:+e.target.value||14}))}/></Field>
      </Dlg>}
    </div>
  );
}

/* ══ CONTENT BRIEF GENERATOR ═════════════════════════════ */
function ContentBriefPage(){
  const[kw,setKw]=useState("");
  const[niche,setNiche]=useState("marketing digital");
  const[loading,setLoading]=useState(false);
  const[brief,setBrief]=useState(null);
  const outRef=useRef(null);

  const gen=async()=>{
    if(!kw.trim())return;
    setLoading(true);setBrief(null);
    const prompt=`Crie um content brief detalhado para um artigo sobre: "${kw}" (nicho: ${niche}).

Responda SOMENTE em JSON sem markdown:
{
  "title_suggestions": ["título 1","título 2","título 3"],
  "search_intent": "informacional|transacional|navegacional",
  "target_audience": "descrição do público-alvo",
  "word_count": número,
  "outline": [{"h2":"subtítulo","points":["ponto 1","ponto 2"]}],
  "primary_keyword": "${kw}",
  "secondary_keywords": ["kw1","kw2","kw3","kw4"],
  "meta_description": "descrição em 155 chars",
  "tone": "tom recomendado",
  "competitors": ["tema concorrente 1","tema concorrente 2"],
  "cta": "chamada para ação recomendada"
}`;

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setBrief(parsed);
    }catch{setBrief({title_suggestions:["Erro ao gerar brief"],search_intent:"—",target_audience:"—",word_count:0,outline:[],primary_keyword:kw,secondary_keywords:[],meta_description:"—",tone:"—",competitors:[],cta:"—"});}
    setLoading(false);
  };

  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:14}}>
        <div className="ch"><span className="ct">📋 Gerador de Content Brief com IA</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="Palavra-chave / Tema *"><input className="fi" placeholder="Ex: estratégias de seo para blogs" value={kw} onChange={e=>setKw(e.target.value)}/></Field>
            <Field label="Nicho"><select className="fi fi-sel" value={niche} onChange={e=>setNiche(e.target.value)}>{["marketing digital","tecnologia","negócios","saúde","educação","finanças","e-commerce"].map(v=><option key={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}</select></Field>
          </div>
          <button className="btn bf bsm" onClick={gen} disabled={loading||!kw.trim()}>{loading?<><div className="spinner"/>Gerando brief...</>:"📋 Gerar Content Brief"}</button>
        </div>
      </div>

      {brief&&(
        <div className="fade-in">
          <div className="two" style={{marginBottom:14}}>
            <div className="card">
              <div className="ch"><span className="ct">🎯 Títulos Sugeridos</span></div>
              <div className="cb" style={{paddingTop:4}}>
                {brief.title_suggestions?.map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"8px 0",borderBottom:i<brief.title_suggestions.length-1?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12,fontWeight:800,color:C.pC,background:C.p,borderRadius:5,padding:"1px 6px",flexShrink:0}}>{i+1}</span>
                    <span style={{fontSize:13,lineHeight:1.4}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card" style={{marginBottom:12}}>
                <div className="ch"><span className="ct">📊 Informações Gerais</span></div>
                <div className="cb" style={{paddingTop:4}}>
                  {[{l:"Intenção de busca",v:brief.search_intent},{l:"Público-alvo",v:brief.target_audience},{l:"Tom recomendado",v:brief.tone},{l:"Contagem de palavras",v:brief.word_count+" palavras"},{l:"CTA",v:brief.cta}].map((r,i)=>(
                    <div key={i} style={{padding:"7px 0",borderBottom:i<4?`1px solid ${C.ovV}`:"none"}}>
                      <div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:2}}>{r.l}</div>
                      <div style={{fontSize:13}}>{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="ch"><span className="ct">🔑 Keywords</span></div>
                <div className="cb" style={{paddingTop:4}}>
                  <div style={{marginBottom:8}}><div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:5}}>Principal</div><span className="chip cp">{brief.primary_keyword}</span></div>
                  <div><div style={{fontSize:11,color:C.onV,fontWeight:600,marginBottom:5}}>Secundárias</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{brief.secondary_keywords?.map(k=><span key={k} className="chip cn">{k}</span>)}</div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{marginBottom:14}}>
            <div className="ch"><span className="ct">📑 Estrutura do Artigo (Outline)</span></div>
            <div className="cb" style={{paddingTop:6}}>
              {brief.outline?.map((sec,i)=>(
                <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<brief.outline.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.p,marginBottom:8}}>H2: {sec.h2}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {sec.points?.map((pt,j)=>(
                      <div key={j} style={{display:"flex",gap:8,fontSize:12,color:C.onV}}>
                        <span style={{color:C.ovV}}>•</span>{pt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📝 Meta Description sugerida</span></div>
            <div className="cb" style={{paddingTop:4}}>
              <div style={{padding:"11px 13px",background:C.s1,borderRadius:9,fontSize:13,lineHeight:1.6,fontStyle:"italic",color:C.onV}}>"{brief.meta_description}"</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:11,color:C.onV}}>{brief.meta_description?.length}/160 chars</span>
                <button className="btn bt bsm" style={{fontSize:11}}>📋 Copiar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!brief&&!loading&&<Empty ico="📋" title="Gere um Content Brief" sub="Informe a palavra-chave e a IA cria um guia completo de produção de conteúdo."/>}
    </div>
  );
}

/* ══ SYSTEM HEALTH ════════════════════════════════════════ */
function SystemHealthPage(){
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
const DB = (() => {
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
const Backend = {
  async publishToWordPress({siteUrl,user,appPassword,post,status="publish"}){
    await new Promise(r=>setTimeout(r,1800));
    if(!siteUrl||!user||!appPassword)throw new Error("rest_not_logged_in");
    const wpId=Math.floor(Math.random()*9000)+1000;
    DB.create("PublishLog",{title:post.title,wp:siteUrl,date:new Date().toLocaleString("pt-BR").slice(0,16),status:"success",type:"publicado",id_wp:wpId,duration:"1.4s"});
    return {success:true,wpId,url:`https://${siteUrl}/?p=${wpId}`};
  },
  async testWordPressConnection({siteUrl,user,appPassword}){
    await new Promise(r=>setTimeout(r,1500));
    if(!siteUrl)throw new Error("URL inválida");
    const ok=siteUrl.includes("offline")?false:siteUrl.includes("loja")?"warning":true;
    if(!ok)throw new Error("rest_not_logged_in");
    return {success:true,wpVersion:"6.5",restApiActive:true,userRole:"administrator",pluginInstalled:siteUrl.includes("blog")};
  },
  async syncWordPressMeta({postId,siteUrl}){
    await new Promise(r=>setTimeout(r,900));
    DB.update("Post",postId,{wpSynced:true,lastSynced:new Date().toISOString()});
    return {success:true,metasSynced:["title","description","og:image","canonical"]};
  },
  async publishToExternalPlatform({platform,content,postId}){
    await new Promise(r=>setTimeout(r,1200));
    DB.create("SocialPublishLog",{platform,content:content.slice(0,50),postId,ts:new Date().toISOString(),status:"success"});
    return {success:true,platform,publishedAt:new Date().toISOString()};
  },
  async generatePost({topic,tone,niche,length}){
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Crie artigo SEO sobre: "${topic}". Nicho: ${niche}. Tom: ${tone}.\n# [Título]\n\n[Intro]\n\n## [H2]\n[Conteúdo]\n\n## [H2]\n[Conteúdo]\n\n## Conclusão\n[CTA]\n\n---\n**Meta Description:** [155 chars]\n**Keywords:** kw1, kw2, kw3\n**Score SEO estimado:** [num]/100`}]})});
    const data=await res.json();
    const text=data.content?.map(b=>b.text||"").join("")||"";
    const titleMatch=text.match(/^#\s+(.+)/m);
    const metaMatch=text.match(/\*\*Meta Description:\*\*\s*(.+)/);
    const scoreMatch=text.match(/Score SEO estimado:\s*(\d+)/);
    return {content:text,title:titleMatch?.[1]||topic,metaDescription:metaMatch?.[1]||"",seoScore:scoreMatch?.[1]?parseInt(scoreMatch[1]):82,keywords:[topic]};
  },
  async generateOptimizedTitles({topic,niche,count=5}){
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:`Gere ${count} títulos SEO sobre "${topic}" (nicho: ${niche}). JSON: {"titles":["t1","t2","t3","t4","t5"]}`}]})});
    const data=await res.json();
    const txt=data.content?.map(b=>b.text||"").join("")||"{}";
    return JSON.parse(txt.replace(/```json|```/g,"").trim());
  },
  async generateOptimizedMeta({title,keyword}){
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,messages:[{role:"user",content:`Meta description SEO para: "${title}", keyword: "${keyword}". Máx 155 chars. Responda SOMENTE com o texto.`}]})});
    const data=await res.json();
    const meta=data.content?.map(b=>b.text||"").join("").trim()||"";
    return {metaDescription:meta.slice(0,155),charCount:meta.length};
  },
  async triggerAutomation({automationId,postId,event}){
    await new Promise(r=>setTimeout(r,600));
    DB.create("AutomationLog",{automationId,postId,event,ts:new Date().toISOString(),status:"success"});
    return {success:true,triggeredAt:new Date().toISOString()};
  },
  async autoPublishToSocial({postId,platforms}){
    const results={};
    for(const pl of platforms){await new Promise(r=>setTimeout(r,400));results[pl]={success:true,publishedAt:new Date().toISOString()};}
    return {success:true,results};
  },
  async dispatchNotification({userId,type,message,channel="in-app"}){
    await new Promise(r=>setTimeout(r,200));
    return DB.create("Notification",{ico:"🔔",text:message,time:"agora",read:false,type,channel,userId,createdAt:new Date().toISOString()});
  },
  async checkDeadlineNotifications(){
    await new Promise(r=>setTimeout(r,300));
    const tasks=DB.find("PostTask",t=>!t.done);
    return {checked:tasks.length,notified:0};
  },
  async notifyPublishedTask({postId,publishedBy}){
    const post=POSTS.find(p=>p.id===postId);
    return await Backend.dispatchNotification({userId:"team",type:"success",message:`📤 Post publicado: "${post?.title||"Post"}" por ${publishedBy}`,channel:"in-app"});
  },
  async handleEntityNotification({entity,action}){
    const msgs={Post:{created:"✨ Novo post criado",updated:"✏️ Post atualizado",deleted:"🗑 Post excluído"},Project:{created:"📁 Novo projeto"}};
    return await Backend.dispatchNotification({userId:"all",type:"info",message:msgs[entity]?.[action]||`${entity} ${action}`,channel:"in-app"});
  },
  async sendProjectNotification({projectId,message}){
    return await Backend.dispatchNotification({userId:`project_${projectId}`,type:"info",message,channel:"in-app"});
  },
  async handleOAuthCallback({provider,code}){
    await new Promise(r=>setTimeout(r,1000));
    return {success:true,provider,accessToken:`tok_${provider}_${Date.now()}`,expiresIn:3600};
  },
  async weeklyBackup({includeMedia=true}){
    await new Promise(r=>setTimeout(r,2000));
    const posts=POSTS.length;
    const size=`${(posts*0.05).toFixed(1)} MB`;
    return {success:true,posts,size,createdAt:new Date().toISOString()};
  },
};


/* ══ ADMIN PANEL ══════════════════════════════════════════ */
function AdminPanel({showToast}){
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
function PostTaskPanel({post,showToast}){
  const[tasks,setTasks]=useState([{id:1,postId:1,title:"Revisar meta description",done:true,assignee:"Ana Lima",due:"10/05/26"},{id:2,postId:1,title:"Adicionar imagens H2",done:false,assignee:"Carlos M.",due:"11/05/26"},{id:3,postId:1,title:"Atualizar CTAs",done:false,assignee:"Ana Lima",due:"12/05/26"}].filter(t=>t.postId===(post?.id||1)));
  const[input,setInput]=useState("");
  const add=()=>{if(!input.trim())return;setTasks(p=>[...p,{id:Date.now(),postId:post?.id||1,title:input,done:false,assignee:"Ana Lima",due:"—"}]);setInput("");};
  const toggle=id=>setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del=id=>setTasks(p=>p.filter(t=>t.id!==id));
  const done=tasks.filter(t=>t.done).length;
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>Tarefas: {done}/{tasks.length} concluídas</div></div>
      </div>
      <div className="pb" style={{height:8,marginBottom:14}}><div className="pbf" style={{width:`${tasks.length?((done/tasks.length)*100):0}%`,background:C.ter}}/></div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="ch"><span className="ct">✅ Checklist</span><span className="chip ct3">{done}/{tasks.length}</span></div>
            <div style={{padding:"0 16px 10px"}}>
              {tasks.map((t,i)=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<tasks.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} style={{width:16,height:16,cursor:"pointer",accentColor:C.p}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,textDecoration:t.done?"line-through":"none",color:t.done?C.onV:C.on}}>{t.title}</div>
                    <div style={{fontSize:11,color:C.onV}}>👤 {t.assignee}{t.due!=="—"?` · 📅 ${t.due}`:""}</div>
                  </div>
                  <button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>del(t.id)}>🗑</button>
                </div>
              ))}
              {tasks.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Nenhuma tarefa. Adicione abaixo.</div>}
            </div>
            <div style={{padding:"0 16px 14px",display:"flex",gap:8}}>
              <input className="fi" style={{flex:1,height:36,padding:"7px 12px"}} placeholder="Nova tarefa..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
              <button className="btn bf bsm" onClick={add} disabled={!input.trim()}>➕</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📊 Progresso</span></div>
          <div className="cb" style={{paddingTop:8}}>
            {[{l:"Concluídas",v:done,c:C.ter},{l:"Pendentes",v:tasks.length-done,c:C.warn},{l:"Total",v:tasks.length,c:C.p}].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                <span style={{fontSize:13}}>{s.l}</span>
                <span className="mono" style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 12px",background:tasks.length&&done===tasks.length?C.terC:C.pC,borderRadius:9,fontSize:12,color:tasks.length&&done===tasks.length?C.onTerC:C.onPC,fontWeight:600,textAlign:"center"}}>
              {tasks.length===0?"Adicione tarefas ao post":done===tasks.length?"🎉 Todas concluídas!":done===0?"⏳ Nenhuma concluída ainda":`📝 ${tasks.length-done} tarefa${tasks.length-done>1?"s":""} restante${tasks.length-done>1?"s":""}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ VERSION HISTORY ══════════════════════════════════════ */
function VersionHistoryPage({post,onBack,showToast}){
  const[versions,setVersions]=useState([{id:1,postId:1,version:3,content:"Versão 3 — adicionadas 3 seções H2 e FAQ",savedBy:"Ana Lima",savedAt:"09/05/26 14:00"},{id:2,postId:1,version:2,content:"Versão 2 — revisão completa de SEO e meta",savedBy:"Carlos M.",savedAt:"08/05/26 11:30"},{id:3,postId:1,version:1,content:"Versão 1 — rascunho inicial gerado pela IA",savedBy:"IA",savedAt:"07/05/26 09:00"}].filter(v=>v.postId===(post?.id||1)));
  const[selected,setSelected]=useState(null);
  const[restoring,setRestoring]=useState(false);
  const restore=async(v)=>{setRestoring(true);await new Promise(r=>setTimeout(r,1200));setRestoring(false);showToast(`↩ Versão ${v.version} restaurada!`);};
  const saveNew=()=>{const v={id:Date.now(),postId:post?.id||1,version:versions.length+1,content:"Nova versão salva manualmente",savedBy:"Ana Lima",savedAt:new Date().toLocaleString("pt-BR").slice(0,16)};setVersions(p=>[v,...p]);showToast("💾 Versão salva!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>{versions.length} versões</div></div>
        <button className="btn bf bsm" onClick={saveNew}>💾 Salvar versão atual</button>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📚 Histórico</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {versions.length===0&&<Empty ico="📄" title="Sem versões" sub="Salve a versão atual para começar."/>}
            {versions.map((v,i)=>(
              <div key={v.id} style={{display:"flex",gap:10,padding:"12px 0",borderBottom:i<versions.length-1?`1px solid ${C.ovV}`:"none",cursor:"pointer",background:selected?.id===v.id?`${C.pC}44`:"transparent",borderRadius:8,paddingLeft:selected?.id===v.id?8:0,transition:"all .14s"}} onClick={()=>setSelected(v)}>
                <div style={{width:34,height:34,borderRadius:8,background:i===0?C.pC:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:i===0?C.onPC:C.onV,flexShrink:0}}>v{v.version}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:600}}>{v.content.slice(0,40)}</span>{i===0&&<span className="chip ct3" style={{fontSize:9}}>Atual</span>}</div>
                  <div style={{fontSize:11,color:C.onV}}>👤 {v.savedBy} · 🕐 {v.savedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>{selected
          ?<div className="card"><div className="ch"><span className="ct">Versão {selected.version}</span><button className="btn bf bsm" onClick={()=>restore(selected)} disabled={restoring}>{restoring?<><div className="spinner"/>Restaurando...</>:"↩ Restaurar"}</button></div><div className="cb" style={{paddingTop:6}}><div style={{padding:"12px",background:C.s1,borderRadius:9,fontSize:13,color:C.onV,lineHeight:1.7,marginBottom:10}}>{selected.content}</div><div style={{fontSize:12,color:C.onV}}>👤 {selected.savedBy} · 🕐 {selected.savedAt}</div></div></div>
          :<Empty ico="📖" title="Selecione uma versão" sub="Clique para ver e restaurar."/>
        }</div>
      </div>
    </div>
  );
}

/* ══ INLINE COMMENTS ══════════════════════════════════════ */
function InlineCommentsPage({post,onBack,showToast}){
  const[comments,setComments]=useState([{id:1,postId:1,text:"Revisar esta frase, muito longa",author:"Carlos M.",position:120,resolved:false,createdAt:"09/05/26 10:00"},{id:2,postId:1,text:"Adicionar fonte aqui",author:"Ana Lima",position:340,resolved:true,createdAt:"08/05/26 15:20"}].filter(c=>c.postId===(post?.id||1)));
  const[newComment,setNewComment]=useState("");
  const addComment=()=>{if(!newComment.trim())return;setComments(p=>[...p,{id:Date.now(),postId:post?.id||1,text:newComment,author:"Ana Lima",position:Math.floor(Math.random()*500),resolved:false,createdAt:new Date().toLocaleString("pt-BR").slice(0,16)}]);setNewComment("");showToast("💬 Comentário adicionado!");};
  const resolve=id=>{setComments(p=>p.map(c=>c.id===id?{...c,resolved:true}:c));showToast("✅ Resolvido!");};
  const open=comments.filter(c=>!c.resolved);
  const resolved=comments.filter(c=>c.resolved);
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{post?.title||"Post"}</div><div style={{fontSize:12,color:C.onV}}>{open.length} em aberto · {resolved.length} resolvidos</div></div>
      </div>
      <div className="two">
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="ch"><span className="ct">💬 Em Aberto</span><span className="chip ce">{open.length}</span></div>
            <div style={{padding:"0 14px 8px"}}>
              {open.length===0&&<div style={{padding:"20px 0",textAlign:"center",color:C.onV,fontSize:13}}>Nenhum comentário em aberto 🎉</div>}
              {open.map((c,i)=>(
                <div key={c.id} style={{padding:"12px 0",borderBottom:i<open.length-1?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:7}}>
                    <div style={{width:26,height:26,borderRadius:7,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.onPC,flexShrink:0}}>{c.author.split(" ").map(w=>w[0]).join("")}</div>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{c.author}</div><div style={{fontSize:11,color:C.onV}}>pos.{c.position} · {c.createdAt}</div></div>
                  </div>
                  <div style={{fontSize:13,background:C.s1,borderRadius:8,padding:"9px 11px",marginBottom:8,lineHeight:1.5}}>{c.text}</div>
                  <div style={{display:"flex",gap:7}}>
                    <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>resolve(c.id)}>✅ Resolver</button>
                    <button className="btn bo bsm" style={{fontSize:11}} onClick={()=>setComments(p=>p.filter(x=>x.id!==c.id))}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">➕ Novo Comentário</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <textarea className="fi fi-ta" rows={3} placeholder="Adicione um comentário ou sugestão..." value={newComment} onChange={e=>setNewComment(e.target.value)}/>
              <button className="btn bf bsm" style={{marginTop:8}} onClick={addComment} disabled={!newComment.trim()}>💬 Comentar</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">✅ Resolvidos</span><span className="chip ct3">{resolved.length}</span></div>
          <div style={{padding:"0 14px 8px"}}>
            {resolved.length===0&&<Empty ico="💬" title="Nenhum resolvido" sub="Resolva comentários para que apareçam aqui."/>}
            {resolved.map((c,i)=>(
              <div key={c.id} style={{padding:"10px 0",borderBottom:i<resolved.length-1?`1px solid ${C.ovV}`:"none",opacity:.6}}>
                <div style={{display:"flex",gap:8,marginBottom:4}}><div style={{width:22,height:22,borderRadius:6,background:C.terC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.onTerC,flexShrink:0}}>{c.author.split(" ").map(w=>w[0]).join("")}</div><span style={{fontSize:12,fontWeight:600}}>{c.author}</span><span className="chip ct3" style={{fontSize:9}}>Resolvido</span></div>
                <div style={{fontSize:12,color:C.onV}}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══ PROJECT TEAMS ════════════════════════════════════════ */
function ProjectTeamsPage({project,showToast}){
  const[teams,setTeams]=useState([{id:1,projectId:1,name:"Equipe SEO",members:["Ana Lima","Carlos M."],lead:"Ana Lima"},{id:2,projectId:1,name:"Equipe Conteúdo",members:["Juliana Costa"],lead:"Juliana Costa"}].filter(t=>t.projectId===(project?.id||1)));
  const[dlg,setDlg]=useState(false);
  const[form,setForm]=useState({name:"",lead:"",members:[]});
  const save=()=>{if(!form.name)return;setTeams(p=>[...p,{id:Date.now(),projectId:project?.id||1,...form}]);setDlg(false);setForm({name:"",lead:"",members:[]});showToast("👥 Equipe criada!");};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:13}}><button className="btn bf bsm" onClick={()=>setDlg(true)}>➕ Nova Equipe</button></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
        {teams.map(t=>(
          <div key={t.id} className="card">
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:11}}>
                <div><div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{t.name}</div><div style={{fontSize:12,color:C.onV}}>Líder: {t.lead||"—"}</div></div>
                <span className="chip cn">{(t.members||[]).length} membros</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {(t.members||[]).map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",background:C.s1,borderRadius:999,fontSize:12}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{m[0]}</div>{m}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:7}}>
                <button className="btn bt bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>showToast("👥 Gerenciando equipe...")}>Gerenciar</button>
                <button className="ib" style={{width:26,height:26,fontSize:12}} onClick={()=>setTeams(p=>p.filter(x=>x.id!==t.id))}>🗑</button>
              </div>
            </div>
          </div>
        ))}
        {teams.length===0&&<Empty ico="👥" title="Sem equipes" sub="Crie equipes para organizar o trabalho."/>}
      </div>
      {dlg&&<Dlg title="Nova Equipe" onClose={()=>setDlg(false)} footer={<><button className="btn bo" onClick={()=>setDlg(false)}>Cancelar</button><button className="btn bf" onClick={save}>Criar</button></>}>
        <Field label="Nome *"><input className="fi" placeholder="Ex: Equipe SEO" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label="Líder"><select className="fi fi-sel" value={form.lead} onChange={e=>setForm(f=>({...f,lead:e.target.value}))}><option value="">Selecionar...</option>{USERS.filter(u=>u.status==="active").map(u=><option key={u.id}>{u.name}</option>)}</select></Field>
        <Field label="Membros">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {USERS.filter(u=>u.status==="active").map(u=>(
              <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
                <input type="checkbox" checked={(form.members||[]).includes(u.name)} onChange={e=>setForm(f=>({...f,members:e.target.checked?[...(f.members||[]),u.name]:(f.members||[]).filter(m=>m!==u.name)}))} style={{accentColor:C.p}}/>
                {u.name}
              </label>
            ))}
          </div>
        </Field>
      </Dlg>}
    </div>
  );
}

/* ══ PROJECT DETAIL ═══════════════════════════════════════ */
function ProjectDetailPage({project,onBack,go,showToast}){
  const proj=project||{id:1,name:"Projeto SEO Q2 2026",desc:"Produção de 40 artigos SEO para o segundo trimestre",status:"active",priority:"high",progress:65,owner:"Ana Lima",deadline:"30/06/26",posts:12,tasks:24};
  const[tab,setTab]=useState("overview");
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Projetos</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{proj.name}</div><div style={{fontSize:12,color:C.onV}}>{proj.desc}</div></div>
        <button className="btn bf bsm" onClick={()=>showToast("⚙️ Configurações do projeto")}>⚙️ Configurar</button>
      </div>
      <div className="tabs">
        {["overview","posts","tasks","teams","analytics"].map(t=>(
          <div key={t} className={`tabi ${tab===t?"a":""}`} onClick={()=>setTab(t)}>
            {{"overview":"📊 Visão Geral","posts":"📄 Posts","tasks":"✅ Tarefas","teams":"👥 Equipes","analytics":"📈 Analytics"}[t]}
          </div>
        ))}
      </div>
      {tab==="overview"&&(
        <div>
          <div className="mg">{[{l:"Posts",v:proj.posts,d:"de 40 planejados",cls:"mcp"},{l:"Progresso",v:proj.progress+"%",d:"↑ 12% esta semana",cls:"mct"},{l:"Tarefas",v:proj.tasks,d:"8 pendentes",cls:"mcs"},{l:"Prazo",v:proj.deadline,d:"52 dias restantes",cls:"mce"}].map((m,i)=>(
            <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
          ))}</div>
          <div className="two">
            <div className="card">
              <div className="ch"><span className="ct">Progresso</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div className="pb" style={{height:12,marginBottom:12}}><div className="pbf" style={{width:`${proj.progress}%`,background:C.ter}}/></div>
                {[{l:"Backlog",v:8,c:C.sec},{l:"Produção",v:5,c:C.p},{l:"Revisão",v:2,c:C.warn},{l:"Publicado",v:12,c:C.ter}].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:`1px solid ${C.ovV}`,marginTop:4}}><span style={{fontSize:12}}>{s.l}</span><span className="mono" style={{fontSize:14,fontWeight:800,color:s.c}}>{s.v}</span></div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">ℹ️ Informações</span></div>
              <div className="cb" style={{paddingTop:6}}>
                {[{l:"Responsável",v:proj.owner},{l:"Prioridade",v:proj.priority.charAt(0).toUpperCase()+proj.priority.slice(1)},{l:"Status",v:proj.status==="active"?"Ativo":"Inativo"},{l:"Prazo",v:proj.deadline},{l:"Posts planejados",v:"40"},{l:"Criado em",v:"01/04/26"}].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?`1px solid ${C.ovV}`:"none"}}><span style={{fontSize:12,color:C.onV,fontWeight:600}}>{r.l}</span><span style={{fontSize:13,fontWeight:500}}>{r.v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="posts"&&<PostsPage go={go}/>}
      {tab==="tasks"&&<PostTaskPanel post={{id:1,title:proj.name}} showToast={showToast}/>}
      {tab==="teams"&&<ProjectTeamsPage project={proj} showToast={showToast}/>}
      {tab==="analytics"&&<PerformanceDashboard/>}
    </div>
  );
}


/* ══ MULTICHANNEL PUBLISHER ═══════════════════════════════ */
function MultiChannelPublisher({post,onBack,showToast}){
  const[channels,setChannels]=useState({wordpress:true,twitter:false,linkedin:false,instagram:false,facebook:false,newsletter:false});
  const[publishing,setPublishing]=useState(false);
  const[progress,setProgress]=useState({});
  const[done,setDone]=useState(false);
  const chInfo={wordpress:{ico:"⊞",name:"WordPress",desc:"Publicar como post no blog"},twitter:{ico:"𝕏",name:"Twitter/X",desc:"Tweet com link do post"},linkedin:{ico:"in",name:"LinkedIn",desc:"Artigo profissional"},instagram:{ico:"📸",name:"Instagram",desc:"Carrossel ou story"},facebook:{ico:"📘",name:"Facebook",desc:"Post no feed"},newsletter:{ico:"📧",name:"Newsletter",desc:"Enviar para lista de e-mail"}};
  const selected=Object.keys(channels).filter(k=>channels[k]);
  const publish=async()=>{
    setPublishing(true);setDone(false);
    for(const ch of selected){
      setProgress(p=>({...p,[ch]:"publishing"}));
      await new Promise(r=>setTimeout(r,900+Math.random()*600));
      try{
        if(ch==="wordpress") await Backend.publishToWordPress({siteUrl:"blog.exemplo.com.br",user:"admin",appPassword:"xxx",post:post||{id:1,title:"Post"}});
        else await Backend.publishToExternalPlatform({platform:ch,content:post?.title||"Post",postId:post?.id||1});
        setProgress(p=>({...p,[ch]:"done"}));
      }catch{setProgress(p=>({...p,[ch]:"error"}));}
    }
    await Backend.notifyPublishedTask({postId:post?.id||1,publishedBy:"Ana Lima"});
    setPublishing(false);setDone(true);
    showToast(`📤 Publicado em ${selected.length} canal${selected.length>1?"is":""}!`);
  };
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
        <button className="btn bx bsm" onClick={onBack}>← Voltar</button>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Publicação Multicanal</div><div style={{fontSize:12,color:C.onV}}>{post?.title||"Post selecionado"}</div></div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📡 Selecionar Canais</span></div>
          <div style={{padding:"0 16px 14px"}}>
            {Object.entries(chInfo).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.ovV}`}}>
                <div style={{width:36,height:36,borderRadius:9,background:channels[k]?C.pC:C.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:k==="linkedin"?13:18,fontWeight:800,color:channels[k]?C.onPC:C.onV,flexShrink:0,transition:"all .14s"}}>{v.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{v.name}</div><div style={{fontSize:11,color:C.onV}}>{v.desc}</div></div>
                {progress[k]==="publishing"&&<div className="spinner"/>}
                {progress[k]==="done"&&<span className="chip ct3">✓</span>}
                {progress[k]==="error"&&<span className="chip ce">✗</span>}
                {!progress[k]&&<Tog on={channels[k]} onChange={v=>setChannels(p=>({...p,[k]:v}))}/>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:13}}>
            <div className="ch"><span className="ct">📋 Resumo</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:13,marginBottom:12}}>{selected.length===0?<span style={{color:C.onV}}>Selecione ao menos 1 canal.</span>:<span>Publicando em <strong>{selected.length}</strong> canal{selected.length>1?"is":""}: {selected.map(k=>chInfo[k].name).join(", ")}</span>}</div>
              {done&&<div style={{padding:"10px 12px",background:C.terC,borderRadius:9,fontSize:12,color:C.onTerC,marginBottom:12,fontWeight:600}}>🎉 Publicação concluída com sucesso!</div>}
              {Object.keys(progress).length>0&&<div style={{marginBottom:12}}>
                {Object.entries(progress).map(([ch,st])=>(
                  <div key={ch} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",fontSize:12}}>
                    <span style={{fontSize:14}}>{chInfo[ch]?.ico}</span>
                    <span style={{flex:1}}>{chInfo[ch]?.name}</span>
                    {st==="publishing"&&<><div className="spinner" style={{width:12,height:12}}/><span style={{color:C.onV}}>Publicando...</span></>}
                    {st==="done"&&<span style={{color:C.ter,fontWeight:600}}>✅ Publicado</span>}
                    {st==="error"&&<span style={{color:C.err,fontWeight:600}}>❌ Falhou</span>}
                  </div>
                ))}
              </div>}
              <button className="btn bf" style={{width:"100%",justifyContent:"center",padding:12,borderRadius:12}} onClick={publish} disabled={publishing||selected.length===0||done}>{publishing?<><div className="spinner"/>Publicando...</>:done?"✅ Concluído":"📤 Publicar Agora"}</button>
              {!done&&<button className="btn bo" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>showToast("📅 Agendamento configurado!")}>📅 Agendar</button>}
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">⚡ Smart Scheduler</span></div>
            <div className="cb" style={{paddingTop:6}}>
              <div style={{fontSize:12,color:C.onV,marginBottom:10}}>A IA analisa seus dados e sugere o melhor momento:</div>
              {[{day:"Segunda-feira",time:"09:00",score:94,reason:"Maior engajamento histórico"},{day:"Terça-feira",time:"10:30",score:88,reason:"CTR médio mais alto"},{day:"Quinta-feira",time:"08:00",score:82,reason:"Menor concorrência"}].map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{s.day}, {s.time}</div><div style={{fontSize:11,color:C.onV}}>{s.reason}</div></div>
                  <div className="mono" style={{fontSize:14,fontWeight:800,color:s.score>=90?C.ter:C.p}}>{s.score}</div>
                  <button className="btn bt bsm" style={{fontSize:11}} onClick={()=>showToast(`📅 Agendado para ${s.day}!`)}>Agendar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══ CONTENT REPURPOSING ══════════════════════════════════ */
function ContentRepurposingPage({showToast}){
  const[selPost,setSelPost]=useState(POSTS.find(p=>p.status==="published")||POSTS[0]);
  const[loading,setLoading]=useState(false);
  const[results,setResults]=useState(null);
  const repurpose=async()=>{
    setLoading(true);setResults(null);
    const prompt=`Especialista em repurposing. Post: "${selPost.title}" (cat: ${selPost.cat}). Responda SOMENTE em JSON:\n{"newsletter":"2 parágrafos de newsletter","twitter_thread":"5 tweets numerados 1/5 a 5/5","linkedin":"post profissional 3 parágrafos + hashtags","youtube_script":"roteiro 60s para vídeo","faq":"5 perguntas e respostas"}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setResults(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setResults({newsletter:"Erro ao gerar.",twitter_thread:"Erro.",linkedin:"Erro.",youtube_script:"Erro.",faq:"Erro."});}
    setLoading(false);
  };
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">♻️ Repurposing de Conteúdo com IA</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two">
            <Field label="Post de origem">
              <select className="fi fi-sel" value={selPost.id} onChange={e=>setSelPost(POSTS.find(p=>p.id===+e.target.value)||POSTS[0])}>
                {POSTS.filter(p=>p.status==="published").map(p=><option key={p.id} value={p.id}>{p.title.slice(0,55)}…</option>)}
              </select>
            </Field>
            <div><div className="fl">Formatos gerados</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Newsletter","Thread Twitter","LinkedIn","YouTube Script","FAQ"].map(f=><span key={f} className="chip cp">{f}</span>)}</div></div>
          </div>
          <button className="btn bf bsm" onClick={repurpose} disabled={loading}>{loading?<><div className="spinner"/>Gerando...</>:"♻️ Gerar Variações"}</button>
        </div>
      </div>
      {results&&(
        <div className="fade-in" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          {[{key:"newsletter",title:"📧 Newsletter"},{key:"twitter_thread",title:"𝕏 Thread Twitter"},{key:"linkedin",title:"LinkedIn Post"},{key:"youtube_script",title:"🎬 Script YouTube"},{key:"faq",title:"❓ FAQ"}].map(f=>(
            <div key={f.key} className="card">
              <div className="ch"><span className="ct">{f.title}</span><button className="btn bt bsm" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(results[f.key]||"");showToast(`📋 Copiado!`);}}>📋 Copiar</button></div>
              <div className="cb" style={{paddingTop:4}}><div style={{background:C.s1,borderRadius:9,padding:"11px 13px",fontSize:12,lineHeight:1.7,color:C.onV,maxHeight:150,overflowY:"auto",whiteSpace:"pre-wrap"}}>{results[f.key]}</div></div>
            </div>
          ))}
        </div>
      )}
      {!results&&!loading&&<Empty ico="♻️" title="Repurpose seu conteúdo" sub="Selecione um post publicado e a IA cria versões para diferentes canais."/>}
    </div>
  );
}

/* ══ CONTENT GAP ANALYZER ════════════════════════════════ */
function ContentGapPage(){
  const[analyzing,setAnalyzing]=useState(false);
  const[gaps,setGaps]=useState(null);
  const myTopics=["SEO","IA","Email Marketing","WordPress","CRO"];
  const competitorTopics=["SEO","IA","Social Media","Content Marketing","Email Marketing","PPC","Analytics","UX","Copywriting","Automação"];
  const analyze=async()=>{
    setAnalyzing(true);setGaps(null);
    const prompt=`Analise lacunas de conteúdo. Meus tópicos: ${myTopics.join(",")}. Concorrentes: ${competitorTopics.join(",")}. Responda SOMENTE em JSON:\n{"gaps":[{"topic":"...","opportunity":"alta|média|baixa","reason":"...","suggested_title":"..."}]}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content?.map(b=>b.text||"").join("")||"{}";
      setGaps(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setGaps({gaps:[{topic:"Social Media",opportunity:"alta",reason:"Concorrentes têm forte presença",suggested_title:"Guia de Social Media para Blogs em 2026"},{topic:"PPC",opportunity:"alta",reason:"Alto volume, pouca cobertura",suggested_title:"Google Ads para Criadores de Conteúdo"},{topic:"Analytics",opportunity:"média",reason:"Tópico emergente",suggested_title:"GA4: Guia Prático para Bloggers"}]});}
    setAnalyzing(false);
  };
  const oppColor={alta:C.errC,média:C.warnC,baixa:C.s2};
  const oppText={alta:C.err,média:C.warn,baixa:C.onV};
  return(
    <div className="fade-in">
      <div className="two" style={{marginBottom:13}}>
        <div className="card"><div className="ch"><span className="ct">📚 Meus Tópicos</span><span className="chip ct3">{myTopics.length}</span></div><div className="cb" style={{paddingTop:6}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{myTopics.map(t=><span key={t} className="chip ct3">{t}</span>)}</div></div></div>
        <div className="card"><div className="ch"><span className="ct">🔍 Tópicos dos Concorrentes</span><span className="chip ce">{competitorTopics.length}</span></div><div className="cb" style={{paddingTop:6}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{competitorTopics.map(t=><span key={t} className={`chip ${myTopics.includes(t)?"ct3":"ce"}`}>{t}{myTopics.includes(t)?" ✓":""}</span>)}</div></div></div>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:13}}><button className="btn bf" onClick={analyze} disabled={analyzing}>{analyzing?<><div className="spinner"/>Analisando...</>:"🔍 Analisar Lacunas"}</button></div>
      {gaps?.gaps&&(
        <div className="fade-in">
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🎯 {gaps.gaps.length} oportunidades identificadas</div>
          {gaps.gaps.map((g,i)=>(
            <div key={i} className="card" style={{marginBottom:11}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:9}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:700}}>{g.topic}</span><span className="chip" style={{background:oppColor[g.opportunity],color:oppText[g.opportunity]}}>Oportunidade {g.opportunity}</span></div>
                    <div style={{fontSize:12,color:C.onV,marginBottom:8}}>{g.reason}</div>
                    <div style={{padding:"8px 11px",background:C.pC,borderRadius:8,fontSize:13,color:C.onPC,fontWeight:500}}>💡 "{g.suggested_title}"</div>
                  </div>
                </div>
                <button className="btn bt bsm" style={{fontSize:11}}>✨ Gerar artigo</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!gaps&&!analyzing&&<Empty ico="🔍" title="Analise lacunas de conteúdo" sub="Compare seus tópicos com os concorrentes e descubra oportunidades inexploradas."/>}
    </div>
  );
}

/* ══ EVERGREEN ANALYSIS ═══════════════════════════════════ */
function EvergreenPage(){
  const[analyzing,setAnalyzing]=useState(false);
  const[results,setResults]=useState(null);
  const analyze=async()=>{
    setAnalyzing(true);
    await new Promise(r=>setTimeout(r,1800));
    setResults([
      {id:1,title:"10 Estratégias de SEO para 2026",score:82,trend:"stable",monthlyViews:1200,category:"SEO",action:"update",suggestion:"Atualizar exemplos para 2026 e adicionar seção sobre IA + SEO"},
      {id:5,title:"E-mail Marketing: Táticas de Segmentação",score:91,trend:"growing",monthlyViews:980,category:"Email",action:"promote",suggestion:"Conteúdo evergreen forte. Promover nas redes sociais."},
      {id:6,title:"React 19: Nova Arquitetura",score:44,trend:"declining",monthlyViews:290,category:"Dev",action:"rewrite",suggestion:"Conteúdo datado. Reescrever com exemplos atuais."},
      {id:8,title:"IA no E-commerce em 2026",score:77,trend:"growing",monthlyViews:720,category:"IA",action:"expand",suggestion:"Expandir com seção sobre personalização avançada."},
    ]);
    setAnalyzing(false);
  };
  const trendIco={stable:"→","growing":"↑","declining":"↓"};
  const trendColor={stable:C.p,growing:C.ter,declining:C.err};
  const actionColor={update:C.warnC,promote:C.terC,rewrite:C.errC,expand:C.pC};
  const actionLabel={update:"Atualizar",promote:"Promover",rewrite:"Reescrever",expand:"Expandir"};
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:13,alignItems:"center"}}>
        <div style={{fontSize:13,color:C.onV}}>Identifique posts com potencial evergreen e ações recomendadas.</div>
        <button className="btn bf bsm" onClick={analyze} disabled={analyzing}>{analyzing?<><div className="spinner"/>Analisando...</>:"🌿 Analisar Posts"}</button>
      </div>
      {results&&(
        <div className="fade-in">
          <div className="mg">{[{l:"Evergreen",v:results.filter(r=>r.score>=75).length,d:"de "+results.length,cls:"mcp"},{l:"Crescendo",v:results.filter(r=>r.trend==="growing").length,d:"tendência positiva",cls:"mct"},{l:"Precisam ação",v:results.filter(r=>r.action!=="promote").length,d:"recomendado",cls:"mcs"},{l:"Críticos",v:results.filter(r=>r.action==="rewrite").length,d:"reescrever",cls:"mce"}].map((m,i)=>(
            <div key={i} className={`mc ${m.cls}`}><div className="ml">{m.l}</div><div className="mv">{m.v}</div><div className="md">{m.d}</div></div>
          ))}</div>
          {results.map(r=>(
            <div key={r.id} className="card" style={{marginBottom:11}}>
              <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
                <Ring score={r.score} size={44}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:700}}>{r.title}</span><span className="chip" style={{background:trendColor[r.trend]+"22",color:trendColor[r.trend],fontSize:10}}>{trendIco[r.trend]} {r.trend==="growing"?"Crescendo":r.trend==="declining"?"Caindo":"Estável"}</span><span className="chip" style={{background:actionColor[r.action],color:C.on,fontSize:10}}>{actionLabel[r.action]}</span></div>
                  <div style={{fontSize:12,color:C.onV,marginBottom:7}}>{r.category} · {r.monthlyViews.toLocaleString()} views/mês</div>
                  <div style={{padding:"8px 11px",background:C.s1,borderRadius:8,fontSize:12,color:C.onV,marginBottom:9}}>💡 {r.suggestion}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn bt bsm" style={{fontSize:11}}>✏️ Editar</button>
                    {r.action==="rewrite"&&<button className="btn bf bsm" style={{fontSize:11}}>✨ Reescrever com IA</button>}
                    {r.action==="promote"&&<button className="btn bf bsm" style={{fontSize:11}}>📤 Promover</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!results&&!analyzing&&<Empty ico="🌿" title="Análise de conteúdo evergreen" sub="Descubra quais posts têm maior potencial de longo prazo."/>}
    </div>
  );
}


/* ══ READABILITY ANALYSIS ════════════════════════════════ */
function ReadabilityPage(){
  const[text,setText]=useState("");
  const[result,setResult]=useState(null);
  const analyze=()=>{
    if(text.trim().length<50)return;
    const words=text.split(/\s+/).filter(Boolean).length;
    const sentences=text.split(/[.!?]+/).filter(s=>s.trim()).length||1;
    const syllables=text.split(/\s+/).reduce((a,w)=>a+Math.max(1,w.replace(/[^aeiouáéíóúàèìòùãõ]/gi,"").length),0);
    const avgW=words/sentences;
    const avgS=syllables/words;
    const score=Math.max(0,Math.min(100,Math.round(206.835-1.015*avgW-84.6*avgS)));
    const grade=score>=90?"Muito fácil":score>=70?"Fácil":score>=60?"Médio":score>=50?"Médio-difícil":score>=30?"Difícil":"Muito difícil";
    const longSent=text.split(/[.!?]+/).filter(s=>s.trim().split(/\s+/).length>25).length;
    const passive=(text.match(/\b(foi|foram|será|serão|é|são|está|estão)\s+\w+d[oa]s?\b/gi)||[]).length;
    setResult({score,grade,words,sentences,avgWords:avgW.toFixed(1),longSent,passive,readTime:Math.ceil(words/200)});
  };
  return(
    <div className="fade-in">
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">📖 Analisador de Legibilidade</span></div>
          <div className="cb" style={{paddingTop:6}}>
            <Field label="Cole seu texto aqui"><textarea className="fi fi-ta" rows={9} placeholder="Cole o texto do post para análise de legibilidade..." value={text} onChange={e=>setText(e.target.value)}/></Field>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="mono" style={{fontSize:11,color:C.onV}}>{text.split(/\s+/).filter(Boolean).length} palavras</span>
              <button className="btn bf bsm" onClick={analyze} disabled={text.trim().length<50}>📖 Analisar</button>
            </div>
          </div>
        </div>
        {result?(
          <div className="fade-in">
            <div className="card" style={{marginBottom:13}}>
              <div className="ch"><span className="ct">📊 Score Flesch-Kincaid</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:13,padding:"12px",background:C.s1,borderRadius:10}}>
                  <Ring score={result.score} size={54}/>
                  <div><div style={{fontSize:20,fontWeight:800,color:result.score>=70?C.ter:result.score>=50?C.warn:C.err}}>{result.score}/100</div><div style={{fontSize:13,color:C.onV}}>{result.grade}</div><div style={{fontSize:11,color:C.onV}}>~{result.readTime} min de leitura</div></div>
                </div>
                {[{l:"Palavras",v:result.words},{l:"Sentenças",v:result.sentences},{l:"Palavras/frase",v:result.avgWords}].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:12,color:C.onV}}>{s.l}</span>
                    <span className="mono" style={{fontSize:13,fontWeight:700}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><span className="ct">⚠️ Sugestões</span></div>
              <div className="cb" style={{paddingTop:6}}>
                {[{ok:result.avgWords<=20,l:"Frases curtas (≤20 palavras)",v:`Média: ${result.avgWords} pal/frase`},{ok:result.longSent===0,l:"Sem frases muito longas",v:result.longSent===0?"✓ Nenhuma":result.longSent+" frases longas"},{ok:result.passive<3,l:"Poucos verbos no passivo",v:result.passive===0?"✓ Nenhum":result.passive+" ocorrências"},{ok:result.score>=60,l:"Legibilidade adequada",v:result.grade}].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<3?`1px solid ${C.ovV}`:"none"}}>
                    <span style={{fontSize:14}}>{c.ok?"✅":"⚠️"}</span>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:c.ok?C.on:C.onV}}>{c.l}</div><div style={{fontSize:11,color:C.onV}}>{c.v}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ):<Empty ico="📖" title="Cole um texto para analisar" sub="Calcula score de Flesch, tempo de leitura e identifica frases complexas."/>}
      </div>
    </div>
  );
}

/* ══ PLAGIARISM CHECKER ═══════════════════════════════════ */
function PlagiarismPage({showToast}){
  const[text,setText]=useState("");
  const[checking,setChecking]=useState(false);
  const[result,setResult]=useState(null);
  const check=async()=>{
    if(text.trim().length<100){showToast("⚠️ Mínimo 100 caracteres.");return;}
    setChecking(true);setResult(null);
    await new Promise(r=>setTimeout(r,2500));
    const unique=Math.floor(Math.random()*15)+83;
    setResult({unique,plagiarism:100-unique,sources:unique<100?[{url:"blog.concorrente.com.br",similarity:12,snippet:"estratégias de SEO são fundamentais para..."},{url:"medium.com/@author",similarity:5,snippet:"palavras-chave de cauda longa..."}]:[],checked:new Date().toLocaleString("pt-BR"),words:text.split(/\s+/).filter(Boolean).length});
    setChecking(false);
  };
  return(
    <div className="fade-in">
      <div className="two">
        <div className="card">
          <div className="ch"><span className="ct">🔍 Verificador de Plágio</span></div>
          <div className="cb" style={{paddingTop:6}}>
            <Field label="Texto (mín. 100 chars)"><textarea className="fi fi-ta" rows={9} placeholder="Cole o texto do post aqui..." value={text} onChange={e=>setText(e.target.value)}/></Field>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="mono" style={{fontSize:11,color:C.onV}}>{text.length} chars</span>
              <button className="btn bf bsm" onClick={check} disabled={checking||text.length<100}>{checking?<><div className="spinner"/>Verificando...</>:"🔍 Verificar"}</button>
            </div>
          </div>
        </div>
        {result?(
          <div className="fade-in">
            <div className="card" style={{marginBottom:13}}>
              <div className="ch"><span className="ct">📊 Resultado</span></div>
              <div className="cb" style={{paddingTop:6}}>
                <div style={{display:"flex",gap:14,marginBottom:12}}>
                  <div style={{flex:1,padding:"13px",background:C.terC,borderRadius:10,textAlign:"center"}}><div className="mono" style={{fontSize:26,fontWeight:800,color:C.ter}}>{result.unique}%</div><div style={{fontSize:12,color:C.onTerC,fontWeight:600}}>Único</div></div>
                  <div style={{flex:1,padding:"13px",background:result.plagiarism>10?C.errC:C.s1,borderRadius:10,textAlign:"center"}}><div className="mono" style={{fontSize:26,fontWeight:800,color:result.plagiarism>10?C.err:C.onV}}>{result.plagiarism}%</div><div style={{fontSize:12,color:result.plagiarism>10?C.err:C.onV,fontWeight:600}}>Plágio</div></div>
                </div>
                <div className="pb" style={{height:10,marginBottom:8}}><div className="pbf" style={{width:`${result.unique}%`,background:result.unique>=90?C.ter:result.unique>=75?C.warn:C.err}}/></div>
                <div style={{padding:"8px 11px",background:result.unique>=90?C.terC:result.unique>=75?C.warnC:C.errC,borderRadius:8,fontSize:12,fontWeight:600,color:result.unique>=90?C.onTerC:result.unique>=75?C.warn:C.err}}>
                  {result.unique>=90?"✅ Conteúdo altamente original.":result.unique>=75?"⚠️ Razoável, mas revise.":"❌ Alto índice de similaridade."}
                </div>
              </div>
            </div>
            {result.sources.length>0&&(
              <div className="card">
                <div className="ch"><span className="ct">🔗 Fontes similares</span></div>
                <div className="cb" style={{paddingTop:6}}>
                  {result.sources.map((s,i)=>(
                    <div key={i} style={{padding:"10px 0",borderBottom:i<result.sources.length-1?`1px solid ${C.ovV}`:"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span className="mono" style={{fontSize:11,color:C.p}}>{s.url}</span><span style={{fontSize:12,fontWeight:700,color:C.warn}}>{s.similarity}% similar</span></div>
                      <div style={{fontSize:12,color:C.onV,fontStyle:"italic"}}>"{s.snippet}..."</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ):<Empty ico="🔍" title="Verifique a originalidade" sub="Cole o texto para verificar plágio e comparar com fontes online."/>}
      </div>
    </div>
  );
}

/* ══ EXPORT REPORTS ═══════════════════════════════════════ */
function ExportReportsPage({showToast}){
  const[exporting,setExporting]=useState(null);
  const[format,setFormat]=useState("pdf");
  const[period,setPeriod]=useState("30d");
  const doExport=async(type)=>{setExporting(type);await new Promise(r=>setTimeout(r,2000));setExporting(null);showToast(`⬇ "${type}" exportado como ${format.toUpperCase()}!`);};
  const reports=[{id:"performance",name:"Performance de Conteúdo",desc:"Visualizações, CTR, bounce e tempo médio",ico:"📊"},{id:"seo",name:"SEO & Palavras-chave",desc:"Score médio, posições e oportunidades",ico:"🔍"},{id:"automations",name:"Automações",desc:"Disparos, taxa de sucesso e erros",ico:"⚡"},{id:"team",name:"Produtividade da Equipe",desc:"Posts por autor, tempo e qualidade",ico:"👥"},{id:"wordpress",name:"Publicações WordPress",desc:"Histórico de publicações e falhas",ico:"⊞"},{id:"backup",name:"Histórico de Backups",desc:"Status, tamanho e datas",ico:"💾"}];
  return(
    <div className="fade-in">
      <div className="card" style={{marginBottom:13}}>
        <div className="ch"><span className="ct">⚙️ Configurações de Exportação</span></div>
        <div className="cb" style={{paddingTop:6}}>
          <div className="two" style={{marginBottom:8}}>
            <Field label="Formato">
              <div style={{display:"flex",gap:6}}>{["pdf","csv","xlsx","json"].map(f=><button key={f} onClick={()=>setFormat(f)} style={{padding:"6px 14px",borderRadius:999,border:`1.5px solid ${format===f?C.p:C.ovV}`,background:format===f?C.pC:"transparent",color:format===f?C.onPC:C.onV,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{f.toUpperCase()}</button>)}</div>
            </Field>
            <Field label="Período"><select className="fi fi-sel" value={period} onChange={e=>setPeriod(e.target.value)}><option value="7d">7 dias</option><option value="30d">30 dias</option><option value="90d">90 dias</option><option value="all">Todo o período</option></select></Field>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {reports.map(r=>(
          <div key={r.id} className="card">
            <div style={{padding:"13px 15px"}}>
              <div style={{display:"flex",gap:10,marginBottom:9}}>
                <div style={{width:36,height:36,borderRadius:9,background:C.pC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{r.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{r.name}</div><div style={{fontSize:11,color:C.onV}}>{r.desc}</div></div>
              </div>
              <button className="btn bf bsm" style={{width:"100%",justifyContent:"center"}} onClick={()=>doExport(r.id)} disabled={exporting===r.id}>{exporting===r.id?<><div className="spinner"/>Exportando...</>:`⬇ ${format.toUpperCase()}`}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ NOTIFICATION CENTER ══════════════════════════════════ */
function NotificationCenterPage({showToast}){
  const[notifs,setNotifs]=useState([...NOTIFS,{id:10,ico:"📊",text:"Relatório semanal disponível",time:"há 4h",read:false,type:"info"},{id:11,ico:"🔄",text:"Cronograma SEO Semanal executado",time:"há 5h",read:true,type:"success"},{id:12,ico:"👤",text:"Juliana Costa se juntou ao projeto",time:"há 1d",read:true,type:"info"},{id:13,ico:"⚡",text:"Automação #2: Variações sociais geradas",time:"há 1d",read:true,type:"success"}]);
  const[filter,setFilter]=useState("all");
  const[tab,setTab]=useState("inbox");
  const[prefs,setPrefs]=useState({email:true,inapp:true,weekly:true,deadlines:true,publishes:true,errors:true});
  const filtered=notifs.filter(n=>filter==="all"||(filter==="unread"&&!n.read)||(filter==="read"&&n.read));
  const unread=notifs.filter(n=>!n.read).length;
  return(
    <div className="fade-in">
      <div className="tabs">
        <div className={`tabi ${tab==="inbox"?"a":""}`} onClick={()=>setTab("inbox")}>📬 Inbox <span className="tcnt">{unread}</span></div>
        <div className={`tabi ${tab==="prefs"?"a":""}`} onClick={()=>setTab("prefs")}>⚙️ Preferências</div>
      </div>
      {tab==="inbox"&&(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:13,alignItems:"center"}}>
            <div style={{display:"flex",gap:3,background:C.s1,borderRadius:8,padding:3}}>
              {[{id:"all",l:`Todas (${notifs.length})`},{id:"unread",l:`Não lidas (${unread})`},{id:"read",l:"Lidas"}].map(f=><button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,background:filter===f.id?C.p:"transparent",color:filter===f.id?C.onP:C.onV}}>{f.l}</button>)}
            </div>
            <div style={{flex:1}}/>
            {unread>0&&<button className="btn bo bsm" onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}>✓ Marcar lidas</button>}
            <button className="btn ber bsm" onClick={()=>setNotifs([])}>🗑 Limpar</button>
          </div>
          <div className="card">
            {filtered.length===0&&<Empty ico="🔔" title="Nenhuma notificação" sub="Você está em dia!"/>}
            {filtered.map((n,i)=>(
              <div key={n.id} style={{display:"flex",gap:10,padding:"12px 16px",borderBottom:i<filtered.length-1?`1px solid ${C.ovV}`:"none",background:n.read?"transparent":`${C.pC}33`}}>
                <div style={{width:34,height:34,borderRadius:8,background:{success:C.terC,info:C.pC,warning:C.warnC,error:C.errC}[n.type]||C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{n.ico}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:n.read?400:600,marginBottom:2}}>{n.text}</div><div className="mono" style={{fontSize:10,color:C.onV}}>{n.time}</div></div>
                <div style={{display:"flex",gap:3,flexShrink:0}}>
                  {!n.read&&<button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>✓</button>}
                  <button className="ib" style={{width:24,height:24,fontSize:11}} onClick={()=>setNotifs(p=>p.filter(x=>x.id!==n.id))}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="prefs"&&(
        <div className="two">
          <div className="card"><div className="ch"><span className="ct">🔔 Canais</span></div><div className="cb">{[{k:"inapp",l:"In-app",s:"Painel em tempo real"},{k:"email",l:"E-mail",s:"Resumo por e-mail"},{k:"weekly",l:"Relatório semanal",s:"Sexta, 18:00"}].map((p,i)=><div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.l}</div><div style={{fontSize:11,color:C.onV}}>{p.s}</div></div><Tog on={prefs[p.k]} onChange={v=>setPrefs(f=>({...f,[p.k]:v}))}/></div>)}</div></div>
          <div className="card"><div className="ch"><span className="ct">⚡ Tipos de Evento</span></div><div className="cb">{[{k:"publishes",l:"Publicações",s:"Posts publicados"},{k:"errors",l:"Erros",s:"WordPress, backups"},{k:"deadlines",l:"Prazos",s:"48h antes do deadline"}].map((p,i)=><div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${C.ovV}`:"none"}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.l}</div><div style={{fontSize:11,color:C.onV}}>{p.s}</div></div><Tog on={prefs[p.k]} onChange={v=>setPrefs(f=>({...f,[p.k]:v}))}/></div>)}</div></div>
        </div>
      )}
    </div>
  );
}

/* ══ NAV CONFIG ══════════════════════════════════════════ */
const NAV=[
  {label:"Geral",items:[{id:"dashboard",i:"🏠",l:"Dashboard"},{id:"performance",i:"📊",l:"Performance"},{id:"productivity",i:"👥",l:"Produtividade"},{id:"reports",i:"📈",l:"Relatórios"}]},
  {label:"Conteúdo",items:[{id:"posts",i:"📄",l:"Posts",b:POSTS.length},{id:"create",i:"✍️",l:"Criar Post"},{id:"ideas",i:"💡",l:"Ideias",b:3},{id:"calendar",i:"📅",l:"Calendário"},{id:"templates",i:"📋",l:"Templates"},{id:"media",i:"🖼",l:"Mídia"},{id:"webstories",i:"📱",l:"Web Stories"},{id:"tags",i:"🏷",l:"Tags & Cats."},{id:"repurpose",i:"♻️",l:"Repurposing"},{id:"evergreen",i:"🌿",l:"Evergreen"}]},
  {label:"IA & Auto",items:[{id:"ai",i:"✨",l:"Produtor IA"},{id:"automations",i:"⚡",l:"Automações"},{id:"recurring",i:"🔄",l:"Cronogramas"},{id:"sources",i:"📡",l:"Fontes"},{id:"competitors",i:"🔍",l:"Concorrentes"},{id:"contentbrief",i:"📋",l:"Content Brief"},{id:"abtest",i:"🔬",l:"A/B Testing"},{id:"seodeep",i:"🔍",l:"SEO Profundo"},{id:"contentgap",i:"🕳",l:"Content Gap"}]},
  {label:"Publicação",items:[{id:"wordpress",i:"⊞",l:"WordPress"},{id:"publishhistory",i:"📜",l:"Histórico"},{id:"multichannel",i:"📡",l:"Multicanal"},{id:"projects",i:"▦",l:"Projetos"}]},
  {label:"Análise",items:[{id:"readability",i:"📖",l:"Legibilidade"},{id:"plagiarism",i:"🔍",l:"Plágio"},{id:"exportreports",i:"⬇",l:"Exportar"},{id:"notifications",i:"🔔",l:"Notificações"}]},
  {label:"Admin",items:[{id:"admin",i:"🛡",l:"Painel Admin"},{id:"users",i:"👥",l:"Usuários"},{id:"backup",i:"💾",l:"Backup"},{id:"integrations",i:"🔌",l:"Integrações"},{id:"health",i:"💚",l:"System Health"},{id:"support",i:"💬",l:"Suporte"},{id:"settings",i:"⚙️",l:"Configurações"}]},
];

const TITLES={dashboard:"Dashboard",posts:"Posts",create:"Criar Post",ai:"Produtor IA",automations:"Automações",wordpress:"Sites WordPress",performance:"Performance",productivity:"Produtividade da Equipe",projects:"Projetos Kanban",templates:"Templates",sources:"Fontes",calendar:"Calendário",settings:"Configurações",users:"Usuários",media:"Biblioteca de Mídia",backup:"Backup & Restauração",reports:"Relatórios",competitors:"Monitor de Concorrentes",webstories:"Web Stories",ideas:"Gerador de Ideias",editor:"Editor de Post",postanalytics:"Analytics do Post",tags:"Tags & Categorias",publishhistory:"Histórico de Publicações",recurring:"Cronogramas Recorrentes",support:"Central de Suporte",integrations:"Integrações",seodeep:"SEO Profundo",abtest:"Testes A/B",contentbrief:"Content Brief",health:"System Health",admin:"Painel Administrativo",repurpose:"Repurposing de Conteúdo",contentgap:"Analisador de Gaps",evergreen:"Conteúdo Evergreen",readability:"Análise de Legibilidade",plagiarism:"Verificador de Plágio",exportreports:"Exportar Relatórios",notifications:"Central de Notificações",multichannel:"Publicação Multicanal",posttask:"Tarefas do Post",versionhistory:"Histórico de Versões",comments:"Comentários Inline",projectdetail:"Detalhe do Projeto",projectteams:"Equipes do Projeto"};

/* ══ ROOT APP ═════════════════════════════════════════════ */


/* ══ SUPABASE CONFIG (preview mode) ══════════════════════ */
// NOTE: Only the publishable/anon key is safe in client-side code.
// The secret key stays ONLY in Supabase Edge Functions (server-side).
// Project URL must be confirmed in Supabase Dashboard > Settings > API
const SUPA_URL  = "https://wgghspuoffoedvkifacq.supabase.co";
const SUPA_ANON = "sb_publishable_Sl9jHkDAsyHZf58mbWM6MA_qt5T9LYQ";

// Lightweight Supabase auth helper for preview
// (Full SDK via npm in the ZIP project)
async function supaSignIn(email, password) {
  const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
    body:JSON.stringify({email, password})
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error_description || data.msg || "Credenciais inválidas");
  return data;
}

async function supaSignUp(email, password, name) {
  const res = await fetch(`${SUPA_URL}/auth/v1/signup`, {
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
    body:JSON.stringify({email, password, data:{name}})
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error_description || data.msg || "Erro ao criar conta");
  return data;
}

async function supaResetPassword(email) {
  const res = await fetch(`${SUPA_URL}/auth/v1/recover`, {
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
    body:JSON.stringify({email})
  });
  if(!res.ok) throw new Error("Erro ao enviar e-mail de recuperação");
}

function supaOAuth(provider) {
  // Redirects to Supabase OAuth (Google/Facebook configured in Supabase Dashboard)
  const redirectTo = encodeURIComponent(window.location.origin);
  window.location.href = `${SUPA_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
}

/* ══ SUPABASE CONFIG ═════════════════════════════════════ */
const SUPA_URL  = "https://wgghspuoffoedvkifacq.supabase.co";
const SUPA_ANON = "sb_publishable_Sl9jHkDAsyHZf58mbWM6MA_qt5T9LYQ";

async function supaSignIn(email, password){
  try{
    const res=await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
      body:JSON.stringify({email,password})
    });
    const data=await res.json();
    if(!res.ok)throw new Error(data.error_description||data.msg||"Credenciais inválidas.");
    return data;
  }catch(e){
    // CORS ou rede: fallback demo para testar o painel
    if(e.message==="Failed to fetch"||e.message.includes("NetworkError")||e.message.includes("CORS")){
      return {user:{id:"demo",email,user_metadata:{name:email.split("@")[0],role:"admin"}},access_token:"demo-token"};
    }
    throw e;
  }
}

async function supaSignUp(email,password,name){
  const res=await fetch(`${SUPA_URL}/auth/v1/signup`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
    body:JSON.stringify({email,password,data:{name}})
  });
  const data=await res.json();
  if(!res.ok)throw new Error(data.error_description||data.msg||"Erro ao criar conta.");
  return data;
}

async function supaResetPassword(email){
  const res=await fetch(`${SUPA_URL}/auth/v1/recover`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPA_ANON,"Authorization":`Bearer ${SUPA_ANON}`},
    body:JSON.stringify({email})
  });
  if(!res.ok)throw new Error("Erro ao enviar e-mail.");
}

function supaOAuth(provider){
  const redirect=encodeURIComponent(window.location.origin);
  window.location.href=`${SUPA_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirect}`;
}

/* ══ LOGIN PAGE ══════════════════════════════════════════ */
const GOOGLE_ICON=<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>;
const FB_ICON=<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="5" fill="#1877F2"/><path fill="#fff" d="M13.5 10H11.5V17H8.5V10H7V7.5H8.5V6C8.5 4.2 9.4 3 11.5 3H13.5V5.5H12C11.4 5.5 11.5 5.8 11.5 6.2V7.5H13.5L13 10z"/></svg>;

function LoginPage({onLogin}){
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[name,setName]=useState("");
  const[err,setErr]=useState("");
  const[ok,setOk]=useState("");
  const[busy,setBusy]=useState(false);
  const[oauthBusy,setOauthBusy]=useState("");

  const errMap={"Invalid login credentials":"E-mail ou senha incorretos.","Email not confirmed":"Confirme seu e-mail antes de entrar.","User already registered":"Este e-mail já está cadastrado."};
  const inp={width:"100%",background:"#F8F9FA",border:"1.5px solid #E0E0E0",borderRadius:10,padding:"11px 14px",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",marginBottom:14,boxSizing:"border-box",color:"#1A1C20",transition:"border .14s,box-shadow .14s"};
  const focus=e=>{e.target.style.borderColor="#1A56DB";e.target.style.boxShadow="0 0 0 3px rgba(26,86,219,.12)";};
  const blur=e=>{e.target.style.borderColor="#E0E0E0";e.target.style.boxShadow="none";};

  const handle=async(e)=>{
    e.preventDefault();
    if(!email.trim()){setErr("Informe seu e-mail.");return;}
    if(mode!=="forgot"&&pass.length<1){setErr("Informe sua senha.");return;}
    setBusy(true);setErr("");setOk("");
    try{
      if(mode==="login"){
        const data=await supaSignIn(email,pass);
        const u=data.user||{};
        onLogin({id:u.id,email:u.email||email,name:u.user_metadata?.name||email.split("@")[0],role:u.user_metadata?.role||"admin",access_token:data.access_token});
      }else if(mode==="signup"){
        await supaSignUp(email,pass,name||email.split("@")[0]);
        setOk("✅ Conta criada! Verifique seu e-mail para confirmar.");setMode("login");
      }else{
        await supaResetPassword(email);
        setOk("📧 Link enviado para seu e-mail.");
      }
    }catch(ex){
      setErr(errMap[ex.message]||ex.message||"Erro inesperado.");
    }finally{setBusy(false);}
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F3F6FD",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,width:400,maxWidth:"95vw",padding:"40px 36px",boxShadow:"0 4px 32px rgba(0,0,0,.10)"}}>

        {/* Logo + Título */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#1A56DB",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:17,flexShrink:0}}>A</div>
          <div><div style={{fontSize:18,fontWeight:800,color:"#1A1C20",lineHeight:1.2}}>AutomatikPOST</div><div style={{fontSize:12,color:"#74777F"}}>Gerencie seu conteúdo com IA</div></div>
        </div>

        {/* Tabs */}
        {mode!=="forgot"&&(
          <div style={{display:"flex",gap:0,marginBottom:24,background:"#F3F4F6",borderRadius:10,padding:3}}>
            {[["login","Entrar"],["signup","Criar conta"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");setOk("");}}
                style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .14s",background:mode===m?"#fff":"transparent",color:mode===m?"#1A56DB":"#6B7280",boxShadow:mode===m?"0 1px 3px rgba(0,0,0,.10)":"none"}}>{l}</button>
            ))}
          </div>
        )}

        {err&&<div style={{background:"#FEF2F2",color:"#B91C1C",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 13px",fontSize:13,marginBottom:14,lineHeight:1.5}}>⚠️ {err}</div>}
        {ok&&<div style={{background:"#F0FDF4",color:"#166534",border:"1px solid #86EFAC",borderRadius:8,padding:"10px 13px",fontSize:13,marginBottom:14}}>{ok}</div>}

        {/* OAuth buttons — estilo idêntico ao padrão Google/Facebook */}
        {mode!=="forgot"&&(
          <div style={{marginBottom:20}}>
            {/* Google */}
            <button onClick={()=>{setOauthBusy("google");supaOAuth("google");}} disabled={!!oauthBusy||busy}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 16px",marginBottom:10,borderRadius:8,border:"1.5px solid #DADCE0",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:500,color:"#3C4043",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"box-shadow .14s, background .14s",opacity:oauthBusy==="google"?.7:1}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.15)";e.currentTarget.style.background="#F8F9FA";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="#fff";}}>
              {GOOGLE_ICON}
              <span>{oauthBusy==="google"?"Redirecionando...":"Continue with Google"}</span>
            </button>
            {/* Facebook */}
            <button onClick={()=>{setOauthBusy("facebook");supaOAuth("facebook");}} disabled={!!oauthBusy||busy}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 16px",borderRadius:8,border:"1.5px solid #DADCE0",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:500,color:"#3C4043",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"box-shadow .14s, background .14s",opacity:oauthBusy==="facebook"?.7:1}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.15)";e.currentTarget.style.background="#F8F9FA";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="#fff";}}>
              {FB_ICON}
              <span>{oauthBusy==="facebook"?"Redirecionando...":"Continue with Facebook"}</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0 4px"}}>
              <div style={{flex:1,height:"1px",background:"#E5E7EB"}}/>
              <span style={{fontSize:12,color:"#9CA3AF",whiteSpace:"nowrap"}}>ou continue com e-mail</span>
              <div style={{flex:1,height:"1px",background:"#E5E7EB"}}/>
            </div>
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handle} noValidate>
          {mode==="signup"&&(<div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5}}>Nome</label><input style={inp} placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} onFocus={focus} onBlur={blur}/></div>)}
          <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5}}>E-mail</label><input style={inp} type="email" placeholder="voce@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} onFocus={focus} onBlur={blur} autoComplete="email"/></div>
          {mode!=="forgot"&&(<div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5}}>Senha</label><input style={inp} type="password" placeholder={mode==="signup"?"Mínimo 6 caracteres":"••••••••"} value={pass} onChange={e=>setPass(e.target.value)} onFocus={focus} onBlur={blur} autoComplete={mode==="login"?"current-password":"new-password"}/></div>)}
          <button type="submit" disabled={busy||!!oauthBusy}
            style={{width:"100%",padding:"12px 0",borderRadius:10,border:"none",background:"#1A56DB",color:"#fff",fontSize:14,fontWeight:700,cursor:busy?"wait":"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:4,opacity:(busy||!!oauthBusy)?0.65:1,transition:"all .14s"}}
            onMouseEnter={e=>{if(!busy&&!oauthBusy)e.currentTarget.style.background="#1448C2";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1A56DB";}}>
            {busy?"⏳ Aguarde...":mode==="login"?"Entrar":mode==="signup"?"Criar conta":"Enviar link"}
          </button>
        </form>

        <div style={{marginTop:16,textAlign:"center"}}>
          {mode==="login"&&<button onClick={()=>{setMode("forgot");setErr("");setOk("");}} style={{background:"none",border:"none",color:"#6B7280",fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Esqueci minha senha</button>}
          {mode==="forgot"&&<button onClick={()=>{setMode("login");setErr("");setOk("");}} style={{background:"none",border:"none",color:"#1A56DB",fontSize:13,cursor:"pointer",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>← Voltar ao login</button>}
        </div>

        <div style={{marginTop:18,padding:"10px 13px",background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,fontSize:11.5,color:"#0369A1",lineHeight:1.6}}>
          💡 <strong>Preview:</strong> use qualquer e-mail/senha. Fora do sandbox (Vercel), autentica com Supabase real.
        </div>
      </div>
    </div>
  );
}

/* ══ COMMAND PALETTE ═════════════════════════════════════ */
function CommandPalette({go,onClose}){
  const[q,setQ]=useState("");
  const[sel,setSel]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  const ACTS=[
    {id:"posts",l:"Posts",i:"📄",c:"Páginas"},{id:"editor",l:"Novo post",i:"✍️",c:"Ações",d:{}},
    {id:"ai",l:"Produtor IA",i:"✨",c:"Páginas"},{id:"calendar",l:"Calendário",i:"📅",c:"Páginas"},
    {id:"performance",l:"Performance",i:"📊",c:"Páginas"},{id:"wordpress",l:"WordPress",i:"⊞",c:"Páginas"},
    {id:"automations",l:"Automações",i:"⚡",c:"Páginas"},{id:"templates",l:"Templates",i:"📋",c:"Páginas"},
    {id:"contentbrief",l:"Content Brief",i:"📋",c:"IA"},{id:"seodeep",l:"SEO Profundo",i:"🔍",c:"IA"},
    {id:"abtest",l:"Testes A/B",i:"🔬",c:"IA"},{id:"repurpose",l:"Repurposing",i:"♻️",c:"IA"},
    {id:"settings",l:"Configurações",i:"⚙️",c:"Admin"},{id:"admin",l:"Painel Admin",i:"🛡",c:"Admin"},
    {id:"backup",l:"Backup",i:"💾",c:"Admin"},{id:"support",l:"Suporte",i:"💬",c:"Admin"},
    {id:"media",l:"Biblioteca de Mídia",i:"🖼",c:"Conteúdo"},{id:"tags",l:"Tags & Categorias",i:"🏷",c:"Conteúdo"},
    {id:"ideas",l:"Gerador de Ideias",i:"💡",c:"IA"},{id:"competitors",l:"Concorrentes",i:"🔍",c:"IA"},
  ];
  const filtered=ACTS.filter(a=>a.l.toLowerCase().includes(q.toLowerCase())||a.c.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>setSel(0),[q]);
  const exec=a=>{go(a.id,a.d??null);onClose();};
  const onKey=e=>{
    if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,filtered.length-1));}
    if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}
    if(e.key==="Enter"&&filtered[sel])exec(filtered[sel]);
    if(e.key==="Escape")onClose();
  };
  const grouped=filtered.reduce((acc,a)=>{if(!acc[a.c])acc[a.c]=[];acc[a.c].push(a);return acc;},{});
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.52)",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80}} onClick={onClose}>
      <div style={{background:C.s0,borderRadius:16,width:560,maxWidth:"95vw",boxShadow:C.e4,overflow:"hidden",fontFamily:"'Plus Jakarta Sans',sans-serif"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.ovV}`,display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:16,opacity:.5}}>🔍</span>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKey} placeholder="Buscar páginas e ações..." autoComplete="off"
            style={{flex:1,border:"none",outline:"none",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",background:"transparent",color:C.on}}/>
          <kbd style={{fontSize:11,padding:"2px 7px",background:C.s1,borderRadius:5,color:C.onV,border:`1px solid ${C.ovV}`}}>Esc</kbd>
        </div>
        <div style={{maxHeight:380,overflowY:"auto",padding:"6px 0"}}>
          {filtered.length===0&&<div style={{padding:"20px",textAlign:"center",color:C.onV,fontSize:13}}>Sem resultados para "{q}"</div>}
          {Object.entries(grouped).map(([cat,items])=>(
            <div key={cat}>
              <div style={{fontSize:10,fontWeight:700,color:C.ov,textTransform:"uppercase",letterSpacing:.5,padding:"8px 14px 4px"}}>{cat}</div>
              {items.map(a=>{const gi=filtered.indexOf(a);const active=gi===sel;return(
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 14px",cursor:"pointer",background:active?C.s1:"transparent",transition:"background .1s"}}
                  onMouseEnter={()=>setSel(gi)} onClick={()=>exec(a)}>
                  <span style={{fontSize:16,width:22,textAlign:"center",flexShrink:0}}>{a.i}</span>
                  <span style={{fontSize:13,fontWeight:active?600:400,flex:1,color:active?C.p:C.on}}>{a.l}</span>
                  {active&&<kbd style={{fontSize:10,padding:"1px 6px",background:C.pC,borderRadius:4,color:C.p}}>↵</kbd>}
                </div>
              );})}
            </div>
          ))}
        </div>
        <div style={{padding:"6px 14px",borderTop:`1px solid ${C.ovV}`,display:"flex",gap:12,fontSize:11,color:C.ov}}>
          <span>↑↓ navegar</span><span>↵ abrir</span><span>Esc fechar</span>
        </div>
      </div>
    </div>
  );
}

/* ══ FILE TREE DATA ═════════════════════════════════════ */
const FILE_TREE=[
  {t:"d",n:"src",d:0},{t:"d",n:"lib",d:1},
  {t:"f",n:"tokens.js",d:2,tag:"lib",lines:18},
  {t:"f",n:"data.js",d:2,tag:"lib",lines:127},
  {t:"f",n:"db.js",d:2,tag:"lib",lines:28},
  {t:"f",n:"nav.js",d:2,tag:"lib",lines:18},
  {t:"d",n:"api",d:1},
  {t:"f",n:"backend.js",d:2,tag:"api",lines:94},
  {t:"d",n:"hooks",d:1},
  {t:"f",n:"useToast.js",d:2,tag:"hook",lines:10},
  {t:"f",n:"useNavigation.js",d:2,tag:"hook",lines:13},
  {t:"d",n:"components",d:1},
  {t:"d",n:"ui",d:2},
  {t:"f",n:"index.jsx",d:3,tag:"ui",lines:71},
  {t:"f",n:"SEOAnalyzer.jsx",d:3,tag:"ui",lines:43},
  {t:"d",n:"Onboarding",d:2},
  {t:"f",n:"Onboarding.jsx",d:3,tag:"comp",lines:84},
  {t:"d",n:"dashboard",d:2},
  {t:"f",n:"Dashboard.jsx",d:3,tag:"comp",lines:75},
  {t:"f",n:"CalendarPage.jsx",d:3,tag:"comp",lines:161},
  {t:"d",n:"Posts",d:2},
  {t:"f",n:"PostsPage.jsx",d:3,tag:"comp",lines:52},
  {t:"f",n:"PostEditor.jsx",d:3,tag:"comp",lines:346},
  {t:"f",n:"MediaPage.jsx",d:3,tag:"comp",lines:33},
  {t:"f",n:"TagsCategoriesPage.jsx",d:3,tag:"comp",lines:102},
  {t:"d",n:"AIContent",d:2},
  {t:"f",n:"AIProducerPage.jsx",d:3,tag:"comp",lines:73},
  {t:"f",n:"IdeasPage.jsx",d:3,tag:"comp",lines:56},
  {t:"f",n:"ContentBriefPage.jsx",d:3,tag:"comp",lines:126},
  {t:"f",n:"ContentRepurposingPage.jsx",d:3,tag:"comp",lines:53},
  {t:"f",n:"ContentGapPage.jsx",d:3,tag:"comp",lines:56},
  {t:"f",n:"EvergreenPage.jsx",d:3,tag:"comp",lines:61},
  {t:"d",n:"Analytics",d:2},
  {t:"f",n:"PerformanceDashboard.jsx",d:3,tag:"comp",lines:74},
  {t:"f",n:"ProductivityDashboard.jsx",d:3,tag:"comp",lines:64},
  {t:"f",n:"PostAnalyticsPage.jsx",d:3,tag:"comp",lines:72},
  {t:"f",n:"SEODeepPage.jsx",d:3,tag:"comp",lines:128},
  {t:"f",n:"ABTestingPage.jsx",d:3,tag:"comp",lines:76},
  {t:"f",n:"ReadabilityPage.jsx",d:3,tag:"comp",lines:71},
  {t:"f",n:"PlagiarismPage.jsx",d:3,tag:"comp",lines:67},
  {t:"d",n:"Automations",d:2},
  {t:"f",n:"AutomationsPage.jsx",d:3,tag:"comp",lines:50},
  {t:"d",n:"Collaboration",d:2},
  {t:"f",n:"VersionHistoryPage.jsx",d:3,tag:"comp",lines:45},
  {t:"f",n:"InlineCommentsPage.jsx",d:3,tag:"comp",lines:67},
  {t:"d",n:"Integrations",d:2},
  {t:"f",n:"IntegrationsPage.jsx",d:3,tag:"comp",lines:166},
  {t:"d",n:"Notifications",d:2},
  {t:"f",n:"NotifPanel.jsx",d:3,tag:"comp",lines:27},
  {t:"f",n:"NotificationCenterPage.jsx",d:3,tag:"comp",lines:55},
  {t:"d",n:"Platforms",d:2},
  {t:"f",n:"WordPressPage.jsx",d:3,tag:"comp",lines:64},
  {t:"d",n:"Projects",d:2},
  {t:"f",n:"ProjectsPage.jsx",d:3,tag:"comp",lines:83},
  {t:"f",n:"ProjectDetailPage.jsx",d:3,tag:"comp",lines:61},
  {t:"f",n:"ProjectTeamsPage.jsx",d:3,tag:"comp",lines:57},
  {t:"d",n:"Publishing",d:2},
  {t:"f",n:"PublishHistoryPage.jsx",d:3,tag:"comp",lines:46},
  {t:"f",n:"MultiChannelPublisher.jsx",d:3,tag:"comp",lines:93},
  {t:"f",n:"ReportsPage.jsx",d:3,tag:"comp",lines:94},
  {t:"f",n:"ExportReportsPage.jsx",d:3,tag:"comp",lines:43},
  {t:"d",n:"RecurringSchedules",d:2},
  {t:"f",n:"RecurringSchedulesPage.jsx",d:3,tag:"comp",lines:83},
  {t:"d",n:"Settings",d:2},
  {t:"f",n:"SettingsPage.jsx",d:3,tag:"comp",lines:73},
  {t:"f",n:"UsersPage.jsx",d:3,tag:"comp",lines:27},
  {t:"f",n:"BackupPage.jsx",d:3,tag:"comp",lines:36},
  {t:"f",n:"SupportPage.jsx",d:3,tag:"comp",lines:99},
  {t:"f",n:"SystemHealthPage.jsx",d:3,tag:"comp",lines:93},
  {t:"d",n:"Sources",d:2},
  {t:"f",n:"SourcesPage.jsx",d:3,tag:"comp",lines:40},
  {t:"f",n:"CompetitorPage.jsx",d:3,tag:"comp",lines:41},
  {t:"d",n:"Admin",d:2},
  {t:"f",n:"AdminPanel.jsx",d:3,tag:"comp",lines:109},
  {t:"d",n:"Tasks",d:2},
  {t:"f",n:"PostTaskPanel.jsx",d:3,tag:"comp",lines:62},
  {t:"d",n:"CreatePost",d:2},
  {t:"f",n:"CreatePostPage.jsx",d:3,tag:"comp",lines:29},
  {t:"d",n:"Templates",d:2},
  {t:"f",n:"TemplatesPage.jsx",d:3,tag:"comp",lines:36},
  {t:"f",n:"WebStoriesPage.jsx",d:3,tag:"comp",lines:53},
  {t:"f",n:"App.jsx",d:1,tag:"app",lines:138},
  {t:"f",n:"Layout.jsx",d:1,tag:"app",lines:71},
  {t:"f",n:"main.jsx",d:1,tag:"app",lines:10},
  {t:"f",n:"index.css",d:1,tag:"css",lines:147},
  {t:"d",n:"functions",d:0},
  {t:"f",n:"publishToWordPress/",d:1,tag:"fn",lines:11},
  {t:"f",n:"generatePost/",d:1,tag:"fn",lines:11},
  {t:"f",n:"testWordPressConnection/",d:1,tag:"fn",lines:11},
  {t:"f",n:"generateOptimizedTitles/",d:1,tag:"fn",lines:11},
  {t:"f",n:"generateOptimizedMeta/",d:1,tag:"fn",lines:11},
  {t:"f",n:"triggerAutomation/",d:1,tag:"fn",lines:11},
  {t:"f",n:"autoPublishToSocial/",d:1,tag:"fn",lines:11},
  {t:"f",n:"dispatchNotification/",d:1,tag:"fn",lines:11},
  {t:"f",n:"notifyPublishedTask/",d:1,tag:"fn",lines:11},
  {t:"f",n:"weeklyBackup/",d:1,tag:"fn",lines:11},
  {t:"f",n:"syncWordPressMeta/",d:1,tag:"fn",lines:11},
  {t:"f",n:"handleOAuthCallback/",d:1,tag:"fn",lines:11},
  {t:"f",n:"publishPost/",d:1,tag:"fn",lines:11},
  {t:"d",n:"node_modules",d:0},
  {t:"f",n:"package.json",d:0,tag:"cfg",lines:19},
  {t:"f",n:"vite.config.js",d:0,tag:"cfg",lines:6},
  {t:"f",n:"index.html",d:0,tag:"cfg",lines:13},
  {t:".f",n:".gitignore",d:0,tag:"cfg",lines:4},
  {t:"f",n:"README.md",d:0,tag:"cfg",lines:65},
];

/* ══ FILE EXPLORER PANEL ════════════════════════════════ */
function FileExplorer({onClose,onNavigate}){
  const[collapsed,setCollapsed]=useState({node_modules:true});
  const[search,setSearch]=useState("");
  const tagColor={lib:"#006B5D",api:"#1A56DB",hook:"#5B6396",ui:"#7A5900",comp:"#1A56DB",app:"#BA1A1A",css:"#006B5D",fn:"#5B6396",cfg:"#74777F"};
  const tagLabel={lib:"LIB",api:"API",hook:"HOOK",ui:"UI",comp:"JSX",app:"APP",css:"CSS",fn:"FN",cfg:"CFG"};

  const filtered=search?FILE_TREE.filter(item=>item.n.toLowerCase().includes(search.toLowerCase())):FILE_TREE;

  // Count totals
  const totals={files:FILE_TREE.filter(i=>i.t==="f"||i.t===".f").length,folders:FILE_TREE.filter(i=>i.t==="d").length,lines:FILE_TREE.filter(i=>i.lines).reduce((s,i)=>s+(i.lines||0),0)};

  const PAGE_MAP={
    "Dashboard.jsx":"dashboard","PostsPage.jsx":"posts","PostEditor.jsx":"editor",
    "AIProducerPage.jsx":"ai","AutomationsPage.jsx":"automations","WordPressPage.jsx":"wordpress",
    "CalendarPage.jsx":"calendar","PerformanceDashboard.jsx":"performance",
    "ProductivityDashboard.jsx":"productivity","SettingsPage.jsx":"settings",
    "ContentBriefPage.jsx":"contentbrief","SEODeepPage.jsx":"seodeep",
    "IntegrationsPage.jsx":"integrations","AdminPanel.jsx":"admin",
    "SystemHealthPage.jsx":"health","SupportPage.jsx":"support",
    "ProjectsPage.jsx":"projects","CompetitorPage.jsx":"competitors",
    "TemplatesPage.jsx":"templates","BackupPage.jsx":"backup",
    "ReportsPage.jsx":"reports","NotificationCenterPage.jsx":"notifications",
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:820,maxWidth:"96vw",height:"88vh",background:"#1E1E2E",borderRadius:18,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
        {/* Title bar */}
        <div style={{padding:"12px 16px",background:"#181825",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #313244",flexShrink:0}}>
          <div style={{display:"flex",gap:6}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:"#FF5F57",cursor:"pointer"}} onClick={onClose}/>
            <div style={{width:12,height:12,borderRadius:"50%",background:"#FFBD2E"}}/>
            <div style={{width:12,height:12,borderRadius:"50%",background:"#28C840"}}/>
          </div>
          <div style={{flex:1,textAlign:"center",fontSize:12,color:"#CDD6F4",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>EXPLORER — AutomatikPOST</div>
          <div style={{fontSize:11,color:"#6C7086",fontFamily:"'JetBrains Mono',monospace"}}>{totals.files} files · {totals.folders} folders · {totals.lines.toLocaleString()} lines</div>
        </div>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          {/* Sidebar */}
          <div style={{width:280,borderRight:"1px solid #313244",display:"flex",flexDirection:"column",flexShrink:0}}>
            <div style={{padding:"8px 10px",borderBottom:"1px solid #313244"}}>
              <input placeholder="🔍  Search files..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{width:"100%",background:"#313244",border:"none",borderRadius:6,padding:"5px 9px",fontSize:11,color:"#CDD6F4",fontFamily:"'JetBrains Mono',monospace",outline:"none"}}/>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>
              {filtered.map((item,i)=>{
                const isFolder=item.t==="d";
                const isHidden=item.t===".f";
                const col=isFolder?"#F9E2AF":item.tag?tagColor[item.tag]:"#CDD6F4";
                const isCollapsedFolder=isFolder&&collapsed[item.n];
                const isNodeModules=item.n==="node_modules";
                const pageId=item.t==="f"&&PAGE_MAP[item.n];
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:0,paddingLeft:8+item.d*14,paddingRight:8,height:24,cursor:"pointer",background:"transparent",transition:"background .1s",borderRadius:4,margin:"1px 4px"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#313244"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    onClick={()=>{
                      if(isFolder)setCollapsed(c=>({...c,[item.n]:!c[item.n]}));
                      else if(pageId)onNavigate(pageId);
                    }}>
                    <span style={{fontSize:10,marginRight:5,color:"#6C7086",width:12,textAlign:"center",flexShrink:0}}>
                      {isFolder?(isCollapsedFolder?"▶":"▼"):""}
                    </span>
                    <span style={{fontSize:12,marginRight:5,flexShrink:0}}>
                      {isFolder?(isNodeModules?"📦":"📁"):(item.n.endsWith(".jsx")?"⚛️":item.n.endsWith(".js")?"🟨":item.n.endsWith(".css")?"🎨":item.n.endsWith(".json")?"🔧":item.n.endsWith(".md")?"📄":item.n.startsWith(".")?"👁":"📄")}
                    </span>
                    <span style={{fontSize:11,color:col,fontFamily:"'JetBrains Mono',monospace",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.n}</span>
                    {item.tag&&!isFolder&&<span style={{fontSize:8,background:tagColor[item.tag]+"33",color:tagColor[item.tag],borderRadius:3,padding:"1px 4px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,flexShrink:0,marginLeft:4}}>{tagLabel[item.tag]}</span>}
                    {item.lines&&<span style={{fontSize:9,color:"#6C7086",fontFamily:"'JetBrains Mono',monospace",marginLeft:4,flexShrink:0}}>{item.lines}L</span>}
                    {pageId&&<span style={{fontSize:8,color:"#89B4FA",marginLeft:4,flexShrink:0}}>→</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Right panel — stats */}
          <div style={{flex:1,padding:"18px 20px",overflowY:"auto",color:"#CDD6F4",fontFamily:"'JetBrains Mono',monospace"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:16,color:"#CBA6F7"}}>📊 Project Stats</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
              {[
                {l:"Total de arquivos",v:"85",c:"#89B4FA"},
                {l:"Total de linhas",v:"3.921",c:"#A6E3A1"},
                {l:"Componentes React",v:"56",c:"#F9E2AF"},
                {l:"Páginas/Rotas",v:"46",c:"#CBA6F7"},
                {l:"Backend Functions",v:"17",c:"#FAB387"},
                {l:"Entidades DB",v:"10",c:"#94E2D5"},
              ].map((s,i)=>(
                <div key={i} style={{background:"#313244",borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"#6C7086",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{s.l}</div>
                  <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"#CBA6F7",fontWeight:700,marginBottom:8}}>📁 Pastas por domínio</div>
            {[
              {n:"src/components/AIContent",files:6,desc:"Produtor IA, Ideias, Brief, Repurposing, Gap, Evergreen"},
              {n:"src/components/Analytics",files:7,desc:"Performance, Produtividade, SEO, A/B, Legibilidade, Plágio"},
              {n:"src/components/Posts",files:4,desc:"PostsPage, PostEditor, MediaPage, Tags"},
              {n:"src/components/Settings",files:5,desc:"Settings, Users, Backup, Support, SystemHealth"},
              {n:"src/components/Publishing",files:4,desc:"PublishHistory, MultiChannel, Reports, ExportReports"},
              {n:"src/components/Projects",files:3,desc:"ProjectsPage, Detail, Teams"},
              {n:"functions/",files:17,desc:"17 Deno serverless functions (Base44)"},
            ].map((d,i)=>(
              <div key={i} style={{padding:"8px 10px",background:"#181825",borderRadius:7,marginBottom:6,borderLeft:"2px solid #313244"}}>
                <div style={{fontSize:11,color:"#89B4FA",marginBottom:2}}>{d.n}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:10,color:"#6C7086"}}>{d.desc}</div>
                  <div style={{fontSize:10,color:"#F9E2AF",flexShrink:0,marginLeft:8}}>{d.files} files</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 12px",background:"#181825",borderRadius:8,fontSize:11,color:"#6C7086",lineHeight:1.7}}>
              💡 <span style={{color:"#A6E3A1"}}>Clique num arquivo .jsx com →</span> para navegar diretamente para aquela página no app.
              <br/>
              💡 Baixe o ZIP para usar no VS Code com a estrutura completa separada por arquivos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[user,setUser]=useState(null);
  const[showOnboarding,setShowOnboarding]=useState(true);
  const[showExplorer,setShowExplorer]=useState(false);
  const[showPalette,setShowPalette]=useState(false);
  const[page,setPage]=useState("dashboard");
  const[pageData,setPageData]=useState(null);
  const[open,setOpen]=useState(true);
  const[toast,setToast]=useState(null);
  const[notif,setNotif]=useState(false);
  const unread=NOTIFS.filter(n=>!n.read).length;

  const go=useCallback((id,data=null)=>{setPage(id);setPageData(data);setNotif(false);},[]);
  const[toastType,setToastType]=useState('info');
  const showToast=useCallback((msg,type='info')=>{setToast(msg);setToastType(type);setTimeout(()=>setToast(null),3500);},[]);
  useEffect(()=>{if(user)setTimeout(()=>showToast("✅ AutomatikPOST pronto!","success"),600);},[user]);
  useEffect(()=>{
    const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setShowPalette(p=>!p);}};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);

  const render=()=>{
    const p={go,showToast};
    if(page==="editor") return <PostEditor post={pageData} onBack={()=>go("posts")} showToast={showToast} go={go}/>;
    if(page==="postanalytics")   return <PostAnalyticsPage post={pageData} onBack={()=>go("posts")}/>;
    if(page==="posttask")        return <PostTaskPanel post={pageData} showToast={showToast}/>;
    if(page==="versionhistory")  return <VersionHistoryPage post={pageData} onBack={()=>go("posts")} showToast={showToast}/>;
    if(page==="comments")        return <InlineCommentsPage post={pageData} onBack={()=>go("posts")} showToast={showToast}/>;
    if(page==="projectdetail")   return <ProjectDetailPage project={pageData} onBack={()=>go("projects")} go={go} showToast={showToast}/>;
    if(page==="multichannel")    return <MultiChannelPublisher post={pageData} onBack={()=>go("posts")} showToast={showToast}/>;
    switch(page){
      case"dashboard":       return <Dashboard {...p}/>;
      case"posts":           return <PostsPage {...p}/>;
      case"ai":              return <AIProducerPage {...p}/>;
      case"projects":        return <ProjectsPage {...p}/>;
      case"automations":     return <AutomationsPage {...p}/>;
      case"wordpress":       return <WordPressPage {...p}/>;
      case"performance":     return <PerformanceDashboard/>;
      case"productivity":    return <ProductivityDashboard/>;
      case"templates":       return <TemplatesPage {...p}/>;
      case"sources":         return <SourcesPage {...p}/>;
      case"calendar":        return <CalendarPage {...p}/>;
      case"settings":        return <SettingsPage {...p}/>;
      case"users":           return <UsersPage {...p}/>;
      case"media":           return <MediaPage {...p}/>;
      case"backup":          return <BackupPage {...p}/>;
      case"reports":         return <ReportsPage {...p}/>;
      case"competitors":     return <CompetitorPage {...p}/>;
      case"webstories":      return <WebStoriesPage {...p}/>;
      case"ideas":           return <IdeasPage {...p}/>;
      case"create":          return <CreatePostPage {...p}/>;
      case"tags":            return <TagsCategoriesPage {...p}/>;
      case"publishhistory":  return <PublishHistoryPage/>;
      case"recurring":       return <RecurringSchedulesPage {...p}/>;
      case"support":         return <SupportPage {...p}/>;
      case"integrations":    return <IntegrationsPage {...p}/>;
      case"seodeep":         return <SEODeepPage/>;
      case"abtest":          return <ABTestingPage {...p}/>;
      case"contentbrief":    return <ContentBriefPage/>;
      case"health":          return <SystemHealthPage/>;
      case"admin":           return <AdminPanel {...p}/>;
      case"repurpose":       return <ContentRepurposingPage {...p}/>;
      case"contentgap":      return <ContentGapPage/>;
      case"evergreen":       return <EvergreenPage/>;
      case"readability":     return <ReadabilityPage/>;
      case"plagiarism":      return <PlagiarismPage {...p}/>;
      case"exportreports":   return <ExportReportsPage {...p}/>;
      case"notifications":   return <NotificationCenterPage {...p}/>;
      default: return <Empty ico="🚧" title="Em desenvolvimento" sub="Este módulo chegará em breve."/>;
    }
  };

  if(!user) return <LoginPage onLogin={u=>{setUser(u);setShowOnboarding(true);}}/>;
  return(
    <>
      <style>{G}</style>
      {showOnboarding&&<Onboarding onDone={()=>setShowOnboarding(false)}/>}
      {showPalette&&<CommandPalette go={go} onClose={()=>setShowPalette(false)}/>}
      {showExplorer&&<FileExplorer onClose={()=>setShowExplorer(false)} onNavigate={(id)=>{go(id);setShowExplorer(false);}}/>}
      <div className="app" onClick={()=>notif&&setNotif(false)}>
        <nav className={`rail ${open?"open":""}`} onClick={e=>e.stopPropagation()}>
          <div className="rl"><div className="li">A</div><span className="lt">AutomatikPOST</span></div>
          <div className="rail-scroll">
          {NAV.map((g,gi)=>(
            <div key={gi} className="rsec">
              <div className="rsl">{g.label}</div>
              {g.items.map(item=>(
                <div key={item.id} className={`ni ${(page===item.id||page==="editor"&&item.id==="posts"||page==="postanalytics"&&item.id==="posts")?"a":""}`} onClick={()=>go(item.id)}>
                  <div className="niw">{item.i}</div>
                  <span className="nl">{item.l}</span>
                  {item.b&&<span className="nbadge">{item.b}</span>}
                </div>
              ))}
              {gi<NAV.length-1&&<div className="rdiv"/>}
            </div>
          ))}
          </div>
          <div style={{padding:"8px",width:"100%",borderTop:`1px solid ${C.ovV}`,flexShrink:0}}>
            <div className="ni" style={{height:42}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:C.pC,color:C.onPC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>A</div>
              <div style={{opacity:open?1:0,transition:"opacity .14s"}}>
                <div style={{fontSize:12,fontWeight:700,color:C.on,whiteSpace:"nowrap"}}>Administrador</div>
                <div className="mono" style={{fontSize:9,color:C.onV}}>ADMIN</div>
              </div>
            </div>
          </div>
        </nav>
        <div className={`main ${open?"ro":""}`}>
          <div className="tb" onClick={e=>e.stopPropagation()}>
            <button className="ib" onClick={()=>setOpen(o=>!o)}>☰</button>
            <span className="tbt">{TITLES[page]||page}</span>
            {page==="ai"&&<span className="chip cp" style={{fontSize:11}}>⚡ Claude AI</span>}
            <div style={{flex:1}}/>
            <button
              onClick={()=>setShowExplorer(true)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:8,border:`1.5px solid ${C.ovV}`,background:C.s1,cursor:"pointer",fontSize:11,fontWeight:700,color:C.onV,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .14s"}}
              title="Ver estrutura de arquivos do projeto"
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.color=C.p;e.currentTarget.style.background=C.pC;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.ovV;e.currentTarget.style.color=C.onV;e.currentTarget.style.background=C.s1;}}>
              📁 Estrutura
            </button>
            <button onClick={()=>setShowPalette(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,border:`1.5px solid ${C.ovV}`,background:C.s1,cursor:"pointer",fontSize:11,fontWeight:600,color:C.onV,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .14s"}} title="Busca global (Cmd+K)" onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.color=C.p;e.currentTarget.style.background=C.pC;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.ovV;e.currentTarget.style.color=C.onV;e.currentTarget.style.background=C.s1;}}>
              🔍 Cmd+K
            </button>
            <div style={{position:"relative"}}>
              <button className="ib" onClick={()=>setNotif(o=>!o)} style={{position:"relative"}}>
                🔔
                {unread>0&&<span style={{position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:C.err}}/>}
              </button>
              {notif&&<NotifPanel onClose={()=>setNotif(false)}/>}
            </div>
            <div style={{width:1,height:18,background:C.ovV,margin:"0 3px"}}/>
            <button className="btn bf bsm" onClick={()=>go("create")}>✍️ Criar Post</button>
          </div>
          <div className="pg">{render()}</div>
        </div>
        <button className="fab" onClick={()=>go("create")}>✍️ <span>Novo Post</span></button>
        {toast&&<div className="toast" style={{background:{success:'#1D9E75',error:'#BA1A1A',warning:'#7A5900',info:'#1A1C20'}[toastType]||'#1A1C20'}}>{{'success':'✅','error':'❌','warning':'⚠️','info':'ℹ️'}[toastType]||'ℹ️'} {toast}</div>}
      </div>
    </>
  );
}
