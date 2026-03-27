import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Core vendor chunk
                    if (id.includes('node_modules/react/')) return 'vendor-react'
                    if (id.includes('node_modules/react-dom/')) return 'vendor-react'
                    if (id.includes('node_modules/react-router-dom/')) return 'vendor-router'

                    // Animation libraries
                    if (id.includes('node_modules/framer-motion/')) return 'vendor-motion'
                    if (id.includes('node_modules/motion/')) return 'vendor-motion'

                    // HTTP & data
                    if (id.includes('node_modules/axios/')) return 'vendor-http'
                    if (id.includes('node_modules/sonner/')) return 'vendor-ui'

                    // Heavy charting — put in own chunk
                    if (id.includes('node_modules/recharts/')) return 'vendor-charts'
                    if (id.includes('node_modules/d3-')) return 'vendor-charts'
                    if (id.includes('node_modules/resize-observer')) return 'vendor-charts'

                    // Icon libraries
                    if (id.includes('node_modules/react-icons/')) return 'vendor-icons'
                    if (id.includes('node_modules/lucide-react/')) return 'vendor-icons'

                    // UI utilities
                    if (id.includes('node_modules/tailwind-merge/')) return 'vendor-ui'
                    if (id.includes('node_modules/clsx/')) return 'vendor-ui'
                    if (id.includes('node_modules/cva/')) return 'vendor-ui'
                    if (id.includes('node_modules/class-variance-authority/')) return 'vendor-ui'
                    if (id.includes('node_modules/cmdk/')) return 'vendor-ui'

                    // Other node_modules
                    if (id.includes('node_modules/')) return 'vendor-misc'
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