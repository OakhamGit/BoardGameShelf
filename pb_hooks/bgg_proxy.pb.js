/// <reference path="../pb_data/types.d.ts" />

// BGG Proxy Routes
//
// Routes:
//   GET /api/custom/bgg/search/{q...}  → JSON array of { id, name, year }
//   GET /api/custom/bgg/thing/{id}     → JSON object with game details
//
// {q...} wildcard allows spaces/slashes in encoded search terms.
// e.pathParam() is the correct PocketBase v0.22+ JSVM API.

const BGG_BASE = "https://boardgamegeek.com/xmlapi2"

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
routerAdd("GET", "/api/custom/bgg/search/{q...}", (e) => {
  const q = e.pathParam("q")
  if (!q) {
    return e.json(400, { error: "q required" })
  }

  const res = $http.send({
    url: BGG_BASE + "/search?query=" + encodeURIComponent(q) + "&type=boardgame",
    method: "GET",
    timeout: 15,
  })

  if (res.statusCode !== 200) {
    return e.json(502, { error: "BGG returned " + res.statusCode })
  }

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
routerAdd("GET", "/api/custom/bgg/thing/{id}", (e) => {
  const id = e.pathParam("id")
  if (!id) {
    return e.json(400, { error: "id required" })
  }

  const res = $http.send({
    url: BGG_BASE + "/thing?id=" + encodeURIComponent(id) + "&stats=1",
    method: "GET",
    timeout: 15,
  })

  if (res.statusCode !== 200) {
    return e.json(502, { error: "BGG returned " + res.statusCode })
  }

  const xml = res.raw

  const namePrimary = xml.match(/<name[^>]*type="primary"[^>]*value="([^"]*)"/)
  const name = namePrimary ? namePrimary[1] : ""

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
