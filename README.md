# wedding-hall-finder

밍정커플 릴스에서 유입된 사용자가 1~2분 안에 웨딩홀 취향을 고르고, 현실 조건을 입력해 실제 서울 웨딩홀 후보를 확인하는 모바일 웹앱입니다.

## 현재 상태

이 커밋은 **Codex 로컬 개발 인수인계용 scaffold**입니다. PRD 전체 구현 완료본이 아닙니다.

- PRD: `docs/PRD.md`
- Codex 인수인계: `docs/CODEX_HANDOFF.md`
- 데이터 포인터: `data/README.md`
- upstream source of truth: `JamesDev51/crawlers-factory@feat/wedding-hall-data-pipeline`
- service scope invariant: 서울 민간/상업 웨딩베뉴 213개

## 시작

```bash
npm install
npm run data:sync
npm run dev
```

`npm run data:sync`는 주요 GitHub Actions artifact를 `.handoff/upstream/`에 받습니다. 그 다음 `docs/CODEX_HANDOFF.md` 순서대로 정식 importer와 PRD 나머지 기능을 완성하세요.

## 주의

현재 `public/data/v1` 최종 서비스 bundle은 의도적으로 커밋하지 않았습니다. 활성 작업공간에는 전체 upstream merged artifact가 모두 남아 있지 않았기 때문에, 일부 데이터만 최종본처럼 고정하는 대신 원본 Actions run과 pinned commit을 handoff했습니다.

공개 플랫폼에서 수집한 웨딩홀 이미지는 재사용 권리가 확인되기 전 서비스 화면에 직접 노출하지 않습니다.
