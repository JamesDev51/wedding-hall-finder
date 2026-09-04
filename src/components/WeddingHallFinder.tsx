"use client";

import { useEffect, useMemo, useState } from "react";
import { tasteQuestions } from "@/src/data/questions";
import { recommend } from "@/src/lib/recommend";
import type { Hall, Venue } from "@/src/lib/types";

const districts = ["강남구", "서초구", "송파구", "강동구", "영등포구", "마포구", "종로구", "중구", "성동구", "광진구", "강서구", "양천구"];

export default function WeddingHallFinder() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [phase, setPhase] = useState<"intro" | "taste" | "conditions" | "result">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/v1/venues.json").then((response) => response.json()),
      fetch("/data/v1/halls.json").then((response) => response.json()),
    ])
      .then(([venueData, hallData]) => { setVenues(venueData); setHalls(hallData); })
      .catch(() => { setVenues([]); setHalls([]); });
  }, []);

  const brightness = answers.q1 ?? 0;
  const results = useMemo(() => recommend(venues, halls, brightness, { districts: selectedDistricts, guestCount }), [venues, halls, brightness, selectedDistricts, guestCount]);

  const answerQuestion = (value: number) => {
    const current = tasteQuestions[questionIndex];
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    if (questionIndex === tasteQuestions.length - 1) setPhase("conditions");
    else setQuestionIndex((value) => value + 1);
  };

  return (
    <main className="shell">
      <header className="brand">밍정커플 · 웨딩홀 취향 테스트</header>
      {phase === "intro" && <section className="hero card"><span className="eyebrow">1~2분이면 끝나요</span><h1>내가 좋아할 웨딩홀,<br />사진 취향부터 찾아봐요.</h1><p>취향 선택과 현실 조건을 합쳐 서울 민간 웨딩홀 데이터에서 후보를 찾아줍니다.</p><button className="primary" onClick={() => setPhase("taste")}>혼자 해보기</button><p className="fine">로그인·전화번호 입력 없이 바로 시작합니다.</p></section>}

      {phase === "taste" && (() => { const question = tasteQuestions[questionIndex]; return <section className="card"><div className="progress"><span style={{ width: `${((questionIndex + 1) / tasteQuestions.length) * 100}%` }} /></div><p className="eyebrow">{questionIndex + 1} / {tasteQuestions.length}</p><h2>{question.prompt}</h2><div className="choiceGrid"><button className="choice visualA" onClick={() => answerQuestion(question.a.value)}>{question.a.label}</button><button className="choice visualB" onClick={() => answerQuestion(question.b.value)}>{question.b.label}</button></div><button className="secondary" onClick={() => answerQuestion(0)}>둘 다 괜찮아요</button><button className="ghost" onClick={() => answerQuestion(0)}>잘 모르겠어요</button><p className="fine">현재 비교 이미지는 placeholder입니다. PRD 기준 생성 이미지 16장으로 교체해야 합니다.</p></section>; })()}

      {phase === "conditions" && <section className="card"><p className="eyebrow">현실 조건</p><h2>어느 지역을 보고 있어요?</h2><div className="chips">{districts.map((district) => <button key={district} className={selectedDistricts.includes(district) ? "chip active" : "chip"} onClick={() => setSelectedDistricts((current) => current.includes(district) ? current.filter((item) => item !== district) : [...current, district])}>{district}</button>)}</div><h2 className="spaced">예상 하객 수는?</h2><div className="chips">{[130,180,230,280,350].map((count) => <button key={count} className={guestCount === count ? "chip active" : "chip"} onClick={() => setGuestCount(count)}>{count === 130 ? "150명 이하" : count === 350 ? "300명 이상" : `${count - 30}~${count + 20}명`}</button>)}<button className={guestCount === null ? "chip active" : "chip"} onClick={() => setGuestCount(null)}>아직 모르겠음</button></div><button className="primary spaced" onClick={() => setPhase("result")}>내 결과 보기</button></section>}

      {phase === "result" && <section className="card"><p className="eyebrow">내 취향 결과</p><h1>{brightness < -0.2 ? "분위기 있는 다크홀 취향" : brightness > 0.2 ? "화사한 브라이트홀 취향" : "밝기보다 전체 밸런스 취향"}</h1><p>현재 handoff scaffold는 데이터가 확인된 밝기·지역·수용인원 중심의 보수적인 추천만 사용합니다.</p><div className="resultList">{results.map((result,index) => <article className="resultCard" key={result.venue.venue_id}><span className="rank">{["취향 원픽","현실 조건 원픽","균형 원픽"][index] ?? `${index + 1}순위`}</span><h3>{result.venue.canonical_name}</h3><p>{result.hall?.hall_name ?? "홀명 미확인"} · {result.venue.district}</p><div className="tags">{result.reasons.map((reason) => <span key={reason}>{reason}</span>)}</div><dl><div><dt>식대</dt><dd>{result.hall?.meal_won ? `${result.hall.meal_won.toLocaleString()}원` : "미확인"}</dd></div><div><dt>최소보증</dt><dd>{result.hall?.minimum_guarantee ? `${result.hall.minimum_guarantee}명` : "미확인"}</dd></div><div><dt>수용</dt><dd>{result.hall?.seated_capacity ? `${result.hall.seated_capacity}명` : "미확인"}</dd></div></dl>{result.venue.kakao_url && <a href={result.venue.kakao_url} target="_blank" rel="noreferrer">카카오맵에서 보기 ↗</a>}</article>)}</div>{results.length === 0 && <p className="fine">서비스 데이터가 아직 동기화되지 않았습니다. `npm run data:sync` 후 importer를 완성하세요.</p>}<p className="fine">가격·보증 인원은 날짜와 시간대에 따라 달라질 수 있으니 공식 상담에서 다시 확인해 주세요.</p></section>}
    </main>
  );
}
