import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'

const typeColors = { call: '#818CF8', email: '#10B981', meeting: '#F59E0B', task: '#6366F1' }

export default function FollowUps() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'task', title: '', description: '', dueDate: '' })
  const [validated, setValidated] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const toast = useToast()
  const formRef = useRef(null)

  const fetchItems = async () => {
    try {
      const data = await api.followUps.list()
      setItems(data.followUps || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!formRef.current?.checkValidity()) {
      e.stopPropagation()
      return
    }

    setSubmitError('')
    try {
      await api.followUps.create(form)
      toast('Follow-up created successfully')
      setForm({ type: 'task', title: '', description: '', dueDate: '' })
      setShowForm(false)
      setValidated(false)
      fetchItems()
    } catch (err) {
      toast(err.message, 'error')
      setSubmitError(err.message)
    }
  }

  const handleComplete = async (id) => {
    try {
      await api.followUps.complete(id)
      toast('Follow-up marked as complete')
      fetchItems()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this follow-up?')) return
    try {
      await api.followUps.remove(id)
      toast('Follow-up deleted successfully')
      fetchItems()
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

  const pendingItems = items.filter(i => !i.completed)
  const completedItems = items.filter(i => i.completed)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, letterSpacing: '-0.03em', color: '#F1F5F9' }}>
          Follow-ups
        </h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2 rounded-lg text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
          + Add Follow-up
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl p-6 glass">
          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
              {submitError}
            </div>
          )}

          <form ref={formRef} noValidate onSubmit={handleSubmit} className={`needs-validation ${validated ? 'was-validated' : ''}`}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="fuType" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Type</label>
                <select id="fuType" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="form-select form-select-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="fuDueDate" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Due Date *</label>
                <input id="fuDueDate" type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Due date is required.</div>
              </div>
              <div className="col-12">
                <label htmlFor="fuTitle" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Title *</label>
                <input id="fuTitle" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Title is required.</div>
              </div>
              <div className="col-12">
                <label htmlFor="fuDesc" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Description</label>
                <textarea id="fuDesc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif', resize: 'vertical' }} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit"
                  className="btn fw-medium border-0 py-2 px-4"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#FFFFFF' }}>
                  Create
                </button>
                <button type="button" onClick={() => { setShowForm(false); setValidated(false); setSubmitError('') }}
                  className="btn border-0 py-2 px-4"
                  style={{ background: 'rgba(255,255,255,0.06)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#94A3B8' }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Pending */}
      <h2 className="text-lg mb-3" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, letterSpacing: '-0.03em', color: '#F1F5F9' }}>
        Pending ({pendingItems.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {pendingItems.length === 0 ? (
          <div className="col-span-full text-center py-8 rounded-xl glass" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>
            No pending follow-ups.
          </div>
        ) : (
          pendingItems.map((item, i) => {
            const isOverdue = new Date(item.dueDate) < new Date()
            return (
              <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-xl p-4" style={{
                  background: '#14142B',
                  border: isOverdue ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                    background: `${typeColors[item.type]}15`, color: typeColors[item.type],
                    border: `1px solid ${typeColors[item.type]}30`, fontFamily: 'Manrope, sans-serif',
                  }}>
                    {item.type}
                  </span>
                  {isOverdue && (
                    <span className="text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#EF4444' }}>Overdue</span>
                  )}
                </div>
                <h3 className="text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif', color: '#F1F5F9' }}>{item.title}</h3>
                {item.description && (
                  <p className="text-xs mt-1" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>{item.description}</p>
                )}
                <p className="text-xs mt-2" style={{ fontFamily: 'Manrope, sans-serif', color: '#64748B' }}>
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleComplete(item._id)}
                    className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10B981', fontFamily: 'Manrope, sans-serif' }}>
                    Complete
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#EF4444', fontFamily: 'Manrope, sans-serif' }}>
                    Delete
                  </button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Completed */}
      {completedItems.length > 0 && (
        <>
          <h2 className="text-lg mb-3" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, letterSpacing: '-0.03em', color: '#F1F5F9' }}>
            Completed ({completedItems.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedItems.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-xl p-4 opacity-60" style={{
                  background: '#14142B',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                    background: `${typeColors[item.type]}15`, color: typeColors[item.type],
                    border: `1px solid ${typeColors[item.type]}30`, fontFamily: 'Manrope, sans-serif',
                  }}>
                    {item.type}
                  </span>
                  <span className="text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#10B981' }}>Done</span>
                </div>
                <h3 className="text-sm font-medium line-through" style={{ fontFamily: 'Manrope, sans-serif', color: '#64748B' }}>{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
