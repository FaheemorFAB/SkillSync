/**
 * Minimal toast notification system (no external dependency)
 */
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'

const ToastContext = createContext(null)

let toastCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastCounter
    setToasts(ts => [...ts, { id, message, type }])
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), duration)
    return id
  }, [])

  const remove = useCallback((id) => setToasts(ts => ts.filter(t => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ addToast, remove }}>
      {children}
      {/* Toast container */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' }}>
        {toasts.map(t => <Toast key={t.id} toast={t} onRemove={remove} />)}
      </div>
    </ToastContext.Provider>
  )
}

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info }
const COLORS = { success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#6366F1' }

function Toast({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info
  const color = COLORS[toast.type] || '#6366F1'
  return (
    <div style={{
      background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
      fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#F1F5F9',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)', animation: 'slide-up 0.3s ease',
      borderLeft: `3px solid ${color}`,
    }}>
      <Icon size={16} style={{ color, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 0, display: 'flex' }}>
        <X size={14} />
      </button>
    </div>
  )
}

// Hook
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast requires ToastProvider')
  const { addToast } = ctx
  return {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
    toast: (msg) => addToast(msg, 'info'),
  }
}

// Singleton-style global toast (used with import toast from './toast')
let _addToast = null
export function _registerToast(fn) { _addToast = fn }

const toast = {
  success: (m) => _addToast?.(m, 'success') ?? console.log('[toast]', m),
  error: (m) => _addToast?.(m, 'error') ?? console.error('[toast]', m),
  warning: (m) => _addToast?.(m, 'warning') ?? console.warn('[toast]', m),
  info: (m) => _addToast?.(m, 'info') ?? console.log('[toast]', m),
}
toast.default = (m, opts) => _addToast?.(m, 'info') ?? console.log('[toast]', m)

export default toast
