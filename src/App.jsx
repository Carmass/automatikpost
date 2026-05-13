import { useCallback, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { useToast } from './hooks/useToast.js'
import { useNavigation } from './hooks/useNavigation.js'
import Layout from './Layout.jsx'
import LoginPage from './components/Auth/LoginPage.jsx'

// Pages
import Onboarding         from './components/Onboarding/Onboarding.jsx'
import Dashboard          from './components/dashboard/Dashboard.jsx'
import CalendarPage       from './components/dashboard/CalendarPage.jsx'
import PostsPage          from './components/Posts/PostsPage.jsx'
import PostEditor         from './components/Posts/PostEditor.jsx'
import MediaPage          from './components/Posts/MediaPage.jsx'
import TagsCategoriesPage from './components/Posts/TagsCategoriesPage.jsx'
import PostAnalyticsPage  from './components/Analytics/PostAnalyticsPage.jsx'
import PerformanceDashboard    from './components/Analytics/PerformanceDashboard.jsx'
import ProductivityDashboard   from './components/Analytics/ProductivityDashboard.jsx'
import SEODeepPage        from './components/Analytics/SEODeepPage.jsx'
import ABTestingPage      from './components/Analytics/ABTestingPage.jsx'
import ReadabilityPage    from './components/Analytics/ReadabilityPage.jsx'
import PlagiarismPage     from './components/Analytics/PlagiarismPage.jsx'
import AIProducerPage     from './components/AIContent/AIProducerPage.jsx'
import IdeasPage          from './components/AIContent/IdeasPage.jsx'
import ContentBriefPage   from './components/AIContent/ContentBriefPage.jsx'
import ContentRepurposingPage from './components/AIContent/ContentRepurposingPage.jsx'
import ContentGapPage     from './components/AIContent/ContentGapPage.jsx'
import EvergreenPage      from './components/AIContent/EvergreenPage.jsx'
import AutomationsPage    from './components/Automations/AutomationsPage.jsx'
import RecurringSchedulesPage from './components/RecurringSchedules/RecurringSchedulesPage.jsx'
import SourcesPage        from './components/Sources/SourcesPage.jsx'
import CompetitorPage     from './components/Sources/CompetitorPage.jsx'
import WordPressPage      from './components/Platforms/WordPressPage.jsx'
import PublishHistoryPage from './components/Publishing/PublishHistoryPage.jsx'
import MultiChannelPublisher  from './components/Publishing/MultiChannelPublisher.jsx'
import ReportsPage        from './components/Publishing/ReportsPage.jsx'
import ExportReportsPage  from './components/Publishing/ExportReportsPage.jsx'
import ProjectsPage       from './components/Projects/ProjectsPage.jsx'
import ProjectDetailPage  from './components/Projects/ProjectDetailPage.jsx'
import TemplatesPage      from './components/Templates/TemplatesPage.jsx'
import WebStoriesPage     from './components/Templates/WebStoriesPage.jsx'
import VersionHistoryPage from './components/Collaboration/VersionHistoryPage.jsx'
import InlineCommentsPage from './components/Collaboration/InlineCommentsPage.jsx'
import PostTaskPanel      from './components/Tasks/PostTaskPanel.jsx'
import IntegrationsPage   from './components/Integrations/IntegrationsPage.jsx'
import NotificationCenterPage from './components/Notifications/NotificationCenterPage.jsx'
import AdminPanel         from './components/Admin/AdminPanel.jsx'
import SettingsPage       from './components/Settings/SettingsPage.jsx'
import UsersPage          from './components/Settings/UsersPage.jsx'
import BackupPage         from './components/Settings/BackupPage.jsx'
import SupportPage        from './components/Settings/SupportPage.jsx'
import SystemHealthPage   from './components/Settings/SystemHealthPage.jsx'
import CreatePostPage     from './components/CreatePost/CreatePostPage.jsx'

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

  // Onboarding: show if profile has no wordpress sites yet (first login)
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
      {needsOnboarding && <Onboarding onDone={() => {}} />}
      <Layout page={page} go={go} showToast={showToast}>
        {renderPage()}
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
