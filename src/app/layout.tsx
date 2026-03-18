import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizMail AI - AIビジネスメール作成支援 | 無料で使えるメール文例生成",
  description:
    "AIがビジネスメールを瞬時に作成。お礼・依頼・お詫び・催促など8つのシーンに対応。適切な敬語でプロフェッショナルなメールを生成します。無料で利用可能。",
  keywords: [
    "ビジネスメール",
    "例文",
    "AI",
    "メール作成",
    "敬語",
    "テンプレート",
    "お礼メール",
    "依頼メール",
    "お詫びメール",
    "ビジネスメール 書き方",
  ],
  openGraph: {
    title: "BizMail AI - AIビジネスメール作成支援",
    description:
      "シーンを選んで要点を入力するだけ。AIが適切な敬語でビジネスメールを瞬時に生成します。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "BizMail AI - AIビジネスメール作成支援",
    description:
      "シーンを選んで要点を入力するだけ。AIが適切な敬語でビジネスメールを瞬時に生成します。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
