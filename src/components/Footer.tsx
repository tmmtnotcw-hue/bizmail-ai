"use client";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* SEOコンテンツ */}
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            BizMail AI とは
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            BizMail AI は、AIを活用したビジネスメール作成支援ツールです。
            お礼・依頼・お詫び・催促など8つのシーンに対応し、
            適切な敬語を使ったビジネスメールを瞬時に生成します。
            送信先やトーンを選ぶだけで、プロフェッショナルなメールが完成します。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                こんな方におすすめ
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>・ビジネスメールの書き方に自信がない方</li>
                <li>・メール作成に時間がかかる方</li>
                <li>・適切な敬語表現を確認したい方</li>
                <li>・新入社員・転職したての方</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                対応シーン
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>・お礼メール / 依頼メール</li>
                <li>・お詫びメール / 催促メール</li>
                <li>・報告メール / お断りメール</li>
                <li>・挨拶メール / 問い合わせメール</li>
              </ul>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; 2026 BizMail AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
