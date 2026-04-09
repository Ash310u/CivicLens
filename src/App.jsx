import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/common/Toast';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { APP_BASENAME, ROUTES, ROLE_HOME_PATHS } from '@/lib/routes';

// Public Pages
import Landing from '@/pages/public/Landing';
import Features from '@/pages/public/Features';
import HowItWorks from '@/pages/public/HowItWorks';
import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import FAQ from '@/pages/public/FAQ';

// Auth Pages
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Citizen Pages
import TopDashboard from '@/pages/citizen/TopDashboard';
import ReportDetails from '@/pages/citizen/ReportDetails';
import Heatmap from '@/pages/citizen/Heatmap';
import Campaigns from '@/pages/citizen/Campaigns';

import DisposalLocator from '@/pages/citizen/DisposalLocator';
import BulkPickup from '@/pages/citizen/BulkPickup';
import AIAssistant from '@/pages/citizen/AIAssistant';
import SegregationGuide from '@/pages/citizen/SegregationGuide';
import Profile from '@/pages/citizen/Profile';

// Authority Pages
import AuthorityDashboard from '@/pages/authority/Dashboard';
import ReportQueue from '@/pages/authority/ReportQueue';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';

// Placeholder for pages not yet built
import PlaceholderPage from '@/pages/PlaceholderPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME_PATHS[user?.role] || ROUTES.citizen.home} replace />;
  }
  return children;
}

function AppRoutes() {
  const toRelativePath = (path) => path.replace(/^\//, '');

  return (
    <Routes>
      {/* Public Pages */}
      <Route path={ROUTES.home} element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path={toRelativePath(ROUTES.features)} element={<Features />} />
        <Route path={toRelativePath(ROUTES.howItWorks)} element={<HowItWorks />} />
        <Route path={toRelativePath(ROUTES.about)} element={<About />} />
        <Route path={toRelativePath(ROUTES.contact)} element={<Contact />} />
        <Route path={toRelativePath(ROUTES.faq)} element={<FAQ />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.signup} element={<Signup />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
      </Route>

      {/* Shared Dashboard Pages */}
      <Route element={<ProtectedRoute allowedRoles={['citizen', 'authority', 'admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.heatmap} element={<Heatmap />} />
      </Route>

      {/* Citizen Shared Pages */}
      <Route element={<ProtectedRoute allowedRoles={['citizen']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.campaigns} element={<Campaigns />} />
      </Route>

      {/* Citizen Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['citizen']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.citizen.reportDetails()} element={<ReportDetails />} />
        <Route path={ROUTES.citizen.home} element={<TopDashboard />} />
        <Route path={ROUTES.citizen.disposal} element={<DisposalLocator />} />
        <Route path={ROUTES.citizen.bulkPickup} element={<BulkPickup />} />
        <Route path={ROUTES.citizen.assistant} element={<AIAssistant />} />
        <Route path={ROUTES.citizen.guide} element={<SegregationGuide />} />
        <Route path={ROUTES.citizen.profile} element={<Profile />} />
      </Route>

      {/* Authority Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['authority']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.authority.home} element={<AuthorityDashboard />} />
        <Route path={ROUTES.authority.queue} element={<ReportQueue />} />
        <Route path={ROUTES.authority.assign} element={<PlaceholderPage title="Assign Tasks" description="Task assignment workflow for cleanup teams." />} />
        <Route path={ROUTES.authority.resolution} element={<PlaceholderPage title="Resolution Tracking" description="Before/after photo verification and resolution management." />} />
        <Route path={ROUTES.authority.analytics} element={<PlaceholderPage title="Ward Analytics" description="Detailed ward-level analytics and performance metrics." />} />
        <Route path={ROUTES.authority.escalation} element={<PlaceholderPage title="Escalations" description="Manage escalated reports and override timers." />} />
        <Route path={ROUTES.authority.workers} element={<PlaceholderPage title="Worker Management" description="Manage cleanup workers, assignments, and performance." />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.admin.home} element={<AdminDashboard />} />
        <Route path={ROUTES.admin.analytics} element={<PlaceholderPage title="Analytics Overview" description="City-wide analytics and downloadable reports." />} />
        <Route path={ROUTES.admin.monitor} element={<PlaceholderPage title="System Monitor" description="Real-time API health, database status, and queue metrics." />} />
        <Route path={ROUTES.admin.users} element={<PlaceholderPage title="User Management" description="Manage users, roles, and permissions across the platform." />} />
        <Route path={ROUTES.admin.moderation} element={<PlaceholderPage title="Moderation Settings" description="AI validation thresholds and content moderation rules." />} />
        <Route path={ROUTES.admin.campaigns} element={<PlaceholderPage title="Campaign Approval" description="Review and approve/reject community campaigns." />} />
      </Route>

      {/* Organization Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['organization']}><DashboardLayout /></ProtectedRoute>}>
        <Route path={ROUTES.organization.home} element={<PlaceholderPage title="Organization Dashboard" description="Overview of your organization's waste compliance and metrics." />} />
        <Route path={ROUTES.organization.compliance} element={<PlaceholderPage title="Bulk Compliance" description="Segregation compliance tracking and audit trail." />} />
        <Route path={ROUTES.organization.tracking} element={<PlaceholderPage title="Waste Tracking" description="Category-wise waste generation tracking and trends." />} />
        <Route path={ROUTES.organization.participation} element={<PlaceholderPage title="Campaign Participation" description="Team participation history and leaderboard." />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-extrabold text-[var(--text-tertiary)] mb-4">404</h1>
              <p className="text-lg text-[var(--text-secondary)] mb-6">Page not found</p>
              <Link to={ROUTES.home} className="text-civic-500 hover:text-civic-600 font-medium">← Back to Home</Link>
            </div>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

export default function App() {
  const normalizedBasename = APP_BASENAME === '/' ? '/' : APP_BASENAME;
  const isWithinConfiguredBase =
    typeof window === 'undefined' ||
    normalizedBasename === '/' ||
    window.location.pathname === normalizedBasename ||
    window.location.pathname.startsWith(`${normalizedBasename}/`);
  const routerBasename = isWithinConfiguredBase ? normalizedBasename : '/';

  return (
    <BrowserRouter basename={routerBasename}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
