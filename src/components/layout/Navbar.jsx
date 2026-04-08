import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sun, Moon, Menu, X, ChevronDown,
  Leaf, LogIn, UserPlus, LayoutDashboard, LogOut
} from 'lucide-react';
import Button from '@/components/common/Button';
import clsx from 'clsx';
import logoUrl from '../../../icons/logo.png';
import { ROUTES, ROLE_HOME_PATHS } from '@/lib/routes';

const publicLinks = [
  { label: 'Features', href: ROUTES.features },
  { label: 'How it Works', href: ROUTES.howItWorks },

  { label: 'About', href: ROUTES.about },
  { label: 'Contact', href: ROUTES.contact },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!user) return ROUTES.login;
    return ROLE_HOME_PATHS[user.role] || ROUTES.citizen.home;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--navbar-bg)] backdrop-blur-xl shadow-[0_1px_3px_var(--shadow-color)] border-b border-[var(--border-subtle)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.home} className="flex items-center gap-2.5 group">
              <img
                src={logoUrl}
                alt="CivicLens Logo"
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl font-bold text-[var(--text-primary)]">
                Civic<span className="text-gradient">Lens</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div
              className="hidden lg:flex items-center gap-1 relative"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {publicLinks.map(link => {
                const isActive = location.pathname === link.href;
                const isHovered = hoveredLink === link.href;

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    className={clsx(
                      'relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200',
                      isActive || isHovered ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 bg-civic-500/10 rounded-full border border-civic-500/20"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="hover-nav-pill"
                        className="absolute inset-0 bg-[var(--bg-tertiary)] rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-civic-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)] hidden xl:block">{user.name}</span>
                    <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl shadow-elevated p-2 border border-[var(--border-subtle)]"
                      >
                        <div className="px-3 py-2 mb-1 border-b border-[var(--border-subtle)]">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)] capitalize">{user.role}</p>
                        </div>
                        <button
                          onClick={() => { navigate(getDashboardPath()); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </button>
                        <button
                          onClick={() => { logout(); navigate(ROUTES.home); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to={ROUTES.login}>
                    <Button variant="ghost" size="sm" icon={LogIn}>Log In</Button>
                  </Link>
                  <Link to={ROUTES.signup}>
                    <Button variant="primary" size="sm" icon={UserPlus}>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-[var(--text-secondary)]">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong border-b border-[var(--border-subtle)] lg:hidden overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {publicLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'text-civic-600 dark:text-civic-400 bg-civic-500/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardPath()} className="flex-1">
                      <Button variant="primary" size="md" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" size="md" onClick={() => { logout(); navigate(ROUTES.home); }}>
                      <LogOut size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.login} className="flex-1">
                      <Button variant="outline" size="md" className="w-full">Log In</Button>
                    </Link>
                    <Link to={ROUTES.signup} className="flex-1">
                      <Button variant="primary" size="md" className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
