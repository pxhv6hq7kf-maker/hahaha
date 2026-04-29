import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { Star, ChevronDown, ChevronUp, FileText, Briefcase, Building2, ShieldAlert, LineChart, Globe, MapPin, Search, ArrowLeft, Users, TrendingUp, Leaf } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { motion, AnimatePresence } from "motion/react";

const DYNAMICS = [
  { id: 1, date: "2024-05-20", time: "14:30", type: "投融资", typeColor: "bg-blue-100 text-blue-700 border-blue-200", title: "完成C轮融资，估值超百亿", content: "由知名投资机构领投，主要用于下一代核心技术研发和全球市场拓展布局。本次融资将大幅提升公司的行业竞争力。" },
  { id: 2, date: "2024-05-18", time: "09:15", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "发布2023年度企业社会责任报告", content: "报告详细阐述了过去一年在绿色发展、科技创新、员工关怀等方面的举措与成效，彰显企业担当。" },
  { id: 3, date: "2024-05-15", time: "16:40", type: "人事", typeColor: "bg-purple-100 text-purple-700 border-purple-200", title: "核心高管团队调整，新任CTO履新", content: "前业内知名技术专家正式加入，担任首席技术官，将主导新一代AI产品线的技术架构升级。" },
  { id: 4, date: "2024-05-10", time: "11:20", type: "舆情", typeColor: "bg-orange-100 text-orange-700 border-orange-200", title: "被多家权威媒体评为年度创新企业", content: "凭借在细分赛道的优异表现，荣登年度科技创新先锋榜单，品牌声誉进一步提升。" },
  { id: 5, date: "2024-05-05", time: "10:00", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "第一季度营收同比增长45%", content: "得益于核心产品市场占有率提升及海外市场开拓，Q1实现营收大幅增长，超市场预期。" },
];

const SECTIONS = [
  { id: "intro", title: "企业简介", icon: <Building2 size={16} />, content: "成立于2015年，是国内领先的科技创新企业，专注于为行业提供数字化、智能化的全栈解决方案。目前已服务超过千家头部客户，在业界享有较高的品牌知名度。" },
  { id: "talent", title: "人才团队建设分析", icon: <Users size={16} />, content: "企业核心管理层多毕业于国内外知名高校，具备丰富的行业经验。研发人员占比超过40%，其中硕士及以上学历占60%以上。近两年核心人才流失率控制在5%以内，团队稳定性较好。已建立完善的人才培养体系和股权激励机制。" },
  { id: "market", title: "产业与市场布局分析", icon: <MapPin size={16} />, content: "国内市场以长三角、珠三角、京津冀为核心区域，市场份额约35%；海外业务拓展至东南亚、欧洲等地区，海外营收占比约15%。在智能制造赛道中位居第一梯队，与多家行业龙头建立深度合作关系。" },
  { id: "growth", title: "成长动能预测分析", icon: <TrendingUp size={16} />, content: "过去三年营收复合增长率超过30%，预计未来两年仍将保持25%以上增速。产品线持续扩展，技术壁垒不断强化。随着行业数字化转型加速，公司有望进入新一轮高速发展期。" },
  { id: "sustainability", title: "经营可持续性分析", icon: <Leaf size={16} />, content: "主营业务毛利率维持在45%左右，现金流状况良好，资产负债率处于健康水平。供应链体系成熟稳定，客户集中度适中。ESG评级持续提升，在绿色制造方面走在行业前列。" },
  { id: "conclusion", title: "综合评估结论风险提示", icon: <ShieldAlert size={16} />, content: "综合评估：该企业具备较强的技术创新能力和市场竞争力，成长空间可观。风险提示：1. 行业竞争加剧可能导致价格战；2. 核心技术人才流失风险；3. 宏观经济波动可能影响下游需求；4. 国际贸易摩擦可能影响海外业务拓展。建议持续关注行业动态及公司经营状况。" },
];

export default function Enterprise() {
  const { enterpriseId } = useParams();
  const [searchParams] = useSearchParams();
  const enterpriseName = searchParams.get("enterpriseName") || decodeURIComponent(enterpriseId || "未知企业");
  const fromIndustry = searchParams.get("fromIndustry");
  
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("全部");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredDynamics = activeFilter === "全部" 
    ? DYNAMICS 
    : DYNAMICS.filter(d => d.type === activeFilter);

  return (
    
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 1. 顶部区域：返回首页按钮 + 缩小版搜索框 */}
      <section className="pt-4 pb-2 flex items-center justify-center relative">
        <Link
          to="/home"
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors font-medium whitespace-nowrap absolute left-0"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
        <div className="w-full max-w-[60%]">
          <SearchBar size="small" placeholder="搜索行业/企业" />
        </div>
      </section>

      {/* 核心内容双列布局 */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 2. 核心区域 1：企业结构化摘要 (占页面2/5, roughly translated to flex-1 in a 2-col flex layout) */}
        <section className="flex-[5] flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="px-6 pt-6 pb-6">
                <div className="flex items-end gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&h=128&fit=crop&q=80" alt="logo" className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    {enterpriseName}
                    <span className="text-xs font-normal px-2 py-0.5 bg-white/20 text-white rounded-md flex items-center gap-1"><LineChart size={12}/> 高新技术</span>
                  </h1>
                    <p className="text-sm text-blue-100 mt-1 flex items-center gap-2">
                      代码：688*** | 行业：{fromIndustry ? (
                        <Link to={`/industry/${fromIndustry}`} className="text-white/90 hover:underline">返回所属行业</Link>
                      ) : "先进制造"} | 成立日期：2015-08-12
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-50/50">
              {SECTIONS.map((section) => {
                const isCollapsed = collapsedSections.includes(section.id);
                return (
                  <div key={section.id} className="mb-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
                        <span className="text-blue-600">{section.icon}</span>
                        {section.title}
                      </h3>
                      {isCollapsed ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50/50 mt-1">
                            {section.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
              <Link 
                to={`/report/R-${enterpriseId}?enterpriseId=${enterpriseId}`}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-md font-medium text-sm"
              >
                <FileText size={16} />
                查看完整版研报
              </Link>
            </div>
          </div>
        </section>

        {/* 3. 核心区域 2：最新企业动态 (占页面2/5) */}
        <section className="flex-[4] flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 h-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 relative">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                最新企业动态
              </h2>

              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 transition-colors font-medium"
                >
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
                      {["全部", "公告", "投融资", "舆情", "人事"].map((filter) => (
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

            {/* Timeline */}
            <div className="relative pl-4 border-l-2 border-slate-100 ml-3 space-y-8">
              {filteredDynamics.length > 0 ? filteredDynamics.map((item, index) => (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[23px] top-1 w-3 h-3 bg-white border-2 border-blue-400 rounded-full group-hover:border-blue-600 group-hover:bg-blue-50 transition-colors z-10 shadow-sm"></div>
                  
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md tracking-wide">
                      {item.date} <span className="text-slate-400 font-normal ml-1">{item.time}</span>
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${item.typeColor}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all cursor-pointer">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <Search size={32} className="opacity-20" />
                  <p>暂无相关类型动态</p>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
