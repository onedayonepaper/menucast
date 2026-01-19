# MenuCast RUNBOOK

## Prereqs
- Node.js >= 20
- pnpm >= 10

## Setup

```bash
pnpm i
pnpm db:push
pnpm seed
pnpm dev
```

Services:
- API: http://localhost:4100
- Admin: http://localhost:3100
- Counter: http://localhost:3101
- Player: http://localhost:3102

Default accounts:
- OWNER: `owner@menucast.local` / `owner1234!`
- STAFF: `staff@menucast.local` / `staff1234!`

## Scenario Tests

### 1) Upload -> Playlist -> Deploy -> Player reflects
1. Open Admin: `http://localhost:3100/login` and login.
2. Go to Assets: `http://localhost:3100/assets` and upload an image/video.
3. Create a playlist: `http://localhost:3100/playlists`.
4. Add playlist items via API (MVP UI is minimal):

```bash
# replace ACCESS with your Bearer token from localStorage (menucast.admin.session)
# replace PLAYLIST_ID and ASSET_ID
curl -s http://localhost:4100/api/playlists/PLAYLIST_ID/items \
  -H "authorization: Bearer ACCESS" \
  -H "content-type: application/json" \
  -d '{"assetId":"ASSET_ID","sortOrder":1,"durationSec":8}'
```

5. Deploy: `http://localhost:3100/deployments` (enter playlistId + layoutPreset).
6. On Player, register + play:
   - Register: `http://localhost:3102/register`
   - Play: `http://localhost:3102/play`

Expected:
- Player fetches manifest and plays content.
- Subsequent deployments trigger WS `deploy:update` and Player refreshes automatically.

### 2) Offline playback
1. Start playback at `http://localhost:3102/play`.
2. Open browser devtools -> Network -> Offline.

Expected:
- Player keeps showing last content (best-effort) and does not crash.

3. Turn network back Online.

Expected:
- Player reconnects and refreshes manifest when it receives `deploy:update`.

### 3) Counter calls -> Player display
1. Login Admin first (Counter uses admin access token from localStorage): `http://localhost:3100/login`.
2. Open Counter: `http://localhost:3101/`.
3. Click `Next (+1)`.

Expected:
- API issues number atomically (SQLite).
- WS `call:event` is emitted.
- Player shows the latest calls list within ~1s.

## Notes
- SQLite DB file: `data/menucast.db`
- Upload storage: `data/uploads/<storeId>/<assetId>.<ext>`
