import Link from "next/link";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "記事が見つかりません" };

  return {
    title: `${post.title} | BizMail AI ブログ`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "ja_JP",
    },
  };
}

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="mb-4 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={i} className="mb-3 mt-8 text-2xl font-bold text-gray-900 dark:text-white">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={i} className="mb-2 mt-6 text-lg font-semibold text-gray-900 dark:text-white">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      inList = true;
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
    } else if (trimmed.startsWith("[") && trimmed.includes("](")) {
      flushList();
      const match = trimmed.match(/\[(.+?)\]\((.+?)\)/);
      if (match) {
        elements.push(
          <p key={i} className="mb-4">
            <Link href={match[2]} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {match[1]}
            </Link>
          </p>
        );
      }
    } else {
      flushList();
      // Handle inline bold (**text**)
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
      elements.push(
        <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BizMail AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AIビジネスメール作成支援</p>
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">ブログ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{post.category}</span>
        </nav>

        {/* Article */}
        <article>
          <div className="mb-6">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {post.category}
            </span>
            <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="flex items-center gap-3">
              <time className="text-sm text-gray-500">{post.date}</time>
              <div className="flex gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose-custom">
            {renderContent(post.content)}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-950/20">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            この記事で紹介したメールをAIで簡単作成
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            シーンを選んで要点を入力するだけ。敬語や定型表現もAIにおまかせ。
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
          >
            ✨ 無料でメールを作成する
          </Link>
        </div>

        {/* 関連記事 */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">関連記事</h3>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs text-gray-500">&copy; 2026 BizMail AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
