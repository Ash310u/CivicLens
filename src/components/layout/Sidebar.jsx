import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, FileWarning, MapPin, Users, BarChart3,
  Camera, ClipboardList, Megaphone, Recycle, Bot, BookOpen,
  Truck, User, Trophy, Settings, Shield, Activity,
  ChevronLeft, ChevronRight, Building2, CheckSquare,
  AlertTriangle, UserCog, Eye, Gauge, FileCheck
} from 'lucide-react';
import clsx from 'clsx';

const menusByRole = {
  citizen: [
    { section: 'Main', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/citizen' },
      { label: 'Report Waste', icon: Camera, href: '/citizen/report' },
      { label: 'My Reports', icon: ClipboardList, href: '/citizen/reports' },
    ]},
    { section: 'Explore', items: [
      { label: 'Live Heatmap', icon: MapPin, href: '/heatmap' },
      { label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
      { label: 'Disposal Locator', icon: Recycle, href: '/citizen/disposal' },
      { label: 'Bulk Pickup', icon: Truck, href: '/citizen/bulk-pickup' },
    ]},
    { section: 'Learn', items: [
      { label: 'AI Assistant', icon: Bot, href: '/citizen/assistant' },
      { label: 'Segregation Guide', icon: BookOpen, href: '/citizen/guide' },
    ]},
    { section: 'Profile', items: [
      { label: 'My Impact', icon: Trophy, href: '/citizen/profile' },
    ]},
  ],
  authority: [
    { section: 'Operations', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/authority' },
      { label: 'Report Queue', icon: ClipboardList, href: '/authority/queue' },
      { label: 'Assign Tasks', icon: CheckSquare, href: '/authority/assign' },
      { label: 'Resolution', icon: FileCheck, href: '/authority/resolution' },
    ]},
    { section: 'Analytics', items: [
      { label: 'Ward Analytics', icon: BarChart3, href: '/authority/analytics' },
      { label: 'Escalations', icon: AlertTriangle, href: '/authority/escalation' },
      { label: 'Workers', icon: UserCog, href: '/authority/workers' },
    ]},
    { section: 'Map', items: [
      { label: 'Live Heatmap', icon: MapPin, href: '/heatmap' },
    ]},
  ],
  admin: [
    { section: 'Overview', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
      { label: 'System Monitor', icon: Activity, href: '/admin/monitor' },
    ]},
    { section: 'Management', items: [
      { label: 'Users & Roles', icon: Users, href: '/admin/users' },
      { label: 'Moderation', icon: Shield, href: '/admin/moderation' },
      { label: 'Campaigns', icon: Megaphone, href: '/admin/campaigns' },
    ]},
    { section: 'Map', items: [
      { label: 'Live Heatmap', icon: MapPin, href: '/heatmap' },
    ]},
  ],
  organization: [
    { section: 'Main', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/organization' },
      { label: 'Compliance', icon: FileCheck, href: '/organization/compliance' },
      { label: 'Waste Tracking', icon: BarChart3, href: '/organization/tracking' },
    ]},
    { section: 'Community', items: [
      { label: 'Campaigns', icon: Megaphone, href: '/organization/participation' },
    ]},
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role || 'citizen';
  const menus = menusByRole[role] || menusByRole.citizen;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--border-subtle)] overflow-y-auto no-scrollbar"
    >
      <div className="flex-1 py-4 px-3 space-y-6">
        {menus.map((group, gi) => (
          <div key={gi}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"
                >
                  {group.section}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-civic-500/10 text-civic-600 dark:text-civic-400'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-civic-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon size={18} className="flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </motion.aside>
  );
}
