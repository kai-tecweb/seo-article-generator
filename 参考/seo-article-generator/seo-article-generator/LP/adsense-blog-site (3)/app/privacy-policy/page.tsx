import { Shield, Eye, Cookie, Database, Mail, Calendar } from "lucide-react"

export const metadata = {
  title: "プライバシーポリシー | TechVibe - 未来を創るテクノロジーメディア",
  description:
    "TechVibeのプライバシーポリシー。個人情報の取り扱い、Cookie、Google AdSense、Google Analyticsについて詳しく説明しています。",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "2024年1月1日"
  const effectiveDate = "2024年1月1日"

  const sections = [
    {
      id: "collection",
      title: "個人情報の収集について",
      icon: Database,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "usage",
      title: "個人情報の利用目的",
      icon: Eye,
      color: "from-green-500 to-green-600",
    },
    {
      id: "cookies",
      title: "Cookieの使用について",
      icon: Cookie,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "adsense",
      title: "Google AdSenseについて",
      icon: Shield,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "analytics",
      title: "Google Analyticsについて",
      icon: Database,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "disclosure",
      title: "個人情報の第三者への開示",
      icon: Shield,
      color: "from-red-500 to-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* ヒーローセクション */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-8 animate-slide-up">
              <Shield className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">個人情報保護について</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 animate-slide-up">
              <span className="gradient-text">プライバシーポリシー</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed animate-slide-up mb-8">
              TechVibeは、ユーザーの皆様の個人情報を適切に保護し
              <br className="hidden md:block" />
              安心してご利用いただけるサービスを提供いたします
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                制定日: {effectiveDate}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                最終更新: {lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <div className="container-custom pb-8">
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">目次</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <div
                  className={`p-2 bg-gradient-to-r ${section.color} rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <section.icon className="text-white" size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* 基本方針 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                    <Shield className="text-white" size={20} />
                  </div>
                  基本方針
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    TechVibe（以下「当サイト」）は、ユーザーの個人情報を適切に保護することを重要な責務と考え、
                    個人情報保護法その他の関連法令を遵守し、個人情報の適正な取り扱いを行います。
                  </p>
                </div>
              </section>

              {/* 個人情報の収集について */}
              <section id="collection" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3">
                    <Database className="text-white" size={20} />
                  </div>
                  1. 個人情報の収集について
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    当サイトでは、以下の場合に個人情報を収集させていただくことがあります：
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>お問い合わせフォームをご利用いただく際</li>
                    <li>ニュースレターの購読をお申し込みいただく際</li>
                    <li>コメント機能をご利用いただく際</li>
                    <li>アンケートやキャンペーンにご参加いただく際</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>収集する情報：</strong>お名前、メールアドレス、会社名、お問い合わせ内容など、
                      フォームにご入力いただいた情報
                    </p>
                  </div>
                </div>
              </section>

              {/* 個人情報の利用目的 */}
              <section id="usage" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
                    <Eye className="text-white" size={20} />
                  </div>
                  2. 個人情報の利用目的
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">収集した個人情報は、以下の目的でのみ利用いたします：</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">お問い合わせ対応</h4>
                      <p className="text-green-700 text-sm">ご質問やご要望への回答、サポート提供</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">情報提供</h4>
                      <p className="text-blue-700 text-sm">ニュースレターや重要なお知らせの配信</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">サービス改善</h4>
                      <p className="text-purple-700 text-sm">サイトの品質向上、新機能の開発</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">統計分析</h4>
                      <p className="text-orange-700 text-sm">匿名化されたデータによる利用傾向の分析</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookieの使用について */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3">
                    <Cookie className="text-white" size={20} />
                  </div>
                  3. Cookieの使用について
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    当サイトでは、ユーザーの利便性向上のためにCookieを使用しています。
                    Cookieは、ユーザーのブラウザに保存される小さなテキストファイルです。
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-800 mb-3">Cookieの利用目的</h4>
                    <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                      <li>ユーザーの設定やログイン状態の保持</li>
                      <li>サイトの利用状況の分析</li>
                      <li>広告の最適化</li>
                      <li>ソーシャルメディア機能の提供</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 text-sm">
                    ※ Cookieの設定は、ブラウザの設定から無効にすることができますが、
                    一部機能が正常に動作しない場合があります。
                  </p>
                </div>
              </section>

              {/* Google AdSenseについて */}
              <section id="adsense" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mr-3">
                    <Shield className="text-white" size={20} />
                  </div>
                  4. Google AdSenseについて
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    当サイトでは、第三者配信の広告サービス「Google AdSense」を利用しています。
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-800 mb-3">Google AdSenseの仕組み</h4>
                    <ul className="list-disc list-inside text-orange-700 space-y-2 text-sm">
                      <li>
                        ユーザーの興味に応じた商品やサービスの広告を表示するため、
                        当サイトや他サイトへのアクセスに関する情報を使用することがあります
                      </li>
                      <li>この情報には、氏名、住所、メールアドレス、電話番号は含まれません</li>
                      <li>DoubleClick Cookieを使用して、ユーザーの過去のアクセス情報に基づいて広告を配信します</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>広告のカスタマイズについて：</strong>
                      <a
                        href="https://www.google.com/settings/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline ml-1"
                      >
                        Google広告設定ページ
                      </a>
                      から、パーソナライズ広告を無効にすることができます。
                    </p>
                  </div>
                </div>
              </section>

              {/* Google Analyticsについて */}
              <section id="analytics" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-3">
                    <Database className="text-white" size={20} />
                  </div>
                  5. Google Analyticsについて
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を利用しています。
                  </p>
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                    <h4 className="font-semibold text-pink-800 mb-3">Google Analyticsの特徴</h4>
                    <ul className="list-disc list-inside text-pink-700 space-y-2 text-sm">
                      <li>トラフィックデータの収集のためにCookieを使用しています</li>
                      <li>このトラフィックデータは匿名で収集されており、個人を特定するものではありません</li>
                      <li>収集されたデータは、サイトの利用状況の分析やサービス改善に使用されます</li>
                      <li>IP匿名化機能を有効にし、個人を特定できないよう配慮しています</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Google Analyticsの詳細については、
                    <a
                      href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:no-underline ml-1"
                    >
                      Google Analyticsサービス利用規約
                    </a>
                    をご確認ください。
                  </p>
                </div>
              </section>

              {/* 個人情報の第三者への開示 */}
              <section id="disclosure" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg mr-3">
                    <Shield className="text-white" size={20} />
                  </div>
                  6. 個人情報の第三者への開示
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    当サイトでは、個人情報を適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-semibold text-red-800 mb-3">開示する場合</h4>
                    <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                      <li>ご本人の同意がある場合</li>
                      <li>法令等への協力のため、開示が必要となる場合</li>
                      <li>人の生命、身体または財産の保護のために必要がある場合</li>
                      <li>
                        公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、
                        本人の同意を得ることが困難である場合
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* その他の重要事項 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">7. その他の重要事項</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">個人情報の開示・訂正・削除</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、
                      ご本人であることを確認させていただいた上、速やかに対応させていただきます。
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">アフィリエイトプログラム</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、
                      Amazonアソシエイト・プログラムの参加者です。
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">免責事項</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      当サイトからリンクやバナーなどによって他のサイトに移動された場合、
                      移動先サイトで提供される情報、サービス等について一切の責任を負いません。
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">プライバシーポリシーの変更</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、
                      本ポリシーの内容を適宜見直しその改善に努めます。
                    </p>
                  </div>
                </div>
              </section>

              {/* お問い合わせ */}
              <section className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <Mail className="mx-auto mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-4 font-display">個人情報に関するお問い合わせ</h3>
                  <p className="mb-6 opacity-90">
                    個人情報の取り扱いに関するご質問やご要望がございましたら、 お気軽にお問い合わせください。
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Mail className="mr-2" size={16} />
                    お問い合わせフォーム
                  </a>
                </div>
              </section>

              {/* 運営者情報 */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>制定日：</strong>
                  {effectiveDate}
                  <br />
                  <strong>最終更新日：</strong>
                  {lastUpdated}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>運営者：</strong>TechVibe編集部
                  <br />
                  <strong>所在地：</strong>〒100-0001 東京都千代田区千代田1-1-1 テックビル 5F
                  <br />
                  <strong>連絡先：</strong>contact@techvibe.jp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
