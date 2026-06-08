import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Clock, TrendingUp, SearchCode, Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  size?: "large" | "small";
  placeholder?: string;
  autoFocus?: boolean;
}

type SearchResult = {
  name: string;
  type: "industry" | "enterprise";
  meta?: string;
};

const INDUSTRY_OPTIONS = ["新能源", "人工智能", "生物医药", "半导体", "低空经济", "量子计算", "消费电子", "云计算", "先进制造", "新材料", "物联网"];

const ENTERPRISE_OPTIONS = [
  { name: "新能源动力科技", meta: "新能源 · 动力电池" },
  { name: "新能源智造集团", meta: "新能源 · 智能制造" },
  { name: "华新能源材料", meta: "新能源 · 新材料" },
  { name: "智元机器人", meta: "人工智能 · 机器人" },
  { name: "寒武纪", meta: "人工智能 · AI芯片" },
  { name: "商汤科技", meta: "人工智能 · 计算机视觉" },
  { name: "星环科技", meta: "云计算 · 基础数据库" },
  { name: "中芯国际", meta: "半导体 · 晶圆制造" },
  { name: "壁仞科技", meta: "半导体 · AI推理芯片" },
  { name: "宁德时代", meta: "新能源 · 动力电池" },
  { name: "比亚迪", meta: "新能源 · 整车制造" },
  { name: "华大智造", meta: "生物医药 · 生命科学" },
  { name: "联影医疗", meta: "生物医药 · 医疗设备" },
  { name: "影石创新", meta: "消费电子 · 全景影像" },
  { name: "北方华创", meta: "半导体 · 设备" },
];

export default function SearchBar({
  size = "large",
  placeholder = "搜索产业或企业名称",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isLarge = size === "large";
  const heightClass = isLarge ? "h-[58px]" : "h-[40px]";
  const widthClass = isLarge ? "w-[84%] max-w-[900px]" : "w-[60%] max-w-[600px]";
  const trimmedQuery = query.trim();

  const liveResults = useMemo<SearchResult[]>(() => {
    if (!trimmedQuery) return [];

    const industryMatches = INDUSTRY_OPTIONS
      .filter((item) => item.includes(trimmedQuery))
      .map((name) => ({ name, type: "industry" as const }));

    const enterpriseMatches = ENTERPRISE_OPTIONS
      .filter((item) => item.name.includes(trimmedQuery) || item.meta.includes(trimmedQuery))
      .map((item) => ({ name: item.name, type: "enterprise" as const }));

    return [...industryMatches, ...enterpriseMatches].slice(0, 8);
  }, [trimmedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (item: string, type: "industry" | "enterprise") => {
    setIsFocused(false);
    if (type === "industry") {
      navigate(`/industry/${encodeURIComponent(item)}?industryName=${encodeURIComponent(item)}`);
    } else {
      navigate(`/enterprise/${encodeURIComponent(item)}?enterpriseName=${encodeURIComponent(item)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && trimmedQuery) {
      const firstResult = liveResults[0];
      if (firstResult) {
        handleSearch(firstResult.name, firstResult.type);
      } else {
        handleSearch(trimmedQuery, "industry");
      }
    }
  };

  const renderResult = (item: SearchResult) => (
    <li
      key={`${item.type}-${item.name}`}
      onClick={() => handleSearch(item.name, item.type)}
      className="px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm cursor-pointer rounded-lg flex items-center justify-between group"
    >
      <span className="min-w-0 flex items-center gap-2">
        {item.type === "industry" ? <TrendingUp size={14} className="text-blue-500 flex-shrink-0" /> : <Building2 size={14} className="text-slate-400 flex-shrink-0" />}
        <span className="truncate font-medium">{item.name}</span>
        <span className={`text-xs ml-1 border rounded px-1.5 py-0.5 flex-shrink-0 ${
          item.type === "industry"
            ? "text-blue-600 bg-blue-50 border-blue-200"
            : "text-slate-400 border-slate-200 group-hover:bg-white group-hover:border-slate-300"
        }`}>
          {item.type === "industry" ? "产业" : "企业"}
        </span>
      </span>
    </li>
  );

  return (
    <div className={`relative mx-auto ${widthClass}`} ref={containerRef}>
      <div
        className={`flex items-center bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden transition-all ${
          isFocused ? "ring-2 ring-blue-500/30 border-blue-400 shadow-md" : "hover:border-slate-300 hover:shadow-md"
        } ${heightClass}`}
      >
        <div className="pl-6 pr-3 text-slate-400">
          <Search size={isLarge ? 22 : 18} />
        </div>
        <input
          type="text"
          className={`flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 ${
            isLarge ? "text-lg" : "text-sm"
          }`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyPress}
          autoFocus={autoFocus}
        />
        <button
          onClick={() => {
            const firstResult = liveResults[0];
            if (firstResult) {
              handleSearch(firstResult.name, firstResult.type);
            } else if (trimmedQuery) {
              handleSearch(trimmedQuery, "industry");
            }
          }}
          className={`flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
            isLarge ? "px-8 h-full font-medium tracking-wide gap-2.5 text-base" : "w-12 h-full"
          }`}
        >
          {isLarge ? (
            <>
              <SearchCode size={20} />
              搜索
            </>
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 mt-2 z-50 overflow-hidden"
          >
            <div className="p-2">
              {trimmedQuery ? (
                <>
                  <div className="px-3 pt-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Search size={14} />
                    搜索结果
                  </div>
                  <ul className="space-y-1 pb-2">
                    {liveResults.length > 0 ? liveResults.map(renderResult) : (
                      <li className="px-4 py-3 text-sm text-slate-400">暂无匹配结果</li>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <div className="px-3 pt-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    热门搜索
                  </div>
                  <ul className="space-y-1">
                    {["新能源", "人工智能", "生物医药"].map((item) => renderResult({ name: item, type: "industry" }))}
                  </ul>
                  <div className="h-px bg-slate-100 my-2 mx-3"></div>
                  <div className="px-3 pt-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} />
                    历史搜索
                  </div>
                  <ul className="space-y-1 pb-2">
                    {["宁德时代", "比亚迪"].map((item) => renderResult({ name: item, type: "enterprise" }))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
