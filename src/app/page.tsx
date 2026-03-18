import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
              ✉️
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BizMail AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AIビジネスメール作成支援</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="hidden text-sm text-gray-600 hover:text-blue-600 sm:block dark:text-gray-400">
              ブログ
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              今すぐ使う
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              完全無料 ・ 登録なしで使える
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-6xl">
              ビジネスメールを
              <br />
              <span className="text-blue-600 dark:text-blue-400">AI</span>
              が<span className="underline decoration-blue-400 decoration-4 underline-offset-8">10秒</span>で作成
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-400">
              シーンを選んで要点を入力するだけ。
              敬語・定型表現・署名まで、プロ品質のメールが瞬時に完成します。
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/app"
                className="w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
              >
                ✨ 無料でメールを作成する
              </Link>
              <Link
                href="/blog"
                className="w-full rounded-xl border border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 transition-all hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                📝 例文を見る
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-200 bg-gray-50 px-4 py-10 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">対応シーン</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">2</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">対応言語</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">10秒</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">で完成</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
              BizMail AI が選ばれる理由
            </h2>
            <p className="mb-12 text-center text-gray-500 dark:text-gray-400">
              メール作成の悩みを全て解決します
            </p>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: "🎯", title: "適切な敬語", desc: "送信先に合わせた敬語レベルを自動調整。上司・取引先・顧客それぞれに最適な表現を使用します。" },
                { icon: "⚡", title: "10秒で完成", desc: "要点を箇条書きで入力するだけ。件名も本文もAIが瞬時に生成。メール作成の時間を90%削減。" },
                { icon: "🌐", title: "日英対応", desc: "日本語・英語のビジネスメールに対応。海外とのやり取りもワンクリックで切り替えられます。" },
                { icon: "✉️", title: "Gmail連携", desc: "生成したメールをGmailの下書きとしてワンクリックで開けます。コピペの手間も不要。" },
                { icon: "💾", title: "テンプレート保存", desc: "よく使うメールパターンをテンプレートとして保存。次回から瞬時に呼び出せます。" },
                { icon: "👤", title: "プロフィール設定", desc: "名前・会社名・署名を登録すると、生成メールに自動反映。毎回入力する手間がなくなります。" },
              ].map((feature, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 p-6 transition-all hover:shadow-lg dark:border-gray-800">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-blue-50 px-4 py-16 dark:bg-blue-950/20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              使い方は3ステップ
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "1", title: "シーンを選ぶ", desc: "お礼・依頼・お詫びなど8つのシーンから選択" },
                { step: "2", title: "要点を入力", desc: "伝えたいポイントを箇条書きでOK" },
                { step: "3", title: "コピー＆送信", desc: "生成されたメールをコピーまたはGmailで直接開く" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/app"
                className="inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                ✨ 無料でメールを作成する
              </Link>
            </div>
          </div>
        </section>

        {/* Supported scenes */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              対応シーン
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: "🙏", label: "お礼" },
                { icon: "📩", label: "依頼" },
                { icon: "🙇", label: "お詫び" },
                { icon: "⏰", label: "催促" },
                { icon: "📊", label: "報告" },
                { icon: "🚫", label: "断り" },
                { icon: "👋", label: "挨拶" },
                { icon: "❓", label: "問い合わせ" },
              ].map((scene, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <span className="text-2xl">{scene.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{scene.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-gray-200 bg-gray-50 px-4 py-16 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              よくある質問
            </h2>
            <div className="space-y-4">
              {[
                { q: "本当に無料で使えますか？", a: "はい、完全無料です。アカウント登録なしでもメール生成が可能です。アカウントを作成すると、テンプレート保存や生成履歴などの追加機能が使えます。" },
                { q: "生成されたメールの品質は大丈夫ですか？", a: "最新のAI（GPT-4o-mini）を使用しており、ビジネスメールとして適切な敬語表現と構成で生成されます。送信前に内容をご確認いただくことをお勧めします。" },
                { q: "入力した内容は保存されますか？", a: "ログインしていない場合、入力内容はサーバーに保存されません。ログインユーザーのみ、生成履歴が保存されます（いつでも削除可能）。" },
                { q: "英語メールも作れますか？", a: "はい、日本語と英語の両方に対応しています。言語切替ボタンで簡単に切り替えられます。日本語で要点を入力しても、自然な英語メールが生成されます。" },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-gray-900 dark:text-white">
                    {faq.q}
                    <span className="text-gray-400 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              もうメール作成で悩まない
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              今すぐBizMail AIを使って、プロ品質のビジネスメールを作成しましょう。
            </p>
            <Link
              href="/app"
              className="inline-block rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              ✨ 無料でメールを作成する
            </Link>
            <p className="mt-4 text-sm text-gray-400">登録不要 ・ クレジットカード不要</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
