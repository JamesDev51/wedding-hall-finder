#!/usr/bin/env bash
set -euo pipefail

REPO="JamesDev51/crawlers-factory"
BRANCH="feat/wedding-hall-data-pipeline"
PINNED_SHA="a8168aed7eea9f76de0b542268f323a2dd2d24df"
OUT="${1:-.handoff/upstream}"
mkdir -p "$OUT"

command -v gh >/dev/null || { echo "gh CLI가 필요합니다." >&2; exit 1; }

echo "[1/3] WeddingNote latest 5-shard artifacts"
mkdir -p "$OUT/weddingnote"
gh run download 33769513684 -R "$REPO" -D "$OUT/weddingnote" || true

echo "[2/3] Current venue validation artifacts"
mkdir -p "$OUT/current-validation"
gh run download 33507929715 -R "$REPO" -D "$OUT/current-validation" || true

echo "[3/3] Official/private price recheck artifacts"
mkdir -p "$OUT/private-price-recheck"
gh run download 33699350458 -R "$REPO" -D "$OUT/private-price-recheck" || true

cat <<EOF
업스트림 포인터
repo: $REPO
branch: $BRANCH
pinned sha: $PINNED_SHA

추가로 sibling crawlers-factory checkout에서 아래 문서를 확인하세요.
- wedding_hall_crawling/docs/service-dataset-v1-contract.md
- wedding_hall_crawling/docs/private-price-quality-v2-20260903.md
- wedding_hall_crawling/src/wedding_hall_crawling/private_canonical_finalize.py
- wedding_hall_crawling/src/wedding_hall_crawling/private_price_layer.py
EOF
