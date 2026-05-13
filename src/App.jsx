import { lazy, Suspense, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { useToast } from './hooks/useToast.js'
import { useNavigation } from './hooks/useNavigation.js'
import Layout from './Layout.jsx'
import LoginPage from './components/Auth/LoginPage.jsx'

// Lazy-loaded pages — only bundled when first visited
const Onboarding              = lazy(() => import('./components/Onboarding/Onboarding.jsx'))
const Dashboard               = lazy(() => import('./components/dashboard/Dashboard.jsx'))
const CalendarPage            = lazy(() => import('./components/dashboard/CalendarPage.jsx'))
const PostsPage               = lazy(() => import('./components/Posts/PostsPage.jsx'))
const PostEditor              = lazy(() => import('./components/Posts/PostEditor.jsx'))
const MediaPage               = lazy(() => import('./components/Posts/MediaPage.jsx'))
const TagsCategoriesPage      = lazy(() => import('./components/Posts/TagsCategoriesPage.jsx'))
const PostAnalyticsPage       = lazy(() => import('./components/Analytics/PostAnalyticsPage.jsx'))
const PerformanceDashboard    = lazy(() => import('./components/Analytics/PerformanceDashboard.jsx'))
const ProductivityDashboard   = lazy(() => import('./components/Analytics/ProductivityDashboard.jsx'))
const SEODeepPage             = lazy(() => import('./components/Analytics/SEODeepPage.jsx'))
const ABTestingPage           = lazy(() => import('./components/Analytics/ABTestingPage.jsx'))
const ReadabilityPage         = lazy(() => import('./components/Analytics/ReadabilityPage.jsx'))
const PlagiarismPage          = lazy(() => import('./components/Analytics/PlagiarismPage.jsx'))
const AIProducerPage          = lazy(() => import('./components/AIContent/AIProducerPage.jsx'))
const IdeasPage               = lazy(() => import('./components/AIContent/IdeasPage.jsx'))
const ContentBriefPage        = lazy(() => import('./components/AIContent/ContentBriefPage.jsx'))
const ContentRepurposingPage  = lazy(() => import('./components/AIContent/ContentRepurposingPage.jsx'))
const ContentGapPage          = lazy(() => import('./components/AIContent/ContentGapPage.jsx'))
const EvergreenPage           = lazy(() => import('./components/AIContent/EvergreenPage.jsx'))
const AutomationsPage         = lazy(() => import('./components/Automations/AutomationsPage.jsx'))
const RecurringSchedulesPage  = lazy(() => import('./components/RecurringSchedules/RecurringSchedulesPage.jsx'))
const SourcesPage             = lazy(() => import('./components/Sources/SourcesPage.jsx'))
const CompetitorPage          = lazy(() => import('./components/Sources/CompetitorPage.jsx'))
const WordPressPage           = lazy(() => import('./components/Platforms/WordPressPage.jsx'))
const PublishHistoryPage      = lazy(() => import('./components/Publishing/PublishHistoryPage.jsx'))
const MultiChannelPublisher   = lazy(() => import('./components/Publishing/MultiChannelPublisher.jsx'))
const ReportsPage             = lazy(() => import('./components/Publishing/ReportsPage.jsx'))
const ExportReportsPage       = lazy(() => import('./components/Publishing/ExportReportsPage.jsx'))
const ProjectsPage            = lazy(() => import('./components/Projects/ProjectsPage.jsx'))
const ProjectDetailPage       = lazy(() => import('./components/Projects/ProjectDetailPage.jsx'))
const TemplatesPage           = lazy(() => import('./components/Templates/TemplatesPage.jsx'))
const WebStoriesPage          = lazy(() => import('./components/Templates/WebStoriesPage.jsx'))
const VersionHistoryPage      = lazy(() => import('./components/Collaboration/VersionHistoryPage.jsx'))
const InlineCommentsPage      = lazy(() => import('./components/Collaboration/InlineCommentsPage.jsx'))
const PostTaskPanel           = lazy(() => import('./components/Tasks/PostTaskPanel.jsx'))
const IntegrationsPage        = lazy(() => import('./components/Integrations/IntegrationsPage.jsx'))
const NotificationCenterPage  = lazy(() => import('./components/Notifications/NotificationCenterPage.jsx'))
const AdminPanel              = lazy(() => import('./components/Admin/AdminPanel.jsx'))
const SettingsPage            = lazy(() => import('./components/Settings/SettingsPage.jsx'))
const UsersPage               = lazy(() => import('./components/Settings/UsersPage.jsx'))
const BackupPage              = lazy(() => import('./components/Settings/BackupPage.jsx'))
const SupportPage             = lazy(() => import('./components/Settings/SupportPage.jsx'))
const SystemHealthPage        = lazy(() => import('./components/Settings/SystemHealthPage.jsx'))
const CreatePostPage          = lazy(() => import('./components/CreatePost/CreatePostPage.jsx'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
    </div>
  )
}

function Toast({ msg, type = 'info' }) {
  if (!msg) return null
  const bg = { success: '#1D9E75', error: '#BA1A1A', warning: '#7A5900', info: '#1A1C20' }
  return (
    <div className="toast" style={{ background: bg[type] ?? bg.info }}>
      {{ success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type]} {msg}
    </div>
  )
}

function AppShell() {
  const { user, profile, loading } = useAuth()
  const { page, pageData, go }     = useNavigation('dashboard')
  const { toast, toastType, showToast } = useToast()

  useEffect(() => {
    if (user && !loading) setTimeout(() => showToast('✅ AutomatikPOST pronto!', 'success'), 600)
  }, [user, loading])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F6FD', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1A56DB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, margin: '0 auto 16px' }}>A</div>
        <div style={{ fontSize: 13, color: '#74777F' }}>Carregando...</div>
      </div>
    </div>
  )

  if (!user) return <LoginPage />

  const needsOnboarding = profile && !profile.onboarding_done
  const p = { go, showToast }

  function renderPage() {
    if (page === 'editor')          return <PostEditor post={pageData} onBack={() => go('posts')} showToast={showToast} go={go} />
    if (page === 'postanalytics')   return <PostAnalyticsPage post={pageData} onBack={() => go('posts')} />
    if (page === 'posttask')        return <PostTaskPanel post={pageData} showToast={showToast} />
    if (page === 'versionhistory')  return <VersionHistoryPage post={pageData} onBack={() => go('posts')} showToast={showToast} />
    if (page === 'comments')        return <InlineCommentsPage post={pageData} onBack={() => go('posts')} showToast={showToast} />
    if (page === 'projectdetail')   return <ProjectDetailPage project={pageData} onBack={() => go('projects')} go={go} showToast={showToast} />
    if (page === 'multichannel')    return <MultiChannelPublisher post={pageData} onBack={() => go('posts')} showToast={showToast} />

    switch (page) {
      case 'dashboard':       return <Dashboard {...p} />
      case 'posts':           return <PostsPage {...p} />
      case 'create':          return <CreatePostPage {...p} />
      case 'ideas':           return <IdeasPage {...p} />
      case 'calendar':        return <CalendarPage {...p} />
      case 'templates':       return <TemplatesPage {...p} />
      case 'media':           return <MediaPage {...p} />
      case 'webstories':      return <WebStoriesPage {...p} />
      case 'tags':            return <TagsCategoriesPage {...p} />
      case 'repurpose':       return <ContentRepurposingPage {...p} />
      case 'evergreen':       return <EvergreenPage />
      case 'ai':              return <AIProducerPage {...p} />
      case 'automations':     return <AutomationsPage {...p} />
      case 'recurring':       return <RecurringSchedulesPage {...p} />
      case 'sources':         return <SourcesPage {...p} />
      case 'competitors':     return <CompetitorPage />
      case 'contentbrief':    return <ContentBriefPage />
      case 'abtest':          return <ABTestingPage {...p} />
      case 'seodeep':         return <SEODeepPage />
      case 'contentgap':      return <ContentGapPage />
      case 'wordpress':       return <WordPressPage {...p} />
      case 'publishhistory':  return <PublishHistoryPage />
      case 'projects':        return <ProjectsPage {...p} />
      case 'performance':     return <PerformanceDashboard />
      case 'productivity':    return <ProductivityDashboard />
      case 'reports':         return <ReportsPage {...p} />
      case 'readability':     return <ReadabilityPage />
      case 'plagiarism':      return <PlagiarismPage {...p} />
      case 'exportreports':   return <ExportReportsPage {...p} />
      case 'notifications':   return <NotificationCenterPage {...p} />
      case 'admin':           return <AdminPanel {...p} />
      case 'users':           return <UsersPage {...p} />
      case 'backup':          return <BackupPage {...p} />
      case 'integrations':    return <IntegrationsPage {...p} />
      case 'health':          return <SystemHealthPage />
      case 'support':         return <SupportPage {...p} />
      case 'settings':        return <SettingsPage {...p} />
      default:
        return <div className="empty"><div style={{ fontSize: 40, marginBottom: 12, opacity: .4 }}>🚧</div><div style={{ fontSize: 14, fontWeight: 700 }}>Em desenvolvimento</div></div>
    }
  }

  return (
    <>
      {needsOnboarding && (
        <Suspense fallback={null}>
          <Onboarding onDone={() => {}} />
        </Suspense>
      )}
      <Layout page={page} go={go} showToast={showToast}>
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </Layout>
      <Toast msg={toast} type={toastType} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
