import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider, _registerToast } from './lib/toast.jsx'
import toast from './lib/toast.jsx'
import './index.css'

// Register the global toast function
// This will be set when ToastProvider mounts via a small bridge component
function ToastBridge({ children }) {
  const [, forceUpdate] = React.useState(0)
  React.useEffect(() => {
    // Override the singleton after mount
    _registerToast((msg, type) => {
      // We'll use a ref-based approach - just dispatch a custom event
      window.dispatchEvent(new CustomEvent('skillsync-toast', { detail: { msg, type } }))
    })
  }, [])
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
