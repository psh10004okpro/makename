import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "한국 전통 작명소 - AI 사주팔자 기반 작명 서비스",
  description: "전통 사주팔자와 AI를 결합한 신생아 작명, 개명, 회사명 작명 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
