import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'

const statusColors = {
  new: '#818CF8', contacted: '#38BDF8', qualified: '#10B981',
  unqualified: '#F97316', converted: '#10B981',
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', notes: '' })
  const [editingId, setEditingId] = useState(null)
  const [validated, setValidated] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [converting, setConverting] = useState(null)
  const [convertMsg, setConvertMsg] = useState(null)
  const [assigning, setAssigning] = useState(null)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [filterRep, setFilterRep] = useState('')
  const toast = useToast()
  const formRef = useRef(null)

  useEffect(() => {
    api.auth.me().then(res => setUser(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (user && user.role !== 'sales') {
      api.auth.getUsers().then(res => setUsers(res.data)).catch(() => {})
    }
  }, [user])

  const fetchLeads = async () => {
    try {
      const data = await api.leads.list(filterRep ? { assignedTo: filterRep } : undefined)
      setLeads(data.leads || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [filterRep])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!formRef.current?.checkValidity()) {
      e.stopPropagation()
      return
    }

    setSubmitError('')
    try {
      if (editingId) {
        await api.leads.update(editingId, form)
        toast('Lead updated successfully')
      } else {
        await api.leads.create(form)
        toast('Lead created successfully')
      }
      setForm({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', notes: '' })
      setEditingId(null)
      setShowForm(false)
      setValidated(false)
      fetchLeads()
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  const handleEdit = (lead) => {
    setForm({ name: lead.name, email: lead.email || '', phone: lead.phone || '', company: lead.company || '', source: lead.source || 'website', status: lead.status, notes: lead.notes || '' })
    setEditingId(lead._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return
    try {
      await api.leads.remove(id)
      toast('Lead deleted successfully')
      fetchLeads()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleAssign = async (leadId, assignedTo) => {
    setAssigning(leadId)
    try {
      await api.leads.assign(leadId, assignedTo)
      toast('Lead assigned successfully')
      fetchLeads()
    } catch (err) {
      toast(err.message)
    } finally {
      setAssigning(null)
    }
  }

  const handleConvert = async (id) => {
    setConverting(id)
    setConvertMsg(null)
    try {
      const res = await api.leads.convert(id)
      toast('Lead converted to deal successfully')
      setConvertMsg({ leadId: id, deal: res.data.deal })
      fetchLeads()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setConverting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#6366F1' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '-0.04em', color: '#FFFFFF',
        }}>
          Leads
        </h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', notes: '' }) }}
          className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF',
            fontSize: '15px',
          }}
        >
          + Add Lead
        </button>
      </div>

      {user && user.role !== 'sales' && (
        <div className="mb-4 d-flex align-items-center gap-2">
          <label className="text-xs font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>Filter by rep:</label>
          <select value={filterRep} onChange={(e) => setFilterRep(e.target.value)}
            className="form-select form-select-sm" style={{ width: 'auto', fontFamily: 'Manrope, sans-serif' }}>
            <option value="">All reps</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.fullName}</option>)}
          </select>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl p-6 glass"
        >
          <h3 className="text-xl font-bold mb-4" style={{
            fontFamily: 'Manrope, sans-serif',
            letterSpacing: '-0.03em', color: '#FFFFFF',
          }}>
            {editingId ? 'Edit Lead' : 'New Lead'}
          </h3>

          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
              {submitError}
            </div>
          )}

          <form ref={formRef} noValidate onSubmit={handleSubmit} className={`needs-validation ${validated ? 'was-validated' : ''}`}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="leadName" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Name *</label>
                <input id="leadName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Name is required.</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="leadEmail" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Email</label>
                <input id="leadEmail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Enter a valid email.</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="leadPhone" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Phone</label>
                <input id="leadPhone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-md-4">
                <label htmlFor="leadCompany" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Company</label>
                <input id="leadCompany" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-md-4">
                <label htmlFor="leadSource" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Source</label>
                <select id="leadSource" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="form-select form-select-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="social_media">Social Media</option>
                  <option value="walk_in">Walk In</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="leadStatus" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Status</label>
                <select id="leadStatus" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="form-select form-select-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label htmlFor="leadNotes" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Notes</label>
                <textarea id="leadNotes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif', resize: 'vertical' }} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit"
                  className="btn fw-bold border-0 py-2.5 px-6"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em',
                    borderRadius: '8px', color: '#FFFFFF', fontSize: '14px',
                  }}>
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setValidated(false); setSubmitError('') }}
                  className="btn border-0 py-2.5 px-5 font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.08)', fontFamily: 'Manrope, sans-serif',
                    letterSpacing: '-0.03em', borderRadius: '8px', color: '#CBD5E1', fontSize: '14px',
                  }}>
                Cancel
              </button>
            </div>
            </div>
          </form>
        </motion.div>
      )}

      {convertMsg && convertMsg.leadId && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl p-4" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#10B981' }}>
            Lead converted successfully!{' '}
            <a href="/pipeline" className="underline" style={{ color: '#A5B4FC' }}
              onClick={(e) => { e.preventDefault(); window.location.href = '/pipeline' }}>
              View deal in Pipeline
            </a>
          </p>
        </motion.div>
      )}

      <div className="rounded-xl overflow-hidden glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                {['Name', 'Email', 'Company', 'Source', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-sm uppercase tracking-wider" style={{
                    fontFamily: 'Manrope, sans-serif', letterSpacing: '0.05em', color: '#94A3B8',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8', fontSize: '14px' }}>
                    No leads yet. Add your first lead!
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:opacity-80 transition-opacity"
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                  >
                    <td className="px-4 py-3 font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', fontSize: '14px' }}>{lead.name}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{lead.email || '-'}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{lead.company || '-'}</td>
                    <td className="px-4 py-3 capitalize" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{lead.source?.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs capitalize" style={{
                        background: `${statusColors[lead.status]}15`,
                        color: statusColors[lead.status],
                        fontFamily: 'Manrope, sans-serif',
                        border: `1px solid ${statusColors[lead.status]}30`,
                      }}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(lead)} className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105" style={{
                          background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)',
                          color: '#A5B4FC', fontFamily: 'Manrope, sans-serif',
                        }}>Edit</button>
                        {lead.status !== 'converted' && (
                          <button onClick={() => handleConvert(lead._id)} disabled={converting === lead._id}
                            className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.35)',
                              color: '#6EE7B7', fontFamily: 'Manrope, sans-serif',
                            }}>
                            {converting === lead._id ? 'Converting...' : 'Convert'}
                          </button>
                        )}
                        {user && user.role !== 'sales' && (
                          <select
                            value={lead.assignedTo?._id || ''}
                            onChange={(e) => handleAssign(lead._id, e.target.value)}
                            disabled={assigning === lead._id}
                            style={{
                              background: 'rgba(99, 102, 241, 0.2)',
                              border: '2px solid rgba(99, 102, 241, 0.4)',
                              color: '#A5B4FC',
                              borderRadius: '6px',
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '4px 22px 4px 8px',
                              cursor: assigning === lead._id ? 'not-allowed' : 'pointer',
                              outline: 'none',
                            }}
                          >
                            <option value="" style={{ background: '#1A1A3E', color: '#E2E8F0' }}>Assign...</option>
                            {users.map(u => (
                              <option key={u._id} value={u._id} style={{ background: '#1A1A3E', color: '#E2E8F0' }}>{u.fullName}</option>
                            ))}
                          </select>
                        )}
                        {user && user.role !== 'sales' && (
                          <button onClick={() => handleDelete(lead._id)} className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105" style={{
                            background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.35)',
                            color: '#FCA5A5', fontFamily: 'Manrope, sans-serif',
                          }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
