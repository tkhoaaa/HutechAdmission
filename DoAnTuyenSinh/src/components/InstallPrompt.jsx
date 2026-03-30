import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-card border border-border rounded-xl shadow-lg p-4 z-50 animate-in slide-in-from-bottom-4">
      <h3 className="font-semibold text-foreground mb-1">Cài đặt HUTECHS App</h3>
      <p className="text-sm text-muted-foreground mb-3">Truy cập nhanh hơn từ màn hình chính</p>
      <div className="flex gap-2">
        <button onClick={handleInstall} className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition">Cài đặt</button>
        <button onClick={() => setShowPrompt(false)} className="px-3 py-1.5 text-muted-foreground rounded-md text-sm hover:bg-muted transition">Đóng</button>
      </div>
    </div>
  )
}
