import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In production the /api/generate function is run by Vercel. In development
// there is no Vercel, so this plugin mounts the very same handler on the dev
// server — local and deployed behaviour cannot drift.
function devApi(env) {
  return {
    name: 'flashgenius-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        Object.assign(process.env, {
          GROQ_API_KEY: env.GROQ_API_KEY,
          GROQ_MODEL: env.GROQ_MODEL,
        })

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        req.body = Buffer.concat(chunks).toString('utf8')

        // Minimal shim for the express-style response the handler expects.
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (value) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(value))
          return res
        }

        try {
          const { default: handler } = await server.ssrLoadModule('/api/generate.js')
          await handler(req, res)
        } catch (err) {
          console.error('[dev-api]', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'The dev API handler crashed. See the terminal.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), devApi(env)],
  }
})
