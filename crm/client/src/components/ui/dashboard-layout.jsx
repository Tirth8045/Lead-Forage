import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'
import {
  LayoutDashboard,
  Target,
  Users,
  GitFork,
  ClipboardList,
  Shield,
  LogOut,
  Menu,
} from 'lucide-react'

export function DashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const toast = useToast()

  useEffect(() => {
    api.auth.me().then(res => setCurrentUser(res.data)).catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      await api.auth.logout()
      toast('Logged out successfully')
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A1A' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed lg:static z-20 h-screen flex flex-col transition-all duration-300',
          sidebarOpen ? 'left-0' : '-left-72 lg:left-0',
        )}
        style={{
          width: '260px',
          background: '#14142B',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>L</span>
          </div>
          <span className="font-semibold text-base" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#F1F5F9' }}>
            LeadForage
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Leads', path: '/leads', icon: Target },
            { label: 'Contacts', path: '/contacts', icon: Users },
            { label: 'Pipeline', path: '/pipeline', icon: GitFork },
            { label: 'Follow-ups', path: '/follow-ups', icon: ClipboardList },
            ...(currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')
              ? [{ label: 'Team', path: '/team', icon: Shield }]
              : []),
          ].map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all',
                  isActive ? 'font-bold' : 'hover:opacity-80',
                )}
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '-0.03em',
                  background: isActive
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : '#E2E8F0',
                  textDecoration: 'none',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        {currentUser && (
          <div className="px-4 py-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#FFFFFF',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ fontFamily: 'Manrope, sans-serif', color: '#F1F5F9' }}>
                {currentUser.fullName}
              </div>
              <span
                className="badge rounded-pill px-2 py-0.5 fw-medium"
                style={{
                  background:
                    currentUser.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' :
                    currentUser.role === 'manager' ? 'rgba(99, 102, 241, 0.15)' :
                    'rgba(16, 185, 129, 0.15)',
                  color:
                    currentUser.role === 'admin' ? '#EF4444' :
                    currentUser.role === 'manager' ? '#818CF8' :
                    '#10B981',
                  fontSize: '10px',
                  fontFamily: 'Manrope, sans-serif',
                  textTransform: 'capitalize',
                }}
              >
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base w-full transition-all hover:opacity-80"
            style={{
              fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#E2E8F0',
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-6 w-full max-w-sm"
            style={{ background: '#1A1A3E', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
              Confirm Logout
            </h3>
            <p className="text-sm mb-5" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
              Are you sure you want to log out?
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="btn border-0 py-2 px-4 font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Manrope, sans-serif', borderRadius: '8px', color: '#CBD5E1', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); handleLogout() }}
                className="btn fw-bold border-0 py-2 px-4"
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', fontFamily: 'Manrope, sans-serif', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(20, 20, 43, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: '#94A3B8' }}
          >
            <Menu size={22} />
          </button>
          <div className="text-sm font-medium" style={{
            fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#F1F5F9',
          }}>
            LeadForage
          </div>
          <div />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
