import { useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { Star, ChevronDown, ChevronUp, FileText, Briefcase, Building2, ShieldAlert, LineChart, Globe, Search, ArrowLeft, TrendingUp } from "lucide-react";
import SearchBar from "../components/SearchBar";
import GenerationProgress from "../components/GenerationProgress";
import { motion, AnimatePresence } from "motion/react";

const DYNAMICS = [
  { id: 1, date: "2024-05-20", time: "14:30", type: "投融资", typeColor: "bg-blue-100 text-blue-700 border-blue-200", title: "完成C轮融资，估值超百亿", content: "由知名投资机构领投，主要用于下一代核心技术研发和全球市场拓展布局。本次融资将大幅提升公司的行业竞争力。" },
  { id: 2, date: "2024-05-18", time: "09:15", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "发布2023年度企业社会责任报告", content: "报告详细阐述了过去一年在绿色发展、科技创新、员工关怀等方面的举措与成效，彰显企业担当。" },
  { id: 3, date: "2024-05-15", time: "16:40", type: "人事", typeColor: "bg-purple-100 text-purple-700 border-purple-200", title: "核心高管团队调整，新任CTO履新", content: "前业内知名技术专家正式加入，担任首席技术官，将主导新一代AI产品线的技术架构升级。" },
  { id: 4, date: "2024-05-10", time: "11:20", type: "舆情", typeColor: "bg-orange-100 text-orange-700 border-orange-200", title: "被多家权威媒体评为年度创新企业", content: "凭借在细分赛道的优异表现，荣登年度科技创新先锋榜单，品牌声誉进一步提升。" },
  { id: 5, date: "2024-05-05", time: "10:00", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "第一季度营收同比增长45%", content: "得益于核心产品市场占有率提升及海外市场开拓，Q1实现营收大幅增长，超市场预期。" },
];

const SECTIONS = [
  {
    id: "intro",
    title: "企业基本介绍",
    icon: <Building2 size={16} />,
    lines: [
      "成立于2015年，是国内领先的科技创新企业，专注于为行业提供数字化、智能化的全栈解决方案",
      "目前已服务超过千家头部客户，在业界享有较高的品牌知名度",
      "2025年度实现营业收入128.5亿元，同比增长32.7%，其中主营业务收入占比96.2%",
      "近三年营收复合增长率达28.5%，呈持续上升态势",
    ]
  },
  {
    id: "business",
    title: "核心业务介绍",
    icon: <Briefcase size={16} />,
    lines: [
      "核心业务涵盖三大板块，形成云管端协同闭环，客户生命周期价值持续增长",
      "智能硬件研发与制造——营收占比42%，毛利率38%，面向工业和消费场景的智能终端产品，拥有核心专利超300项",
      "行业SaaS解决方案——营收占比35%，毛利率62%，为金融、医疗、制造等行业提供垂直云服务，客户续约率92%",
      "数据分析与增值服务——营收占比23%，毛利率55%，基于海量数据资产提供智能决策支持，ARPU值连续三年提升",
    ]
  },
  {
    id: "projects",
    title: "近期项目介绍",
    icon: <Globe size={16} />,
    lines: [
      "新一代AI推理芯片项目——已进入流片阶段，预计2026Q4实现小批量交付，目标推理性能较上代提升3倍，已获得3家头部客户预订单",
      "东南亚市场拓展计划——已在新加坡设立区域总部，与当地2家运营商达成战略合作，预计2026年海外营收占比提升至20%",
      "智慧医疗平台2.0——中标3个省级医保平台项目，合同金额超5亿元，进入规模化部署阶段",
      "固态电池检测设备——与宁德时代签订独家供应协议，首批设备已交付验收",
      "工业互联网安全平台——获工信部试点示范项目认定，已在8家大型制造企业落地",
    ]
  },
  {
    id: "valuation",
    title: "盈利预测与估值",
    icon: <TrendingUp size={16} />,
    lines: [
      "【投资评级：增持】未来6-12个月投资收益率预计领先市场基准指数",
      "2026年预测：营收170亿元（+32%），归母净利润22亿元（+38%），EPS 1.83元",
      "2027年预测：营收215亿元（+26%），归母净利润30亿元（+36%），EPS 2.50元",
      "2028年预测：营收265亿元（+23%），归母净利润39亿元（+30%），EPS 3.25元",
      "核心假设：智能硬件业务增速25%，SaaS业务增速40%，数据服务增速30%",
      "估值参考：当前PE 35x，低于可比公司均值42x；PS 6.8x，处于行业中枢偏下",
      "若2025年业绩兑现，按30x PE估算目标价约75-85元，较当前价有约20%-35%上行空间",
    ]
  },
  {
    id: "risk",
    title: "风险提示",
    icon: <ShieldAlert size={16} />,
    lines: [
      "行业竞争加剧风险——头部互联网企业加速布局行业SaaS，可能导致价格战和毛利率承压",
      "技术路线风险——AI芯片项目尚在流片阶段，量产良率和交付节奏存在不确定性",
      "客户集中度风险——前5大客户营收占比约38%，大客户需求波动可能影响业绩稳定性",
      "人才流失风险——核心技术团队3人近期减持，需关注团队稳定性",
      "地缘政治风险——海外业务拓展可能受国际贸易摩擦影响",
    ]
  },
];

export default function Enterprise() {
  const { enterpriseId } = useParams();
  const [searchParams] = useSearchParams();
  const enterpriseName = searchParams.get("enterpriseName") || decodeURIComponent(enterpriseId || "未知企业");
  const fromIndustry = searchParams.get("fromIndustry");

  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("全部");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Generation progress flow: check localStorage for cached result
  const hasCache = !!localStorage.getItem(`enterprise_result_${enterpriseId}`);
  const [isGenerating, setIsGenerating] = useState(!hasCache);

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating(false);
  }, []);

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
      {/* Generation Progress Mode */}
      {isGenerating && (
        <GenerationProgress
          enterpriseName={enterpriseName}
          enterpriseId={enterpriseId || ""}
          onComplete={handleGenerationComplete}
        />
      )}

      {/* Full Content Mode (after generation or cached) */}
      {!isGenerating && (
      <>
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
                          <div className="px-4 pb-4 pt-2 text-sm leading-relaxed border-t border-slate-50 mt-1">
                            {section.id === "valuation" ? (
                              <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-semibold text-[13px]">
                                  <TrendingUp size={14} />
                                  增持
                                  <span className="text-emerald-500 font-normal ml-1">未来6-12个月收益率领先市场基准</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { year: "2026E", rev: "170亿", revY: "+32%", np: "22亿", npY: "+38%", eps: "1.83" },
                                    { year: "2027E", rev: "215亿", revY: "+26%", np: "30亿", npY: "+36%", eps: "2.50" },
                                    { year: "2028E", rev: "265亿", revY: "+23%", np: "39亿", npY: "+30%", eps: "3.25" },
                                  ].map((y) => (
                                    <div key={y.year} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                      <div className="text-xs font-bold text-blue-600 mb-2">{y.year}</div>
                                      <div className="space-y-1 text-xs text-slate-600">
                                        <div>营收 <span className="font-semibold text-slate-800">{y.rev}</span> <span className="text-emerald-600">{y.revY}</span></div>
                                        <div>净利 <span className="font-semibold text-slate-800">{y.np}</span> <span className="text-emerald-600">{y.npY}</span></div>
                                        <div>EPS <span className="font-semibold text-slate-800">{y.eps}</span></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {section.lines.slice(4).map((line, i) => (
                                  <p key={i} className="text-slate-500 text-xs flex items-start gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></span>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            ) : section.id === "risk" ? (
                              <div className="space-y-2">
                                {section.lines.map((line, i) => (
                                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-50/50 border border-rose-100/60">
                                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    <p className="text-slate-700 text-[13px]">{line}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {section.lines.map((line, i) => (
                                  <div key={i} className="flex items-start gap-2.5 py-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                                    <p className="text-slate-600 text-[13px]">{line}</p>
                                  </div>
                                ))}
                              </div>
                            )}
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
      </>
      )}
    </div>
  );
}
