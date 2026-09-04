export type TasteAxis = "brightness" | "scale" | "floral" | "style" | "aisle" | "ceiling" | "entrance" | "venueType";

export type TasteQuestion = {
  id: string;
  prompt: string;
  axis: TasteAxis;
  a: { label: string; value: number };
  b: { label: string; value: number };
};

export const tasteQuestions: TasteQuestion[] = [
  { id: "q1", prompt: "내가 입장하고 싶은 조명은?", axis: "brightness", a: { label: "어두운 홀", value: -1 }, b: { label: "밝은 홀", value: 1 } },
  { id: "q2", prompt: "더 끌리는 공간감은?", axis: "scale", a: { label: "웅장한 홀", value: 1 }, b: { label: "아늑한 홀", value: -1 } },
  { id: "q3", prompt: "꽃장식은 어떤 쪽?", axis: "floral", a: { label: "풍성한 꽃", value: 1 }, b: { label: "미니멀", value: -1 } },
  { id: "q4", prompt: "전체 분위기는?", axis: "style", a: { label: "클래식", value: -1 }, b: { label: "모던·내추럴", value: 1 } },
  { id: "q5", prompt: "버진로드는?", axis: "aisle", a: { label: "긴 버진로드", value: 1 }, b: { label: "짧은 버진로드", value: -1 } },
  { id: "q6", prompt: "층고 느낌은?", axis: "ceiling", a: { label: "높은 층고", value: 1 }, b: { label: "포근한 층고", value: -1 } },
  { id: "q7", prompt: "입장 방식은?", axis: "entrance", a: { label: "계단·2층 입장", value: 1 }, b: { label: "같은 층 입장", value: -1 } },
  { id: "q8", prompt: "더 끌리는 웨딩홀 타입은?", axis: "venueType", a: { label: "호텔·컨벤션", value: 1 }, b: { label: "채플·하우스", value: -1 } }
];
