/**
 * Mystery Tavern — PocketBase collection setup script
 * Tested against PocketBase v0.22+ / v0.36+
 * Run: node setup-pb.js
 */

import PocketBase from 'pocketbase'
import readline from 'readline'

const PB_URL = 'https://mysterydb.oakham.digital'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

const PUBLIC_READ = {
  listRule: '',
  viewRule: '',
  createRule: null,
  updateRule: null,
  deleteRule: null,
}

async function main() {
  console.log('\nMystery Tavern — PocketBase Setup (v0.36+)\n')

  const email = await ask('Admin email: ')
  const password = await ask('Admin password: ')
  rl.close()

  const pb = new PocketBase(PB_URL)

  // v0.22+ uses _superusers instead of the deprecated admins API
  console.log('\nAuthenticating…')
  await pb.collection('_superusers').authWithPassword(email, password)
  console.log('✓ Authenticated\n')

  // ── Delete existing collections (staff_picks first, it has a relation) ─────
  const existing = await pb.collections.getFullList()
  for (const name of ['staff_picks', 'events', 'games']) {
    const col = existing.find((c) => c.name === name)
    if (col) {
      await pb.collections.delete(col.id)
      console.log(`Deleted existing "${name}"`)
    }
  }

  // ── games ──────────────────────────────────────────────────────────────────
  console.log('\nCreating "games"…')
  const games = await pb.collections.create({
    name: 'games',
    type: 'base',
    ...PUBLIC_READ,
    fields: [
      { name: 'name',        type: 'text',   required: true                                                         },
      { name: 'players_min', type: 'number', required: true,  min: 1, max: 20,   onlyInt: true                     },
      { name: 'players_max', type: 'number', required: true,  min: 1, max: 20,   onlyInt: true                     },
      { name: 'playtime',    type: 'number', required: true,  min: 1,            onlyInt: true                     },
      { name: 'genre',       type: 'select', required: true,  maxSelect: 1, values: ['Strategy', 'Party', 'Co-op', 'Family', '2-Player'] },
      { name: 'shelf',       type: 'text',   required: false                                                        },
      { name: 'description', type: 'text',   required: false                                                        },
      { name: 'tags',        type: 'json',   required: false                                                        },
      { name: 'image_url',   type: 'url',    required: false                                                        },
      { name: 'bgg_id',      type: 'number', required: false, onlyInt: true                                        },
    ],
  })
  console.log(`✓ games — ${games.fields?.length ?? 0} fields, id: ${games.id}`)

  // ── events ─────────────────────────────────────────────────────────────────
  console.log('Creating "events"…')
  const events = await pb.collections.create({
    name: 'events',
    type: 'base',
    ...PUBLIC_READ,
    fields: [
      { name: 'title',       type: 'text', required: true  },
      { name: 'time',        type: 'text', required: false },
      { name: 'date',        type: 'date', required: false },
      { name: 'description', type: 'text', required: false },
    ],
  })
  console.log(`✓ events — ${events.fields?.length ?? 0} fields, id: ${events.id}`)

  // ── staff_picks ────────────────────────────────────────────────────────────
  console.log('Creating "staff_picks"…')
  const picks = await pb.collections.create({
    name: 'staff_picks',
    type: 'base',
    ...PUBLIC_READ,
    fields: [
      {
        name: 'game',
        type: 'relation',
        required: true,
        collectionId: games.id,
        cascadeDelete: true,
        maxSelect: 1,
      },
      { name: 'note',       type: 'text',   required: false },
      { name: 'sort_order', type: 'number', required: false, onlyInt: true },
    ],
  })
  console.log(`✓ staff_picks — ${picks.fields?.length ?? 0} fields, id: ${picks.id}`)

  console.log('\n✓ All done!\n')
}

main().catch((err) => {
  console.error('\n✗ Error:', err?.message || err)
  console.error(JSON.stringify(err?.response?.data, null, 2))
  process.exit(1)
})
