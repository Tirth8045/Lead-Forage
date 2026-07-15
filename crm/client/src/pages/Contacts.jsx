import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', position: '', tags: '' })
  const [editingId, setEditingId] = useState(null)
  const [validated, setValidated] = useState(false)
  const [submitError, setSubmitError] = useState('')
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

  const fetchContacts = async () => {
    try {
      const data = await api.contacts.list(filterRep ? { assignedTo: filterRep } : undefined)
      setContacts(data.contacts || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [filterRep])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!formRef.current?.checkValidity()) {
      e.stopPropagation()
      return
    }

    setSubmitError('')
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
      if (editingId) {
        await api.contacts.update(editingId, payload)
        toast('Contact updated successfully')
      } else {
        await api.contacts.create(payload)
        toast('Contact created successfully')
      }
      setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', position: '', tags: '' })
      setEditingId(null)
      setShowForm(false)
      setValidated(false)
      fetchContacts()
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  const handleEdit = (c) => {
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email || '', phone: c.phone || '', company: c.company || '', position: c.position || '', tags: (c.tags || []).join(', ') })
    setEditingId(c._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return
    try {
      await api.contacts.remove(id)
      toast('Contact deleted successfully')
      fetchContacts()
    } catch (err) {
      toast(err.message, 'error')
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
        <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.04em', color: '#FFFFFF' }}>Contacts</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', position: '', tags: '' }) }}
          className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF', fontSize: '15px' }}>
          + Add Contact
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl p-6 glass">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            {editingId ? 'Edit Contact' : 'New Contact'}
          </h3>

          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
              {submitError}
            </div>
          )}

          <form ref={formRef} noValidate onSubmit={handleSubmit} className={`needs-validation ${validated ? 'was-validated' : ''}`}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="contactFirstName" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>First Name *</label>
                <input id="contactFirstName" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>First name is required.</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="contactLastName" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Last Name *</label>
                <input id="contactLastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Last name is required.</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="contactEmail" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Email</label>
                <input id="contactEmail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Enter a valid email.</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="contactPhone" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Phone</label>
                <input id="contactPhone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-md-6">
                <label htmlFor="contactCompany" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Company</label>
                <input id="contactCompany" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-md-6">
                <label htmlFor="contactPosition" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Position</label>
                <input id="contactPosition" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-12">
                <label htmlFor="contactTags" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Tags (comma-separated)</label>
                <input id="contactTags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit"
                  className="btn fw-bold border-0 py-2.5 px-6"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setValidated(false); setSubmitError('') }}
                  className="btn border-0 py-2.5 px-5 font-semibold"
                  style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#CBD5E1', fontSize: '14px' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      <div className="rounded-xl overflow-hidden glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                {['Name', 'Email', 'Phone', 'Company', 'Position', 'Tags', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '0.05em', color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8', fontSize: '14px' }}>No contacts yet.</td></tr>
              ) : (
                contacts.map((c, i) => (
                  <motion.tr key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="hover:opacity-80 transition-opacity" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td className="px-4 py-3 font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', fontSize: '14px' }}>{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{c.email || '-'}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{c.phone || '-'}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{c.company || '-'}</td>
                    <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{c.position || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(c.tags || []).map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                            background: 'rgba(99, 102, 241, 0.25)', color: '#A5B4FC',
                            border: '1px solid rgba(99, 102, 241, 0.4)', fontFamily: 'Manrope, sans-serif',
                          }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(c)} className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#A5B4FC', fontFamily: 'Manrope, sans-serif' }}>Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FCA5A5', fontFamily: 'Manrope, sans-serif' }}>Delete</button>
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
