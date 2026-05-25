import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { Star, ChevronDown, ChevronUp, FileText, Briefcase, Building2, ShieldAlert, LineChart, Globe, Search, ArrowLeft, TrendingUp, BookmarkPlus } from "lucide-react";
import SearchBar from "../components/SearchBar";
import GenerationProgress from "../components/GenerationProgress";
import Breadcrumb from "../components/Breadcrumb";
import { motion, AnimatePresence } from "motion/react";

const DYNAMICS = [
  { id: 1, date: "2024-05-20", time: "14:30", type: "投融资", typeColor: "bg-blue-100 text-blue-700 border-blue-200", title: "完成C轮融资，估值超百亿", content: "由知名投资机构领投，主要用于下一代核心技术研发和全球市场拓展布局。本次融资将大幅提升公司的行业竞争力。" },
  { id: 2, date: "2024-05-18", time: "09:15", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "发布2023年度企业社会责任报告", content: "报告详细阐述了过去一年在绿色发展、科技创新、员工关怀等方面的举措与成效，彰显企业担当。" },
  { id: 3, date: "2024-05-15", time: "16:40", type: "人事", typeColor: "bg-purple-100 text-purple-700 border-purple-200", title: "核心高管团队调整，新任CTO履新", content: "前业内知名技术专家正式加入，担任首席技术官，将主导新一代AI产品线的技术架构升级。" },
  { id: 4, date: "2024-05-10", time: "11:20", type: "舆情", typeColor: "bg-orange-100 text-orange-700 border-orange-200", title: "被多家权威媒体评为年度创新企业", content: "凭借在细分赛道的优异表现，荣登年度科技创新先锋榜单，品牌声誉进一步提升。" },
  { id: 5, date: "2024-05-05", time: "10:00", type: "公告", typeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", title: "第一季度营收同比增长45%", content: "得益于核心产品市场占有率提升及海外市场开拓，Q1实现营收大幅增长，超市场预期。" },
];

const getSECTIONS = (enterpriseName: string) => [
  {
    id: "investment_conclusion",
    title: "投资结论与评级",
    icon: <LineChart size={16} />,
    content: (
      <div className="space-y-5">
        {/* 1.1 投资摘要 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1.1</span>
            <h4 className="font-bold text-slate-800 text-sm">投资摘要</h4>
          </div>
          <div className="pl-7 text-sm text-slate-600 leading-relaxed bg-slate-50/60 rounded-xl p-3.5 border border-slate-100">
            {enterpriseName}是一家位于<strong className="text-slate-800">上海</strong>的<strong className="text-slate-800">AI推理芯片</strong>企业，当前处于<strong className="text-slate-800">C轮扩张</strong>阶段。核心技术为<strong className="text-slate-800">自研GPGPU架构</strong>，关键技术参数<strong className="text-emerald-700">FP16算力达到行业领先水平</strong>。该赛道处于<strong className="text-slate-800">资本热度上升期</strong>，国家<strong className="text-amber-700">重点战略扶持</strong>，国内与国际技术代差<strong className="text-slate-800">1-2代</strong>，企业处于<strong className="text-blue-700">国内第一梯队</strong>。综合评级：<strong className="text-rose-600">AA</strong>。核心亮点：国产替代空间巨大，头部客户订单饱满。核心风险：流片良率不确定性，美国高端算力制裁。
          </div>
        </div>

        {/* 1.2 评级结论 */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1.2</span>
            <h4 className="font-bold text-slate-800 text-sm">评级结论</h4>
          </div>
          <div className="pl-7 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">综合评级</span>
              <div className="flex gap-1 items-center">
                {["AAA", "AA", "A", "BBB", "BB", "D"].map((r) => (
                  <span 
                    key={r} 
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      r === "AA" 
                        ? "w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-2xl shadow-md shadow-amber-200 flex items-center justify-center" 
                        : "text-[10px] bg-slate-50 text-slate-400"
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-100">
                <div className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  关键支撑因子
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. 国产GPU替代确定性极强，国内客户采购优先级大幅前移<br/>
                  2. 已实现量产交付，商业化进度领先国内同梯队企业
                </p>
              </div>
              <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-100">
                <div className="text-xs font-semibold text-rose-700 mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  关键抑制因子
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. 芯片制程受制裁影响，先进工艺流片渠道不确定性高<br/>
                  2. 英伟达国内降价倾销，中低端产品面临价格战
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1.3 企业概况速览 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1.3</span>
            <h4 className="font-bold text-slate-800 text-sm">企业概况速览</h4>
          </div>
          
          {/* 企业基本介绍 */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">企业基本介绍</p>
            <p className="text-sm text-slate-600 leading-relaxed">成立于2018年，国内领先的通用GPU芯片设计公司，2025年度实现营业收入128.5亿元，同比增长32.7%，近三年营收复合增长率达28.5%</p>
          </div>

          {/* 核心业务介绍 */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">核心业务介绍</p>
            <p className="text-sm text-slate-600 leading-relaxed">AI训练与推理GPU芯片、GPU计算集群、行业软硬一体解决方案，产品覆盖数据中心、智算中心、自动驾驶三大场景</p>
          </div>

          {/* 硬科技介绍 */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">硬科技介绍</p>
            <p className="text-sm text-slate-600 leading-relaxed">自研BR100系列通用计算GPU，累计申请发明专利超800项，算力密度达到国际同代产品的90%以上，生态兼容CUDA代码迁移率95%</p>
          </div>

          {/* 赛道地位 */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">赛道地位</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold mr-2">
                Top3
              </span>
              国内GPU芯片设计厂商第一梯队，市场份额约12%
            </p>
          </div>
        </div>
      </div>
    ),
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
  const industryName = searchParams.get("industryName");
  const cityName = searchParams.get("cityName");
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

  // 收藏功能
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favorites: string[] = JSON.parse(localStorage.getItem("favorite_enterprises") || "[]");
    setIsFavorited(favorites.includes(enterpriseId || ""));
  }, [enterpriseId]);

  const toggleFavorite = () => {
    const favorites: string[] = JSON.parse(localStorage.getItem("favorite_enterprises") || "[]");
    if (isFavorited) {
      const next = favorites.filter(id => id !== enterpriseId);
      localStorage.setItem("favorite_enterprises", JSON.stringify(next));
      setIsFavorited(false);
    } else {
      favorites.push(enterpriseId || "");
      localStorage.setItem("favorite_enterprises", JSON.stringify(favorites));
      setIsFavorited(true);
    }
  };

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
        <div className="absolute left-0">
          <Breadcrumb items={
            cityName
              ? [
                  { label: cityName, to: `/city/${encodeURIComponent(cityName)}?cityName=${encodeURIComponent(cityName)}` },
                  {
                    label: industryName as string,
                    to: `/industry/${encodeURIComponent(industryName as string)}?industryName=${encodeURIComponent(industryName as string)}&cityName=${encodeURIComponent(cityName)}`,
                  },
                  { label: enterpriseName }
                ]
              : industryName
              ? [
                  { label: industryName as string, to: `/industry/${encodeURIComponent(industryName as string)}?industryName=${encodeURIComponent(industryName as string)}` },
                  { label: enterpriseName }
                ]
              : [{ label: enterpriseName }]
          } />
        </div>
        <div className="w-full max-w-[60%]">
          <SearchBar size="small" placeholder="搜索行业/企业" />
        </div>
      </section>

      {/* 核心内容双列布局 */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 2. 核心区域 1：企业结构化摘要 (占页面2/3) */}
        <section className="flex-[2] flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="px-6 pt-6 pb-6">
                <div className="flex items-end gap-5 justify-between">
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
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isFavorited
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {isFavorited ? (
                      <Star size={16} fill="white" />
                    ) : (
                      <BookmarkPlus size={16} />
                    )}
                    {isFavorited ? "已收藏" : "收藏"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-50/50">
              {getSECTIONS(enterpriseName).map((section) => {
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
                            {section.content ? (
                              section.content
                            ) : section.id === "valuation" ? (
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
                to={`/report/R-${enterpriseId}?enterpriseId=${enterpriseId}&enterpriseName=${encodeURIComponent(enterpriseName)}${searchParams.get("industryName") ? `&industryName=${encodeURIComponent(searchParams.get("industryName") as string)}` : ""}`}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-md font-medium text-sm"
              >
                <FileText size={16} />
                查看完整版研报
              </Link>
            </div>
          </div>
        </section>

        {/* 3. 核心区域 2：推荐企业 + 最新企业动态 (占页面1/3) */}
        <section className="flex-[1] flex flex-col gap-4">
          {/* Recommended Enterprises */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                你可能感兴趣的企业
              </h2>
              <Link to="/home" className="text-xs text-blue-600 hover:text-blue-700 font-medium">查看更多</Link>
            </div>
            <div className="space-y-2.5">
              {[
                { id: "1", name: "宁德时代", industry: "新能源", city: "福建宁德", round: "上市", valuation: "1.2万亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
                { id: "2", name: "比亚迪", industry: "新能源", city: "广东深圳", round: "上市", valuation: "8700亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
                { id: "3", name: "中芯国际", industry: "半导体", city: "上海", round: "上市", valuation: "4200亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
                { id: "4", name: "寒武纪", industry: "人工智能", city: "北京", round: "上市", valuation: "580亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
                { id: "5", name: "恒瑞医药", industry: "生物医药", city: "江苏连云港", round: "上市", valuation: "2700亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
                { id: "6", name: "大疆创新", industry: "智能制造", city: "广东深圳", round: "Pre-IPO", valuation: "1600亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
              ].map((ent) => (
                <Link
                  key={ent.id}
                  to={`/enterprise/${encodeURIComponent(ent.id)}?enterpriseName=${encodeURIComponent(ent.name)}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-slate-100 hover:border-blue-100"
                >
                  <img src={ent.logo} alt={ent.name} className="w-10 h-10 rounded-full border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 truncate">{ent.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{ent.industry}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">{ent.city}</span>
                      <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">{ent.round}</span>
                      <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{ent.valuation}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Enterprise News */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
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
