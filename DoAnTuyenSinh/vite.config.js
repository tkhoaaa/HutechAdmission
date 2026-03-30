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
