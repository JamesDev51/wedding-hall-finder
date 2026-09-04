import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "밍정커플 웨딩홀 취향 테스트",
  description: "사진 취향과 현실 조건으로 나에게 맞는 서울 웨딩홀 후보를 찾아보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
