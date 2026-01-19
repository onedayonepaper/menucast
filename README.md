# menucast

로컬에서 바로 실행되는 DID(디지털 사이니지) 메뉴/홍보 플레이어 + 점주(Admin) CMS + 카운터(호출) 화면 MVP입니다.

- DB: SQLite 단일 파일
- 업로드: 로컬 디스크 저장
- API: REST + WebSocket(Socket.IO)
- Player: 오프라인 캐시(서비스 워커) 기반 재생

## 구성

- `apps/admin-web`: 점주/직원용 CMS
- `apps/counter-web`: 대기번호 호출 화면
- `apps/player-web`: DID 플레이어(등록/재생)
- `services/api`: NestJS API + Prisma(SQLite)

## 로컬 실행

```bash
pnpm i
pnpm db:push
pnpm seed
pnpm dev
```

접속(현재 포트 설정 기준):
- Admin: http://localhost:3100/login
- Counter: http://localhost:3101/
- Player: http://localhost:3102/
- API: http://localhost:4100/api

기본 계정(seed):
- OWNER: `owner@menucast.local` / `owner1234!`
- STAFF: `staff@menucast.local` / `staff1234!`

## 빠른 사용 시나리오

1) Admin 로그인
- http://localhost:3100/login

2) 디바이스 등록 코드 발급
- Admin > 디바이스
- Player에서 http://localhost:3102/register 로 등록

3) 자산 업로드
- Admin > 자산

4) 플레이리스트 구성
- Admin > 플레이리스트
- 자산 선택(썸네일 그리드) → 추가 → 순서 저장

5) 배포
- Admin > 배포
- playlistId 확인 후 배포

6) 플레이어 재생
- http://localhost:3102/play

7) 호출
- http://localhost:3101/
- “다음 호출(+1)” → Player 호출 영역 실시간 반영

## 데이터/업로드 위치

- SQLite DB: `data/menucast.db`
- 업로드 파일: `data/uploads/<storeId>/<assetId>.<ext>`

## 문서

- 실행/테스트: `docs/RUNBOOK.md`
- API 요약: `docs/API.md`
