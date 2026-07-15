import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import {
  Users, Target, TrendingUp, DollarSign,
  Trophy, CreditCard, CalendarCheck, AlertTriangle,
  Phone, Mail, Briefcase, CheckCircle2,
} from 'lucide-react'

const statusColors = {
  new: '#818CF8', contacted: '#38BDF8', qualified: '#34D399',
  unqualified: '#FB923C', converted: '#34D399',
}

const stageGradients = [
  { from: '#6366F1', to: '#818CF8' },
  { from: '#8B5CF6', to: '#A78BFA' },
  { from: '#3B82F6', to: '#60A5FA' },
  { from: '#06B6D4', to: '#22D3EE' },
  { from: '#10B981', to: '#34D399' },
  { from: '#F59E0B', to: '#FBBF24' },
]

function StatCard({ label, value, color, icon: Icon, delay, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl p-5 glass-hover"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>
            {label}
          </p>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
          background: `${color}20`,
        }}>
          <Icon size={24} color={color} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-3xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.04em', color: '#FFFFFF' }}>
        {value ?? '-'}
      </p>
    </motion.div>
  )
}

function formatCurrency(n) {
  return '$' + Number(n || 0).toLocaleString()
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [leads, setLeads] = useState([])
  const [deals, setDeals] = useState([])
  const [stages, setStages] = useState([])
  const [pendingFUs, setPendingFUs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, l, p] = await Promise.all([
          api.dashboard.stats(),
          api.leads.list({ limit: '5' }),
          api.pipeline.get(),
        ])
        if (cancelled) return
        setStats(s)
        setLeads(l.leads || l)
        setDeals(p?.data?.deals || [])
        setStages(p?.data?.stages || [])
        try {
          const fu = await api.followUps.list({ completed: 'false' })
          if (!cancelled) setPendingFUs(fu.followUps || fu)
        } catch {}
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner-border" style={{ width: '2rem', height: '2rem', color: '#6366F1' }} role="status" />
      </div>
    )
  }

  const d = stats?.data || stats || {}
  const totalDealValue = d.totalDealsValue || 0
  const wonValue = d.wonDealsValue || 0
  const wonCount = d.wonDeals || 0
  const overdueCount = d.overdueFollowUps || 0
  const pendingCount = d.pendingFollowUps || 0

  const dealsByStage = {}
  stages.forEach(s => { dealsByStage[s._id] = { name: s.name, deals: [], total: 0 } })
  deals.forEach(deal => {
    if (dealsByStage[deal.stageId]) {
      dealsByStage[deal.stageId].deals.push(deal)
      dealsByStage[deal.stageId].total += deal.value || 0
    }
  })
  const stageEntries = stages.map(s => dealsByStage[s._id] || { name: s.name, deals: [], total: 0 })
  const maxDealCount = Math.max(...stageEntries.map(s => s.deals.length), 1)

  const fuIcons = { call: Phone, email: Mail, meeting: Briefcase, task: CheckCircle2 }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.04em', color: '#FFFFFF' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>
            Welcome back! Here's your sales overview.
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-lg font-medium glass" style={{
          color: '#818CF8',
          fontFamily: 'Manrope, sans-serif',
        }}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={d.totalLeads ?? 0} color="#6366F1" icon={Users} delay={0} subtitle="All time" />
        <StatCard label="Contacts" value={d.totalContacts ?? 0} color="#818CF8" icon={Target} delay={0.05} subtitle="In network" />
        <StatCard label="Active Deals" value={d.totalDeals ?? 0} color="#8B5CF6" icon={TrendingUp} delay={0.1} subtitle="In progress" />
        <StatCard label="Pipeline Value" value={formatCurrency(totalDealValue)} color="#A78BFA" icon={DollarSign} delay={0.15} subtitle="Total worth" />
        <StatCard label="Won Deals" value={wonCount} color="#06B6D4" icon={Trophy} delay={0.2} subtitle="Closed won" />
        <StatCard label="Revenue" value={formatCurrency(wonValue)} color="#10B981" icon={CreditCard} delay={0.25} subtitle="Earned" />
        <StatCard label="Pending Follow-ups" value={pendingCount} color="#F59E0B" icon={CalendarCheck} delay={0.3} subtitle="Action needed" />
        <StatCard label="Overdue" value={overdueCount} color="#EF4444" icon={AlertTriangle} delay={0.35} subtitle="Past due" />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pipeline Overview */}
        <div className="rounded-xl p-5 glass">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            Pipeline Overview
          </h2>
          <div className="space-y-3">
            {stageEntries.map((stage, idx) => (
              <div key={stage.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span style={{ fontFamily: 'Manrope, sans-serif', color: '#E2E8F0', fontWeight: 500 }}>{stage.name}</span>
                  <span className="font-semibold text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
                    {stage.deals.length} deals · {formatCurrency(stage.total)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${(stage.deals.length / maxDealCount) * 100}%`,
                    background: `linear-gradient(90deg, ${stageGradients[idx % stageGradients.length].from}, ${stageGradients[idx % stageGradients.length].to})`,
                  }} />
                </div>
              </div>
            ))}
            {stageEntries.length === 0 && (
              <p className="text-sm text-center py-6" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
                No pipeline stages configured.
              </p>
            )}
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="rounded-xl p-5 glass">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              Pending Follow-ups
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{
              background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24',
              fontFamily: 'Manrope, sans-serif',
            }}>{pendingFUs.length} pending</span>
          </div>
          {pendingFUs.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
              All caught up! No pending follow-ups.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {pendingFUs.slice(0, 5).map((fu, i) => {
                const Icon = fuIcons[fu.type] || CheckCircle2
                const isOverdue = new Date(fu.dueDate) < new Date()
                return (
                  <motion.div
                    key={fu._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: isOverdue ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                      borderLeft: isOverdue ? '3px solid #F87171' : '3px solid #6366F1',
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      background: isOverdue ? 'rgba(248,113,113,0.2)' : 'rgba(99,102,241,0.2)',
                    }}>
                      <Icon size={18} color={isOverdue ? '#F87171' : '#818CF8'} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
                        {fu.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: 'Manrope, sans-serif', color: isOverdue ? '#F87171' : '#CBD5E1' }}>
                        {isOverdue ? 'Overdue — ' : 'Due: '}{new Date(fu.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads + Deals by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Leads */}
        <div className="rounded-xl p-5 glass">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              Recent Leads
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{
              background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8',
              fontFamily: 'Manrope, sans-serif',
            }}>{leads.length} total</span>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
              No leads yet. Add your first lead!
            </p>
          ) : (
            <div className="space-y-2">
              {leads.slice(0, 5).map((lead, i) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8', fontFamily: 'Manrope, sans-serif' }}>
                      {lead.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
                        {lead.name}
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>
                        {lead.company || lead.email || 'No company'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1.5 rounded-md capitalize" style={{
                    background: `${statusColors[lead.status] || '#94A3B8'}20`,
                    color: statusColors[lead.status] || '#94A3B8',
                    fontFamily: 'Manrope, sans-serif',
                  }}>
                    {lead.status?.replace('_', ' ')}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Deals by Stage (Horizontal Bars) */}
        <div className="rounded-xl p-5 glass">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            Deals by Stage
          </h2>
          <div className="space-y-3">
            {stageEntries.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
                No deals in pipeline.
              </p>
            ) : (
              stageEntries.map((stage, i) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-semibold w-24 text-right flex-shrink-0" style={{ fontFamily: 'Manrope, sans-serif', color: '#E2E8F0' }}>
                    {stage.name}
                  </span>
                  <div className="flex-1 relative" style={{ height: '30px' }}>
                    <div className="h-full rounded-lg flex items-center px-3 transition-all duration-700" style={{
                      width: `${Math.max((stage.deals.length / maxDealCount) * 100, 5)}%`,
                      minWidth: '36px',
                      background: `linear-gradient(90deg, ${stageGradients[i % stageGradients.length].from}, ${stageGradients[i % stageGradients.length].to})`,
                    }}>
                      <span className="text-xs font-semibold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {stage.deals.length}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs w-20 text-right flex-shrink-0 font-medium" style={{ fontFamily: 'Manrope, sans-serif', color: '#E2E8F0' }}>
                    {formatCurrency(stage.total)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
