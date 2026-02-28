/// <reference path="../pb_data/types.d.ts" />

// BGG Proxy Routes
// Proxies requests to the BGG XML API2 server-side, keeping the auth token secret.
//
// Routes:
//   GET /api/custom/bgg/search?q=QUERY  → returns JSON array of { id, name, year }
//   GET /api/custom/bgg/thing?id=NNN    → returns JSON object with game details
//
// Setup: set BGG_TOKEN environment variable in your Coolify PocketBase service.

const BGG_BASE = "https://boardgamegeek.com/xmlapi2"

function bggHeaders() {
  const token = $os.getenv("BGG_TOKEN")
  return { "Authorization": "Bearer " + token }
}

// Reliably get a query param from the request regardless of JSVM Go binding style
function getParam(e, name) {
  // Go method names keep PascalCase in JSVM — Query() not query()
  try { const v = e.request.url.Query().Get(name); if (v) return v } catch(_) {}
  try { const v = e.request.URL.Query().Get(name);  if (v) return v } catch(_) {}
  // Lowercase fallbacks
  try { const v = e.request.url.query().Get(name); if (v) return v } catch(_) {}
  try { const v = e.request.url.query().get(name);  if (v) return v } catch(_) {}
  // URLSearchParams on the raw query string
  try {
    const raw = String(e.request.url.RawQuery || e.request.URL.RawQuery || e.request.url.rawQuery || "")
    if (raw) { const v = new URLSearchParams(raw).get(name); if (v) return v }
  } catch(_) {}
  // Manual parse as last resort
  try {
    const raw = String(e.request.url.RawQuery || e.request.URL.RawQuery || e.request.url.rawQuery || "")
    for (const pair of raw.split("&")) {
      const idx = pair.indexOf("=")
      if (idx > -1 && decodeURIComponent(pair.slice(0, idx)) === name) {
        return decodeURIComponent(pair.slice(idx + 1))
      }
    }
  } catch(_) {}
  return ""
}

// Parse XML string to extract text content of a tag
function xmlText(xml, tag) {
  const re = new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "i")
  const m = xml.match(re)
  return m ? m[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#10;/g, "\n").trim() : ""
}

function xmlAttr(xml, tag, attr) {
  const re = new RegExp("<" + tag + "[^>]*\\s" + attr + '="([^"]*)"', "i")
  const m = xml.match(re)
  return m ? m[1] : ""
}

// ── Search ──────────────────────────────────────────────────────────────────
routerAdd("GET", "/api/custom/bgg/search", (e) => {
  const q = getParam(e, "q")
  if (!q) {
    return e.json(400, { error: "q parameter required" })
  }

  const res = $http.send({
    url: BGG_BASE + "/search?query=" + encodeURIComponent(q) + "&type=boardgame",
    method: "GET",
    headers: bggHeaders(),
    timeout: 15,
  })

  if (res.statusCode !== 200) {
    return e.json(502, { error: "BGG returned " + res.statusCode })
  }

  // Parse XML: extract all <item> elements
  const xml = res.raw
  const itemRe = /<item[^>]*\bid="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi
  const results = []
  let match

  while ((match = itemRe.exec(xml)) !== null) {
    const id = match[1]
    const inner = match[2]
    const namePrimary = inner.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/)
    const nameAlt = inner.match(/<name[^>]*value="([^"]*)"/)
    const name = namePrimary ? namePrimary[1] : (nameAlt ? nameAlt[1] : "")
    const year = inner.match(/<yearpublished[^>]*value="([^"]*)"/)
    results.push({ id, name, year: year ? year[1] : "" })
  }

  return e.json(200, { results })
})

// ── Thing (game detail) ──────────────────────────────────────────────────────
routerAdd("GET", "/api/custom/bgg/thing", (e) => {
  const id = getParam(e, "id")
  if (!id) {
    return e.json(400, { error: "id parameter required" })
  }

  const res = $http.send({
    url: BGG_BASE + "/thing?id=" + encodeURIComponent(id) + "&stats=1",
    method: "GET",
    headers: bggHeaders(),
    timeout: 15,
  })

  if (res.statusCode !== 200) {
    return e.json(502, { error: "BGG returned " + res.statusCode })
  }

  const xml = res.raw

  // Primary name
  const namePrimary = xml.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/)
  const name = namePrimary ? namePrimary[1] : ""

  // Description — strip XML entities
  const descMatch = xml.match(/<description>([\s\S]*?)<\/description>/)
  let description = descMatch ? descMatch[1] : ""
  description = description
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#10;/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim()

  const image = xmlText(xml, "image")
  const thumbnail = xmlText(xml, "thumbnail")
  const minplayers = xmlAttr(xml, "minplayers", "value")
  const maxplayers = xmlAttr(xml, "maxplayers", "value")
  const minplaytime = xmlAttr(xml, "minplaytime", "value")
  const maxplaytime = xmlAttr(xml, "maxplaytime", "value")

  return e.json(200, {
    id,
    name,
    description,
    image,
    thumbnail,
    minplayers: minplayers ? parseInt(minplayers) : null,
    maxplayers: maxplayers ? parseInt(maxplayers) : null,
    minplaytime: minplaytime ? parseInt(minplaytime) : null,
    maxplaytime: maxplaytime ? parseInt(maxplaytime) : null,
  })
})
