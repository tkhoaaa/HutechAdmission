# Phase 7: PWA Infrastructure — Plan

**Requirements Addressed:** PWA-01, PWA-02, PWA-03
**Phase:** 7 of 9 | **Wave:** 1 of 1

## Wave 1

### Plan 1 — Install vite-plugin-pwa + Configure Service Worker

**Requirements Addressed:** PWA-01

**read_first:**
- `vite.config.js` — current build config
- `public/manifest.json` — existing PWA manifest

**action:**
Install dependencies:
```
npm install vite-plugin-pwa workbox-window --save
```

Add to `vite.config.js`:
```js
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'icons/*.ico'],
      manifest: {
        name: 'HUTECHS - Tuyển sinh',
        short_name: 'HUTECHS',
        description: 'Hệ thống tuyển sinh Đại học HUTECH',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
})
```

Register workbox-window in `src/main.jsx`:
```jsx
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
```

**acceptance_criteria:**
- `vite-plugin-pwa` appears in package.json dependencies
- `VitePWA({...})` is called in the plugins array of vite.config.js
- `manifest.json` has `name`, `short_name`, `theme_color`, `display: standalone`, `icons` with 192x192 and 512x512
- `registerSW` is called in main.jsx
- `npm run build` completes without errors
- `dist/sw.js` exists in build output
- `dist/workbox-*.js` exists in build output

---

### Plan 2 — Offline Page + Install Prompt

**Requirements Addressed:** PWA-02, PWA-03

**read_first:**
- `src/App.jsx` — current app structure
- `src/components/ThanhHeader.jsx` — where to add install prompt

**action:**
Create `src/components/OfflineBoundary.jsx`:
```jsx
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
```

Update `App.jsx` to wrap content:
```jsx
import OfflineBoundary from './components/OfflineBoundary'

function App() {
  return (
    <HelmetProvider>
      <OfflineBoundary>
        <DarkModeProvider>
          {/* rest of app */}
        </DarkModeProvider>
      </OfflineBoundary>
    </HelmetProvider>
  )
}
```

Create `src/components/InstallPrompt.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { Button } from './components/ui/Button'

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
        <Button size="sm" onClick={handleInstall} className="flex-1">Cài đặt</Button>
        <Button size="sm" variant="ghost" onClick={() => setShowPrompt(false)}>Đóng</Button>
      </div>
    </div>
  )
}
```

Add `<InstallPrompt />` to `ThanhHeader.jsx` inside the header container.

**acceptance_criteria:**
- `OfflineBoundary.jsx` exports a component with online/offline detection via `navigator.onLine` and `window online/offline` events
- Offline state renders a styled "Không có kết nối" page with retry button
- `App.jsx` wraps content with `<OfflineBoundary>`
- `InstallPrompt.jsx` listens for `beforeinstallprompt` event
- `ThanhHeader.jsx` renders `<InstallPrompt />`
- `npm run build` completes without errors

---

### Plan 3 — Vercel Config + Icon Verification

**Requirements Addressed:** PWA-01, PWA-03

**read_first:**
- `public/icons/` directory — check existing icons
- `vercel.json` (if exists) or `vercel.config.js`

**action:**
Create `vercel.json` in project root:
```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    },
    {
      "source": "/workbox-(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

Check that icons exist in `public/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `favicon.ico`

If icons are missing, generate them from the existing favicon design or create placeholder SVGs converted to PNG.

**acceptance_criteria:**
- `vercel.json` exists with `Cache-Control: no-store` for `/sw.js` and immutable cache for workbox files
- `public/icons/icon-192.png` exists and is 192x192
- `public/icons/icon-512.png` exists and is 512x512
- `npm run build` produces valid SW with workbox files

---

## must_haves

1. Service Worker registers on page load without causing blank screen
2. Offline page appears when network disconnects — user can retry
3. Install prompt banner appears on desktop/mobile Chrome/Edge when criteria met
4. Static assets (JS, CSS, fonts) cached for fast repeat loads
5. `npm run build` passes with zero errors

## verification

- Disconnect network in DevTools → page shows offline boundary
- Connect network → retry button reloads page
- `npm run build` → dist/ contains sw.js and workbox-*.js
- `npx serve dist` → install prompt appears on Chrome
