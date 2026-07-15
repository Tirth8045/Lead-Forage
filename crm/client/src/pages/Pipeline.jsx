import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'

export default function Pipeline() {
  const [pipeline, setPipeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', value: '', stageId: '' })
  const [dragging, setDragging] = useState(null)
  const [validated, setValidated] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [editingDeal, setEditingDeal] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', value: '' })
  const [reassigning, setReassigning] = useState(null)
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

  const fetchPipeline = async () => {
    try {
      const data = await api.pipeline.get(filterRep ? { assignedTo: filterRep } : undefined)
      setPipeline(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPipeline() }, [filterRep])

  const handleAddDeal = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!formRef.current?.checkValidity()) {
      e.stopPropagation()
      return
    }

    setSubmitError('')
    try {
      await api.pipeline.addDeal({ ...form, value: Number(form.value) || 0 })
      toast('Deal added successfully')
      setForm({ title: '', value: '', stageId: '' })
      setShowForm(false)
      setValidated(false)
      fetchPipeline()
    } catch (err) {
      toast(err.message, 'error')
      setSubmitError(err.message)
    }
  }

  const handleDeleteDeal = async (dealId) => {
    if (!confirm('Delete this deal?')) return
    try {
      await api.pipeline.deleteDeal(dealId)
      toast('Deal deleted successfully')
      fetchPipeline()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleEditDeal = async (e) => {
    e.preventDefault()
    try {
      await api.pipeline.updateDeal(editingDeal._id, { title: editForm.title, value: Number(editForm.value) || 0 })
      toast('Deal updated successfully')
      setEditingDeal(null)
      fetchPipeline()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleOpenEdit = (deal) => {
    setEditForm({ title: deal.title, value: deal.value || '' })
    setEditingDeal(deal)
  }

  const handleAssignDeal = async (dealId, assignedTo) => {
    setReassigning(dealId)
    try {
      await api.pipeline.assignDeal(dealId, assignedTo)
      toast('Deal reassigned successfully')
      fetchPipeline()
    } catch (err) {
      toast(err.message)
    } finally {
      setReassigning(null)
    }
  }

  const handleDragStart = (deal, stageId) => {
    setDragging({ deal, fromStage: stageId })
  }

  const handleDrop = async (toStageId) => {
    if (!dragging || dragging.fromStage === toStageId) {
      setDragging(null)
      return
    }
    try {
      await api.pipeline.moveDeal(dragging.deal._id, { stageId: toStageId, order: dragging.deal.order })
      toast('Deal moved successfully')
      fetchPipeline()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setDragging(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#6366F1' }} />
      </div>
    )
  }

  const stages = pipeline?.data?.stages?.sort((a, b) => a.order - b.order) || []
  const deals = pipeline?.data?.deals || []

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header - stays at top */}
      <div className="flex-shrink-0 pb-4 z-10" style={{ background: '#0A0A1A', position: 'sticky', top: 0 }}>
        <div className="flex items-center justify-between mb-4 pt-1">
          <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.04em', color: '#FFFFFF' }}>
            Sales Pipeline
          </h1>
          <button onClick={() => { setShowForm(!showForm); setForm({ title: '', value: '', stageId: stages[0]?._id || '' }) }}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', border: '1px solid rgba(99,102,241,0.3)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF', fontSize: '15px' }}>
            + Add Deal
          </button>
        </div>

      {user && user.role !== 'sales' && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <label className="text-xs font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8' }}>Filter by rep:</label>
          <select value={filterRep} onChange={(e) => setFilterRep(e.target.value)}
            className="form-select form-select-sm" style={{ width: 'auto', fontFamily: 'Manrope, sans-serif' }}>
            <option value="">All reps</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.fullName}</option>)}
          </select>
        </div>
      )}

      {/* Deal Form — sticky below header when open */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl p-6 glass">
          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
              {submitError}
            </div>
          )}

          <form ref={formRef} noValidate onSubmit={handleAddDeal} className={`needs-validation ${validated ? 'was-validated' : ''}`}>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="dealTitle" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Deal Title *</label>
                <input id="dealTitle" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
                <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>Title is required.</div>
              </div>
              <div className="col-md-3">
                <label htmlFor="dealValue" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Value ($)</label>
                <input id="dealValue" type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="col-md-3">
                <label htmlFor="dealStage" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif' }}>Stage</label>
                <select id="dealStage" value={form.stageId} onChange={(e) => setForm({ ...form, stageId: e.target.value })}
                  className="form-select form-select-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {stages.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button type="submit"
                  className="btn fw-bold border-0 py-2.5 w-100"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                Add
              </button>
              <button type="button" onClick={() => { setShowForm(false); setValidated(false); setSubmitError('') }}
                className="btn border-0 py-2.5 px-4 font-semibold" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', borderRadius: '8px', color: '#CBD5E1', fontSize: '14px' }}>
                Cancel
              </button>
            </div>
            </div>
          </form>
        </motion.div>
      )}
      </div>

      {/* Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: '#1A1A3E', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
              Edit Deal
            </h3>
            <form onSubmit={handleEditDeal}>
              <div className="mb-3">
                <label className="form-label small" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>Title</label>
                <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="mb-3">
                <label className="form-label small" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>Value ($)</label>
                <input type="number" min={0} value={editForm.value} onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                  className="form-control form-control-sm" style={{ fontFamily: 'Manrope, sans-serif' }} />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" onClick={() => setEditingDeal(null)}
                  className="btn border-0 py-2 px-4 font-semibold"
                  style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Manrope, sans-serif', borderRadius: '8px', color: '#CBD5E1', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="btn fw-bold border-0 py-2 px-4"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', fontFamily: 'Manrope, sans-serif', borderRadius: '8px', color: '#FFFFFF', fontSize: '14px' }}>
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Kanban Board — wrapped grid layout */}
      <div className="flex-1 overflow-y-auto rounded-xl">
        {stages.length === 0 ? (
          <div className="flex items-center justify-center h-full rounded-xl glass" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8', minHeight: '400px' }}>
            No stages configured. Create a pipeline in settings.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {stages.map((stage) => {
              const stageDeals = deals.filter(d => d.stageId === stage._id)
              const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)

              return (
                <div
                  key={stage._id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(stage._id)}
                  className="rounded-xl glass flex flex-col"
                  style={{
                    border: dragging && dragging.fromStage !== stage._id
                      ? '2px dashed #6366F1'
                      : '',
                    transition: 'border-color 0.2s',
                    minHeight: '200px',
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                        {stage.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8',
                        fontFamily: 'Manrope, sans-serif',
                      }}>
                        {stageDeals.length}
                      </span>
                    </div>
                    {stageTotal > 0 && (
                      <p className="text-xs mt-1" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1' }}>
                        ${stageTotal.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="p-3 space-y-2 flex-1">
                    {stageDeals.map((deal) => (
                      <motion.div
                        key={deal._id}
                        draggable
                        onDragStart={() => handleDragStart(deal, stage._id)}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-lg cursor-grab active:cursor-grabbing"
                        style={{
                          background: '#1A1A3E',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF' }}>
                          {deal.title}
                        </p>
                        {deal.lead && (
                          <span className="text-xs mt-1 inline-block px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC', fontFamily: 'Manrope, sans-serif' }}>
                            from lead
                          </span>
                        )}
                        {deal.value > 0 && (
                          <p className="text-xs mt-1 font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: '#A5B4FC' }}>
                            ${deal.value.toLocaleString()}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenEdit(deal)}
                          className="text-xs font-medium"
                          style={{ fontFamily: 'Manrope, sans-serif', color: '#818CF8' }}
                        >
                          Edit
                        </button>
                        {user && user.role !== 'sales' && (
                          <select
                            value=""
                            onChange={(e) => { if (e.target.value) handleAssignDeal(deal._id, e.target.value) }}
                            disabled={reassigning === deal._id}
                            style={{
                              background: 'rgba(99, 102, 241, 0.2)',
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                              color: '#A5B4FC',
                              borderRadius: '4px',
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '1px 16px 1px 4px',
                              cursor: reassigning === deal._id ? 'not-allowed' : 'pointer',
                              outline: 'none',
                            }}
                          >
                            <option value="" style={{ background: '#1A1A3E', color: '#E2E8F0' }}>Reassign</option>
                            {users.map(u => (
                              <option key={u._id} value={u._id} style={{ background: '#1A1A3E', color: '#E2E8F0' }}>{u.fullName}</option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => handleDeleteDeal(deal._id)}
                          className="text-xs font-medium"
                          style={{ fontFamily: 'Manrope, sans-serif', color: '#F87171' }}
                        >
                          Remove
                        </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
