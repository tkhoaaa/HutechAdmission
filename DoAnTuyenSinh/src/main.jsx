import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "../css/tailwind.css";
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // show prompt to user
  },
  onOfflineReady() {
    // show "app ready for offline" toast
  },
  onRegistered(registration) {
    console.log('SW registered:', registration)
  },
  onRegisterError(error) {
    console.warn('SW registration error:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
