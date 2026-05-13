# AutomatikPOST

Plataforma SaaS completa de produção, automação e gestão de conteúdo com IA e integração WordPress.

## Stack

- **Frontend**: React 18 + Vite
- **IA**: Claude API (claude-sonnet-4-20250514)
- **Backend**: Deno Functions (Base44)
- **Design**: Material Design 3 custom

## Instalação

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  components/     # Componentes por feature
    Admin/        # AdminPanel
    AIContent/    # AIProducer, Ideas, ContentBrief, Repurposing, Gap, Evergreen
    Analytics/    # Performance, Productivity, SEO, A/B Testing, Readability, Plagiarism
    Automations/  # AutomationsPage
    Collaboration/# VersionHistory, InlineComments
    CreatePost/   # CreatePostPage
    dashboard/    # Dashboard, CalendarPage
    Integrations/ # IntegrationsPage
    Notifications/# NotificationCenter, NotifPanel
    Onboarding/   # Onboarding wizard
    Platforms/    # WordPressPage
    Posts/        # PostsPage, PostEditor, MediaPage, Tags
    Projects/     # ProjectsPage, ProjectDetail, ProjectTeams
    Publishing/   # PublishHistory, MultiChannel, Reports, ExportReports
    RecurringSchedules/ # RecurringSchedulesPage
    Settings/     # Settings, Users, Backup, Support, SystemHealth
    Sources/      # SourcesPage, CompetitorPage
    Tasks/        # PostTaskPanel
    Templates/    # TemplatesPage, WebStoriesPage
    ui/           # Shared UI: Ring, Tog, SChip, Bar, Spark, Empty, Dlg, Field, SEOAnalyzer
  api/            # Backend.js (all functions combined)
  lib/            # tokens.js, data.js, db.js, nav.js
  hooks/          # useToast, useNavigation
  utils/          # helpers
functions/        # Deno serverless functions (Base44)
```

## Páginas (46 total)

Dashboard, Performance, Produtividade, Relatórios, Posts, Criar Post, Ideias IA,
Calendário, Templates, Mídia, Web Stories, Tags & Categorias, Repurposing, Evergreen,
Produtor IA, Automações, Cronogramas, Fontes, Concorrentes, Content Brief, A/B Testing,
SEO Profundo, Content Gap, WordPress, Histórico, Multicanal, Projetos, Legibilidade,
Plágio, Exportar, Notificações, Admin, Usuários, Backup, Integrações, System Health,
Suporte, Configurações + sub-páginas (PostEditor, Analytics, Tarefas, Versões, etc.)

## Backend Functions (17)

publishToWordPress, testWordPressConnection, syncWordPressMeta, publishToExternalPlatform,
generatePost, generateOptimizedTitles, generateOptimizedMeta, triggerAutomation,
autoPublishToSocial, dispatchNotification, checkDeadlineNotifications, notifyPublishedTask,
handleEntityNotification, sendProjectNotification, handleOAuthCallback, weeklyBackup, publishPost
