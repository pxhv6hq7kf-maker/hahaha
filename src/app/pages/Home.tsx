import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight, Flame, ChevronLeft, ChevronRight as IconRight, Sparkles, TrendingUp, Compass, ArrowUpRight, BarChart3, Cpu } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { motion } from "motion/react";

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

const LISTED_ENTERPRISES = [
  { id: 201, name: "中芯国际", code: "688981", market: "科创板", valuation: "3200亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 202, name: "宁德时代", code: "300750", market: "创业板", valuation: "8800亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 203, name: "海康威视", code: "002415", market: "深主板", valuation: "3100亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 204, name: "澜起科技", code: "688008", market: "科创板", valuation: "720亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 205, name: "寒武纪", code: "688256", market: "科创板", valuation: "950亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 206, name: "华大智造", code: "688114", market: "科创板", valuation: "310亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 207, name: "联影医疗", code: "688271", market: "科创板", valuation: "1150亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 208, name: "金山办公", code: "688111", market: "科创板", valuation: "1300亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 209, name: "传音控股", code: "688036", market: "科创板", valuation: "1500亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 210, name: "北方华创", code: "002371", market: "深主板", valuation: "1900亿", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
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
    listedTitle: "上市企业榜单",
    listedSubtitle: "Public Tech Companies · Top 50",
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
    listedTitle: "Listed Leaders",
    listedSubtitle: "Public Tech Companies · Top 50",
    viewAll: "View all",
    langLabel: "中",
  },
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
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
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_60%_70%,rgba(129,140,248,0.16),transparent_30%)]" />

          <div className="absolute inset-0 z-10">
            {[
              { label: "融资新闻", from: [-420, -190], color: "from-blue-500 to-indigo-500", delay: 0.1 },
              { label: "财报数据", from: [420, -170], color: "from-cyan-500 to-blue-500", delay: 0.22 },
              { label: "产业链图谱", from: [-430, 150], color: "from-emerald-500 to-teal-500", delay: 0.34 },
              { label: "竞品动态", from: [430, 150], color: "from-violet-500 to-indigo-500", delay: 0.46 },
              { label: "专利技术", from: [0, -280], color: "from-sky-500 to-cyan-500", delay: 0.58 },
              { label: "团队履历", from: [0, 280], color: "from-slate-500 to-blue-500", delay: 0.7 },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: item.from[0], y: item.from[1], scale: 0.78, filter: "blur(6px)" }}
                animate={{ opacity: [0, 1, 1, 0], x: [item.from[0], item.from[0] * 0.42, 0, 0], y: [item.from[1], item.from[1] * 0.42, 0, 0], scale: [0.78, 0.9, 0.45, 0.18], filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(8px)"] }}
                transition={{ duration: 1.45, delay: item.delay, times: [0, 0.28, 0.78, 1], ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/90 p-3 shadow-xl"
              >
                <div className={`mb-2 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
                <p className="text-xs font-bold text-slate-700">{item.label}</p>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 rounded-full bg-slate-200" />
                  <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.82, 1, 1.04, 0.96] }}
            transition={{ duration: 1.9, times: [0, 0.18, 0.82, 1] }}
            className="absolute z-20 flex h-52 w-52 items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="absolute h-52 w-52 rounded-full border border-blue-300/40 bg-[conic-gradient(from_90deg,transparent,rgba(59,130,246,0.22),transparent,rgba(99,102,241,0.2),transparent)]"
            />
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
              className="absolute h-40 w-40 rounded-full border border-dashed border-cyan-300/70"
            />
            <motion.div
              animate={{ opacity: [0.25, 0.75, 0.25], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-32 w-32 rounded-full bg-blue-400/15 blur-xl"
            />
            <div className="absolute inset-0">
              {[
                { x: 26, y: 24 },
                { x: 156, y: 32 },
                { x: 178, y: 130 },
                { x: 48, y: 162 },
                { x: 104, y: 14 },
              ].map((node, index) => (
                <motion.span
                  key={index}
                  animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.16 }}
                  className="absolute h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-300/70"
                  style={{ left: node.x, top: node.y }}
                />
              ))}
            </div>
            <svg className="absolute h-52 w-52" viewBox="0 0 208 208" fill="none">
              <motion.path
                d="M32 30L104 104L162 38M104 104L182 136M104 104L54 166M104 104L104 20"
                stroke="url(#ai-core-gradient)"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="ai-core-gradient" x1="20" y1="20" x2="188" y2="188" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <motion.div
              animate={{ opacity: [0.88, 1, 0.88], scale: [0.96, 1.04, 0.96] }}
              transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-24 w-24 flex-col items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 text-blue-700 shadow-2xl shadow-blue-300/70 backdrop-blur-xl"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-50 via-white to-indigo-100" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-300/70">
                <Cpu size={25} />
              </div>
              <div className="relative mt-2 text-[10px] font-black tracking-[0.24em] text-blue-700">AI AGENT</div>
            </motion.div>
            <motion.div
              animate={{ x: [-82, 82], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-px w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: [0, 0, 1, 1], scale: [0.9, 0.9, 1, 1], y: [18, 18, 0, 0] }}
            transition={{ duration: 2.65, times: [0, 0.62, 0.82, 1] }}
            className="relative z-30 w-[min(86vw,520px)] rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-200/60"
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-[0.25em] text-blue-600">
                  <Cpu size={13} />
                  AI GENERATED REPORT
                </p>
                <h2 className="text-2xl font-bold text-slate-900">研知-科技企业成长性评测</h2>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">已生成</div>
            </div>
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
              <div className="space-y-2.5">
                <div className="h-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-4/5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
                <div className="mt-4 rounded-xl bg-yellow-100/80 p-3 text-xs font-medium text-yellow-800">投资建议与核心风险已高亮</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
                <div className="mb-2 h-20 rounded-xl bg-white shadow-sm" />
                <div className="h-2 rounded-full bg-blue-200" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0, 1, 1], y: [10, 10, 0, 0] }}
            transition={{ duration: 2.85, times: [0, 0.74, 0.9, 1] }}
            className="absolute bottom-[13vh] z-40 flex flex-col items-center gap-6"
          >
            <p className="overflow-hidden whitespace-nowrap border-r border-blue-500 pr-1 text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
              科技企业成长性多维评测，发现科技企业价值
            </p>
            <button
              onClick={() => setShowIntro(false)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-blue-300/60 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-400/70"
            >
              开始发现企业
              <motion.span
                animate={{ opacity: [0.35, 1, 0.35], x: [0, 4, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center"
              >
                <ChevronRight size={18} />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      )}

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

      {/* 2. 双榜单并列 - 独立卡片化设计 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
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

        <section className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-500 hover:-translate-y-0.5">
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 pointer-events-none"></div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold tracking-[0.15em] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2.5 py-1 rounded-md shadow-sm shadow-violet-200/50">LISTED</span>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t.listedTitle}</h3>
                </div>
                <p className="text-xs text-slate-400 ml-0.5 flex items-center gap-1">
                  <BarChart3 size={11} className="text-violet-500" />
                  {t.listedSubtitle}
                </p>
              </div>
              <button className="text-xs text-slate-400 hover:text-violet-600 flex items-center gap-0.5 transition-colors group/btn">
                {t.viewAll}
                <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-1">
              {LISTED_ENTERPRISES.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl group/row transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-50/80 hover:to-indigo-50/50 border border-transparent hover:border-violet-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
                      index < 3
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200/50"
                        : "bg-slate-100 text-slate-500 group-hover/row:bg-slate-200"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="relative">
                      <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white shadow-sm flex-shrink-0" />                    </div>
                    <p className="font-semibold text-slate-700 group-hover/row:text-violet-700 transition-colors truncate">
                      {item.name}
                    </p>
                    <span className="text-[10px] font-medium bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 px-2 py-0.5 rounded-md border border-violet-200/60 flex-shrink-0 tracking-wide">
                      {item.code}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block group-hover/row:bg-violet-100 group-hover/row:text-violet-700 transition-all">
                      {item.market}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.valuation}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* 3. 行业筛选 - 玻璃态 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
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
