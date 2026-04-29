import { useState, useRef } from "react";
import { Link } from "react-router";
import { ChevronRight, Flame, ChevronLeft, ChevronRight as IconRight } from "lucide-react";
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

const HOT_INDUSTRIES = [
  { id: 1, name: "新能源汽车", heat: "98.5w", trend: "up" },
  { id: 2, name: "人工智能", heat: "95.2w", trend: "up" },
  { id: 3, name: "生物医药", heat: "88.7w", trend: "down" },
  { id: 4, name: "半导体设备", heat: "85.1w", trend: "up" },
  { id: 5, name: "低空经济", heat: "80.3w", trend: "up" },
  { id: 6, name: "消费电子", heat: "76.4w", trend: "down" },
  { id: 7, name: "量子计算", heat: "72.8w", trend: "up" },
  { id: 8, name: "云计算", heat: "68.9w", trend: "down" },
  { id: 9, name: "先进制造", heat: "65.2w", trend: "up" },
  { id: 10, name: "固态电池", heat: "62.1w", trend: "up" },
];

const HOT_ENTERPRISES = [
  { id: 1, name: "宁德时代", heat: "125.4w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 2, name: "比亚迪", heat: "118.2w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 3, name: "中芯国际", heat: "105.7w", trend: "down", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 4, name: "寒武纪", heat: "98.3w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 5, name: "恒瑞医药", heat: "92.1w", trend: "down", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 6, name: "科大讯飞", heat: "88.5w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 7, name: "药明康德", heat: "85.2w", trend: "down", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 8, name: "北方华创", heat: "81.9w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 9, name: "迈瑞医疗", heat: "78.4w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 10, name: "大疆创新", heat: "75.1w", trend: "up", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
];

export default function Home() {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");
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
          <p className="text-slate-500 text-sm">研究+认知，投资决策的底层支撑</p>
        </div>
        <SearchBar size="large" />
      </section>

      {/* 2. 二级区域：行业筛选 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            行业筛选
          </h2>
        </div>
        
        <div className="relative group flex items-center">
          <button onClick={() => scrollTags("left")} className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -ml-4">
            <ChevronLeft size={16} />
          </button>
          
          <div 
            ref={scrollRef} 
            className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {INDUSTRIES.map(tag => (
              <Link
                key={tag}
                to={`/industry/${encodeURIComponent(tag)}?industryName=${encodeURIComponent(tag)}`}
                onMouseEnter={(e) => handleTagHover(tag, e)}
                onMouseLeave={handleTagLeave}
                className="whitespace-nowrap px-4 py-2 rounded-xl text-sm transition-all border bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <button onClick={() => scrollTags("right")} className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -mr-4">
            <IconRight size={16} />
          </button>
        </div>
      </section>

      {/* 3. 三级区域：热门榜单 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex bg-slate-100 p-1 rounded-lg w-max">
            <button
              onClick={() => setActiveTab("week")}
              className={`px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              周榜单
            </button>
            <button
              onClick={() => setActiveTab("month")}
              className={`px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "month" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              月榜单
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 热门行业 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              热门行业 TOP10
            </h3>
            <div className="space-y-1">
              {HOT_INDUSTRIES.map((item, index) => (
                <Link 
                  key={item.id} 
                  to={`/industry/${encodeURIComponent(item.id)}?industryName=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold ${
                      index < 3 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <span className="text-slate-500 font-medium">{item.heat}</span>
                    <Flame size={14} className={item.trend === "up" ? "text-rose-500" : "text-slate-300"} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-slate-100"></div>

          {/* 热门企业 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              热门企业 TOP10
            </h3>
            <div className="space-y-1">
              {HOT_ENTERPRISES.map((item, index) => (
                <Link 
                  key={item.id} 
                  to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold ${
                      index < 3 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {index + 1}
                    </span>
                    <img src={item.logo} alt={item.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 bg-white" />
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <span className="text-slate-500 font-medium">{item.heat}</span>
                    <Flame size={14} className={item.trend === "up" ? "text-rose-500" : "text-slate-300"} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 产业链阶段弹出面板 (fixed 定位，不被 overflow 裁切) */}
      {hoveredIndustry && popupPos && INDUSTRY_CHAIN_STAGES[hoveredIndustry] && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="fixed bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50"
          style={{
            left: Math.max(8, Math.min(popupPos.x - 144, window.innerWidth - 296)),
            top: popupPos.y,
            width: 288,
          }}
          onMouseEnter={handlePopupEnter}
          onMouseLeave={handlePopupLeave}
        >
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            {hoveredIndustry}·产业链阶段
          </h4>
          {INDUSTRY_CHAIN_STAGES[hoveredIndustry].map((group) => (
            <div key={group.phase} className="mb-2.5 last:mb-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded mr-1.5 ${
                group.phase === "上游" ? "bg-emerald-50 text-emerald-600" :
                group.phase === "中游" ? "bg-blue-50 text-blue-600" :
                "bg-amber-50 text-amber-600"
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
      )}

    </div>
  );
}
