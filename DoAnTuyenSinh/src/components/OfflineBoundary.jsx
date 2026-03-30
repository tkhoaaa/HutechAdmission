import { useState, useEffect } from 'react'

export default function OfflineBoundary({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">📡</div>
          <h1 className="text-2xl font-bold mb-3 text-foreground">Không có kết nối</h1>
          <p className="text-muted-foreground mb-6">
            Vui lòng kiểm tra kết nối internet của bạn. Dữ liệu đã được lưu cache sẽ hiển thị khi có mạng trở lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return children
}
