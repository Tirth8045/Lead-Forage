import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FoxifyHero } from '@/components/ui/foxify-hero'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import Dashboard from '@/pages/Dashboard'
import Leads from '@/pages/Leads'
import Contacts from '@/pages/Contacts'
import Pipeline from '@/pages/Pipeline'
import FollowUps from '@/pages/FollowUps'
import Team from '@/pages/Team'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { api } from '@/services/api'
import { ToastProvider } from '@/lib/toast'
import { Target, BarChart3, Users, ClipboardList, TrendingUp, Shield, Check, ArrowUpRight, Star, Zap, Activity } from 'lucide-react'

const featureIcons = [Target, BarChart3, Users, ClipboardList, TrendingUp, Shield]

const features = [
  { title: 'Lead Tracking', desc: 'Capture and organize every lead from any source. Never lose a prospect again.' },
  { title: 'Sales Pipeline', desc: 'Visual Kanban board to move deals through stages. Drag, drop, close.' },
  { title: 'Contact Management', desc: 'Store detailed contact info with tags, notes, and history.' },
  { title: 'Follow-ups & Tasks', desc: 'Automated reminders for calls, emails, and meetings.' },
  { title: 'Analytics Dashboard', desc: 'Real-time stats on leads, deals, and team performance.' },
  { title: 'Team Collaboration', desc: 'Assign leads, share notes, and work together seamlessly.' },
]

function DarkBg({ children, className = '' }) {
  return (
    <section className={`relative py-24 px-4 ${className}`}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: '#0A0A1A' }} />
        <div className="absolute" style={{ width: '800px', height: '600px', left: '-200px', top: '-100px', background: '#6366F1', filter: 'blur(150px)', opacity: 0.12 }} />
        <div className="absolute" style={{ width: '600px', height: '500px', right: '-150px', bottom: '-100px', background: '#8B5CF6', filter: 'blur(150px)', opacity: 0.08 }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  )
}

function SectionHeading({ label, gradient = true, align = 'center' }) {
  return (
    <h2
      className={`text-${align} mb-16`}
      style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
    >
      {label.split(/(\{[^}]+\})/).map((part, i) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          return <span key={i} className="gradient-text">{part.slice(1, -1)}</span>
        }
        return part
      })}
    </h2>
  )
}

function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`rounded-xl p-6 ${hover ? 'glass-hover' : 'glass'} ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
    >
      {children}
    </div>
  )
}

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden" style={{ background: '#0A0A1A' }}>
      <FoxifyHero
        logo={{ initial: 'Lead', text: 'Forage' }}
        navigation={[
          { label: 'Dashboard', onClick: () => document.getElementById('live-dashboard')?.scrollIntoView({ behavior: 'smooth' }) },
          { label: 'What We Provide', onClick: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
          { label: 'How It Works', onClick: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
          { label: 'About Us', onClick: () => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' }) },
          { label: 'Pricing', onClick: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) },
          { label: 'Get Started', onClick: () => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' }) },
        ]}
        authButtons={{
          login: { label: 'Log in', onClick: () => navigate('/login') },
          signup: { label: 'Get Started', onClick: () => navigate('/register') },
        }}
        badge={{
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9 9L12 2Z" fill="#818CF8" />
            </svg>
          ),
          text: 'All-in-One Sales CRM',
        }}
        title="Turn Leads Into Revenue With LeadForage"
        description="Capture, track, and close more deals with an intuitive sales platform. AI-powered insights help your team work smarter and grow faster."
        ctaButtons={{
          primary: { label: 'Start Free Trial', onClick: () => navigate('/register') },
          secondary: { label: 'See How It Works', onClick: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
        }}
      />

      {/* Real-time Dashboard Preview */}
      <DarkBg id="live-dashboard">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 mb-8"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: '#6366F1' }} />
              <span className="text-sm font-semibold" style={{ color: '#F1F5F9', letterSpacing: '-0.03em' }}>Live Dashboard Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-xs" style={{ color: '#94A3B8' }}>Real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Active Leads', value: '2,847', change: '+12.5%', icon: Users },
              { label: 'Pipeline Value', value: '$487K', change: '+8.2%', icon: BarChart3 },
              { label: 'Conversion Rate', value: '24.6%', change: '+3.1%', icon: TrendingUp },
              { label: 'Deals Closed', value: '1,203', change: '+18.7%', icon: Target },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#94A3B8', letterSpacing: '-0.03em' }}>{stat.label}</span>
                    <Icon size={16} color="#818CF8" />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#F1F5F9', letterSpacing: '-0.03em' }}>{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight size={12} color="#10B981" />
                    <span className="text-xs font-medium" style={{ color: '#10B981' }}>{stat.change}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
          {/* Mini chart bars */}
          <div className="flex items-end gap-2 h-24 px-2">
            {[35, 55, 42, 78, 61, 90, 72, 85, 48, 66, 80, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="flex-1 rounded-t-md"
                style={{
                  background: `linear-gradient(to top, #6366F1, #8B5CF6)`,
                  opacity: 0.7 + (h / 100) * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </DarkBg>

      {/* Features Section */}
      <DarkBg id="features">
        <SectionHeading label="Everything You Need to {Close More Deals}" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => {
            const Icon = featureIcons[i]
            return (
              <GlassCard key={f.title}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                  <Icon size={22} color="#818CF8" />
                </div>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.03em', color: '#F1F5F9', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', letterSpacing: '-0.03em', color: '#94A3B8', lineHeight: '1.6' }}>{f.desc}</p>
              </GlassCard>
            )
          })}
        </motion.div>
      </DarkBg>

      {/* How It Works */}
      <DarkBg id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <SectionHeading label="Get Started in {3 Simple Steps}" />
          <div className="space-y-6">
            {[
              { step: '01', title: 'Import Your Leads', desc: 'Add leads manually or import from any source. Our smart parser organizes everything automatically.' },
              { step: '02', title: 'Track Your Pipeline', desc: 'Drag deals through stages — from new lead to closed won. See exactly where every deal stands.' },
              { step: '03', title: 'Close & Grow', desc: 'Follow up automatically, analyze what works, and replicate your success across the team.' },
            ].map((item, i) => (
              <GlassCard key={item.step}>
                <div className="flex items-start gap-6">
                  <span
                    className="text-3xl font-bold flex-shrink-0 gradient-text"
                    style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(28px, 3vw, 36px)' }}
                  >
                    {item.step}
                  </span>
                  <div className="pt-1">
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.03em', color: '#F1F5F9', marginBottom: '6px' }}>{item.title}</h3>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '15px', letterSpacing: '-0.03em', color: '#94A3B8', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </DarkBg>

      {/* About Us */}
      <DarkBg id="about-us">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading label="About {LeadForage}" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
            style={{ fontFamily: 'Manrope, sans-serif', fontSize: '16px', letterSpacing: '-0.03em', color: '#94A3B8', lineHeight: '1.7' }}
          >
            Founded in 2024, LeadForage helps sales teams capture, nurture, and convert leads into loyal customers.
            Our platform combines intuitive pipeline management with AI-powered insights so you can focus on what
            matters most — closing deals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { stat: '10K+', label: 'Active Users', icon: Users },
              { stat: '50K+', label: 'Deals Closed', icon: Target },
              { stat: '98%', label: 'Satisfaction Rate', icon: Star },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <GlassCard key={s.label}>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                      style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                      <Icon size={28} color="#818CF8" />
                    </div>
                    <p className="text-3xl font-bold mb-1 gradient-text">{s.stat}</p>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', letterSpacing: '-0.03em', color: '#94A3B8' }}>{s.label}</p>
                  </div>
                </GlassCard>
              )
            })}
          </motion.div>
        </div>
      </DarkBg>

      {/* Trust Badges */}
      <DarkBg>
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest mb-8"
            style={{ color: '#64748B', letterSpacing: '0.15em' }}
          >
            Trusted by innovative teams worldwide
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            {['TechFlow', 'DataBridge', 'CloudNova', 'SwiftScale', 'NexGen', 'PrimeStack'].map((name) => (
              <div key={name} className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
                <Zap size={20} color="#818CF8" />
                <span className="text-lg font-semibold" style={{ color: '#94A3B8', letterSpacing: '-0.03em' }}>{name}</span>
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {[
              { icon: Shield, text: 'SOC 2 Compliant' },
              { icon: Check, text: 'GDPR Ready' },
              { icon: Activity, text: '99.9% Uptime' },
            ].map((badge) => {
              const Icon = badge.icon
              return (
                <div key={badge.text} className="glass rounded-full px-4 py-2 flex items-center gap-2">
                  <Icon size={14} color="#818CF8" />
                  <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{badge.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </DarkBg>

      {/* Pricing */}
      <DarkBg id="pricing">
        <SectionHeading label="Simple {Pricing}" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              plan: 'Starter', price: '$0', period: 'forever', features: ['Up to 10 leads', 'Basic pipeline', 'Email support'],
              cta: 'Get Started', popular: false,
            },
            {
              plan: 'Pro', price: '$29', period: '/month', features: ['Unlimited leads', 'Full pipeline Kanban', 'AI insights', 'Priority support', 'Team collaboration'],
              cta: 'Start Free Trial', popular: true,
            },
            {
              plan: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Custom integrations', 'Dedicated manager', 'API access', 'SLA guarantee'],
              cta: 'Contact Sales', popular: false,
            },
          ].map((p, i) => (
            <motion.div
              key={p.plan}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-6 flex flex-col ${p.popular ? '' : 'glass'}`}
              style={{
                background: p.popular
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))'
                  : '',
                backdropFilter: 'blur(16px)',
                border: p.popular
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '',
                transform: p.popular ? 'scale(1.05)' : 'none',
                boxShadow: p.popular ? '0 8px 32px rgba(99,102,241,0.15)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              {p.popular && (
                <span className="text-xs px-3 py-1 rounded-full self-start mb-3"
                  style={{
                    background: 'rgba(99,102,241,0.2)', color: '#A78BFA',
                    fontFamily: 'Manrope, sans-serif', border: '1px solid rgba(99,102,241,0.3)',
                  }}>
                  Most Popular
                </span>
              )}
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.03em', color: '#F1F5F9', marginBottom: '4px' }}>{p.plan}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: '#F1F5F9' }}>{p.price}</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#64748B' }}> {p.period}</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: 'rgba(99,102,241,0.15)' }}>
                      <Check size={12} color="#818CF8" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(p.plan === 'Enterprise' ? '/contact' : '/register')}
                className="w-full py-2.5 rounded-lg text-sm transition-all hover:scale-105"
                style={{
                  background: p.popular
                    ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#F1F5F9',
                }}
              >
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </DarkBg>

      {/* CTA Section */}
      <DarkBg id="get-started">
        <div className="text-center max-w-3xl mx-auto">
          <GlassCard>
            <h2
              className="mb-4"
              style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
            >
              Ready to Transform Your Sales?
            </h2>
            <p className="mb-8" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '16px', letterSpacing: '-0.03em', color: '#94A3B8' }}>
              Join thousands of teams using LeadForage to manage leads, track deals, and close more revenue.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-lg text-base transition-all hover:scale-105 btn-primary"
            >
              Start Free Trial
            </button>
          </GlassCard>
        </div>
      </DarkBg>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm"
        style={{ background: '#080812', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-2" style={{ fontWeight: 600, color: '#94A3B8' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <span className="text-white text-xs font-bold">L</span>
            </div>
            LeadForage
          </span>
          <span>&copy; {new Date().getFullYear()} LeadForage. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    api.auth.me().then(() => {
      if (!cancelled) setChecking(false)
    }).catch(() => {
      if (!cancelled) navigate('/login', { state: { from: location }, replace: true })
    })
    return () => { cancelled = true }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A1A' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#6366F1' }} />
      </div>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
          <Route path="/follow-ups" element={<ProtectedRoute><FollowUps /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
