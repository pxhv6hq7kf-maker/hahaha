import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowUpRight, BarChart3, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { ATLAS_ENTERPRISES, LISTED_ENTERPRISES, NEXT50_ENTERPRISES, RankingType } from "../data/rankings";

const PAGE_SIZE = 20;

const RANKING_META = {
  next50: {
    tag: "NEXT50",
    title: "成长潜力企业",
    subtitle: "High-Growth Tech Leaders · Top 50",
    description: "聚焦高成长科技企业，展示融资阶段、估值水平与成长潜力。",
    icon: TrendingUp,
    barClass: "from-blue-600 via-indigo-500 to-violet-500",
    tagClass: "from-blue-600 to-indigo-600 shadow-blue-200/50",
    hoverClass: "hover:from-blue-50/80 hover:to-indigo-50/50 hover:border-blue-100",
    textClass: "group-hover/row:text-blue-700",
    tagPillClass: "border-blue-200/60 bg-blue-50 text-blue-700",
    activeTabClass: "bg-blue-600 text-white shadow-blue-200/70",
    tabHoverClass: "hover:border-blue-200 hover:text-blue-700",
    pageClass: "bg-blue-600 text-white shadow-blue-200/70",
    pillClass: "group-hover/row:bg-blue-100 group-hover/row:text-blue-700",
  },
  atlas: {
    tag: "ATLAS",
    title: "细分赛道科技榜",
    subtitle: "Niche Tech Track Leaders · Top 50",
    description: "覆盖细分技术赛道，展示赛道标签、所在地区与融资阶段。",
    icon: Sparkles,
    barClass: "from-emerald-500 via-teal-500 to-cyan-500",
    tagClass: "from-emerald-600 to-teal-600 shadow-emerald-200/50",
    hoverClass: "hover:from-emerald-50/80 hover:to-teal-50/50 hover:border-emerald-100",
    textClass: "group-hover/row:text-emerald-700",
    tagPillClass: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
    activeTabClass: "bg-emerald-600 text-white shadow-emerald-200/70",
    tabHoverClass: "hover:border-emerald-200 hover:text-emerald-700",
    pageClass: "bg-emerald-600 text-white shadow-emerald-200/70",
    pillClass: "group-hover/row:bg-emerald-100 group-hover/row:text-emerald-700",
  },
  listed: {
    tag: "LISTED",
    title: "上市企业榜单",
    subtitle: "Public Tech Companies · Top 50",
    description: "追踪已上市科技企业，展示证券代码、上市板块与市值水平。",
    icon: BarChart3,
    barClass: "from-violet-600 via-indigo-500 to-purple-500",
    tagClass: "from-violet-600 to-indigo-600 shadow-violet-200/50",
    hoverClass: "hover:from-violet-50/80 hover:to-indigo-50/50 hover:border-violet-100",
    textClass: "group-hover/row:text-violet-700",
    tagPillClass: "border-violet-200/60 bg-violet-50 text-violet-700",
    activeTabClass: "bg-violet-600 text-white shadow-violet-200/70",
    tabHoverClass: "hover:border-violet-200 hover:text-violet-700",
    pageClass: "bg-violet-600 text-white shadow-violet-200/70",
    pillClass: "group-hover/row:bg-violet-100 group-hover/row:text-violet-700",
  },
};

const RANKING_DATA = {
  next50: NEXT50_ENTERPRISES,
  atlas: ATLAS_ENTERPRISES,
  listed: LISTED_ENTERPRISES,
};

const INDUSTRY_TRACK_KEYWORDS: Record<string, string[]> = {
  新能源: ["电池", "能源", "激光雷达"],
  人工智能: ["AI", "视觉", "机器人", "数据库"],
  生物医药: ["生命科学", "医疗", "生物"],
  半导体: ["芯片", "半导体", "ADC"],
  低空经济: ["飞行", "无人机", "雷达"],
  量子计算: ["量子"],
  消费电子: ["影像", "传感器", "可穿戴"],
  云计算: ["数据库", "云", "基础"],
  先进制造: ["机器人", "工业", "自动化"],
  新材料: ["材料", "固态"],
  物联网: ["传感器", "雷达", "智能"],
};

function isRankingType(value: string | undefined): value is RankingType {
  return value === "next50" || value === "atlas" || value === "listed";
}

function matchIndustryTrack(track: string, industry: string) {
  const keywords = INDUSTRY_TRACK_KEYWORDS[industry] || [industry];
  return keywords.some((keyword) => track.includes(keyword));
}

export default function RankingList() {
  const { rankType } = useParams();
  const [activeIndustry, setActiveIndustry] = useState("全部");
  const [followedIndustries, setFollowedIndustries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("followed_industries") || "[]");
      // 如果没有关注行业，默认使用具身智能、量子科技
      setFollowedIndustries(saved.length > 0 ? saved : ["具身智能", "量子科技"]);
    } catch {
      setFollowedIndustries(["具身智能", "量子科技"]);
    }
  }, []);

  useEffect(() => {
    // 使用第一个关注行业作为默认选中
    if (followedIndustries.length > 0) {
      setActiveIndustry(followedIndustries[0]);
    }
    setCurrentPage(1);
  }, [rankType, followedIndustries]);

  if (!isRankingType(rankType)) {
    return <Navigate to="/home" replace />;
  }

  const meta = RANKING_META[rankType];
  const Icon = meta.icon;
  const data = RANKING_DATA[rankType];
  const atlasTabs = followedIndustries;

  const filteredData = useMemo(() => {
    if (rankType !== "atlas") return data;
    return ATLAS_ENTERPRISES.filter((item) => matchIndustryTrack(item.track, activeIndustry));
  }, [activeIndustry, data, rankType]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const currentItems = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleTabChange = (industry: string) => {
    setActiveIndustry(industry);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="fade-in space-y-5 pb-10">
      <Breadcrumb items={[{ label: meta.title }]} />

      <section className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-3.5 shadow-md shadow-slate-200/50 backdrop-blur-xl">
        <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${meta.barClass}`} />
        <div className="relative flex items-center gap-3">
          <span className={`text-[10px] font-bold tracking-[0.15em] bg-gradient-to-r ${meta.tagClass} text-white px-2.5 py-1 rounded-md shadow-sm`}>{meta.tag}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Icon size={14} />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">{meta.title}</h1>
            <p className="mt-0.5 truncate text-xs text-slate-400">{meta.subtitle}</p>
          </div>
        </div>
      </section>

      {rankType === "atlas" && (
        <section className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-md shadow-slate-200/50 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 text-xs font-semibold text-slate-400">关注行业</span>
            {atlasTabs.map((industry) => (
              <button
                key={industry}
                onClick={() => handleTabChange(industry)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
                  activeIndustry === industry
                    ? meta.activeTabClass
                    : `bg-white text-slate-500 border border-slate-200 ${meta.tabHoverClass}`
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className="divide-y divide-slate-100">
          {currentItems.length > 0 ? currentItems.map((item, index) => {
            const rank = (currentPage - 1) * PAGE_SIZE + index + 1;
            return (
              <Link
                key={item.id}
                to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}&rankType=${encodeURIComponent(rankType)}&rankTitle=${encodeURIComponent(meta.title)}`}
                className={`group/row flex items-center justify-between gap-4 p-4 transition-all hover:bg-gradient-to-r ${meta.hoverClass}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="flex h-6 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xs font-semibold text-slate-400 transition-all group-hover/row:bg-slate-100 group-hover/row:text-slate-600">
                    {rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-base font-semibold text-slate-700 transition-colors ${meta.textClass}`}>{item.name}</p>
                      {"code" in item && (
                        <span className={`flex-shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.tagPillClass}`}>{item.code}</span>
                      )}
                    </div>
                    {"track" in item && (
                      <div className="mt-1 flex items-center gap-1.5 overflow-hidden">
                        <span className={`min-w-0 truncate rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide ${meta.tagPillClass}`}>{item.track}</span>
                        <span className="flex-shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">{item.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className={`inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-all ${meta.pillClass}`}>
                    {"round" in item ? item.round : item.market}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{item.valuation}</p>
                </div>
                <ArrowUpRight size={16} className="hidden flex-shrink-0 text-slate-300 transition-transform group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-slate-500 md:block" />
              </Link>
            );
          }) : (
            <div className="p-10 text-center text-sm text-slate-400">当前关注行业暂无匹配企业</div>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between px-1 py-2 text-sm text-slate-400">
        <span>第 {currentPage} / {totalPages} 页</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft size={15} />
            上一页
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`h-7 w-7 rounded-lg text-xs font-semibold transition-all ${
                currentPage === index + 1
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-400 hover:text-blue-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-35"
          >
            下一页
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
