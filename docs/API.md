# MenuCast API

Base: `/api`

Response envelope:
- success: `{ ok: true, data: ... }`
- error: `{ ok: false, error: { code, message } }`

## Auth
- `POST /auth/login` `{ email, password }` -> `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` `{ refreshToken }` -> `{ accessToken }`

## Store
- `GET /stores/me` (Bearer) -> store settings
- `PATCH /stores/me/settings` (Bearer) -> updated settings

## Device
- `POST /devices/registration-codes` (Bearer) -> `{ code, expiresAt }`
- `POST /devices/register` `{ code, name, screenProfile }` -> `{ deviceId, deviceToken, storeId }`
- `GET /devices` (Bearer) -> list devices
- `POST /devices/heartbeat` (header `x-device-token`) -> `{ accepted }`

## Assets
- `POST /assets/upload` (Bearer, multipart field `file`) -> Asset
- `GET /assets` (Bearer) -> Asset[]
- `DELETE /assets/:id` (Bearer) -> `{ deleted:true }`

## Playlists
- `POST /playlists` (Bearer) `{ name }` -> Playlist
- `GET /playlists/:id` (Bearer) -> Playlist + items
- `POST /playlists/:id/items` (Bearer) `{ assetId, sortOrder, durationSec }` -> PlaylistItem
- `PUT /playlists/:id/items/reorder` (Bearer) `{ items:[{ playlistItemId, sortOrder }] }` -> `{ updated:true }`

## Deployments
- `POST /deployments` (Bearer) `{ targetType, targetDeviceId?, playlistId, layoutPreset }` -> Deployment
- `POST /deployments/rollback` (Bearer) `{ toVersion }` -> Deployment
- `GET /deployments/current` (Bearer) -> StoreCurrentDeployment (nullable)

## Player
- `GET /player/manifest` (header `x-device-token`) -> `{ storeId, deviceId, version, layoutPreset, callEnabled, callListSize, playlist }`
- `GET /calls/recent?limit=6` (header `x-device-token`) -> recent call events

## Calls
- `POST /calls/next` (Bearer) -> `{ number }`
- `POST /calls/call` (Bearer) `{ number }`
- `POST /calls/recall` (Bearer) `{ number }`
- `POST /calls/reset` (Bearer) `{ toNumber }`

## WebSocket (Socket.IO)
Namespace: `/ws`

Events:
- `deploy:update` `{ storeId, deviceId?, version }`
- `call:event` `{ storeId, action:'CALL'|'RECALL'|'RESET', number, ts }`
- `device:status` `{ deviceId, online, lastSeen }`
