// BGG proxy + static file server
// Serves the built Vite frontend and proxies BGG API calls server-side (no CORS).

import express from 'express'
import axios from 'axios'
import xml2js from 'xml2js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const BGG_BASE = 'https://boardgamegeek.com/xmlapi2'
const BGG_API_KEY = process.env.BGG_TOKEN || 'd7f1a39e-724d-4bce-a25f-b7d7fd007d3e'

const bggHeaders = {
  'Authorization': `Bearer ${BGG_API_KEY}`,
  'User-Agent': 'MysteryTavernMenu/1.0',
}

const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true })

function parseXml(xml) {
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// ── BGG search ───────────────────────────────────────────────────────────────
app.get('/api/bgg/search', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q required' })

  try {
    const response = await axios.get(`${BGG_BASE}/search`, {
      params: { query: q, type: 'boardgame' },
      headers: bggHeaders,
    })

    const parsed = await parseXml(response.data)
    const items = parsed?.items?.item

    if (!items) return res.json({ results: [] })

    const results = (Array.isArray(items) ? items : [items]).map(item => ({
      id: item.id,
      name: Array.isArray(item.name)
        ? (item.name.find(n => n.type === 'primary')?.value || item.name[0]?.value || '')
        : (item.name?.value || ''),
      year: item.yearpublished?.value || '',
    }))

    res.json({ results })
  } catch (err) {
    console.error('BGG search error:', err.message)
    res.status(502).json({ error: 'BGG request failed', detail: err.message })
  }
})

// ── BGG thing (game detail) ──────────────────────────────────────────────────
app.get('/api/bgg/thing', async (req, res) => {
  const id = req.query.id
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    // BGG sometimes returns 202 (queued) — retry up to 3 times
    let response
    for (let i = 0; i < 3; i++) {
      response = await axios.get(`${BGG_BASE}/thing`, {
        params: { id, type: 'boardgame', stats: 1 },
        headers: bggHeaders,
      })
      if (response.status !== 202) break
      await new Promise(r => setTimeout(r, 2000))
    }

    const parsed = await parseXml(response.data)
    const item = parsed?.items?.item
    if (!item) return res.status(404).json({ error: 'Game not found' })

    const names = Array.isArray(item.name) ? item.name : [item.name]
    const primary = names.find(n => n.type === 'primary')
    const name = primary?.value || names[0]?.value || ''

    let description = item.description || ''
    // xml2js doesn't decode HTML entities in text — do it manually
    description = description
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#10;/g, ' ')
      .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim()

    res.json({
      id,
      name,
      description,
      image: item.image?.trim() || '',
      thumbnail: item.thumbnail?.trim() || '',
      minplayers: item.minplayers?.value ? parseInt(item.minplayers.value) : null,
      maxplayers: item.maxplayers?.value ? parseInt(item.maxplayers.value) : null,
      minplaytime: item.minplaytime?.value ? parseInt(item.minplaytime.value) : null,
      maxplaytime: item.maxplaytime?.value ? parseInt(item.maxplaytime.value) : null,
    })
  } catch (err) {
    console.error('BGG thing error:', err.message)
    res.status(502).json({ error: 'BGG request failed', detail: err.message })
  }
})

// ── Serve built frontend ─────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback — React Router handles client-side routing
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
