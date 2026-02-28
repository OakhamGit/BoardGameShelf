// BGG proxy + static file server
// Serves the built Vite frontend and proxies BGG API calls server-side (no CORS).
//
// Coolify setup:
//   Build command: npm run build
//   Start command: node server.js  (or via npm start)
//   Env vars: PORT (optional, defaults to 3000)

import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const BGG_BASE = 'https://boardgamegeek.com/xmlapi2'

// ── BGG search ───────────────────────────────────────────────────────────────
app.get('/api/bgg/search', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q required' })

  try {
    const response = await fetch(`${BGG_BASE}/search?query=${encodeURIComponent(q)}&type=boardgame`)
    const xml = await response.text()

    const results = []
    const itemRe = /<item[^>]*\bid="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi
    let match
    while ((match = itemRe.exec(xml)) !== null) {
      const id = match[1]
      const inner = match[2]
      const namePrimary = inner.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/)
      const nameAlt = inner.match(/<name[^>]*value="([^"]*)"/)
      const name = namePrimary ? namePrimary[1] : (nameAlt ? nameAlt[1] : '')
      const year = inner.match(/<yearpublished[^>]*value="([^"]*)"/)
      results.push({ id, name, year: year ? year[1] : '' })
    }

    res.json({ results })
  } catch (err) {
    console.error('BGG search error:', err.message)
    res.status(502).json({ error: 'BGG request failed' })
  }
})

// ── BGG thing (game detail) ──────────────────────────────────────────────────
app.get('/api/bgg/thing', async (req, res) => {
  const id = req.query.id
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    const response = await fetch(`${BGG_BASE}/thing?id=${encodeURIComponent(id)}&stats=1`)
    const xml = await response.text()

    const xmlText = (tag) => {
      const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
      return m ? m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#10;/g, ' ').trim() : ''
    }
    const xmlAttr = (tag, attr) => {
      const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'))
      return m ? m[1] : ''
    }

    const namePrimary = xml.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/)
    const name = namePrimary ? namePrimary[1] : ''

    const descMatch = xml.match(/<description>([\s\S]*?)<\/description>/)
    let description = descMatch ? descMatch[1] : ''
    description = description
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#10;/g, ' ')
      .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim()

    const minplayers = xmlAttr('minplayers', 'value')
    const maxplayers = xmlAttr('maxplayers', 'value')
    const minplaytime = xmlAttr('minplaytime', 'value')
    const maxplaytime = xmlAttr('maxplaytime', 'value')

    res.json({
      id,
      name,
      description,
      image: xmlText('image'),
      thumbnail: xmlText('thumbnail'),
      minplayers: minplayers ? parseInt(minplayers) : null,
      maxplayers: maxplayers ? parseInt(maxplayers) : null,
      minplaytime: minplaytime ? parseInt(minplaytime) : null,
      maxplaytime: maxplaytime ? parseInt(maxplaytime) : null,
    })
  } catch (err) {
    console.error('BGG thing error:', err.message)
    res.status(502).json({ error: 'BGG request failed' })
  }
})

// ── Serve built frontend ─────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback — React Router handles client-side routing
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
