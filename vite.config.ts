import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendBriefEmails } from './api/contact.ts'

function contactApiDevPlugin(): Plugin {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const raw = Buffer.concat(chunks).toString('utf8')
          const payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
          const result = await sendBriefEmails(payload, env)
          res.statusCode = result.statusCode
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch (error) {
          console.error('Local /api/contact error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              success: false,
              message: 'Unable to send email right now. Please email businessgroupikasle@gmail.com directly.',
            })
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactApiDevPlugin()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2022',
  },
})
