# 웨딩홀 취향 테스트 — Product Requirements Document

- 문서 버전: `v1.0`
- 작성일: `2026-09-03`
- 상태: `Implementation Ready`
- 제품 저장소: `JamesDev51/wedding-hall-finder`
- 데이터 원천: `JamesDev51/crawlers-factory`의 `feat/wedding-hall-data-pipeline`
- 데이터 계약 기준: `wedding_hall_crawling/docs/service-dataset-v1-contract.md`
- 제품 형태: 모바일 전용에 가까운 모바일 우선 웹앱
- 배포 대상: Vercel
- 수익화/전환 목적: 없음
- 핵심 유입: 인스타그램 릴스 댓글 → 자동 DM → 링크 클릭

---

## 0. 문서 목적과 확정 결정

이 문서는 별도의 제품 기획 결정을 추가로 받지 않고도 개발자가 데이터 이관, 화면 구현, 추천 로직, 테스트, 배포까지 진행할 수 있도록 기능·데이터·알고리즘·품질 기준을 고정한다.

### 0.1 한 문장 정의

> 생성 이미지로 내 웨딩홀 취향을 고르고 현실 조건을 입력하면, 나의 웨딩홀 취향 유형과 실제 서울 웨딩홀 후보 3곳, 그리고 홀 투어 때 확인할 항목을 알려주는 1~2분짜리 무료 모바일 웹 테스트.

### 0.2 제품의 핵심 목적

```text
릴스 댓글 작성
→ 자동 DM 수신
→ 링크 진입
→ 1~2분 테스트 완료
→ 실제 후보 3곳 확인
→ 결과 저장·공유
→ 밍정커플 계정과 콘텐츠 기억
```

상담 신청, 견적 연결, 전화번호 수집, 업체 광고 노출이 목적이 아니다. 재미있는 테스트로 시작하지만 결과는 실제 결혼 준비에 사용할 수 있어야 한다.

### 0.3 확정된 제품 결정

1. 회원가입, 로그인, 전화번호, 이메일, 이름 입력을 요구하지 않는다.
2. 추천은 서버 LLM이 아니라 재현 가능한 결정론적 점수 로직으로 계산한다.
3. 취향 질문에는 특정 실제 웨딩홀 사진이 아니라 동일 조건으로 제작한 생성 이미지를 사용한다.
4. 실제 추천 결과에는 실제 웨딩홀 정보만 사용한다.
5. 실제 사진은 공개 표시 권리가 확인된 자산만 화면에 노출한다.
6. 확인되지 않은 값은 `false`, `0`, `없음`으로 바꾸지 않고 반드시 `unknown/null`로 유지한다.
7. 가격은 실시간 견적이 아니라 출처와 확인일이 있는 공개 참고 정보로만 표시한다.
8. 추천 단위는 원칙적으로 개별 `hall`이며, 홀 구조가 없는 데이터만 예외적으로 `venue` 단위 후보로 처리한다.
9. 같은 업체의 여러 홀이 추천 3자리를 독점하지 못한다.
10. 추천 이유에는 실제 근거가 있는 속성만 사용한다.
11. 후기 요약, 상담 중개, 예약, 전국 검색, 업체 광고 순위는 v1 범위에서 제외한다.
12. 화면과 링크에 웨딩홀 수를 하드코딩하지 않고 데이터 manifest의 값을 사용한다.

---

## 1. 문제 정의

예비부부는 웨딩홀을 보기 시작할 때 자신이 어두운 홀을 좋아하는지, 밝은 홀을 좋아하는지조차 명확히 모르는 경우가 많다. 취향을 알아도 지역, 하객 수, 교통, 주차, 식사, 단독홀, 예식 간격 같은 현실 조건을 따로 조사해야 한다.

기존 웨딩 플랫폼은 상담·견적 전환을 중심으로 설계된 경우가 많아 가볍게 참여하기 어렵다. 밍정커플 계정에는 댓글을 유도하고 팔로워와 대화를 시작할 수 있는 무료 참여형 콘텐츠가 필요하다.

이 제품은 다음 두 문제를 동시에 해결한다.

- 사용자가 자신의 웨딩홀 취향을 짧고 재미있게 언어화하도록 돕는다.
- 취향 결과가 실제 서울 웨딩홀 후보와 홀 투어 체크리스트로 이어지게 한다.

---

## 2. 목표와 비목표

### 2.1 제품 목표

| 목표 | 설명 |
| --- | --- |
| 댓글 이유 만들기 | 릴스 시청자가 `홀` 댓글을 남길 만한 분명한 무료 보상을 제공한다. |
| 2분 이내 완료 | 인스타그램 인앱 브라우저에서 부담 없이 끝낼 수 있어야 한다. |
| 실제 효용 제공 | 결과에 실제 후보 3곳과 개인화된 투어 체크포인트를 제공한다. |
| 계정 기억 강화 | 결과 카드에 밍정커플 브랜드가 자연스럽게 남아야 한다. |
| 공유 유도 | 결과 이미지·링크·커플 비교가 추가 유입을 만든다. |
| 신뢰 유지 | 가격·시설·취향 태그의 출처와 불확실성을 숨기지 않는다. |

### 2.2 비목표

- 웨딩홀 공식 견적서 발급
- 실시간 잔여 타임 확인
- 상담 신청, 전화 연결, CPA 전환
- 회원 전용 가격이나 로그인 뒤 자료 수집
- 업체 광고비에 따른 추천 순위 변경
- 네이버 블로그·카페 후기 자동 요약
- 사용자 후기 커뮤니티
- 전국 웨딩홀 지원
- 웨딩홀 계약 적합성에 대한 법률·재무 판단
- 실제 웨딩홀과 유사하게 만든 생성 이미지를 추천 결과에 사용

---

## 3. 현재 데이터 기준선

현재 upstream 개발자 계약이 보고하는 기준선은 다음과 같다. 앱은 숫자를 코드에 고정하지 않고 versioned manifest에서 읽는다.

| 지표 | 현재 기준 |
| --- | ---: |
| 서울 민간/상업 canonical venue | 214 |
| 홀 구조가 있는 venue | 196 |
| 서비스 hall row | 310 |
| 숫자 가격 근거가 있는 venue | 210 |
| 시각 reference가 있는 venue | 204 |
| 최소 1개 taste signal이 있는 venue | 203 |
| 밝음/어두움 명시 근거가 있는 venue/hall | 97 |
| practical + visual + taste ready venue | 198 |
| media reference | 1,964 |
| taste-tag observation | 508 |

### 3.1 현재 데이터로 바로 사용할 수 있는 항목

- canonical venue 식별자, 이름, 주소, 자치구, Kakao place 식별자
- venue와 hall의 부모·자식 관계
- 일부 hall 이름, 좌석/수용 인원, 최소 보증 인원
- 식대, 대관료, 일부 패키지 가격과 관측 출처·확인일
- 일부 예식 간격, 단독홀, 높은 층고, 야외/가든, 채플, 호텔 신호
- 일부 홀의 명시적 밝음/어두움 정보
- 추천과 태깅에 사용할 수 있는 내부 시각 reference

### 3.2 현재 데이터의 한계

다음 항목은 대부분의 venue/hall에 신뢰 가능한 값이 아직 없다. v1에서 이 값으로 hard filter하거나 사실처럼 말하면 안 된다.

- 클래식 대 모던
- 꽃장식 강도
- 웅장함
- 버진로드 실제 길이
- 정확한 층고
- 신부대기실 전용 화장실
- 연회장 같은 층 여부
- 엘리베이터 혼잡
- 주차 가능 대수와 지하철 도보 시간의 완전한 커버리지

취향 테스트에서는 위 항목을 사용자 유형 생성에 활용할 수 있지만, 실제 웨딩홀 추천 점수에는 해당 hall에 근거가 있을 때만 반영한다.

### 3.3 데이터 범위 불일치 처리

현재 upstream 계약은 214개를 보고한다. 이전 정리 과정에서 `남산한남웨딩가든`의 민간 범위 포함 여부로 213개가 언급된 이력이 있다. 앱은 수량을 하드코딩하지 않고 `scope_status=include`인 행만 소비한다. 운영 배포 전에 upstream manifest의 최종 범위를 한 번 확정해야 한다.

---

## 4. 핵심 사용자와 JTBD

### 4.1 1차 사용자

- 결혼 준비를 시작했지만 웨딩홀 취향이 명확하지 않은 예비신부·예비신랑
- 웨딩홀 투어 전 후보를 좁히고 싶은 사용자
- 밍정커플 릴스를 보고 가볍게 테스트해 보고 싶은 사용자

### 4.2 핵심 JTBD

> 웨딩홀을 알아보기 시작했을 때, 여러 플랫폼을 돌아다니기 전에 내가 어떤 홀을 좋아하고 현실적으로 어떤 후보를 먼저 볼지 빠르게 알고 싶다.

### 4.3 보조 JTBD

> 예비배우자와 취향이 얼마나 비슷한지 확인하고 공통 후보를 찾고 싶다.

---

## 5. 핵심 사용자 흐름과 정보 구조

### 5.1 기본 흐름

```text
/                       랜딩
/test                   모드 선택
/test/taste              이미지 취향 8문항
/test/conditions         현실 조건 6문항 + 선택 예산
/test/priorities         포기 못할 조건 3개
/result?r={token}        취향 유형 + 실제 추천 3곳 + 체크리스트
/venue/{venueId}         웨딩홀/홀 상세
/shortlist               관심홀 최대 3곳 비교
/compare/invite          예비배우자 초대 링크
/compare/result?a=&b=    두 사람 결과 비교
/about/data              데이터 출처·평가 기준·면책
/privacy                 개인정보 안내
```

### 5.2 목표 완료 시간

- 랜딩에서 결과 확인까지 중앙값 120초 이하
- 이미지 취향 8문항: 40초 이내
- 현실 조건과 우선순위: 50초 이내
- 계산 화면: 체감 1초 이내

### 5.3 진입 파라미터

다음 query parameter를 보존한다.

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
- `entry=reels|story|profile|share|couple`

결과 공유 URL에는 UTM을 그대로 복사하지 않는다.

---

## 6. 출시 범위 우선순위

### P0 — 최초 공개에 반드시 포함

- 모바일 랜딩과 모드 선택
- 8개 이미지 취향 질문
- 6개 현실 조건 질문
- 선택형 예산 조건
- 절대 포기 못 하는 조건 3개 선택
- 취향 유형과 취향 축 결과
- 실제 추천 3곳
- 추천 근거와 데이터 확인 필요 표시
- 개인화된 투어 체크리스트
- 웨딩홀/홀 상세
- 관심홀 최대 3곳 저장·비교
- 결과 이미지 저장과 링크 공유
- 로그인 없는 커플 비교
- 데이터 출처·확인일·가격 면책
- 분석 이벤트

### P1 — P0 안정화 후

- `다른 후보 더 보기`
- 결과에서 조건 수정 후 즉시 재계산
- 추천 후보 전체 10개 보기
- 필터형 간단 탐색
- 공유 카드 디자인 2종 A/B 테스트

### 제외

- 회원 계정
- 사용자 리뷰
- 상담/견적 신청
- 검색 광고·스폰서 순위
- 운영자 CMS
- 전국 확대

---

## 7. 상세 기능 요구사항

## 7.1 랜딩

### 목적

인스타그램 인앱 브라우저에서 3초 안에 제품 가치를 이해시키고 테스트를 시작하게 한다.

### 필수 요소

- 헤드라인: `내 웨딩홀 취향, 1분이면 찾을 수 있어요`
- 서브카피: `사진을 고르면 취향 유형과 실제 서울 웨딩홀 후보 3곳을 알려드려요.`
- 결과 미리보기 카드 1장
- `테스트 시작하기` 고정 CTA
- `회원가입 없이 무료로 진행돼요` 안내
- 밍정커플 브랜딩
- 데이터/가격 면책으로 연결되는 작은 링크

### 동작

- CTA 클릭 시 `/test`로 이동한다.
- 추천 데이터 전체는 랜딩에서 다운로드하지 않는다.
- 질문 이미지 첫 두 장만 사전 로드한다.

## 7.2 모드 선택

선택지는 두 개다.

1. `혼자 해보기`
2. `예비배우자와 비교하기`

커플 비교를 선택해도 먼저 본인의 테스트를 동일하게 완료한다. 결과 화면에서 상대방 초대 링크를 생성한다.

## 7.3 이미지 취향 테스트

### 화면 구성

- 상단 뒤로가기
- `1 / 8` 형태의 진행률
- 질문 문구
- A/B 이미지 카드
- 카드 안 또는 아래에 의미가 분명한 텍스트 라벨
- `둘 다 괜찮아요`
- `잘 모르겠어요`

### 선택 동작

- A 또는 B를 누르면 250ms 이내에 다음 문항으로 이동한다.
- 뒤로 이동하면 이전 답을 유지하고 변경할 수 있다.
- `둘 다 괜찮아요`는 중립 선호로 기록한다.
- `잘 모르겠어요`는 해당 축을 미응답으로 기록한다.
- 이미지만으로 판단하지 못하는 사용자를 위해 라벨은 항상 화면에 노출한다.

### 답변 모델

```ts
type TasteAnswer = {
  questionId: string;
  choice: "a" | "b" | "both" | "unknown";
  axisValues: Partial<Record<TasteAxis, number>>; // -1..1
  userConfidence: number; // a/b=1, both=0.35, unknown=0
};
```

## 7.4 현실 조건

현실 조건은 한 화면에 모두 몰아넣지 않고 2~3개의 짧은 화면으로 나눈다.

### C1. 희망 지역

복수 선택 가능. `지역 미정`은 다른 선택과 함께 선택할 수 없다.

- 강남·서초
- 송파·강동
- 영등포·구로·금천·동작·관악
- 종로·중구·용산
- 마포·서대문·은평
- 성동·광진·동대문·성북
- 강서·양천
- 강북·도봉·노원·중랑
- 지역 미정

실제 district 그룹 매핑은 `region-groups.json`에서 관리하고 UI에 하드코딩하지 않는다.

### C2. 예상 하객 수

| 선택 | 내부 대표값 |
| --- | ---: |
| 150명 이하 | 130 |
| 150~200명 | 180 |
| 200~250명 | 230 |
| 250~300명 | 280 |
| 300명 이상 | 350 |
| 아직 모르겠음 | null |

대표값은 추천 계산용이며 사용자에게 정확한 예상 인원처럼 다시 보여주지 않는다.

### C3. 교통과 주차

질문: `둘 중 조금 더 중요한 건?`

- 지하철 접근성
- 주차
- 둘 다 중요
- 크게 상관없음

### C4. 식사

- 뷔페
- 코스요리
- 한상차림
- 상관없음

데이터가 여러 식사 방식을 제공하면 모두 저장하고 하나로 축약하지 않는다.

### C5. 예식 운영

- 단독홀과 프라이빗함이 중요
- 예식 간격이 넉넉한 게 중요
- 회전이 빨라도 상관없음
- 잘 모르겠음

### C6. 신부대기실·동선

- 신부대기실 전용 화장실이 중요
- 연회장이 같은 층이면 좋음
- 엘리베이터 혼잡이 적어야 함
- 크게 상관없음

이 문항은 데이터가 부족한 경우 추천 점수보다 투어 체크리스트 생성에 더 강하게 활용한다.

### 선택형 추가 조건: 가격

기본 흐름을 방해하지 않도록 `예산도 반영할래요`를 펼쳤을 때만 입력한다.

- 1인 식대 상한: 미정 / 7만원 / 9만원 / 11만원 / 제한 없음
- 대관료 상한: 미정 / 500만원 / 1,000만원 / 1,500만원 / 제한 없음
- `가격 정보가 확인된 곳만 보기` 토글

가격 조건이 없으면 가격은 추천의 필수 조건으로 사용하지 않는다.

## 7.5 절대 포기 못 하는 조건

현실 조건과 취향 답변을 바탕으로 관련 항목을 우선 노출하되 전체 목록을 열어볼 수 있다.

선택 가능한 예:

- 어두운 홀 또는 밝은 홀
- 선호 지역
- 하객 수 수용
- 역세권
- 주차
- 음식 방식
- 단독홀
- 예식 간격
- 신부대기실 전용 화장실
- 연회장 같은 층
- 가격 범위

정확히 3개를 선택해야 다음으로 이동한다. `3 / 3` 카운터를 표시한다.

### must-have 처리 원칙

- 데이터상 `false` 또는 불일치가 확인된 후보는 제외한다.
- 데이터가 `unknown`이면 1차 strict 후보에서는 제외한다.
- 후보가 3개 미만일 때만 unknown 후보를 보완 후보로 허용하고 `투어에서 확인 필요`를 명시한다.
- 확인되지 않은 값을 확인된 것처럼 추천 이유에 사용하지 않는다.

## 7.6 계산 화면

- 최소 450ms, 최대 1.2초의 짧은 전환 화면을 사용한다.
- 실제 계산이 끝났으면 불필요하게 지연하지 않는다.
- 문구 예: `취향과 현실 조건을 같이 맞춰보고 있어요.`
- 데이터 로딩 실패 시 자동 재시도 1회 후 오류 화면을 표시한다.

## 7.7 결과 화면

결과 화면의 순서는 고정한다.

1. 취향 유형
2. 내 취향 축
3. 실제 추천 3곳
4. 나에게 맞는 홀 투어 체크리스트
5. 관심홀 비교 CTA
6. 결과 저장·공유
7. 데이터 기준과 면책

### 취향 유형 영역

- 유형명
- 2문장 설명
- 가장 강한 취향 3개
- 4~8개의 양방향 축 바
- `이 유형은 재미를 위한 취향 요약이며 실제 추천은 확인 가능한 데이터만 반영해요.` 안내

### 취향 축 표시

레이더 차트 대신 모바일에서 읽기 쉬운 양방향 bar를 기본으로 사용한다.

```text
어두운 홀  ━━━━━●━━  밝은 홀
아늑한 홀  ━━━●━━━━  웅장한 홀
미니멀     ━━━━━━●━  풍성한 꽃
채플·하우스 ━━━●━━━━  호텔·컨벤션
```

`unknown`으로 답한 축은 `아직 모르겠어요`로 표시한다.

### 추천 3개 슬롯

1. `취향 원픽`
2. `현실 조건 원픽`
3. `균형 원픽`

각 슬롯은 서로 다른 `venue_id`를 사용해야 한다.

## 7.8 추천 카드

### 필수 표시

- 공개 표시가 허용된 실제 대표 사진 또는 권리 안전 placeholder
- 웨딩홀명
- 개별 홀명, 없으면 `홀명 미확인`
- 자치구
- 추천 이유 2~3개
- 사용자 must-have 충족/확인 필요 badge
- 식대, 대관료, 최소 보증 인원 중 확인된 값
- 데이터 확인일
- `자세히 보기`
- `관심홀 담기`

### 금지 표현

- `실시간 가격`
- `최저가`
- `확정 견적`
- `100% 맞는 홀`
- 근거 없는 `긴 버진로드`, `주차 편함`, `음식 맛있음`
- unknown 가격을 `0원`

### 이미지 실패

실제 이미지 로딩이 실패하면 웨딩홀명과 홀명을 포함한 브랜드 placeholder를 보여준다. 다른 실제 홀 이미지나 생성 이미지를 대체 사진으로 사용하지 않는다.

## 7.9 웨딩홀/홀 상세

상세 화면은 아래 순서를 따른다.

1. 대표 이미지와 gallery
2. 웨딩홀명·홀명·주소
3. `내 취향과 맞는 이유`
4. 객관 데이터
5. 공개 가격 참고
6. 투어에서 확인할 항목
7. 출처와 확인일
8. Kakao Map / 공식 홈페이지 / 원 출처 링크
9. 관심홀 담기

### 객관 데이터 표시 규칙

- 확인된 값: 일반 텍스트
- 제3자 공개 자료: `공개자료` badge
- 밍정커플 취향 분류: `밍정커플 분류` badge
- 추론값: 사용자에게 사실 badge로 노출하지 않으며 내부 점수에만 낮은 가중치 사용
- unknown: `미확인`

## 7.10 관심홀 TOP 3

- localStorage에 최대 3개 저장한다.
- 네 번째를 담으려 하면 기존 항목을 교체하는 bottom sheet를 표시한다.
- 로그인 없이 브라우저를 닫았다 열어도 유지한다.
- 데이터 버전이 변경되면 존재하지 않는 id를 제거하고 사용자에게 한 번 안내한다.

비교 항목:

- 대표 이미지
- 지역
- 홀 분위기/형태
- 예상 하객 수 적합 여부
- 식사 방식
- 식대
- 대관료
- 최소 보증
- 단독홀
- 예식 간격
- 주차/교통
- 신부대기실·연회장 동선
- 마지막 확인일

unknown은 비교표에서 빈칸이 아니라 `미확인`으로 표시한다.

## 7.11 커플 비교

### 흐름

```text
A가 테스트 완료
→ 비교 초대 링크 생성
→ B가 링크로 진입
→ B가 테스트 완료
→ A/B 취향과 현실 조건 비교
→ 공통 후보 최대 3곳 표시
```

### 비교 결과

- 취향 축별 일치/차이
- 공통 희망 지역
- 하객 수 차이
- 현실 조건 우선순위 차이
- 두 사람 모두에게 상위권인 공통 후보
- `누가 맞다`가 아니라 `같이 확인할 것` 중심의 문구

관계 궁합 점수는 제공하지 않는다.

## 7.12 결과 저장·공유

### 결과 이미지

- 1080×1350 비율의 공유 카드
- 취향 유형, 핵심 취향 3개, 밍정커플 브랜딩
- 실제 웨딩홀 사진은 권리 상태가 승인된 경우에만 포함
- 기본 공유 카드는 제3자 사진 없이 디자인 요소만 사용

### 공유 방식

1. Web Share API
2. 이미지 저장
3. 링크 복사
4. 지원되지 않으면 안내 bottom sheet

공유 링크는 서버 계정 없이 결과 token으로 동일 결과를 재구성한다.

---

## 8. 취향 질문 명세

질문은 JSON configuration으로 관리하며 화면 코드에 문구·점수를 하드코딩하지 않는다.

| ID | 질문 | A | B | 내부 축 |
| --- | --- | --- | --- | --- |
| Q1 | 내가 입장하고 싶은 조명은? | 어두운 홀 | 밝은 홀 | `brightness` |
| Q2 | 더 끌리는 공간감은? | 웅장한 홀 | 아늑한 홀 | `scale` |
| Q3 | 꽃장식은 어느 쪽? | 풍성한 꽃 | 미니멀한 장식 | `floral` |
| Q4 | 전체 스타일은? | 클래식 | 모던·내추럴 | `aesthetic` |
| Q5 | 입장 장면은? | 긴 버진로드 | 짧고 집중되는 입장 | `aisle` |
| Q6 | 층고 느낌은? | 높은 층고 | 포근한 층고 | `ceiling` |
| Q7 | 입장 방식은? | 계단·2층 입장 | 같은 층 입장 | `entry` |
| Q8 | 공간 형태는? | 호텔·컨벤션 | 채플·하우스 | `venueForm` |

### 8.1 이미지 제작 규칙

각 질문은 2장, 총 16장의 생성 이미지를 사용한다.

- 비율: 4:5
- 동일한 카메라 위치, 화각, 홀 크기, 좌석 수, 꽃 양, 렌더링 품질
- 비교하려는 속성 하나만 변경
- 사람, 로고, 브랜드명, 실제 웨딩홀 고유 구조를 포함하지 않음
- 텍스트를 이미지에 직접 넣지 않음
- 원본 master와 배포용 AVIF/WebP를 별도 보관
- 배포용 긴 변은 1,000px 이하, 장당 목표 200KB 이하
- alt text를 각 선택 의미 중심으로 작성

### 8.2 사용자 취향 벡터

각 축은 `-1..1`로 정규화한다. 방향은 configuration에서 정의한다.

- A/B 선택: 해당 값, confidence `1.0`
- 둘 다 괜찮음: 값 `0`, confidence `0.35`
- 잘 모르겠음: 값 `null`, confidence `0`

여러 질문이 같은 축에 영향을 줄 수 있도록 schema를 열어둔다.

---

## 9. 취향 유형 분류

유형명은 공유와 기억을 위한 콘텐츠 레이어다. 실제 추천 점수와 분리한다.

기본 유형:

1. `웅장한 다크 드라마형`
2. `햇살 가득 브라이트 로맨틱형`
3. `정갈한 모던 미니멀형`
4. `포근한 채플 아늑형`
5. `프라이빗 하우스 웨딩형`
6. `현실도 놓치지 않는 밸런스형`

각 archetype은 `archetypes.json`의 목표 벡터로 정의한다. 사용자 벡터와 cosine similarity를 계산해 가장 가까운 유형을 선택한다.

### 밸런스형 조건

- 유효 답변이 4개 미만
- 가장 강한 축의 절댓값이 0.25 미만
- 최고 archetype과 2위 점수 차이가 0.05 미만
- 사용자의 최상위 우선순위가 가격·지역·하객 편의에 집중된 경우

유형 설명은 추천 결과를 과장하지 않으며 `성격 유형`, `결혼 성공 유형` 같은 표현을 사용하지 않는다.

---

## 10. 추천 엔진 명세

## 10.1 원칙

- 같은 입력과 같은 dataset version은 항상 같은 결과를 반환한다.
- 업체 인기순, 광고 노출량, 플랫폼 추천순을 사용하지 않는다.
- missing data를 불일치로 보지 않지만, 근거가 풍부한 후보보다 유리해지지 않게 한다.
- 추천 이유는 score contribution과 evidence에서 결정론적으로 생성한다.
- 런타임 LLM 호출을 사용하지 않는다.

## 10.2 추천 후보 모델

```ts
type RecommendationCandidate = {
  candidateId: string;
  venueId: string;
  hallId: string | null;
  scopeStatus: "include";
  activeStatus: "active" | "unknown";
  practicalReady: boolean;
  visualReferenceReady: boolean;
  tasteSignalReady: boolean;
  fullRecommendationReady: boolean;
};
```

### 기본 후보 조건

- `scopeStatus === "include"`
- 폐업이 확인되지 않음
- venue/hall FK가 유효함
- 최소한 주소와 지도 링크가 있음
- 결과 카드에 사용할 수 있는 기본 객관 정보가 있음

`취향 원픽`은 taste signal을 가진 후보를 우선한다. `현실 조건 원픽`은 taste signal이 부족해도 practical data가 충분하면 후보가 될 수 있다.

## 10.3 hard filter

다음은 확인된 불일치일 때 후보를 제외한다.

- 선택한 must-have가 데이터상 명확히 false
- 최대 수용 인원이 예상 하객 수보다 작음
- 사용자가 `가격 정보가 확인된 곳만`을 켰는데 숫자 가격 근거가 없음
- 선택한 식사 방식만 허용한다고 설정했는데 다른 방식만 제공됨
- 선택 지역을 strict로 적용하는 단계에서 선택 지역 밖

unknown은 strict 단계에서 must-have를 충족한 것으로 보지 않는다.

## 10.4 기본 균형 점수

```text
취향 일치도                 40점
지역 적합도                 12점
하객 수 적합도             10점
교통·주차·식사·운영·가격    18점
포기 못할 조건 3개          15점
데이터 근거·최신성           5점
합계                       100점
```

### 슬롯별 재가중치

| 항목 | 취향 원픽 | 현실 조건 원픽 | 균형 원픽 |
| --- | ---: | ---: | ---: |
| 취향 | 60 | 20 | 40 |
| 지역 | 10 | 15 | 12 |
| 하객 수 | 10 | 15 | 10 |
| 현실 조건 | 10 | 25 | 18 |
| must-have | 5 | 20 | 15 |
| 데이터 품질 | 5 | 5 | 5 |

각 슬롯은 독립적으로 계산하되 앞 슬롯에서 선택된 `venueId`는 제외한다.

## 10.5 취향 점수

사용자 축 값 `u`, hall 축 값 `h`는 `-1..1`이다.

```text
axis_match = 1 - abs(u - h) / 2
axis_weight = base_weight × user_confidence × data_confidence
raw_match = Σ(axis_match × axis_weight) / Σ(axis_weight)
coverage = Σ(axis_weight) / Σ(base_weight × user_confidence)
final_taste_match = 0.5 + (raw_match - 0.5) × (0.6 + 0.4 × coverage)
```

- hall 축 값이 하나도 없으면 `final_taste_match=0.5`로 중립 처리한다.
- `data_confidence`가 낮은 luminance proxy는 낮은 가중치만 가진다.
- coverage는 별도 데이터 품질 점수에도 반영한다.
- 사용자가 `unknown`을 선택한 축은 분모에서 제외한다.

### v1 근거 가중치

| 근거 | 권장 confidence |
| --- | ---: |
| 공식 사실·명시 문구 | 0.95~1.0 |
| 공개 페이지의 명시적 밝음/어두움 | 0.9 |
| 밍정커플 수동 분류 + 출처 이미지 | 0.75~0.9 |
| 홀명·설명 구조 신호 | 0.55~0.7 |
| 대표 이미지 luminance proxy | 최대 0.35 |
| 근거 없음 | 0 |

`classic/modern`, `floral`, `grand`, `aisle`은 수동 분류가 추가되기 전까지 대부분 중립 unknown으로 남긴다.

## 10.6 지역 점수

- 선택 자치구와 정확히 일치: `1.0`
- 선택한 region group 안의 다른 자치구: `0.8`
- 인접 region fallback: `0.45`
- 지역 미정: 모든 후보 `1.0`

지역은 사용자가 must-have로 고른 경우 strict filter가 되고, 그렇지 않으면 soft score다.

## 10.7 하객 수 점수

- 최대 수용 인원이 대표 하객 수 이상이고 최소 보증도 무리 없음: `1.0`
- 수용 가능하지만 예상 인원이 최소 보증보다 20% 이상 작음: `0.55`
- 최대 수용 인원은 unknown: `0.5`, 확인 필요
- 최대 수용 인원이 부족함: 제외
- 하객 수 미정: `0.75`, 수용 관련 추천 이유는 생성하지 않음

## 10.8 현실 조건 점수

18점 내부 기본 배분:

- 교통/주차: 6
- 식사 방식: 4
- 단독홀/예식 간격: 4
- 신부대기실/연회장 동선: 2
- 선택형 가격 조건: 2

사용자가 상관없음 또는 미정을 선택한 항목은 다른 항목에 점수를 재분배하지 않고 중립 처리한다. 데이터가 없다는 이유로 특정 후보가 0점을 받지 않도록 field-level known coverage를 함께 계산한다.

## 10.9 가격 점수와 표시

- 가격 조건을 입력하지 않으면 가격 점수는 모든 후보 중립이다.
- 숫자 가격이 없으면 `미확인`이다.
- 상한보다 낮거나 같음: `1.0`
- 상한의 10% 이내 초과: `0.5`
- 그 이상 초과: `0`
- must-have 가격 상한이면 확인된 초과 후보를 제외한다.
- 18개월보다 오래된 가격은 stale badge와 최신성 감점을 적용한다.

단순 참고액은 upstream에서 같은 hall 또는 호환 가능한 관측이라고 표시한 경우에만 계산한다.

```text
단순 참고액 = 대관료 + 1인 식대 × max(예상 하객 수, 최소 보증 인원)
```

꽃장식·연출·음주류 등 필수비가 구조화돼 있고 compatibility가 확인된 경우에만 추가한다. UI 명칭은 반드시 `단순 참고액`이다.

## 10.10 단계적 완화

strict 후보가 3개 미만이면 다음 순서로만 완화한다.

1. must-have의 unknown 값을 허용하되 `확인 필요` 표시
2. 선택 자치구에서 같은 region group으로 확대
3. 인접 region group으로 확대
4. 수용 인원 unknown 후보 허용
5. 그래도 부족하면 1~2개만 보여주고 조건을 수정하도록 안내

확인된 must-have 불일치와 확인된 수용 인원 부족은 끝까지 완화하지 않는다.

추천 결과에는 사용된 완화 단계를 내부 metadata로 남긴다.

## 10.11 다양성·동점 규칙

- 추천 3개는 서로 다른 `venueId`
- 동일 체인의 지점이 모두 노출되는 것은 허용하지만 가능하면 2개 이하
- 동점 정렬: 총점 → 근거 coverage → 최신성 → stable candidate id 오름차순
- 광고/인기/크롤링 소스 수는 동점 기준으로 사용하지 않는다.

## 10.12 추천 이유 생성

추천 이유는 contribution이 높은 확인된 항목에서 최대 3개를 선택한다.

예:

- `선호한 어두운 홀 분위기와 가까워요`
- `희망한 강남·서초 권역이에요`
- `예상 하객 230명을 수용할 수 있어요`
- `단독홀 정보가 확인돼 있어요`

금지:

- unknown 항목을 긍정 이유로 사용
- 낮은 confidence 추론을 사실처럼 표현
- `음식이 맛있어요`처럼 후기 데이터가 필요한 표현

---

## 11. 홀 투어 체크리스트 생성

런타임 LLM 없이 template rule로 3~5개를 생성한다.

### 우선순위

1. 사용자가 must-have로 골랐지만 후보 데이터가 unknown인 항목
2. 사용자의 강한 취향 축 중 현장에서 달라질 수 있는 항목
3. 가격·최소 보증·필수 부대비용 확인
4. 하객 동선·주차·대중교통
5. 해당 hall의 stale 데이터

### 템플릿 예

- `신부대기실 안에 전용 화장실이 실제로 있는지 확인해 보세요.`
- `예식 예정 시간대에 홀 조명이 사진처럼 보이는지 확인해 보세요.`
- `버진로드 길이와 실제 입장 동선을 직접 걸어보세요.`
- `식대·대관료 외에 꽃장식과 연출 필수비가 있는지 물어보세요.`
- `예상 하객 수 기준 최소 보증 인원이 맞는지 확인해 보세요.`
- `주차 가능 대수와 무료 주차 시간을 확인해 보세요.`

체크리스트는 결과 카드에 저장할 수 있고, 상세 화면에서는 후보별 unknown과 stale 상태를 반영한다.

---

## 12. 공개 서비스 데이터 계약

## 12.1 원천과 책임 분리

### `crawlers-factory`

- 공개자료 수집
- canonical entity resolution
- source provenance 유지
- 가격 정규화
- hall 구조 병합
- taste evidence 생성
- media reference와 권리 상태 관리
- service dataset export

### `wedding-hall-finder`

- upstream artifact import
- 공개 가능한 필드와 이미지 선별
- schema validation
- 추천 index 생성
- 앱 UI와 추천 로직
- 데이터 버전 표시

frontend repository에는 원본 크롤링 HTML, 로그인 자료, 대량 raw image를 넣지 않는다.

## 12.2 manifest

```ts
type DatasetManifest = {
  schemaVersion: string;
  datasetVersion: string;
  generatedAt: string;
  sourceRepository: string;
  sourceCommitSha: string;
  scope: {
    city: "Seoul";
    venueType: "private_commercial";
  };
  counts: {
    venues: number;
    halls: number;
    recommendationCandidates: number;
    numericPriceVenues: number;
    tasteReadyVenues: number;
    approvedCoverCandidates: number;
  };
  checksums: Record<string, string>;
};
```

## 12.3 공통 evidence 값

```ts
type EvidenceStatus =
  | "verified_official"
  | "reported_public"
  | "curated"
  | "inferred"
  | "unknown";

type EvidenceValue<T> = {
  value: T | null;
  status: EvidenceStatus;
  confidence: number; // 0..1
  observedAt: string | null;
  sourceIds: string[];
};
```

`value=null`과 `status=unknown`을 기본 missing 표현으로 사용한다. boolean의 `false`는 실제로 없거나 제공하지 않는다는 근거가 있을 때만 사용한다.

## 12.4 VenuePublic

```ts
type VenuePublic = {
  venueId: string;
  name: string;
  aliases: string[];
  district: string;
  regionGroup: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  kakaoPlaceId: string | null;
  mapUrl: string | null;
  officialUrl: string | null;
  activeStatus: "active" | "unknown";
  phone: string | null;
  transit: {
    nearestStation: EvidenceValue<string>;
    walkMinutes: EvidenceValue<number>;
  };
  parking: {
    capacity: EvidenceValue<number>;
    level: EvidenceValue<"good" | "normal" | "limited">;
  };
  hallIds: string[];
  sourceIds: string[];
  readiness: RecommendationReadiness;
  updatedAt: string;
};
```

## 12.5 HallPublic

```ts
type HallPublic = {
  hallId: string;
  venueId: string;
  name: string | null;
  capacity: {
    seated: EvidenceValue<number>;
    maximum: EvidenceValue<number>;
    minimumGuarantee: EvidenceValue<number>;
  };
  operation: {
    intervalMinutes: EvidenceValue<number>;
    singleHall: EvidenceValue<boolean>;
    singleFloor: EvidenceValue<boolean>;
  };
  mealTypes: EvidenceValue<Array<"buffet" | "course" | "table" | "other">>;
  flow: {
    bridalRoomPrivateToilet: EvidenceValue<boolean>;
    banquetSameFloor: EvidenceValue<boolean>;
    entryType: EvidenceValue<"same_level" | "stairs" | "second_floor" | "other">;
  };
  taste: Partial<Record<TasteAxis, TasteEvidence>>;
  priceSummaryId: string | null;
  mediaIds: string[];
  sourceIds: string[];
  readiness: RecommendationReadiness;
  updatedAt: string;
};
```

## 12.6 TasteEvidence

```ts
type TasteAxis =
  | "brightness"
  | "scale"
  | "floral"
  | "aesthetic"
  | "aisle"
  | "ceiling"
  | "entry"
  | "venueForm"
  | "privacy";

type TasteEvidence = {
  value: number; // -1..1
  confidence: number;
  method:
    | "explicit_public_description"
    | "official_fact"
    | "mingjung_curation"
    | "name_or_structure_inference"
    | "image_luminance_proxy";
  observedAt: string | null;
  sourceIds: string[];
  displayAsFact: boolean;
};
```

`image_luminance_proxy`는 `displayAsFact=false`여야 한다.

## 12.7 PriceSummary

```ts
type MoneyRange = {
  minWon: number;
  maxWon: number | null;
};

type PriceSummary = {
  priceSummaryId: string;
  venueId: string;
  hallId: string | null;
  mealPerPerson: EvidenceValue<MoneyRange>;
  rentalFee: EvidenceValue<MoneyRange>;
  minimumGuarantee: EvidenceValue<number>;
  flowerFee: EvidenceValue<MoneyRange>;
  ancillaryFee: EvidenceValue<MoneyRange>;
  coherentSet: boolean;
  compositeCompatible: boolean;
  stale: boolean;
  sourceIds: string[];
};
```

금액은 모두 정수 KRW로 저장한다.

## 12.8 MediaPublic

```ts
type MediaRightsStatus =
  | "approved"
  | "official_embed_only"
  | "reference_only"
  | "unknown";

type MediaPublic = {
  mediaId: string;
  venueId: string;
  hallId: string | null;
  role: "cover" | "hall_interior" | "bridal_room" | "banquet" | "exterior";
  assetUrl: string | null;
  sourcePageUrl: string;
  alt: string;
  rightsStatus: MediaRightsStatus;
  publicDisplayAllowed: boolean;
  width: number | null;
  height: number | null;
  observedAt: string | null;
};
```

public bundle에는 `publicDisplayAllowed=true`인 media만 `assetUrl`을 포함한다. reference-only URL을 실수로 화면에 사용할 수 없도록 importer 단계에서 제거한다.

## 12.9 Readiness

```ts
type RecommendationReadiness = {
  practicalReady: boolean;
  visualReferenceReady: boolean;
  tasteSignalReady: boolean;
  fullRecommendationReady: boolean;
  publicCoverReady: boolean;
  fallbackReasons: string[];
};
```

---

## 13. 데이터 파일과 import 파이프라인

### 13.1 앱 배포 파일

```text
public/data/v1/manifest.json
public/data/v1/questions.json
public/data/v1/archetypes.json
public/data/v1/region-groups.json
public/data/v1/recommendation-index.json
public/data/v1/venues/{venueId}.json
public/assets/questions/*.avif
public/assets/questions/*.webp
```

`recommendation-index.json`에는 추천 계산에 필요한 최소 필드만 넣고 gallery와 상세 provenance는 venue detail 파일로 분리한다.

### 13.2 import 명령

```text
pnpm data:import --input <service-dataset-directory>
pnpm data:validate
pnpm data:report
```

### 13.3 import 단계

```text
upstream artifact 읽기
→ schema version 확인
→ scope_status 필터
→ FK와 중복 검증
→ tri-state 값 검증
→ price compatibility 검증
→ media rights 필터
→ recommendation candidate 생성
→ venue detail 분할
→ checksum/manifest 생성
→ readiness report 생성
```

### 13.4 CI 차단 조건

- 중복 venueId/hallId
- orphan hall/price/media/taste row
- `unknown`이 0/false로 변환됨
- 음수 가격 또는 비현실적 통화 단위
- `publicDisplayAllowed=false` assetUrl이 public bundle에 존재
- scope 밖 공공 웨딩 공간이 포함
- source URL 없는 공개 가격
- observedAt 없는 가격을 최신값처럼 선택
- 추천 후보 수가 직전 dataset보다 5% 이상 감소하고 명시적 승인 없음
- checksum 불일치

### 13.5 최소 데이터 품질 gate

현재 데이터 기준으로 production import는 최소 다음을 만족해야 한다.

- canonical private venue 200개 이상
- service hall row 280개 이상
- 숫자 가격 근거 venue 195개 이상
- full recommendation ready venue 190개 이상
- 주요 테스트 시나리오마다 서로 다른 venue 추천 3개 확보
- 실제 사진을 쓰는 후보는 public display 권리 승인 완료

수량 gate는 데이터가 갱신되면 PR로 명시적으로 변경한다.

---

## 14. 이미지와 권리 정책

현재 수집된 media reference는 추천 태깅과 내부 검증에는 사용할 수 있지만 공개 재배포 권리가 자동으로 확보된 것은 아니다.

### 14.1 취향 질문 이미지

- 프로젝트가 생성한 이미지 사용
- 실제 업체명·로고·고유 인테리어 모방 금지
- 소스와 생성 원본을 내부 보관

### 14.2 실제 웨딩홀 이미지

화면 노출 조건:

- 공식 제공/사용 허가
- 명확한 라이선스
- 밍정커플이 직접 촬영하고 사용할 권리가 있는 사진
- 별도 검토를 거쳐 `publicDisplayAllowed=true`

단순히 공개 웹페이지에서 접근 가능하다는 이유만으로 다운로드·재배포하지 않는다.

### 14.3 권리가 확인되지 않은 경우

- 이미지 URL을 public bundle에서 제거
- 브랜드 placeholder 사용
- `공식 페이지에서 사진 보기` 외부 링크 제공 가능
- 공유 카드에는 제3자 사진을 넣지 않음

실제 사진이 제품 핵심이므로 공개 전 상위 추천 후보의 cover 승인률을 운영 지표로 관리한다.

---

## 15. 기술 아키텍처

### 15.1 기술 결정

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- 정적 JSON 기반 client-side recommendation
- Zod 기반 runtime data validation
- localStorage 기반 결과·관심홀 저장
- Vercel 배포
- 별도 데이터베이스와 로그인 서버 없음
- 테스트: unit/component + Playwright E2E

패키지 버전은 초기 구현 시 lockfile로 고정한다.

### 15.2 렌더링 전략

- 랜딩·정책 페이지: static rendering
- 테스트·결과·비교: client component 중심
- venue detail: 정적 데이터 fetch, 필요 시 build-time route generation
- 전체 catalog는 랜딩에서 로드하지 않음
- recommendation index는 테스트 시작 뒤 idle 또는 조건 단계에서 prefetch

### 15.3 권장 폴더 구조

```text
src/
  app/
    page.tsx
    test/
    result/
    venue/[venueId]/
    shortlist/
    compare/
    about/data/
    privacy/
  components/
  features/
    quiz/
    conditions/
    recommendation/
    shortlist/
    sharing/
    couple-compare/
  lib/
    data/
    scoring/
    tokens/
    analytics/
    storage/
  types/
  styles/
scripts/
  import-dataset.ts
  validate-data.ts
  generate-data-report.ts
contracts/
  service-dataset.schema.json
  public-catalog.schema.json
fixtures/
  recommendation/
public/
  data/v1/
  assets/questions/
docs/
  PRD.md
```

### 15.4 상태 관리

전역 상태 라이브러리를 필수로 사용하지 않는다. quiz session은 typed reducer로 관리하고 결과·관심홀만 localStorage adapter를 사용한다.

```ts
type QuizState = {
  mode: "solo" | "couple";
  tasteAnswers: TasteAnswer[];
  conditions: ConditionAnswers;
  priorities: PriorityId[];
  datasetVersion: string;
  currentStep: string;
};
```

상태 전이는 순수 함수로 테스트 가능해야 한다.

---

## 16. 결과 token과 저장

### 16.1 token 내용

- schema version
- dataset version
- mode
- 8개 취향 답변
- 현실 조건
- 우선순위 3개
- 추천 결과 자체는 저장하지 않음

공유 링크를 열면 현재 데이터 또는 token의 호환 가능한 데이터로 추천을 재계산한다.

### 16.2 encoding

- JSON을 짧은 key로 직렬화
- versioned codec
- base64url 또는 URL-safe compression
- checksum 포함
- 임의 코드 실행이나 HTML을 포함하지 않음

### 16.3 dataset version 차이

공유 당시와 현재 dataset version이 다르면:

> `웨딩홀 정보가 업데이트되어 현재 데이터 기준으로 다시 계산했어요.`

를 한 번 표시한다.

### 16.4 localStorage key

```text
whf:quiz:last:v1
whf:shortlist:v1
whf:compare:pending:v1
whf:notice:data-version:v1
```

저장 데이터는 schema validation 실패 시 안전하게 초기화한다.

---

## 17. 분석 이벤트

제품은 analytics provider와 분리된 adapter를 사용한다. analytics가 차단되거나 비활성화되어도 제품 기능은 모두 동작해야 한다.

필수 이벤트:

- `landing_view`
- `test_start`
- `mode_selected`
- `taste_answered`
- `taste_completed`
- `conditions_completed`
- `priorities_completed`
- `result_generated`
- `result_view`
- `recommendation_impression`
- `venue_detail_open`
- `external_map_click`
- `official_source_click`
- `shortlist_add`
- `shortlist_remove`
- `shortlist_completed`
- `share_open`
- `share_complete`
- `couple_invite_created`
- `couple_compare_completed`
- `recommendation_relaxed`
- `data_load_error`

허용 property:

- datasetVersion
- entry source
- questionId/choice
- result archetype
- recommendation slot
- public venueId/hallId
- relaxation stage
- viewport group

금지 property:

- 전체 result token
- 브라우저에 저장된 원문 상태
- 이름·이메일·전화번호
- 자유 입력 텍스트

### 17.1 초기 목표 지표

출시 후 2주간 다음은 목표 가설로 사용한다.

- 랜딩 → 테스트 시작률 55% 이상
- 테스트 시작 → 결과 완료율 65% 이상
- 결과 → 웨딩홀 상세 진입률 30% 이상
- 결과 → 저장 또는 공유율 15% 이상
- 평균 완료 시간 120초 이하

초기 트래픽이 작으면 절대 수치보다 단계별 이탈을 우선 본다.

---

## 18. 디자인·카피·접근성

### 18.1 시각 방향

- 웨딩 플랫폼 광고보다 `밍정커플이 만든 재미있는 테스트`에 가까운 인상
- 따뜻한 아이보리, 딥 브라운, muted rose 계열의 기본 theme
- 넓은 이미지와 큰 선택 카드
- 카드 그림자와 장식을 과도하게 사용하지 않음
- 최대 콘텐츠 폭 480px
- 데스크톱에서는 가운데 모바일 canvas로 표시하되 기능은 동일

### 18.2 카피 원칙

- 짧고 자연스러운 한국어
- `추천`, `후보`, `참고` 사용
- `정답`, `확정`, `무조건`, `실시간`, `최저가` 지양
- AI 말투나 장황한 설명을 피함
- 화면마다 핵심 행동은 하나

### 18.3 접근성

- 터치 target 최소 44×44px
- 텍스트 대비 WCAG AA 수준
- 모든 이미지에 의미 있는 alt
- 이미지 선택 카드에 텍스트 label 제공
- keyboard 조작 가능
- focus indicator 유지
- screen reader에 진행률과 선택 상태 전달
- `prefers-reduced-motion` 지원
- 색만으로 일치/불일치를 전달하지 않음
- 360px에서 가로 스크롤 없음

---

## 19. 성능·SEO·브라우저

### 19.1 성능 목표

- 모바일 4G 기준 LCP 2.5초 이하
- CLS 0.1 이하
- INP 200ms 이하 목표
- 랜딩 initial JS를 최소화
- 질문 이미지 현재 pair와 다음 pair만 prefetch
- recommendation index는 압축 전 1MB 이하 목표
- venue detail gallery는 lazy load

### 19.2 브라우저 기준

필수 수동 검증:

- Instagram 인앱 브라우저 Android
- Instagram 인앱 브라우저 iOS
- Samsung Internet
- Chrome Android
- Safari iOS

Web Share API가 없는 환경에서는 링크 복사와 이미지 저장을 제공한다.

### 19.3 SEO

- 랜딩과 데이터 안내 페이지는 index 허용
- result, compare, shortlist는 `noindex`
- 기본 Open Graph image 제공
- 공유 결과는 URL 없이도 의미가 전달되는 이미지 카드 중심
- venue detail은 초기에는 `noindex`로 시작하며 데이터·권리 운영이 안정된 뒤 별도 결정

---

## 20. 개인정보·보안

- PII를 입력받지 않는다.
- 결과는 기본적으로 사용자의 브라우저에만 저장한다.
- 공유 token에는 개인 식별 정보를 넣지 않는다.
- 외부 URL은 `https` allowlist와 schema validation을 거친다.
- dataset의 HTML을 직접 렌더링하지 않는다.
- 외부 링크는 `noopener noreferrer` 사용
- CSP, Referrer-Policy, X-Content-Type-Options 설정
- analytics에는 full token이나 자유 입력을 보내지 않는다.
- 삭제·정정 문의를 위한 연락 경로를 데이터 안내 페이지에 둔다.

---

## 21. 오류와 fallback

| 상황 | 동작 |
| --- | --- |
| 질문 이미지 실패 | 텍스트 선택 카드를 유지하고 재시도 |
| recommendation index 실패 | 1회 재시도 후 취향 결과만 표시, 추천을 만들지 않음 |
| 추천 후보 3개 미만 | 단계적 완화 후 실제 개수만 표시 |
| 데이터 없는 가격 | `가격 정보 미확인` |
| 오래된 가격 | `오래된 공개 참고값` badge |
| 권리 미확인 이미지 | placeholder + 공식 사진 보기 링크 |
| venue detail 없음 | 결과로 돌아가기 + 데이터 업데이트 안내 |
| 손상된 result token | 테스트 다시 시작 CTA |
| localStorage 사용 불가 | 현재 session만 유지하고 안내하지 않아도 핵심 기능 동작 |
| 공유 API 실패 | 링크 복사와 이미지 저장 fallback |

어떤 오류에서도 가짜 venue, 가짜 가격, 다른 venue의 이미지를 대신 사용하지 않는다.

---

## 22. 테스트 전략

## 22.1 unit test

- 질문 답변 → 취향 벡터
- archetype 분류와 tie-break
- tri-state unknown 처리
- hard filter
- 각 score component
- slot별 가중치
- must-have unknown 완화
- 동일 venue 중복 방지
- 가격 stale/상한/단순 참고액
- 추천 이유가 unknown을 사용하지 않는지
- token encode/decode/checksum/version migration
- localStorage schema migration

추천 핵심 로직 branch coverage 90% 이상을 목표로 한다.

## 22.2 data contract test

- JSON schema
- FK integrity
- duplicate id
- scope exclusion
- money integer/범위
- date 형식
- source provenance
- media rights leak
- unknown coercion
- manifest count/checksum

## 22.3 component test

- A/B/both/unknown 선택
- 뒤로가기 후 답변 유지
- multi-select 지역
- 정확히 3개 priority 제한
- unknown badge
- shortlist 3개 제한
- data version notice

## 22.4 E2E 시나리오

1. 혼자 하기 전체 완료
2. 다크·웅장 취향 + 강남권 + 250명 + 주차
3. 밝은 채플 취향 + 150명 + 대중교통
4. 모든 취향 `둘 다 괜찮아요`
5. 여러 축 `잘 모르겠어요`
6. private toilet을 must-have로 선택했지만 데이터가 부족한 경우
7. 가격 확인 홀만 선택
8. strict 후보가 3개 미만인 단계적 완화
9. 관심홀 3개 저장·교체·새로고침
10. 결과 링크 복사 후 새 브라우저에서 복원
11. 커플 비교 완료
12. 잘못된 token
13. data 파일 로딩 실패
14. public display가 허용되지 않은 media 노출 방지

## 22.5 visual/manual QA

viewport:

- 360×800
- 375×812
- 390×844
- 412×915
- 430×932

확인:

- 가로 스크롤 없음
- 하단 CTA가 브라우저 UI에 가리지 않음
- 긴 웨딩홀명 줄바꿈
- safe-area inset
- 카카오/인스타 인앱 브라우저 공유
- 이미지 저장
- 느린 네트워크
- 다크모드는 v1에서 OS와 무관하게 light theme 유지

---

## 23. 출시 수용 기준

### 제품

- 8개 취향 질문과 현실 조건을 120초 이내 완료 가능
- 로그인이나 PII 입력 없음
- 취향 유형, 추천 3곳, 체크리스트가 같은 결과 화면에 표시
- 같은 venue가 3개 슬롯에 중복되지 않음
- 추천 이유가 실제 evidence와 일치
- 관심홀 저장·비교·공유·커플 비교 동작

### 데이터

- manifest와 public files checksum 일치
- current scope만 포함
- 모든 가격에 source와 observedAt 또는 명확한 unknown 상태
- unknown을 0/false로 바꾸지 않음
- 모든 recommendation candidate가 유효한 map/address를 가짐
- 권리 미승인 media asset URL이 public bundle에 없음
- 데이터 quality report가 CI artifact로 생성됨

### UX

- 360px 가로 스크롤 없음
- 터치 target 44px 이상
- 로딩·빈 결과·오류·stale·unknown 상태 존재
- 모바일 인앱 브라우저에서 뒤로가기와 새로고침 후 비정상 종료 없음

### 기술

- lint/typecheck/unit/E2E 통과
- production build 성공
- 치명적 accessibility 오류 0개
- Lighthouse mobile 기준 Performance 85+, Accessibility 95+ 목표
- console error 0개

---

## 24. 구현 순서

### Phase 0. 데이터 계약 고정

- upstream service dataset artifact 확보
- 214/213 scope 이슈 확정
- public schema와 importer 구현
- rights-safe media export
- data report와 CI gate

### Phase 1. 앱 기반

- Next.js/TypeScript/Tailwind 초기화
- route와 AppShell
- design tokens
- analytics/storage adapter
- 질문 configuration loader

### Phase 2. 테스트 흐름

- 랜딩/모드
- 8개 취향 질문
- 현실 조건
- priority picker
- 결과 token

### Phase 3. 추천

- recommendation index
- pure scoring engine
- hard filter와 relaxation
- slot 다양성
- deterministic reason/checklist generator

### Phase 4. 결과 기능

- 결과 유형/축
- 추천 카드
- venue detail
- shortlist 비교
- share image/link
- couple compare

### Phase 5. 품질

- automated tests
- data/rights QA
- Instagram 인앱 브라우저 수동 QA
- 성능 최적화
- Vercel preview 검증

### Phase 6. 공개

- production dataset lock
- privacy/data 안내
- DM 링크와 UTM 연결
- 릴스 CTA·고정댓글·자동 DM 문구 연동
- 분석 funnel 확인

---

## 25. 현재 남은 외부 의존성과 release blocker

### D-01. canonical 범위 확정

`남산한남웨딩가든`을 포함한 최종 private scope를 upstream에서 확정하고 manifest에 반영한다. 앱은 숫자를 하드코딩하지 않으므로 개발은 진행할 수 있지만 production data lock 전에 해결한다.

### D-02. 공개 이미지 권리

현재 1,964개 media reference가 모두 공개 재배포 가능한 것은 아니다. 추천 결과에 실제 사진을 안정적으로 쓰려면 상위 후보 cover의 `publicDisplayAllowed` 검수가 필요하다. 권리가 없는 사진은 제품에 포함하지 않는다.

### D-03. 주관 태그 보강

현재 explicit brightness와 구조 신호는 유효하지만 floral, aesthetic, grandeur, aisle은 대부분 unknown이다. 앱은 현재 데이터로 중립 처리할 수 있으나, 추천 체감 정확도를 높이기 위해 밍정커플 수동 분류를 점진적으로 추가한다.

### D-04. 세부 동선 데이터

신부대기실 전용 화장실, 연회장 같은 층, 엘리베이터 혼잡은 커버리지가 낮다. v1에서는 추천 확정 근거보다 투어 체크리스트와 `확인 필요`에 사용한다.

이 네 항목 외에는 개발을 막는 제품 기획 미결정 사항이 없다.

---

## 26. Definition of Done

다음 상태를 모두 만족하면 v1 개발 완료로 본다.

1. 사용자가 인스타그램 인앱 브라우저에서 로그인 없이 테스트를 시작할 수 있다.
2. 8개 이미지 선택과 현실 조건·우선순위를 완료할 수 있다.
3. 취향 유형과 취향 축이 정확히 복원·공유된다.
4. current service dataset을 바탕으로 서로 다른 실제 후보 최대 3곳이 결정론적으로 추천된다.
5. 각 추천 이유는 확인 가능한 데이터와 연결된다.
6. unknown, stale, inferred, curated가 화면에서 혼동되지 않는다.
7. 가격은 공개 참고값으로만 표현되고 0원이나 확정 견적으로 오인되지 않는다.
8. 권리 미승인 실제 이미지가 공개 bundle 또는 화면에 노출되지 않는다.
9. 개인화된 홀 투어 체크리스트가 생성된다.
10. 관심홀 3개 비교, 결과 저장·공유, 커플 비교가 동작한다.
11. 데이터 import·validation·report가 재현 가능하다.
12. lint, typecheck, unit, E2E, data contract test가 모두 통과한다.
13. 360px 모바일에서 가로 스크롤과 치명적 접근성 문제가 없다.
14. Vercel production 배포에서 주요 인앱 브라우저 검증이 완료된다.
15. DM 링크, UTM, 분석 이벤트가 실제 릴스 운영 흐름과 연결된다.
