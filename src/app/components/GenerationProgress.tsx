import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Breadcrumb, { Crumb } from "./Breadcrumb";
import {
  Search, Brain, FileText, TrendingUp, ShieldAlert, Building2, Briefcase, Globe,
  Bell, ChevronDown, ChevronUp, Loader2, CheckCircle2, Sparkles,
  Bot, BarChart3, Globe2, Database, FileSearch
} from "lucide-react";

interface GenerationProgressProps {
  enterpriseName: string;
  enterpriseId: string;
  breadcrumbItems?: Crumb[];
  onComplete: (data: string) => void;
  fail?: boolean;
}

type SearchStepStatus = "searching" | "found" | "pending";

interface SearchStep {
  query: string;
  result: string;
}

const SEARCH_AGENTS = [
  {
    id: "enterprise",
    label: "企业调查专员",
    icon: <Bot size={18} />,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-400",
    thinkingText: "正在调查企业基本信息...",
    steps: [
      { query: "搜索工商注册信息", result: "注册资本5亿元，法定代表人张XX，注册地深圳市南山区" },
      { query: "搜索股权结构", result: "控股股东XX集团（持股32.5%），第二大股东XX资本（持股18.2%）" },
      { query: "搜索融资历史", result: "A轮→B轮→C轮，累计融资超30亿元，最新估值120亿元" },
      { query: "搜索核心团队", result: "创始人张XX（清华博士），CTO李XX（前华为首席架构师）" },
      { query: "搜索专利布局", result: "累计申请专利487项，发明专利312项，PCT专利56项" },
    ],
  },
  {
    id: "industry",
    label: "产业调查专员",
    icon: <Search size={18} />,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-400",
    thinkingText: "正在调查产业背景...",
    steps: [
      { query: "搜索行业政策", result: "国务院发布《数字经济发展规划》，工信部出台专项扶持政策" },
      { query: "搜索竞争格局", result: "行业CR5=62%，公司市占率8.3%排名第四，龙头市占率18.7%" },
      { query: "搜索产业链位置", result: "处于产业链中游，上游芯片依赖进口，下游覆盖金融/医疗/制造" },
      { query: "搜索市场规模", result: "2025年市场规模1,280亿元，预计2028年达2,500亿元，CAGR 25%" },
      { query: "搜索技术趋势", result: "AI大模型+边缘计算成为主流方向，国产替代加速推进" },
    ],
  },
];

const ANALYSIS_SECTIONS = [
  {
    id: "intro",
    title: "产业前景分析",
    icon: <Building2 size={16} />,
    color: "text-blue-600",
  
  },
  {
    id: "business",
    title: "人才团队建设",
    icon: <Briefcase size={16} />,
    color: "text-indigo-600",
  },
  {
    id: "projects",
    title: "核心科技属性",
    icon: <Globe size={16} />,
    color: "text-violet-600",
  },
  {
    id: "valuation",
    title: "经营可持续性",
    icon: <TrendingUp size={16} />,
    color: "text-emerald-600",
  },
  {
    id: "risk",
    title: "投资建议及风险提示",
    icon: <ShieldAlert size={16} />,
    color: "text-rose-600",
  },



];

const SEARCH_DURATION = 35;
const ANALYSIS_SECTION_DURATION = 5;
const TOTAL_ANALYSIS_DURATION = ANALYSIS_SECTIONS.length * ANALYSIS_SECTION_DURATION;

type Phase = "search" | "analysis" | "complete";

export default function GenerationProgress({ enterpriseName, enterpriseId, breadcrumbItems = [{ label: enterpriseName }], onComplete, fail = false }: GenerationProgressProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("search");

  // Track generating status in sessionStorage for Profile page
  useEffect(() => {
    const list: string[] = JSON.parse(sessionStorage.getItem("generating_enterprises") || "[]");
    if (!list.includes(enterpriseId)) {
      list.push(enterpriseId);
      sessionStorage.setItem("generating_enterprises", JSON.stringify(list));
    }
    return () => {
      const current: string[] = JSON.parse(sessionStorage.getItem("generating_enterprises") || "[]");
      sessionStorage.setItem("generating_enterprises", JSON.stringify(current.filter(id => id !== enterpriseId)));
    };
  }, [enterpriseId]);

  const [searchProgress, setSearchProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [notified, setNotified] = useState(false);

  // Search state: track each agent's completed step index and current streaming text
  const [searchSteps, setSearchSteps] = useState<Record<string, { completed: number; streaming: string }>>({
    enterprise: { completed: -1, streaming: "" },
    industry: { completed: -1, streaming: "" },
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Main timer
  useEffect(() => {
    if (phase === "complete") return;
    timerRef.current = setInterval(() => {
      if (searchProgress >= SEARCH_DURATION && phase === "search") {
        setPhase("analysis");
      }
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, searchProgress]);

  // Search progress
  useEffect(() => {
    if (phase !== "search") return;
    const timer = setInterval(() => {
      setSearchProgress(prev => {
        const next = prev + 0.1;
        if (next >= SEARCH_DURATION) return SEARCH_DURATION;
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [phase]);

  // Search step progression: advance steps and stream result text
  useEffect(() => {
    if (phase !== "search") return;
    const totalSteps = SEARCH_AGENTS[0].steps.length;
    const stepInterval = (SEARCH_DURATION * 1000) / (totalSteps + 0.5);
    // Each step: 40% query time, 60% result streaming time
    const queryTime = stepInterval * 0.4;
    const streamTime = stepInterval * 0.6;

    let stepIdx = 0;
    let phase2Timer: ReturnType<typeof setTimeout> | null = null;

    const advanceStep = () => {
      if (stepIdx >= totalSteps) return;
      const currentStepIdx = stepIdx;

      // Phase 1: show "searching for query"
      setSearchSteps(prev => ({
        ...prev,
        enterprise: { ...prev.enterprise, completed: currentStepIdx - 1, streaming: "" },
        industry: { ...prev.industry, completed: currentStepIdx - 1, streaming: "" },
      }));

      // Phase 2: start streaming result
      phase2Timer = setTimeout(() => {
        const eResult = SEARCH_AGENTS[0].steps[currentStepIdx].result;
        const iResult = SEARCH_AGENTS[1].steps[currentStepIdx].result;
        let eIdx = 0, iIdx = 0;
        const charInterval = (streamTime * 0.8) / Math.max(eResult.length, iResult.length);

        const streamTimer = setInterval(() => {
          eIdx++;
          iIdx++;
          setSearchSteps(prev => ({
            enterprise: { completed: currentStepIdx - 1, streaming: eResult.slice(0, eIdx) },
            industry: { completed: currentStepIdx - 1, streaming: iResult.slice(0, iIdx) },
          }));
          if (eIdx >= eResult.length && iIdx >= iResult.length) {
            clearInterval(streamTimer);
            setSearchSteps(prev => ({
              enterprise: { completed: currentStepIdx, streaming: "" },
              industry: { completed: currentStepIdx, streaming: "" },
            }));
            stepIdx++;
            if (stepIdx < totalSteps) {
              phase2Timer = setTimeout(advanceStep, stepInterval * 0.1);
            }
          }
        }, charInterval);
      }, queryTime);
    };

    const startTimer = setTimeout(advanceStep, 300);
    return () => {
      clearTimeout(startTimer);
      if (phase2Timer) clearTimeout(phase2Timer);
    };
  }, [phase]);

  // Analysis progress
  useEffect(() => {
    if (phase !== "analysis") return;
    const timer = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + 0.1;
        if (next >= TOTAL_ANALYSIS_DURATION) return TOTAL_ANALYSIS_DURATION;
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [phase]);

  // Track completed sections and active section
  useEffect(() => {
    if (phase !== "analysis") return;
    const sectionIndex = Math.min(Math.floor(analysisProgress / ANALYSIS_SECTION_DURATION), ANALYSIS_SECTIONS.length - 1);
    const sectionProgress = analysisProgress - sectionIndex * ANALYSIS_SECTION_DURATION;

    if (sectionProgress >= ANALYSIS_SECTION_DURATION && !completedSections.includes(ANALYSIS_SECTIONS[sectionIndex].id)) {
      setCompletedSections(prev => [...prev, ANALYSIS_SECTIONS[sectionIndex].id]);
    }

    if (sectionIndex < ANALYSIS_SECTIONS.length && analysisProgress < TOTAL_ANALYSIS_DURATION) {
      setActiveSection(ANALYSIS_SECTIONS[sectionIndex].id);
    }

    if (analysisProgress >= TOTAL_ANALYSIS_DURATION) {
      setCompletedSections(ANALYSIS_SECTIONS.map(s => s.id));
      setActiveSection(null);
    }
  }, [analysisProgress, phase, completedSections]);

  // Complete - Set phase
  useEffect(() => {
    if (phase === "analysis" && analysisProgress >= TOTAL_ANALYSIS_DURATION) {
      setPhase("complete");
    }
  }, [phase, analysisProgress]);

  // Handle completion actions
  useEffect(() => {
    if (phase === "complete") {
      if (fail) {
        setTimeout(() => {
          navigate(`/generation-failed/${enterpriseId}?enterpriseName=${encodeURIComponent(enterpriseName)}`);
        }, 800);
        return;
      }

      const resultData = JSON.stringify({ enterpriseId, enterpriseName, completedAt: Date.now() });
      localStorage.setItem(`enterprise_result_${enterpriseId}`, resultData);

      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      notifications.unshift({
        id: `gen_${Date.now()}`,
        type: "generation_complete",
        title: `${enterpriseName} 研报生成完成`,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        read: false,
        enterpriseId,
        enterpriseName,
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));

      setTimeout(() => onComplete(resultData), 800);
    }
  }, [phase, enterpriseId, enterpriseName, onComplete, fail, navigate]);

  // Notify
  const handleNotify = () => {
    setNotified(true);
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift({
      id: `notify_${Date.now()}`,
      type: "generation_notify",
      title: `已设置提醒：${enterpriseName} 生成完成后将通知您`,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      read: false,
      enterpriseId,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  const searchComplete = phase !== "search";

  // Helper: get step status for a specific agent + step index
  const getStepStatus = (agentId: string, stepIdx: number): SearchStepStatus => {
    const state = searchSteps[agentId];
    if (!state) return "pending";
    if (stepIdx <= state.completed) return "found";
    if (stepIdx === state.completed + 1) return "searching";
    return "pending";
  };

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles size={20} className="text-blue-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{enterpriseName}</h1>
            <p className="text-sm text-slate-300">AI 正在为您生成企业深度研报</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>总体进度</span>
            <span>{Math.round(phase === "search" ? (searchProgress / SEARCH_DURATION) * 50 : phase === "analysis" ? 50 + (analysisProgress / TOTAL_ANALYSIS_DURATION) * 50 : 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${phase === "search" ? (searchProgress / SEARCH_DURATION) * 50 : phase === "analysis" ? 50 + (analysisProgress / TOTAL_ANALYSIS_DURATION) * 50 : 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main content: left 3/4 + right 1/4 */}
      <div className="flex gap-6">
        {/* Left: 3/4 */}
        <div className="flex-[3] flex flex-col gap-4">

          {/* Search Agents - Chat-style streaming */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
                <Search size={16} className="text-blue-600" />
                信息搜索阶段
              </h2>
              {searchComplete ? (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> 已完成
                </span>
              ) : (
                <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> 进行中
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {SEARCH_AGENTS.map((agent) => {
                const agentState = searchSteps[agent.id];
                const currentSearchingIdx = agentState.completed + 1;

                return (
                  <div key={agent.id} className={`border ${agent.borderColor} rounded-xl overflow-hidden`}>
                    {/* Agent header */}
                    <div className={`px-4 py-3 ${agent.bgColor} flex items-center gap-2.5 border-b ${agent.borderColor}`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white shadow-sm`}>
                        {agent.icon}
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{agent.label}</span>
                      {!searchComplete ? (
                        <span className="ml-auto text-[11px] text-slate-500 flex items-center gap-1">
                          <Loader2 size={11} className="animate-spin" /> {agent.thinkingText}
                        </span>
                      ) : (
                        <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                      )}
                    </div>

                    {/* Streaming log */}
                    <div className="px-4 py-3 space-y-2.5 bg-white">
                      {agent.steps.map((step, idx) => {
                        const status = getStepStatus(agent.id, idx);
                        const isStreaming = status === "searching" && agentState.streaming;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: status === "pending" ? 0.3 : 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-2.5"
                          >
                            {/* Status indicator */}
                            <div className="flex-shrink-0 mt-0.5">
                              {status === "found" ? (
                                <CheckCircle2 size={14} className="text-emerald-500" />
                              ) : status === "searching" ? (
                                <Loader2 size={14} className="text-blue-500 animate-spin" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Query line */}
                              <div className={`text-[13px] font-medium ${
                                status === "found" ? "text-slate-700" :
                                status === "searching" ? "text-blue-700" :
                                "text-slate-400"
                              }`}>
                                {status === "searching" ? (
                                  <span className="flex items-center gap-1.5">
                                    <FileSearch size={12} className="text-blue-500" />
                                    {step.query}
                                    <span className="inline-block w-0.5 h-3.5 bg-blue-500 animate-pulse ml-0.5" />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5">
                                    <Database size={12} className={status === "found" ? "text-emerald-500" : "text-slate-300"} />
                                    {step.query}
                                  </span>
                                )}
                              </div>

                              {/* Result line */}
                              {status === "found" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-1 text-[12px] text-slate-500 leading-relaxed pl-5"
                                >
                                  {step.result}
                                </motion.div>
                              )}

                              {/* Streaming result */}
                              {isStreaming && (
                                <div className="mt-1 text-[12px] text-blue-600 leading-relaxed pl-5">
                                  {agentState.streaming}
                                  <span className="inline-block w-0.5 h-3 bg-blue-500 animate-pulse ml-0.5 align-middle" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
                <BarChart3 size={16} className="text-indigo-600" />
                深度分析阶段
              </h2>
              {phase === "complete" ? (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> 全部完成
                </span>
              ) : phase === "analysis" ? (
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> 分析中
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full font-medium">等待中</span>
              )}
            </div>
            <div className="p-5 space-y-3">
              {ANALYSIS_SECTIONS.map((section, idx) => {
                const isCompleted = completedSections.includes(section.id);
                const isActive = activeSection === section.id;
                const isPending = !isCompleted && !isActive;
                const sectionStartTime = idx * ANALYSIS_SECTION_DURATION;
                const sectionElapsed = phase === "analysis" ? Math.max(0, Math.min(analysisProgress - sectionStartTime, ANALYSIS_SECTION_DURATION)) : (isCompleted ? ANALYSIS_SECTION_DURATION : 0);
                const sectionPercent = (sectionElapsed / ANALYSIS_SECTION_DURATION) * 100;
                const isExpanded = expandedItems.has(section.id);

                return (
                  <div
                    key={section.id}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                      isActive ? "border-blue-300 bg-blue-50/30 shadow-sm" :
                      isCompleted ? "border-emerald-200 bg-emerald-50/20 hover:shadow-sm" :
                      "border-slate-100 bg-slate-50/30"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 ${isCompleted ? "cursor-pointer" : ""}`}
                      onClick={() => isCompleted && toggleExpand(section.id)}
                    >
                      {/* Status icon */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? "bg-blue-100 text-blue-600" :
                        isCompleted ? "bg-emerald-100 text-emerald-600" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {isActive ? <Loader2 size={14} className="animate-spin" /> :
                         isCompleted ? <CheckCircle2 size={14} /> :
                         <span className="text-xs font-bold text-slate-400">{idx + 1}</span>}
                      </div>

                      <span className={`font-medium text-sm flex-1 transition-colors ${
                        isActive ? "text-blue-700" :
                        isCompleted ? "text-slate-700" :
                        "text-slate-400"
                      }`}>
                        {section.title}
                      </span>

                      {/* Section icon */}
                      <span className={`${isCompleted ? section.color : isActive ? "text-blue-500" : "text-slate-300"} transition-colors`}>
                        {section.icon}
                      </span>

                      {isActive && (
                        <span className="text-[11px] text-blue-500 font-medium mr-1">
                          {Math.round(sectionPercent)}%
                        </span>
                      )}

                      {isCompleted && (
                        isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />
                      )}

                      {!isCompleted && !isActive && (
                        <span className="text-[11px] text-slate-400 font-medium">待分析</span>
                      )}
                    </div>

                    {/* Progress bar for active section */}
                    {isActive && (
                      <div className="px-4 pb-2">
                        <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            animate={{ width: `${sectionPercent}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expandable brief for completed sections */}
                    <AnimatePresence>
                      {isCompleted && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pt-1 border-t border-emerald-100">
                            <p className="text-xs text-slate-600 leading-relaxed">{section.brief}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 1/4 */}
        <div className="flex-[1] flex flex-col gap-4">
          {/* Recommended Enterprises */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-indigo-600" />
              其他成长性潜力企业
            </h3>
            <div className="space-y-2">
              {[
                { id: "1", name: "宁德时代", city: "福建宁德", round: "上市", valuation: "1.2万亿" },
                { id: "2", name: "比亚迪", city: "广东深圳", round: "上市", valuation: "8700亿" },
                { id: "3", name: "中芯国际", city: "上海", round: "上市", valuation: "4200亿" },
                { id: "4", name: "寒武纪", city: "北京", round: "上市", valuation: "580亿" },
                { id: "5", name: "恒瑞医药", city: "江苏连云港", round: "上市", valuation: "2700亿" },
              ].map((ent) => (
                <Link
                  key={ent.id}
                  to={`/enterprise/${encodeURIComponent(ent.id)}?enterpriseName=${encodeURIComponent(ent.name)}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-700 group-hover:text-blue-600 truncate">{ent.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{ent.city}</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{ent.round}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{ent.valuation}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Notify */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <button
              onClick={handleNotify}
              disabled={notified || phase === "complete"}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                notified
                  ? "bg-slate-100 text-slate-400 cursor-default"
                  : phase === "complete"
                    ? "bg-emerald-50 text-emerald-600 cursor-default"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {notified ? (
                <><Bell size={14} /> 已设置提醒</>
              ) : phase === "complete" ? (
                <><CheckCircle2 size={14} /> 已完成</>
              ) : (
                <><Bell size={14} /> 完成后通知我</>
              )}
            </button>
          </div>

          {/* Completion Animation */}
          <AnimatePresence>
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </motion.div>
                <p className="text-sm font-bold text-emerald-800">研报生成完成</p>
                <p className="text-xs text-emerald-600 mt-1">正在加载完整内容...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
