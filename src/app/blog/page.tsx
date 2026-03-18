import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ビジネスメールの書き方・例文集 | BizMail AI ブログ",
  description:
    "ビジネスメールの書き方を徹底解説。お礼・依頼・お詫び・催促など、シーン別の例文テンプレートと敬語表現のコツを紹介します。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
              ✉️
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                BizMail AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AIビジネスメール作成支援
              </p>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
          >
            メールを作成
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-10">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
            ビジネスメールの書き方・例文集
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            シーン別のビジネスメール例文と書き方のコツを紹介します。
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:hover:border-blue-700"
            >
              <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {post.category}
              </span>
              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {post.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <time className="text-xs text-gray-400">{post.date}</time>
                <div className="flex gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-950/20">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            ビジネスメールの作成にお困りですか？
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            BizMail AIなら、シーンを選んで要点を入力するだけで適切なメールが完成します。
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
          >
            ✨ 無料でメールを作成する
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs text-gray-500">&copy; 2026 BizMail AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
