import { useState, useEffect } from "react";
import { Link } from "react-router";
import { User, Star, FileText, Flame, ChevronRight, Loader2, CheckCircle2, Clock } from "lucide-react";

const FAVORITE_ENTERPRISES = [
  { id: 1, name: "宁德时代", industry: "新能源", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 2, name: "比亚迪", industry: "新能源", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 3, name: "中芯国际", industry: "半导体", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 4, name: "寒武纪", industry: "人工智能", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 5, name: "恒瑞医药", industry: "生物医药", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
];

const DOWNLOADED_REPORTS = [
  { id: 1, title: "宁德时代2024Q1深度研报", enterprise: "宁德时代", date: "2024-05-20", reportId: "R-1", enterpriseId: "1" },
  { id: 2, title: "比亚迪年度投资价值分析", enterprise: "比亚迪", date: "2024-05-18", reportId: "R-2", enterpriseId: "2" },
  { id: 3, title: "中芯国际半导体行业研报", enterprise: "中芯国际", date: "2024-05-15", reportId: "R-3", enterpriseId: "3" },
];

const FOLLOWED_INDUSTRIES = [
  { id: 1, name: "新能源", heat: "98.5w" },
  { id: 2, name: "人工智能", heat: "95.2w" },
  { id: 3, name: "半导体", heat: "85.1w" },
];

interface GenerationStatus {
  enterpriseId: string;
  enterpriseName: string;
  status: "generating" | "completed";
  completedAt?: number;
}

const TABS = [
  { key: "enterprises", label: "收藏企业", icon: <Star size={16} /> },
  { key: "reports", label: "我的研报", icon: <FileText size={16} /> },
  { key: "industries", label: "关注行业", icon: <Flame size={16} /> },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabKey>("enterprises");
  const [generationStatuses, setGenerationStatuses] = useState<GenerationStatus[]>([]);

  useEffect(() => {
    const loadStatuses = () => {
      const statuses: GenerationStatus[] = [];
      // Check localStorage for each favorite enterprise
      FAVORITE_ENTERPRISES.forEach(enterprise => {
        const cached = localStorage.getItem(`enterprise_result_${enterprise.id}`);
        if (cached) {
          try {
            const data = JSON.parse(cached);
            statuses.push({
              enterpriseId: String(enterprise.id),
              enterpriseName: enterprise.name,
              status: "completed",
              completedAt: data.completedAt,
            });
          } catch {
            // ignore parse errors
          }
        }
      });

      // Also check for any in-progress generation stored in sessionStorage
      const generatingList = JSON.parse(sessionStorage.getItem("generating_enterprises") || "[]");
      generatingList.forEach((id: string) => {
        if (!statuses.find(s => s.enterpriseId === id)) {
          const enterprise = FAVORITE_ENTERPRISES.find(e => String(e.id) === id);
          if (enterprise) {
            statuses.push({
              enterpriseId: id,
              enterpriseName: enterprise.name,
              status: "generating",
            });
          }
        }
      });

      setGenerationStatuses(statuses);
    };
    loadStatuses();
    const interval = setInterval(loadStatuses, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatCompletedTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    return d.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }) + " " + d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 用户信息区 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">用户</h1>
            <p className="text-sm text-slate-500 mt-1">收藏 {FAVORITE_ENTERPRISES.length} 家企业 · {DOWNLOADED_REPORTS.length} 份研报 · {FOLLOWED_INDUSTRIES.length} 个行业</p>
          </div>
        </div>
      </section>

      {/* Tab 切换 */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 w-max">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 收藏企业 */}
      {activeTab === "enterprises" && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              收藏企业
            </h2>
            <Link to="/follow/enterprise" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              查看信号列表 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {FAVORITE_ENTERPRISES.map((item, index) => (
              <Link
                key={item.id}
                to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}`}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl group transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                    index < 3 ? "bg-gradient-to-br from-rose-100 to-orange-100 text-rose-600 border border-rose-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {index + 1}
                  </span>
                  <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{item.industry}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 我的研报 */}
      {activeTab === "reports" && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              我的研报
            </h2>
          </div>
          <div className="space-y-2">
            {/* Generation status items */}
            {generationStatuses.length > 0 && generationStatuses.map((gen) => (
              <div
                key={gen.enterpriseId}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  gen.status === "generating"
                    ? "border-amber-200 bg-amber-50/50"
                    : "border-transparent hover:border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 border border-indigo-200">
                    <FileText size={14} />
                  </span>
                  <div>
                    <span className="font-semibold text-slate-700 block">{gen.enterpriseName} 深度研报</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {gen.status === "generating" ? "AI 正在生成中..." : formatCompletedTime(gen.completedAt)}
                    </span>
                  </div>
                </div>
                {gen.status === "generating" ? (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border border-amber-200">
                    <Loader2 size={12} className="animate-spin" /> 生成中
                  </span>
                ) : (
                  <Link
                    to={`/enterprise/${encodeURIComponent(gen.enterpriseId)}?enterpriseName=${encodeURIComponent(gen.enterpriseName)}`}
                    className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border border-blue-200"
                  >
                    <CheckCircle2 size={12} /> 查看研报
                  </Link>
                )}
              </div>
            ))}

            {/* Divider between generation items and downloaded reports */}
            {generationStatuses.length > 0 && DOWNLOADED_REPORTS.length > 0 && (
              <div className="border-t border-slate-100 my-3"></div>
            )}

            {/* Existing downloaded reports */}
            {DOWNLOADED_REPORTS.map((item, index) => (
              <Link
                key={item.id}
                to={`/report/${item.reportId}?enterpriseId=${item.enterpriseId}`}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl group transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                    index < 3 ? "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 border border-blue-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors block">{item.title}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{item.enterprise} · {item.date}</span>
                  </div>
                </div>
                <FileText size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}

            {generationStatuses.length === 0 && DOWNLOADED_REPORTS.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                <FileText size={32} className="opacity-20" />
                <p className="text-sm">暂无研报，前往企业页面生成</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 关注行业 */}
      {activeTab === "industries" && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              关注行业
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FOLLOWED_INDUSTRIES.map((item) => (
              <Link
                key={item.id}
                to={`/industry/${encodeURIComponent(item.name)}?industryName=${encodeURIComponent(item.name)}`}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {item.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Flame size={12} />
                  {item.heat}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
