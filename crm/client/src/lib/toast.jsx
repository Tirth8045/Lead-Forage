import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2" style={{ maxWidth: '360px' }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => removeToast(t.id)}
              className="px-4 py-3 rounded-lg shadow-lg cursor-pointer flex items-center gap-2.5"
              style={{
                background: t.type === 'success' ? '#065F46' : '#7F1D1D',
                border: t.type === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(239, 68, 68, 0.4)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                color: '#F1F5F9',
              }}
            >
              <span style={{ fontSize: '16px' }}>
                {t.type === 'success' ? '\u2713' : '\u2717'}
              </span>
              <span className="font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
