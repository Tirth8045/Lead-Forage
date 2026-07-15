import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/services/api'

export default function Login() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!formRef.current?.checkValidity()) {
      e.stopPropagation()
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await api.auth.login(form)
      if (res) navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0A0A1A' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: '#0A0A1A' }} />
        <motion.div className="absolute" style={{
          width: '800px', height: '600px', left: '-100px', top: '-100px',
          background: '#6366F1', filter: 'blur(150px)', opacity: 0.12,
        }} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 1.5 }} />
        <motion.div className="absolute" style={{
          width: '600px', height: '600px', right: '-150px', bottom: '-150px',
          background: '#8B5CF6', filter: 'blur(150px)', opacity: 0.08,
        }} initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 1.5, delay: 0.3 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full"
        style={{ maxWidth: '440px' }}
      >
        <div className="p-4">
          <div className="border-0 shadow-lg" style={{
            background: '#14142B',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}>
            <div className="p-5">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  }}>
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <span className="fw-bold" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '24px', letterSpacing: '-0.03em', color: '#F1F5F9' }}>
                    LeadForage
                  </span>
                </div>
                <h2 className="mt-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: '24px', letterSpacing: '-0.03em', color: '#F1F5F9' }}>
                  Welcome back
                </h2>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', letterSpacing: '-0.03em', color: '#64748B' }}>
                  Sign in to your account
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <form ref={formRef} noValidate onSubmit={handleSubmit} className={`needs-validation ${validated ? 'was-validated' : ''}`}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}>
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-control"
                    style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                    placeholder="you@example.com"
                  />
                  <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>
                    Please enter a valid email.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label small" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em' }}>
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-control"
                    style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px' }}
                    placeholder="Enter your password"
                  />
                  <div className="invalid-feedback" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px' }}>
                    Password is required.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 fw-medium border-0 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em',
                    borderRadius: '8px', color: '#FFFFFF',
                  }}
                >
                  {loading ? (
                    <span className="d-inline-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="mt-4 text-center small" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', color: '#64748B' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#818CF8', fontWeight: 500 }}>Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
