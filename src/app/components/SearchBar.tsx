import { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp, SearchCode } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  size?: "large" | "small";
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  size = "large",
  placeholder = "搜索行业或企业名称",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isLarge = size === "large";
  const heightClass = isLarge ? "h-[50px]" : "h-[40px]";
  const widthClass = isLarge ? "w-[80%] max-w-[800px]" : "w-[60%] max-w-[600px]";

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
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query, "industry"); // default to industry search for prototype
    }
  };

  return (
    <div className={`relative mx-auto ${widthClass}`} ref={containerRef}>
      <div
        className={`flex items-center bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden transition-all ${
          isFocused ? "ring-2 ring-blue-500/30 border-blue-400 shadow-md" : "hover:border-slate-300 hover:shadow-md"
        } ${heightClass}`}
      >
        <div className="pl-5 pr-2 text-slate-400">
          <Search size={isLarge ? 20 : 18} />
        </div>
        <input
          type="text"
          className={`flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 ${
            isLarge ? "text-base" : "text-sm"
          }`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyPress}
          autoFocus={autoFocus}
        />
        <button
          onClick={() => query.trim() && handleSearch(query, "industry")}
          className={`flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
            isLarge ? "px-6 h-full font-medium tracking-wide gap-2" : "w-12 h-full"
          }`}
        >
          {isLarge ? (
            <>
              <SearchCode size={18} />
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
              <div className="px-3 pt-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} />
                热门搜索
              </div>
              <ul className="space-y-1">
                {["新能源", "人工智能", "生物医药"].map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSearch(item, "industry")}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm cursor-pointer rounded-lg flex items-center justify-between group"
                  >
                    <span>{item} <span className="text-xs text-slate-400 ml-2 border border-slate-200 rounded px-1 group-hover:bg-white group-hover:border-slate-300">行业</span></span>
                    <TrendingUp size={14} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </li>
                ))}
              </ul>
              <div className="h-px bg-slate-100 my-2 mx-3"></div>
              <div className="px-3 pt-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} />
                历史搜索
              </div>
              <ul className="space-y-1 pb-2">
                {["宁德时代", "比亚迪"].map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSearch(item, "enterprise")}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm cursor-pointer rounded-lg flex items-center group"
                  >
                    <span>{item} <span className="text-xs text-slate-400 ml-2 border border-slate-200 rounded px-1 group-hover:bg-white group-hover:border-slate-300">企业</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
