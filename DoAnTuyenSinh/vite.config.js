import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['icons/*.png', 'icons/*.ico'],
            manifest: {
                name: 'HUTECHS - Tuyen sinh',
                short_name: 'HUTECHS',
                description: 'He thong tuyen sinh Dai hoc HUTECH',
                theme_color: '#1e40af',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
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
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'es2018',
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                // Let Vite handle chunking naturally — manualChunks was causing
                // createContext to be called before React finished loading on Vercel
                manualChunks(id) {
                    if (!id.includes('node_modules')) return

                    // Split vendor into logical groups without forcing dependencies
                    if (/node_modules\/(@?react|react-dom|scheduler)\//.test(id)) return
                    if (/node_modules\/(react-router|@?react-router)\//.test(id)) return

                    // Heavy libraries — vite will naturally deduplicate
                    if (/node_modules\/(recharts|d3-.*|resize-observer)\//.test(id)) return

                    // Each top-level vendor gets its own chunk
                    const chunks = [
                        'react', 'react-dom', 'scheduler',
                        'react-router-dom', 'react-router',
                        'framer-motion', 'motion',
                        'axios', 'sonner',
                        'react-icons', 'lucide-react',
                        '@base-ui', '@react-spring',
                        '@radix-ui', 'cmdk', 'tw-animate-css',
                        'tailwind-merge', 'clsx', 'class-variance-authority',
                    ]
                    for (const name of chunks) {
                        if (id.includes(`/node_modules/${name}/`)) {
                            return `vendor-${name.replace(/@/g, '').replace(/\//g, '-')}`
                        }
                    }
                }
            }
        }
    },
    server: {
        port: 5173,
        host: true
    },
    preview: {
        port: 4173,
        host: true
    }
})
