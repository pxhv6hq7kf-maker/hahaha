import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { ArrowLeft, Maximize2, Minimize2, ChevronDown, Clock, Activity, BarChart3, TrendingUp } from "lucide-react";
import SearchBar from "../components/SearchBar";

// 产业链阶段数据
const CHAIN_STAGES: Record<string, { phase: string; stages: string[] }[]> = {
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

const STAGE_NEWS: Record<string, { id: number; title: string; time: string; source: string; summary: string }[]> = {
  "锂矿资源": [
    { id: 1, title: "全球锂矿资源储量报告发布，南美锂三角占比超60%", time: "2024-05-20 10:30", source: "自然资源部", summary: "报告指出全球锂资源储量集中度较高，南美锂三角（智利、阿根廷、玻利维亚）仍是最大供给来源。" },
    { id: 2, title: "锂价触底回升，碳酸锂期货连续三周上涨", time: "2024-05-19 14:15", source: "上海钢联", summary: "受下游需求回暖及部分矿山减产影响，碳酸锂价格从低位反弹，市场情绪明显改善。" },
  ],
  "动力电池": [
    { id: 1, title: "固态电池取得重大突破，预计明年量产", time: "2024-05-19 14:15", source: "科技日报", summary: "某头部企业宣布在全固态电池技术上取得实质性进展，能量密度提升40%。" },
    { id: 2, title: "4月动力电池装车量同比增长35%，磷酸铁锂占比持续提升", time: "2024-05-18 09:00", source: "中国汽车动力电池产业创新联盟", summary: "磷酸铁锂电池凭借成本优势，市场份额已超过六成。" },
  ],
  "整车制造": [
    { id: 1, title: "4月份新能源乘用车市场渗透率突破50%", time: "2024-05-18 09:00", source: "乘联会", summary: "国内新能源汽车销量持续走高，市场占有率首次在单月突破历史新高。" },
    { id: 2, title: "工信部发布新能源汽车产业高质量发展指导意见", time: "2024-05-20 10:30", source: "工信部官网", summary: "进一步优化产业布局，提升核心竞争力，加快突破关键核心技术。" },
  ],
  "算力芯片": [
    { id: 1, title: "国产AI算力芯片取得新突破，性能对标国际主流", time: "2024-05-20 11:00", source: "中国半导体行业协会", summary: "多家国内芯片企业发布新一代AI训练芯片，算力密度大幅提升。" },
    { id: 2, title: "全球AI芯片市场规模预计2025年突破千亿美元", time: "2024-05-19 09:30", source: "Gartner", summary: "受大模型训练需求驱动，AI芯片市场持续高速增长。" },
  ],
  "大模型训练": [
    { id: 1, title: "国内千亿参数大模型密集发布，多模态能力成竞争焦点", time: "2024-05-20 14:00", source: "36氪", summary: "多家科技公司发布新一代大模型，在视觉理解、代码生成等能力上显著提升。" },
    { id: 2, title: "大模型训练成本下降趋势明显，算力利用率提升至60%", time: "2024-05-18 10:15", source: "量子位", summary: "通过混合精度训练和分布式优化，训练效率大幅提升。" },
  ],
};

const STAGE_ENTERPRISES: Record<string, { id: number; name: string; heat: string; revenue: string; share: string; logo: string }[]> = {
  "锂矿资源": [
    { id: 1, name: "天齐锂业", heat: "92.3w", revenue: "400亿", share: "18.5%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 2, name: "赣锋锂业", heat: "89.1w", revenue: "350亿", share: "15.2%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 3, name: "盐湖股份", heat: "72.4w", revenue: "180亿", share: "8.7%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 4, name: "藏格矿业", heat: "58.6w", revenue: "95亿", share: "4.3%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  ],
  "动力电池": [
    { id: 1, name: "宁德时代", heat: "98.5w", revenue: "4000亿", share: "36.8%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 2, name: "比亚迪", heat: "95.2w", revenue: "6000亿", share: "32.4%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 3, name: "亿纬锂能", heat: "75.1w", revenue: "480亿", share: "8.5%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 4, name: "国轩高科", heat: "68.3w", revenue: "310亿", share: "5.2%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 5, name: "中创新航", heat: "62.7w", revenue: "260亿", share: "4.8%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  ],
  "整车制造": [
    { id: 1, name: "比亚迪", heat: "96.2w", revenue: "6000亿", share: "32.4%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 2, name: "理想汽车", heat: "82.5w", revenue: "1200亿", share: "8.1%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 3, name: "蔚来汽车", heat: "78.3w", revenue: "560亿", share: "4.2%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 4, name: "小鹏汽车", heat: "71.8w", revenue: "310亿", share: "2.8%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  ],
  "算力芯片": [
    { id: 1, name: "寒武纪", heat: "88.5w", revenue: "12亿", share: "5.2%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 2, name: "海光信息", heat: "82.3w", revenue: "60亿", share: "8.5%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 3, name: "景嘉微", heat: "65.7w", revenue: "15亿", share: "3.1%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  ],
  "大模型训练": [
    { id: 1, name: "百度", heat: "95.2w", revenue: "1300亿", share: "22.5%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 2, name: "科大讯飞", heat: "88.5w", revenue: "200亿", share: "8.3%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
    { id: 3, name: "商汤科技", heat: "76.1w", revenue: "35亿", share: "4.7%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  ],
};

const DEFAULT_NEWS = [
  { id: 1, title: "工信部发布产业高质量发展指导意见", time: "2024-05-20 10:30", source: "工信部官网", summary: "进一步优化产业布局，提升核心竞争力，加快突破关键核心技术。" },
  { id: 2, title: "行业关键技术取得重大突破，预计明年量产", time: "2024-05-19 14:15", source: "科技日报", summary: "头部企业宣布在核心技术上取得实质性进展，性能指标大幅提升。" },
  { id: 3, title: "市场渗透率持续攀升，行业景气度上行", time: "2024-05-18 09:00", source: "行业研究机构", summary: "行业销量持续走高，市场占有率稳步提升，发展态势良好。" },
  { id: 4, title: "政策利好频出，产业生态加速完善", time: "2024-05-17 16:45", source: "经济日报", summary: "多地加快推进产业布局，探索商业化运营新模式。" },
];

const DEFAULT_ENTERPRISES = [
  { id: 1, name: "行业龙头A", heat: "98.5w", revenue: "4000亿", share: "36.8%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 2, name: "行业龙头B", heat: "95.2w", revenue: "6000亿", share: "32.4%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 3, name: "行业新锐C", heat: "75.1w", revenue: "480亿", share: "8.5%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 4, name: "行业新锐D", heat: "68.3w", revenue: "310亿", share: "5.2%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
  { id: 5, name: "行业新锐E", heat: "62.7w", revenue: "260亿", share: "4.8%", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&q=80" },
];

// Mock Data Generators
const MOCK_NODES = (centerName: string, stages: { phase: string; stages: string[] }[] | undefined) => {
  const nodes = [
    { id: "center", name: centerName || "行业", type: "core" as const, x: 50, y: 50, color: "bg-slate-800", borderColor: "border-slate-900" },
  ];
  if (stages) {
    const allStages = stages.flatMap(g => g.stages);
    const maxRows = Math.ceil(allStages.length / 2);
    const verticalSpacing = 80 / maxRows;
    allStages.forEach((stage, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? 15 : 85;
      const row = Math.floor(i / 2);
      const y = 15 + (row * verticalSpacing);
      nodes.push({ id: `n${i + 1}`, name: stage, type: "stage" as const, x, y, color: "bg-white", borderColor: "border-slate-300" });
    });
  } else {
    nodes.push(
      { id: "n1", name: "上游材料", type: "stage" as const, x: 15, y: 25, color: "bg-white", borderColor: "border-slate-300" },
      { id: "n2", name: "核心制造", type: "stage" as const, x: 85, y: 25, color: "bg-white", borderColor: "border-slate-300" },
      { id: "n3", name: "终端应用", type: "stage" as const, x: 15, y: 75, color: "bg-white", borderColor: "border-slate-300" },
      { id: "n4", name: "配套服务", type: "stage" as const, x: 85, y: 75, color: "bg-white", borderColor: "border-slate-300" },
    );
  }
  return nodes;
};

export default function Industry() {
  const { industryId } = useParams();
  const [searchParams] = useSearchParams();
  const industryName = searchParams.get("industryName") || decodeURIComponent(industryId || "未命名行业");
  const stageParam = searchParams.get("stage");

  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [activeNode, setActiveNode] = useState<string>(stageParam || industryName);
  const [selectedRegion, setSelectedRegion] = useState<string>("全部");
  const [selectedQualification, setSelectedQualification] = useState<string>("全部");
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>("全部");
  const [selectedFunding, setSelectedFunding] = useState<string>("全部");

  const filterOptions = {
    region: ["全部", "北京市", "天津市", "上海市", "重庆市", "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省", "台湾省", "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区"],
    qualification: ["全部", "国家级高新技术企业", "省级高新技术企业", "科技型中小企业", "专精特新企业", "上市公司"],
    establishment: ["全部", "5年以内", "5-10年", "10-20年", "20年以上"],
    funding: ["全部", "种子轮", "天使轮", "A轮", "B轮", "C轮及以上", "已上市"],
  };

  const chainData = CHAIN_STAGES[industryName];
  const nodes = useMemo(() => MOCK_NODES(industryName, chainData), [industryName, chainData]);

  const mockEdges = useMemo(() => {
    if (nodes.length <= 1) return [];
    return nodes.slice(1).map((node, i) => ({
      source: "center",
      target: node.id,
      color: "stroke-slate-300",
    }));
  }, [nodes]);

  const currentNews = STAGE_NEWS[activeNode] || DEFAULT_NEWS;
  const currentEnterprises = STAGE_ENTERPRISES[activeNode] || DEFAULT_ENTERPRISES;

  useEffect(() => {
    if (stageParam) setActiveNode(stageParam);
  }, [stageParam]);

  const handleNodeClick = (nodeName: string) => {
    setActiveNode(nodeName);
  };

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 1. 顶部区域 */}
      <section className="flex items-center justify-between pt-4 pb-2">
        <Link 
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">返回首页</span>
        </Link>
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-[60%]">
            <SearchBar size="small" placeholder="搜索行业/企业" />
          </div>
        </div>
        <div className="w-[114px]"></div> {/* Spacer for balance */}
      </section>

      {/* 2. 核心区域：行业知识图谱 */}
      <section className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500 flex flex-col ${isGraphExpanded ? "h-[70vh] fixed inset-4 z-50 shadow-2xl" : "h-[450px] relative"}`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" size={20} />
              {industryName} 产业知识图谱
            </h2>
          </div>
          <button 
            onClick={() => setIsGraphExpanded(!isGraphExpanded)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={isGraphExpanded ? "收起图谱" : "全屏放大"}
          >
            {isGraphExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* 简易 SVG/DOM 混合图谱实现 */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {mockEdges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              return (
                <line 
                  key={i}
                  x1={`${sourceNode.x}%`} y1={`${sourceNode.y}%`}
                  x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                  className={`${edge.color} transition-all duration-300`}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              );
            })}
          </svg>

          {nodes.map(node => (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node.name)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                activeNode === node.name ? "scale-110 z-20" : "hover:scale-105 z-10"
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`
                ${node.type === 'core' ? 'w-24 h-12 text-base font-bold' : 'w-20 h-10 text-xs font-medium'} 
                ${node.color} ${node.borderColor} border-2 ${node.type === 'core' ? 'text-white' : 'text-slate-700'}
                flex items-center justify-center shadow-sm text-center px-2 leading-tight
                ${activeNode === node.name ? "ring-2 ring-slate-400 shadow-md" : ""}
              `}>
                {node.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 如果是全屏状态，底部内容被遮挡，这里加个条件渲染或让他自然溢出 */}
      <div className={`flex gap-6 ${isGraphExpanded ? "opacity-0 pointer-events-none hidden" : "opacity-100 transition-opacity delay-100"}`}>
        {/* 左侧主内容区 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 3.1 最新行业动态 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[500px]">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              {activeNode !== industryName && <span className="text-blue-600">[{activeNode}]</span>} 最新行业动态
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
              {currentNews.slice(0, 5).map((news) => (
                <div key={news.id} className="group p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">资讯</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {news.time}
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">{news.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {news.summary}
                  </p>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <span>来源：</span><span className="text-slate-500">{news.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3.2 节点关联企业排名 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                <span className="text-blue-600">[{activeNode}]</span> 关联企业排名
              </h3>
            </div>

            {/* 筛选区域 */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium whitespace-nowrap">地区</span>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {filterOptions.region.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium whitespace-nowrap">科技资质</span>
                <div className="relative">
                  <select
                    value={selectedQualification}
                    onChange={(e) => setSelectedQualification(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {filterOptions.qualification.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium whitespace-nowrap">成立年限</span>
                <div className="relative">
                  <select
                    value={selectedEstablishment}
                    onChange={(e) => setSelectedEstablishment(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {filterOptions.establishment.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium whitespace-nowrap">融资轮次</span>
                <div className="relative">
                  <select
                    value={selectedFunding}
                    onChange={(e) => setSelectedFunding(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {filterOptions.funding.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide max-h-[400px]">
              <div className="space-y-2">
                {currentEnterprises.slice(0, 15).map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/enterprise/${encodeURIComponent(item.id)}?enterpriseName=${encodeURIComponent(item.name)}&fromIndustry=${encodeURIComponent(industryId || "")}`}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl group transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                        index < 3 ? "bg-gradient-to-br from-rose-100 to-orange-100 text-rose-600 border border-rose-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {index + 1}
                      </span>
                      <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                      <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 翻页按钮 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">共 30 页，每页 15 条</span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-sm cursor-not-allowed" disabled>
                  <ChevronDown size={14} className="rotate-90" />
                  上一页
                </button>
                <span className="text-sm text-slate-600 font-medium px-2">第 1 页</span>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                  下一页
                  <ChevronDown size={14} className="-rotate-90" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 右侧：你可能感兴趣 */}
        <section className="w-72 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            你可能感兴趣
          </h3>
          <div className="flex-1 space-y-3">
            {[
              { name: "人工智能", relevance: 92, color: "from-blue-500 to-cyan-500" },
              { name: "云计算", relevance: 86, color: "from-purple-500 to-pink-500" },
              { name: "半导体", relevance: 81, color: "from-emerald-500 to-teal-500" },
              { name: "物联网", relevance: 78, color: "from-orange-500 to-amber-500" },
              { name: "生物医药", relevance: 75, color: "from-rose-500 to-red-500" },
            ].map((item) => (
              <Link
                key={item.name}
                to={`/industry/${encodeURIComponent(item.name)}?industryName=${encodeURIComponent(item.name)}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r hover:opacity-90 transition-all border border-transparent hover:border-blue-200"
                style={{ background: `linear-gradient(to right, ${item.color.replace("-500", "-50")}, transparent)` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>相关度</span>
                    <span className="text-blue-600 font-medium">{item.relevance}%</span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
