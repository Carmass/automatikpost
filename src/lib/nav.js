import { POSTS } from './data.js';

const NAV = [
  {label:"Geral",items:[{id:"dashboard",i:"🏠",l:"Dashboard"},{id:"performance",i:"📊",l:"Performance"},{id:"productivity",i:"👥",l:"Produtividade"},{id:"reports",i:"📈",l:"Relatórios"}]},
  {label:"Conteúdo",items:[{id:"posts",i:"📄",l:"Posts",b:POSTS.length},{id:"create",i:"✍️",l:"Criar Post"},{id:"ideas",i:"💡",l:"Ideias",b:3},{id:"calendar",i:"📅",l:"Calendário"},{id:"templates",i:"📋",l:"Templates"},{id:"media",i:"🖼",l:"Mídia"},{id:"webstories",i:"📱",l:"Web Stories"},{id:"tags",i:"🏷",l:"Tags & Cats."},{id:"repurpose",i:"♻️",l:"Repurposing"},{id:"evergreen",i:"🌿",l:"Evergreen"}]},
  {label:"IA & Auto",items:[{id:"ai",i:"✨",l:"Produtor IA"},{id:"automations",i:"⚡",l:"Automações"},{id:"recurring",i:"🔄",l:"Cronogramas"},{id:"sources",i:"📡",l:"Fontes"},{id:"competitors",i:"🔍",l:"Concorrentes"},{id:"contentbrief",i:"📋",l:"Content Brief"},{id:"abtest",i:"🔬",l:"A/B Testing"},{id:"seodeep",i:"🔍",l:"SEO Profundo"},{id:"contentgap",i:"🕳",l:"Content Gap"}]},
  {label:"Publicação",items:[{id:"wordpress",i:"⊞",l:"WordPress"},{id:"publishhistory",i:"📜",l:"Histórico"},{id:"multichannel",i:"📡",l:"Multicanal"},{id:"projects",i:"▦",l:"Projetos"}]},
  {label:"Análise",items:[{id:"readability",i:"📖",l:"Legibilidade"},{id:"plagiarism",i:"🔍",l:"Plágio"},{id:"exportreports",i:"⬇",l:"Exportar"},{id:"notifications",i:"🔔",l:"Notificações"}]},
  {label:"Admin",items:[{id:"admin",i:"🛡",l:"Painel Admin"},{id:"users",i:"👥",l:"Usuários"},{id:"backup",i:"💾",l:"Backup"},{id:"integrations",i:"🔌",l:"Integrações"},{id:"health",i:"💚",l:"System Health"},{id:"support",i:"💬",l:"Suporte"},{id:"settings",i:"⚙️",l:"Configurações"}]},
];

const TITLES={dashboard:"Dashboard",posts:"Posts",create:"Criar Post",ai:"Produtor IA",automations:"Automações",wordpress:"Sites WordPress",performance:"Performance",productivity:"Produtividade da Equipe",projects:"Projetos Kanban",templates:"Templates",sources:"Fontes",calendar:"Calendário",settings:"Configurações",users:"Usuários",media:"Biblioteca de Mídia",backup:"Backup & Restauração",reports:"Relatórios",competitors:"Monitor de Concorrentes",webstories:"Web Stories",ideas:"Gerador de Ideias",editor:"Editor de Post",postanalytics:"Analytics do Post",tags:"Tags & Categorias",publishhistory:"Histórico de Publicações",recurring:"Cronogramas Recorrentes",support:"Central de Suporte",integrations:"Integrações",seodeep:"SEO Profundo",abtest:"Testes A/B",contentbrief:"Content Brief",health:"System Health",admin:"Painel Administrativo",repurpose:"Repurposing de Conteúdo",contentgap:"Analisador de Gaps",evergreen:"Conteúdo Evergreen",readability:"Análise de Legibilidade",plagiarism:"Verificador de Plágio",exportreports:"Exportar Relatórios",notifications:"Central de Notificações",multichannel:"Publicação Multicanal",posttask:"Tarefas do Post",versionhistory:"Histórico de Versões",comments:"Comentários Inline",projectdetail:"Detalhe do Projeto",projectteams:"Equipes do Projeto"};

/* ══ ROOT APP ═════════════════════════════════════════════ */


/* ══ ROOT APP ═════════════════════════════════════════════ */

export { NAV, TITLES };
