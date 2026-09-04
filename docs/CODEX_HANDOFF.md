# Codex handoff — 2026-09-04

## 현재 위치

이 repo는 PRD를 기준으로 실제 제품 개발을 이어가기 위한 handoff 상태입니다. 이전 대화 중 만들어졌던 `bootstrap/part-00` 임시 archive fragment는 정상 소스가 아니어서 제거했습니다. 대신 Next.js App Router scaffold와 현재 추천 로직 초안을 실제 파일 구조로 반영했습니다.

## 데이터 source of truth

- repo: `JamesDev51/crawlers-factory`
- branch: `feat/wedding-hall-data-pipeline`
- latest pinned commit: `a8168aed7eea9f76de0b542268f323a2dd2d24df`
- WeddingNote taste/media refresh run: `33769513684` — success
- current venue validation run: `33507929715`
- official/private price recheck run: `33699350458`

`npm run data:sync`로 주요 artifact를 `.handoff/upstream/`에 받을 수 있습니다.

## 서비스 범위

서울 민간/상업 웨딩베뉴 **213개**를 최종 public recommendation scope로 유지하세요. `남산한남웨딩가든`은 서울시 공공예식장이므로 raw provenance에는 남길 수 있어도 public recommendation DB에서는 제외합니다.

## upstream에서 이미 확보된 수준

이전 최종 리포트 기준으로 전체 파이프라인은 대략 다음 상태까지 진행됐습니다.
- private/commercial core: 213개로 scope correction
- hall rows: 300개 이상 계층 존재
- numeric price evidence: 대부분 venue에 확보, 미확인은 소수
- WeddingNote final crawl: 225/225 pages, 275 parsed hall rows, explicit 밝음/어두움 156 rows
- practical + visual + taste ready: 약 198 venue 수준의 리포트가 존재
- public-platform media는 권리 미확정으로 public display 금지

이 숫자를 앱에 하드코딩하지 말고 importer가 만든 manifest에서 읽으세요.

## 현재 이 repo에 구현된 것

- Next.js App Router / TypeScript strict scaffold
- 모바일 우선 landing
- 8개 취향 질문 구조
- 지역/하객 수 최소 현실 조건 UI
- 밝기·지역·수용인원 기반 보수적 추천 함수 초안
- 결과 카드 UI 초안
- upstream Actions artifact sync 스크립트
- 213개 venue invariant용 data validation 초안

## 아직 해야 하는 것

1. `crawlers-factory`의 `service-dataset-v1-contract.md`, private price layer, canonical finalizer를 기준으로 정식 importer 작성
2. `public/data/v1`의 venues/halls/prices/taste-tags/media/manifest 생성
3. PRD의 현실 조건 전체 구현: 지역, 하객, 교통/주차, 식사, 운영, 동선, 선택 예산
4. must-have 정확히 3개 선택 및 strict/relaxed fallback
5. 최종 scoring: 취향/현실조건/균형 원픽을 서로 다른 venue로 반환
6. 홀 상세, 관심홀 TOP3, 비교, 결과 저장/공유, 커플 비교
7. 질문용 생성 이미지 16장 적용. 동일 구도·동일 규모·비교 요소 하나만 변경
8. 실제 홀 이미지는 `public_display_allowed=true` 자산만 노출
9. localStorage, 공유 token, analytics event contract 구현
10. unit/component/Playwright E2E 및 Instagram in-app browser smoke test
11. Vercel production deploy

## 데이터 품질 규칙

- unknown != false/0
- same address only로 entity merge 금지
- 가격은 source/date/type을 유지
- package 총액과 rental을 섞지 않음
- unresolved strong-source same-hall price conflict는 0이어야 함
- 확인되지 않은 버진로드/층고/꽃장식/웅장함을 recommendation fact로 생성하지 않음

## 완료 게이트

- venue count = 213
- duplicate venue_id/hall_id = 0
- dangling FK = 0
- public/government service leak = 0
- negative price = 0
- unknown coercion = 0
- typecheck/build/E2E green
- Vercel production 주요 journey smoke test green
