// ══ MOCK DATA ══════════════════════════════════════════════

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
