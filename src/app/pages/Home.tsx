import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight, Flame, ChevronLeft, ChevronRight as IconRight, Sparkles, TrendingUp, Compass, ArrowUpRight, MapPin } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { motion } from "motion/react";
import { CITIES } from "../data/cities";

const INDUSTRIES = ["新能源", "人工智能", "生物医药", "半导体", "低空经济", "量子计算", "消费电子", "云计算", "先进制造", "新材料", "物联网"];

const INDUSTRY_CHAIN_STAGES: Record<string, { phase: string; stages: string[] }[]> = {
  "新能源": [
    { phase: "上游", stages: ["锂矿资源", "钴镍材料", "电解液", "隔膜"] },
    { phase: "中游", stages: ["动力电池", "储能系统", "电控系统", "电机"] },
    { phase: "下游", stages: ["整车制造", "充电桩", "电池回收", "运维服务"] },
  ],
  "人工智能": [
    { phase: "上游", stages: ["算力芯片", "数据标注", "AI框架", "传感器"] },
    { phase: "中游", stages: ["大模型训练", "计算机视觉", "NLP", "语音识别"] },
    { phase: "下游", stages: ["智能驾驶", "智慧医疗", "智慧金融", "AIGC"] },
  ],
  "生物医药": [
    { phase: "上游", stages: ["原料药", "培养基", "实验耗材", "科研仪器"] },
    { phase: "中游", stages: ["创新药研发", "CXO服务", "生物类似药", "基因治疗"] },
    { phase: "下游", stages: ["医院终端", "零售药房", "互联网医疗", "医保支付"] },
  ],
  "半导体": [
    { phase: "上游", stages: ["硅片", "光刻胶", "特气", "EDA工具"] },
    { phase: "中游", stages: ["IC设计", "晶圆制造", "封装测试", "掩模版"] },
    { phase: "下游", stages: ["消费电子", "汽车电子", "通信设备", "工业控制"] },
  ],
  "低空经济": [
    { phase: "上游", stages: ["碳纤维材料", "电机电控", "电池系统", "传感器"] },
    { phase: "中游", stages: ["eVTOL制造", "无人机整机", "飞行控制系统", "通信导航"] },
    { phase: "下游", stages: ["物流配送", "空中出行", "巡检监测", "文旅体验"] },
  ],
  "量子计算": [
    { phase: "上游", stages: ["超导材料", "低温设备", "激光器", "微波控制"] },
    { phase: "中游", stages: ["量子芯片", "量子测控", "量子软件", "量子云平台"] },
    { phase: "下游", stages: ["金融建模", "药物研发", "密码安全", "材料模拟"] },
  ],
  "消费电子": [
    { phase: "上游", stages: ["显示面板", "芯片组", "电池", "结构件"] },
    { phase: "中游", stages: ["手机ODM", "笔电制造", "可穿戴设备", "智能音箱"] },
    { phase: "下游", stages: ["品牌零售", "电商平台", "售后服务", "内容生态"] },
  ],
  "云计算": [
    { phase: "上游", stages: ["服务器", "网络设备", "IDC机房", "光模块"] },
    { phase: "中游", stages: ["IaaS平台", "PaaS平台", "容器服务", "数据库"] },
    { phase: "下游", stages: ["SaaS应用", "行业解决方案", "云安全", "云运维"] },
  ],
  "先进制造": [
    { phase: "上游", stages: ["工业机器人", "数控系统", "精密刀具", "传感器"] },
    { phase: "中游", stages: ["智能产线", "柔性制造", "3D打印", "数字孪生"] },
    { phase: "下游", stages: ["汽车制造", "航空航天", "3C电子", "新能源装备"] },
  ],
  "新材料": [
    { phase: "上游", stages: ["矿产原料", "化工原料", "前驱体", "辅助材料"] },
    { phase: "中游", stages: ["先进陶瓷", "高性能纤维", "特种合金", "纳米材料"] },
    { phase: "下游", stages: ["航空航天", "新能源", "电子信息", "生物医药"] },
  ],
  "物联网": [
    { phase: "上游", stages: ["传感器", "MCU芯片", "通信模组", "RFID"] },
    { phase: "中游", stages: ["边缘计算", "物联网平台", "网络运营", "系统集成"] },
    { phase: "下游", stages: ["智能家居", "智慧城市", "工业物联网", "车联网"] },
  ],
};

// NEXT50 成长潜力榜
const NEXT50_ENTERPRISES = [
  { id: 1, name: "摩尔线程", round: "B+轮", valuation: "320亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 2, name: "智元机器人", round: "A+轮", valuation: "100亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 3, name: "宇树科技", round: "B轮", valuation: "75亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 4, name: "星纪魅族", round: "B轮", valuation: "150亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 5, name: "黑芝麻智能", round: "C轮", valuation: "210亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 6, name: "追觅科技", round: "C轮", valuation: "180亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 7, name: "云鲸智能", round: "E轮", valuation: "140亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 8, name: "海光信息", round: "Pre-IPO", valuation: "850亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 9, name: "如鲲新材", round: "B轮", valuation: "68亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 10, name: "天数智芯", round: "C+轮", valuation: "120亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
];

// ATLAS 早小硬科技榜
const ATLAS_ENTERPRISES = [
  { id: 101, name: "壁仞科技", track: "AI推理芯片", city: "上海", round: "C轮", valuation: "180亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 102, name: "清陶能源", track: "固态电池材料", city: "昆山", round: "D轮", valuation: "120亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 103, name: "影石创新", track: "全景影像传感器", city: "深圳", round: "B轮", valuation: "85亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 104, name: "思谋科技", track: "工业视觉检测", city: "深圳", round: "C轮", valuation: "95亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 105, name: "星环科技", track: "基础数据库", city: "上海", round: "已上市", valuation: "130亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 106, name: "禾赛科技", track: "激光雷达", city: "上海", round: "已上市", valuation: "210亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 107, name: "曦智科技", track: "光计算芯片", city: "上海", round: "B+轮", valuation: "68亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 108, name: "镁伽机器人", track: "生命科学自动化", city: "北京", round: "C轮", valuation: "72亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 109, name: "本源量子", track: "量子计算整机", city: "合肥", round: "B轮", valuation: "55亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 110, name: "时的半导体", track: "高精度ADC芯片", city: "深圳", round: "A+轮", valuation: "38亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
];

type Lang = "zh" | "en";

const I18N = {
  zh: {
    tagline: "研究+认知，投资决策的底层支撑",
    industryNav: "行业导航",
    industryNavEn: "Industry Map",
    next50Title: "成长潜力企业",
    next50Subtitle: "High-Growth Tech Leaders · Top 50",
    atlasTitle: "细分赛道科技榜",
    atlasSubtitle: "Niche Tech Track Leaders · Top 50",
    viewAll: "查看全部",
    langLabel: "EN",
  },
  en: {
    tagline: "Research + Cognition · The Foundation of Investment Decisions",
    industryNav: "Industry Map",
    industryNavEn: "",
    next50Title: "High-Growth Leaders",
    next50Subtitle: "NEXT50 · Top 50 Tech Companies",
    atlasTitle: "Niche Tech Tracks",
    atlasSubtitle: "ATLAS · Top 50 Deep-Tech Leaders",
    viewAll: "View all",
    langLabel: "中",
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("app_lang") as Lang) || "zh";
  });
  const t = I18N[lang];

  useEffect(() => {
    const updateLang = () => {
      setLang((localStorage.getItem("app_lang") as Lang) || "zh");
    };
    window.addEventListener("storage", updateLang);
    const interval = setInterval(updateLang, 500);
    return () => {
      window.removeEventListener("storage", updateLang);
      clearInterval(interval);
    };
  }, []);

  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTags = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleTagHover = (tag: string, e: React.MouseEvent) => {
    clearHideTimer();
    setHoveredIndustry(tag);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
  };

  const handleTagLeave = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setHoveredIndustry(null);
      setPopupPos(null);
    }, 150);
  };

  const handlePopupEnter = () => {
    clearHideTimer();
  };

  const handlePopupLeave = () => {
    setHoveredIndustry(null);
    setPopupPos(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-10 fade-in">
      {/* 1. 顶部区域：搜索框 */}
      <section className="pt-8 pb-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight flex items-center justify-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-xl"><Flame size={24} /></span>
            研知
          </h1>
          <p className="text-slate-500 text-sm">{t.tagline}</p>
        </div>
        <SearchBar size="large" />
      </section>

      {/* 2. 二级区域：行业筛选 - 玻璃态 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-white/80"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Compass size={14} />
            </span>
            <span className="tracking-wide">{t.industryNav}</span>
            {t.industryNavEn && <span className="text-xs font-normal text-slate-400 ml-1">{t.industryNavEn}</span>}
          </h2>
        </div>

        <div className="relative group flex items-center">
          <button onClick={() => scrollTags("left")} className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -ml-4 hover:bg-white hover:text-blue-600">
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {INDUSTRIES.map(tag => (
              <Link
                key={tag}
                to={`/industry/${encodeURIComponent(tag)}?industryName=${encodeURIComponent(tag)}`}
                onMouseEnter={(e) => handleTagHover(tag, e)}
                onMouseLeave={handleTagLeave}
                className="group/tag whitespace-nowrap px-4 py-2 rounded-xl text-sm transition-all border bg-white text-slate-600 border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50"
              >
                {tag}
              </Link>
            ))}
          </div>

          <button onClick={() => scrollTags("right")} className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -mr-4 hover:bg-white hover:text-blue-600">
            <IconRight size={16} />
          </button>
        </div>
      </motion.section>

      {/* 3. 重点区域导航 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-white/80"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <MapPin size={14} />
            </span>
            <span className="tracking-wide">重点区域导航</span>
            <span className="text-xs font-normal text-slate-400 ml-1">Regional Hub</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              to={`/city/${encodeURIComponent(city.id)}?cityName=${encodeURIComponent(city.name)}`}
              className="flex flex-col items-center justify-center p-3 rounded-xl text-sm transition-all border bg-white text-slate-600 border-slate-200 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/50 group"
            >
              <span className="text-base font-bold mb-0.5 group-hover:scale-105 transition-transform">{city.name}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-orange-500">{city.output}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 4. 三级区域：双榜单并列 - 独立卡片化设计 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* NEXT50 成长潜力榜 */}
        <section className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-0.5">
          {/* 顶部渐变装饰条 */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500"></div>
          {/* 右上角光晕装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 pointer-events-none"></div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold tracking-[0.15em] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-md shadow-sm shadow-blue-200/50">NEXT50</span>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t.next50Title}</h3>
                </div>
                <p className="text-xs text-slate-400 ml-0.5 flex items-center gap-1">
                  <TrendingUp size={11} className="text-blue-500" />
                  {t.next50Subtitle}
                </p>
              </div>
              <button className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-0.5 transition-colors group/btn">
                {t.viewAll}
                <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-1">
              {NEXT50_ENTERPRISES.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl group/row transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/50 border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      index < 3
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200/50"
                        : "bg-slate-100 text-slate-500 group-hover/row:bg-slate-200"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="relative">
                      <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white shadow-sm" />                    </div>
                    <p className="font-semibold text-slate-700 group-hover/row:text-blue-700 transition-colors truncate">
                      {item.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block group-hover/row:bg-blue-100 group-hover/row:text-blue-700 transition-all">
                      {item.round}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.valuation}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ATLAS 早小硬科技榜 */}
        <section className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-0.5">
          {/* 顶部渐变装饰条 */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          {/* 右上角光晕装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 pointer-events-none"></div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold tracking-[0.15em] bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2.5 py-1 rounded-md shadow-sm shadow-emerald-200/50">ATLAS</span>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t.atlasTitle}</h3>
                </div>
                <p className="text-xs text-slate-400 ml-0.5 flex items-center gap-1">
                  <Sparkles size={11} className="text-emerald-500" />
                  {t.atlasSubtitle}
                </p>
              </div>
              <button className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-0.5 transition-colors group/btn">
                {t.viewAll}
                <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-1">
              {ATLAS_ENTERPRISES.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl group/row transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/50 border border-transparent hover:border-emerald-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
                      index < 3
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50"
                        : "bg-slate-100 text-slate-500 group-hover/row:bg-slate-200"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="relative">
                      <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white shadow-sm flex-shrink-0" />                    </div>
                    <p className="font-semibold text-slate-700 group-hover/row:text-emerald-700 transition-colors truncate">
                      {item.name}
                    </p>
                    <span className="text-[10px] font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60 flex-shrink-0 tracking-wide">
                      {item.track}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
                      {item.city}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block group-hover/row:bg-emerald-100 group-hover/row:text-emerald-700 transition-all">
                      {item.round}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.valuation}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* 产业链阶段弹出面板 (fixed 定位，不被 overflow 裁切) */}
      {/* {hoveredIndustry && popupPos && INDUSTRY_CHAIN_STAGES[hoveredIndustry] && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="fixed bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-xl p-4 z-50"
          style={{
            left: Math.max(8, Math.min(popupPos.x - 144, window.innerWidth - 296)),
            top: popupPos.y,
            width: 288,
          }}
          onMouseEnter={handlePopupEnter}
          onMouseLeave={handlePopupLeave}
        >
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
            {hoveredIndustry}·产业链阶段
          </h4>
          {INDUSTRY_CHAIN_STAGES[hoveredIndustry].map((group) => (
            <div key={group.phase} className="mb-2.5 last:mb-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded mr-1.5 ${
                group.phase === "上游" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                group.phase === "中游" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                "bg-amber-50 text-amber-600 border border-amber-100"
              }`}>
                {group.phase}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {group.stages.map((stage) => (
                  <Link
                    key={stage}
                    to={`/industry/${encodeURIComponent(hoveredIndustry)}?industryName=${encodeURIComponent(hoveredIndustry)}&stage=${encodeURIComponent(stage)}`}
                    className="text-xs px-2 py-1 rounded-md border transition-all bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    {stage}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )} */}

    </div>
  );
}
