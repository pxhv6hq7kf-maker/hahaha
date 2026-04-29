import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Star, ChevronDown, Filter, ArrowUpRight, Search, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SIGNALS = [
  { id: 1, name: "宁德时代", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "发布Q3财报，净利润同比增长15%", type: "利好", typeColor: "text-green-700 bg-green-100 border-green-200", date: "今天 10:30" },
  { id: 2, name: "中芯国际", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "高管人事变动公告", type: "中性", typeColor: "text-blue-700 bg-blue-100 border-blue-200", date: "今天 09:15" },
  { id: 3, name: "寒武纪", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "新一代AI芯片量产存在延迟风险", type: "风险", typeColor: "text-rose-700 bg-rose-100 border-rose-200", date: "昨天 16:45" },
  { id: 4, name: "比亚迪", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "中标欧洲1000辆新能源大巴订单", type: "利好", typeColor: "text-green-700 bg-green-100 border-green-200", date: "昨天 14:20" },
  { id: 5, name: "恒瑞医药", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "创新药临床三期数据优异", type: "利好", typeColor: "text-green-700 bg-green-100 border-green-200", date: "2天前" },
  { id: 6, name: "药明康德", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "海外业务收入占比持续提升", type: "利好", typeColor: "text-green-700 bg-green-100 border-green-200", date: "2天前" },
  { id: 7, name: "大疆创新", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "发布新款消费级无人机产品", type: "中性", typeColor: "text-blue-700 bg-blue-100 border-blue-200", date: "3天前" },
  { id: 8, name: "北方华创", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80", signal: "半导体设备订单交付周期延长", type: "风险", typeColor: "text-rose-700 bg-rose-100 border-rose-200", date: "上周" },
];

export default function FollowEnterprise() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("signalType") || "全部";
  
  const [activeFilter, setActiveFilter] = useState(initialType);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSignals = SIGNALS.filter(signal => {
    const matchesFilter = activeFilter === "全部" || signal.type === activeFilter;
    const matchesSearch = signal.name.includes(searchQuery) || signal.signal.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* Header Actions */}
      <section className="flex items-center justify-between pt-4 pb-2">
        <Link 
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">返回首页</span>
        </Link>
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-[60%] relative">
             <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-200 overflow-hidden h-[40px] focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
                <div className="pl-4 pr-2 text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm"
                  placeholder="在关注列表中搜索企业/信号"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
        </div>
        <div className="w-[114px]"></div> {/* Spacer for balance */}
      </section>

      {/* Main Content */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[60vh] flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4 relative">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-200 shadow-sm">
                <Star size={20} fill="currentColor" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  关注企业·信号列表
                  <span className="text-xs font-normal px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">共 {SIGNALS.length} 家</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">实时追踪您关注企业的最新动态与核心信号</p>
             </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-lg border border-slate-200 transition-colors font-medium shadow-sm"
            >
              <Filter size={16} className="text-slate-400" />
              {activeFilter}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-20"
                >
                  {["全部", "利好", "风险", "中性"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                        activeFilter === filter ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start">
          {filteredSignals.length > 0 ? filteredSignals.map((signal) => (
            <Link 
              key={signal.id} 
              to={`/enterprise/${encodeURIComponent(signal.id)}?enterpriseName=${encodeURIComponent(signal.name)}`}
              className="flex flex-col p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-blue-400 transition-all opacity-0 group-hover:opacity-100"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={signal.logo} alt={signal.name} className="w-12 h-12 rounded-xl border border-slate-100 object-cover shadow-sm bg-white" />
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-[15px]">{signal.name}</h4>
                    <span className="text-xs text-slate-400 mt-0.5 block">{signal.date}</span>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-md border font-medium tracking-wide shadow-sm ${signal.typeColor}`}>
                  {signal.type}
                </span>
              </div>
              
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/50 flex-1">
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                  {signal.signal}
                </p>
              </div>
              
              <div className="mt-4 flex justify-end items-center border-t border-slate-50 pt-3">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                  查看企业情报 <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                 <Activity size={28} className="opacity-40" />
              </div>
              <p className="text-[15px] font-medium">未找到符合条件的信号记录</p>
              <button 
                onClick={() => { setActiveFilter("全部"); setSearchQuery(""); }}
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
              >
                清除筛选条件
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
