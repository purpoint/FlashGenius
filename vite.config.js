import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The Groq call is proxied rather than made from the page, so GROQ_API_KEY
// stays in the dev server's process and never reaches the browser. It also
// avoids cross-origin requests to api.groq.com.
//
// Note this proxy only exists in `vite dev` — a production build has no
// server, so a deployed copy needs a real backend to hold the key.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.GROQ_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.GROQ_API_KEY}`)
              }
            })
          },
        },
      },
    },
  }
})
