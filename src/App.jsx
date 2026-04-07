import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/common/Toast';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
import CitizenDashboard from '@/pages/citizen/Dashboard';
import ReportWaste from '@/pages/citizen/ReportWaste';
import MyReports from '@/pages/citizen/MyReports';
import ReportDetails from '@/pages/citizen/ReportDetails';

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
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const paths = { citizen: '/citizen', authority: '/authority', admin: '/admin', organization: '/organization' };
    return <Navigate to={paths[user?.role] || '/citizen'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Citizen Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['citizen']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/report" element={<ReportWaste />} />
        <Route path="/citizen/reports" element={<MyReports />} />
        <Route path="/citizen/reports/:id" element={<ReportDetails />} />
        <Route path="/citizen/disposal" element={<DisposalLocator />} />
        <Route path="/citizen/bulk-pickup" element={<BulkPickup />} />
        <Route path="/citizen/assistant" element={<AIAssistant />} />
        <Route path="/citizen/guide" element={<SegregationGuide />} />
        <Route path="/citizen/profile" element={<Profile />} />
      </Route>

      {/* Authority Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['authority']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/authority" element={<AuthorityDashboard />} />
        <Route path="/authority/queue" element={<ReportQueue />} />
        <Route path="/authority/assign" element={<PlaceholderPage title="Assign Tasks" description="Task assignment workflow for cleanup teams." />} />
        <Route path="/authority/resolution" element={<PlaceholderPage title="Resolution Tracking" description="Before/after photo verification and resolution management." />} />
        <Route path="/authority/analytics" element={<PlaceholderPage title="Ward Analytics" description="Detailed ward-level analytics and performance metrics." />} />
        <Route path="/authority/escalation" element={<PlaceholderPage title="Escalations" description="Manage escalated reports and override timers." />} />
        <Route path="/authority/workers" element={<PlaceholderPage title="Worker Management" description="Manage cleanup workers, assignments, and performance." />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<PlaceholderPage title="Analytics Overview" description="City-wide analytics and downloadable reports." />} />
        <Route path="/admin/monitor" element={<PlaceholderPage title="System Monitor" description="Real-time API health, database status, and queue metrics." />} />
        <Route path="/admin/users" element={<PlaceholderPage title="User Management" description="Manage users, roles, and permissions across the platform." />} />
        <Route path="/admin/moderation" element={<PlaceholderPage title="Moderation Settings" description="AI validation thresholds and content moderation rules." />} />
        <Route path="/admin/campaigns" element={<PlaceholderPage title="Campaign Approval" description="Review and approve/reject community campaigns." />} />
      </Route>

      {/* Organization Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['organization']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/organization" element={<PlaceholderPage title="Organization Dashboard" description="Overview of your organization's waste compliance and metrics." />} />
        <Route path="/organization/compliance" element={<PlaceholderPage title="Bulk Compliance" description="Segregation compliance tracking and audit trail." />} />
        <Route path="/organization/tracking" element={<PlaceholderPage title="Waste Tracking" description="Category-wise waste generation tracking and trends." />} />
        <Route path="/organization/participation" element={<PlaceholderPage title="Campaign Participation" description="Team participation history and leaderboard." />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-extrabold text-[var(--text-tertiary)] mb-4">404</h1>
              <p className="text-lg text-[var(--text-secondary)] mb-6">Page not found</p>
              <a href="/" className="text-civic-500 hover:text-civic-600 font-medium">← Back to Home</a>
            </div>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
