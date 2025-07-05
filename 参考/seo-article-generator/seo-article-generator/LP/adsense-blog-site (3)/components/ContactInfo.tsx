import { MapPin, Clock, Globe, Users } from "lucide-react"

export default function ContactInfo() {
  const officeInfo = {
    address: "〒100-0001\n東京都千代田区千代田1-1-1\nテックビル 5F",
    hours: "平日 10:00-18:00\n土日祝日は休業",
    access: "JR東京駅 徒歩5分\n地下鉄大手町駅 徒歩3分",
  }

  const teamMembers = [
    { name: "田中太郎", role: "編集長", expertise: "フロントエンド開発" },
    { name: "佐藤花子", role: "技術ライター", expertise: "AI・機械学習" },
    { name: "山田次郎", role: "デザイナー", expertise: "UI/UXデザイン" },
  ]

  return (
    <div className="space-y-8">
      {/* オフィス情報 */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
            <MapPin className="text-white" size={16} />
          </div>
          オフィス情報
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-blue-500" />
              所在地
            </h4>
            <p className="text-gray-600 text-sm whitespace-pre-line pl-6">{officeInfo.address}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Clock size={16} className="mr-2 text-green-500" />
              営業時間
            </h4>
            <p className="text-gray-600 text-sm whitespace-pre-line pl-6">{officeInfo.hours}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Globe size={16} className="mr-2 text-purple-500" />
              アクセス
            </h4>
            <p className="text-gray-600 text-sm whitespace-pre-line pl-6">{officeInfo.access}</p>
          </div>
        </div>
      </div>

      {/* チーム紹介 */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center font-display">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-3">
            <Users className="text-white" size={16} />
          </div>
          編集チーム
        </h3>

        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                {member.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">{member.name}</h4>
                <p className="text-gray-600 text-xs">
                  {member.role} • {member.expertise}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 広告スペース */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-64 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <div className="text-sm font-medium mb-1">広告スペース</div>
            <div className="text-xs text-gray-500">(300x250)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
