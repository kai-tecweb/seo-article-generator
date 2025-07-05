import { FileText, AlertTriangle, Scale } from "lucide-react"

export const metadata = {
  title: "利用規約 | TechVibe - 未来を創るテクノロジーメディア",
  description: "TechVibeの利用規約。サービスの利用条件、禁止事項、免責事項について詳しく説明しています。",
}

export default function TermsPage() {
  const lastUpdated = "2024年1月1日"

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
              <FileText className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">サービス利用について</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 animate-slide-up">
              <span className="gradient-text">利用規約</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed animate-slide-up">
              TechVibeをご利用いただく前に
              <br className="hidden md:block" />
              必ずお読みください
            </p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container-custom pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* 前文 */}
              <section className="mb-12">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    この利用規約（以下「本規約」）は、TechVibe（以下「当サイト」）が提供するサービスの利用条件を定めるものです。
                    ユーザーの皆様（以下「ユーザー」）には、本規約に同意の上、当サイトをご利用いただきます。
                  </p>
                </div>
              </section>

              {/* 第1条 適用 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3">
                    <Scale className="text-white" size={20} />
                  </div>
                  第1条（適用）
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    1. 本規約は、ユーザーと当サイトとの間の当サイトの利用に関わる一切の関係に適用されるものとします。
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    2. 当サイトは本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」）をすることがあります。
                    これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    3. 本規約の規定が前項の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。
                  </p>
                </div>
              </section>

              {/* 第2条 利用登録 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
                    <FileText className="text-white" size={20} />
                  </div>
                  第2条（利用登録）
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    1. 当サービスにおいては、登録希望者が本規約に同意の上、当サイトの定める方法によって利用登録を申請し、
                    当サイトがこれを承認することによって、利用登録が完了するものとします。
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    2. 当サイトは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、
                    その理由については一切の開示義務を負わないものとします。
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当サイトが利用登録を相当でないと判断した場合</li>
                  </ul>
                </div>
              </section>

              {/* 第3条 禁止事項 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg mr-3">
                    <AlertTriangle className="text-white" size={20} />
                  </div>
                  第3条（禁止事項）
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                      <li>法令または公序良俗に違反する行為</li>
                      \
