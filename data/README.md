# Data handoff

최종 서비스 데이터의 source of truth는 이 repo가 아니라 `JamesDev51/crawlers-factory`의 `feat/wedding-hall-data-pipeline` 브랜치입니다.

현재 고정 포인터:
- upstream commit: `a8168aed7eea9f76de0b542268f323a2dd2d24df`
- WeddingNote 5-shard run: `33769513684`
- current venue validation run: `33507929715`
- official/private price recheck run: `33699350458`

`npm run data:sync`가 위 artifact들을 `.handoff/upstream/`으로 가져옵니다. `.handoff/`는 gitignore입니다.

Codex는 이 원본을 바탕으로 `public/data/v1/venues.json`, `halls.json`, `prices.json`, `taste-tags.json`, `manifest.json`을 생성하는 importer를 완성해야 합니다.

## 불변 규칙
- 서비스 범위는 서울 민간/상업 웨딩베뉴 213개
- `남산한남웨딩가든`은 공공예식장이므로 추천/public scope에서 제외
- unknown을 `0` 또는 `false`로 바꾸지 않음
- 가격 package total을 rental fee로 재분류하지 않음
- public-platform media는 재사용 권리 확인 전 `public_display_allowed=false`
