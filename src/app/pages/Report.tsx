import { useParams, useSearchParams, useNavigate } from "react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Printer, Share2, CheckCircle2, RefreshCw, Pencil, Undo2, Save } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Breadcrumb from "../components/Breadcrumb";
import AIEditToolbar from "./report-ai-edit/AIEditToolbar";
import ProcessingOverlay from "./report-ai-edit/ProcessingOverlay";
import SupplementDialog from "./report-ai-edit/SupplementDialog";
import { aiGenerate, type AIAction } from "./report-ai-edit/aiGenerate";

const CHART_COLORS = ["#2563eb", "#06b6d4", "#6366f1"];
const CHART_GRID = "#dbeafe";

const revenueData = [
  { quarter: "2021Q1", revenue: 14, profit: 1.5 },
  { quarter: "2021Q2", revenue: 18, profit: 2.1 },
  { quarter: "2021Q3", revenue: 16, profit: 1.8 },
  { quarter: "2021Q4", revenue: 23, profit: 3.0 },
  { quarter: "2022Q1", revenue: 21, profit: 2.6 },
  { quarter: "2022Q2", revenue: 28, profit: 4.2 },
  { quarter: "2022Q3", revenue: 25, profit: 3.7 },
  { quarter: "2022Q4", revenue: 34, profit: 5.5 },
  { quarter: "2023Q1", revenue: 31, profit: 4.9 },
  { quarter: "2023Q2", revenue: 39, profit: 6.6 },
  { quarter: "2023Q3", revenue: 36, profit: 5.8 },
  { quarter: "2023Q4", revenue: 45, profit: 8.3 },
];

const trendData = [
  { quarter: "2021Q1", score: 61, moat: 58, sentiment: 64 },
  { quarter: "2021Q2", score: 66, moat: 61, sentiment: 70 },
  { quarter: "2021Q3", score: 63, moat: 60, sentiment: 62 },
  { quarter: "2021Q4", score: 72, moat: 65, sentiment: 76 },
  { quarter: "2022Q1", score: 69, moat: 67, sentiment: 68 },
  { quarter: "2022Q2", score: 78, moat: 72, sentiment: 81 },
  { quarter: "2022Q3", score: 74, moat: 70, sentiment: 73 },
  { quarter: "2022Q4", score: 82, moat: 76, sentiment: 85 },
  { quarter: "2023Q1", score: 79, moat: 78, sentiment: 77 },
  { quarter: "2023Q2", score: 87, moat: 82, sentiment: 89 },
  { quarter: "2023Q3", score: 84, moat: 81, sentiment: 83 },
  { quarter: "2023Q4", score: 91, moat: 86, sentiment: 92 },
];

const rdData = [
  { quarter: "2021Q1", rd: 8.2, patents: 18 },
  { quarter: "2021Q2", rd: 9.1, patents: 22 },
  { quarter: "2021Q3", rd: 8.8, patents: 20 },
  { quarter: "2021Q4", rd: 10.4, patents: 26 },
  { quarter: "2022Q1", rd: 10.1, patents: 25 },
  { quarter: "2022Q2", rd: 11.7, patents: 31 },
  { quarter: "2022Q3", rd: 11.2, patents: 29 },
  { quarter: "2022Q4", rd: 13.5, patents: 36 },
  { quarter: "2023Q1", rd: 12.9, patents: 34 },
  { quarter: "2023Q2", rd: 14.6, patents: 42 },
  { quarter: "2023Q3", rd: 13.8, patents: 39 },
  { quarter: "2023Q4", rd: 15.8, patents: 47 },
];

const deliveryData = [
  { quarter: "2021Q1", domestic: 42, overseas: 8 },
  { quarter: "2021Q2", domestic: 48, overseas: 11 },
  { quarter: "2021Q3", domestic: 45, overseas: 10 },
  { quarter: "2021Q4", domestic: 57, overseas: 16 },
  { quarter: "2022Q1", domestic: 54, overseas: 15 },
  { quarter: "2022Q2", domestic: 65, overseas: 21 },
  { quarter: "2022Q3", domestic: 61, overseas: 19 },
  { quarter: "2022Q4", domestic: 74, overseas: 28 },
  { quarter: "2023Q1", domestic: 70, overseas: 26 },
  { quarter: "2023Q2", domestic: 82, overseas: 35 },
  { quarter: "2023Q3", domestic: 78, overseas: 32 },
  { quarter: "2023Q4", domestic: 91, overseas: 43 },
];

const costBarData = [
  { item: "研发", current: 35, benchmark: 28 },
  { item: "制造", current: 40, benchmark: 45 },
  { item: "销售", current: 16, benchmark: 18 },
  { item: "管理", current: 9, benchmark: 9 },
];

const pieGroups = [
  {
    title: "营收结构",
    data: [
      { name: "核心产品", value: 58, color: CHART_COLORS[0] },
      { name: "解决方案", value: 27, color: CHART_COLORS[1] },
      { name: "服务收入", value: 15, color: CHART_COLORS[2] },
    ],
  },
  {
    title: "客户分布",
    data: [
      { name: "头部客户", value: 42, color: CHART_COLORS[0] },
      { name: "成长客户", value: 36, color: CHART_COLORS[1] },
      { name: "长尾客户", value: 22, color: CHART_COLORS[2] },
    ],
  },
  {
    title: "成本结构",
    data: [
      { name: "研发", value: 35, color: CHART_COLORS[0] },
      { name: "生产", value: 40, color: CHART_COLORS[1] },
      { name: "销售管理", value: 25, color: CHART_COLORS[2] },
    ],
  },
];

interface SelectionState {
  range: Range;
  text: string;
}

interface ProcessingState {
  range: Range;
  task: { cancel: () => void };
  mode: "replace" | "append";
  position: { top: number; left: number };
}

const TOOLBAR_HEIGHT = 44;
const TOOLBAR_WIDTH = 600;
const SUPP_HEIGHT = 140;
const GAP = 8;

export default function Report() {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const enterpriseId = searchParams.get("enterpriseId");
  const enterpriseName = searchParams.get("enterpriseName") || "企业详情";
  const industryName = searchParams.get("industryName");
  const navigate = useNavigate();

  // AI 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const [supplementOpen, setSupplementOpen] = useState(false);
  const [supplementPos, setSupplementPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const supplementRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const selectionRef = useRef<SelectionState | null>(null);
  const supplementRangeRef = useRef<Range | null>(null);

  const handleBack = () => {
    if (enterpriseId) {
      navigate(`/enterprise/${enterpriseId}`);
    } else {
      navigate(-1);
    }
  };

  // 进入编辑模式
  const enterEdit = () => {
    historyRef.current = [];
    setCanUndo(false);
    setToolbarPos(null);
    selectionRef.current = null;
    setIsEditing(true);
  };

  // 保存并退出编辑模式
  const saveAndExit = () => {
    try {
      if (editorRef.current && reportId) {
        localStorage.setItem(`report_content_${reportId}`, editorRef.current.innerHTML);
      }
    } catch {
      /* ignore */
    }
    historyRef.current = [];
    setCanUndo(false);
    setToolbarPos(null);
    setProcessing(null);
    setSupplementOpen(false);
    setSupplementPos(null);
    selectionRef.current = null;
    window.getSelection()?.removeAllRanges();
    setIsEditing(false);
  };

  const pushHistory = () => {
    if (editorRef.current) {
      historyRef.current.push(editorRef.current.innerHTML);
      setCanUndo(true);
    }
  };

  // 撤销上一步
  const undo = () => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current.pop()!;
    if (editorRef.current) {
      editorRef.current.innerHTML = prev;
    }
    setCanUndo(historyRef.current.length > 0);
    setToolbarPos(null);
    selectionRef.current = null;
    window.getSelection()?.removeAllRanges();
  };

  const closeSupplement = () => {
    setSupplementOpen(false);
    setSupplementPos(null);
  };

  // 计算浮窗位置：选区右上方，带视口边界回退
  const computePosition = (
    rect: DOMRect,
    width = TOOLBAR_WIDTH,
    height = TOOLBAR_HEIGHT
  ): { top: number; left: number } => {
    let top = rect.top - height - GAP;
    let left = rect.right - width;
    if (top < GAP) top = rect.bottom + GAP; // 顶部溢出 -> 放到选区下方
    if (left < GAP) left = rect.left; // 左侧溢出 -> 左对齐选区
    if (left + width > window.innerWidth - GAP) {
      left = window.innerWidth - width - GAP;
    }
    return { top, left };
  };

  // 选区监听：松开鼠标后，若选区有效则弹出 AI 工具栏
  const handleEditorMouseUp = useCallback(() => {
    if (!isEditing || processing || supplementOpen) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setToolbarPos(null);
      selectionRef.current = null;
      return;
    }
    const range = sel.getRangeAt(0);
    const text = sel.toString();
    if (!text || !text.trim()) {
      setToolbarPos(null);
      selectionRef.current = null;
      return;
    }
    // 选区必须落在编辑区内
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      setToolbarPos(null);
      selectionRef.current = null;
      return;
    }
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setToolbarPos(null);
      selectionRef.current = null;
      return;
    }
    selectionRef.current = { range: range.cloneRange(), text };
    setToolbarPos(computePosition(rect));
  }, [isEditing, processing, supplementOpen]);

  // 原位写入：replace 替换选区内容；append 在选区末尾后追加
  const writeResult = (range: Range, text: string, mode: "replace" | "append") => {
    const work = range.cloneRange();
    if (mode === "replace") {
      work.deleteContents();
    } else {
      work.collapse(false);
    }
    const node = document.createTextNode(text);
    work.insertNode(node);
    node.parentNode?.normalize();
  };

  // 执行 AI 生成（前四个动作为 replace；补充信息 AI 填入为 append）
  const runAction = (
    action: AIAction,
    mode: "replace" | "append" = "replace",
    options?: { userInput?: string }
  ) => {
    const sel = selectionRef.current;
    const range = action === "supplement" ? supplementRangeRef.current : sel?.range;
    const text = action === "supplement" ? options?.userInput || "" : sel?.text;
    if (!range || !text) return;

    pushHistory();
    const workRange = range.cloneRange();
    const rect = workRange.getBoundingClientRect();
    const position = rect.width || rect.height ? computePosition(rect) : { top: 120, left: 120 };
    setToolbarPos(null);

    const task = aiGenerate(action, text, { userInput: options?.userInput, context: sel?.text });
    setProcessing({ range: workRange, task, mode, position });

    task.promise.then((result) => {
      if (!result) {
        setProcessing(null);
        return;
      }
      writeResult(workRange, result, mode);
      setProcessing(null);
      selectionRef.current = null;
      supplementRangeRef.current = null;
      window.getSelection()?.removeAllRanges();
    });
  };

  // 工具栏动作分发
  const handleToolbarAction = (action: AIAction) => {
    if (action === "supplement") {
      const sel = selectionRef.current;
      supplementRangeRef.current = sel?.range.cloneRange() || null;
      const rect = sel?.range.getBoundingClientRect();
      // 窄长条：宽度取研报内容区（编辑区）宽度的 2/3
      const contentW = editorRef.current?.offsetWidth ?? window.innerWidth;
      const suppW = Math.min((contentW * 2) / 3, window.innerWidth - 16);
      const pos =
        rect && (rect.width || rect.height)
          ? { ...computePosition(rect, suppW, SUPP_HEIGHT), width: suppW }
          : { top: 120, left: 120, width: suppW };
      setToolbarPos(null);
      setSupplementPos(pos);
      setSupplementOpen(true);
    } else {
      runAction(action, "replace");
    }
  };

  const cancelProcessing = () => {
    processing?.task.cancel();
    // 编辑未生效，回滚本次刚 push 的历史快照，避免撤销栈出现空操作
    if (historyRef.current.length) historyRef.current.pop();
    setCanUndo(historyRef.current.length > 0);
    setProcessing(null);
    // 生成中尚未写入 DOM，原文保留，无需恢复
  };

  // 补充信息：直接填入
  const handleDirectFill = (input: string) => {
    const range = supplementRangeRef.current;
    closeSupplement();
    if (!range) return;
    pushHistory();
    writeResult(range, input, "append");
    supplementRangeRef.current = null;
    selectionRef.current = null;
    window.getSelection()?.removeAllRanges();
  };

  // 补充信息：AI 填入
  const handleAIFill = (input: string) => {
    closeSupplement();
    runAction("supplement", "append", { userInput: input });
  };

  // ESC / 点击文档其他位置 -> 关闭浮窗
  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (processing) {
        cancelProcessing();
      } else if (supplementOpen) {
        closeSupplement();
      } else {
        setToolbarPos(null);
        selectionRef.current = null;
        window.getSelection()?.removeAllRanges();
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (processing) return;
      const target = e.target as Node;
      // 补充信息浮窗打开时，点击其外部关闭
      if (supplementOpen) {
        if (supplementRef.current?.contains(target)) return;
        closeSupplement();
        return;
      }
      if (toolbarRef.current?.contains(target)) return; // 点击浮窗内不关闭
      if (editorRef.current?.contains(target)) return; // 编辑区内由 mouseup 处理
      setToolbarPos(null);
      selectionRef.current = null;
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isEditing, processing, supplementOpen]);

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in min-h-[80vh]">
      {/* Header Actions */}
      <section className="flex items-center justify-between pt-4 pb-4 border-b border-slate-200">
        <Breadcrumb items={[
          ...(industryName
            ? [{
                label: industryName,
                to: `/industry/${encodeURIComponent(industryName)}?industryName=${encodeURIComponent(industryName)}`,
              }]
            : []),
          {
            label: enterpriseName,
            to: enterpriseId
              ? `/enterprise/${enterpriseId}?enterpriseName=${encodeURIComponent(enterpriseName)}${industryName ? `&industryName=${encodeURIComponent(industryName)}` : ""}`
              : undefined,
          },
          { label: "研报详情" },
        ]} />

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
            <Printer size={18} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
            <Download size={16} />
            下载 PDF
          </button>
          {isEditing ? (
            <>
              <button
                onClick={undo}
                disabled={!canUndo}
                className="flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Undo2 size={16} />
                撤销
              </button>
              <button
                onClick={saveAndExit}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
              >
                <Save size={16} />
                保存
              </button>
            </>
          ) : (
            <button
              onClick={enterEdit}
              className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium text-sm"
            >
              <Pencil size={16} />
              编辑
            </button>
          )}
        </div>
      </section>

      {/* 编辑模式提示条 */}
      {isEditing && (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
          <Pencil size={14} />
          <span>编辑模式：选中正文任意文本后，在浮窗中选择 AI 操作。编辑完成后点击「保存」退出。</span>
        </div>
      )}

      {/* Report Content Mock */}
      <section
        className={`flex-1 bg-white rounded-2xl shadow-sm shadow-blue-100/50 border border-slate-200 p-10 lg:p-16 max-w-4xl mx-auto w-full transition-shadow ${
          isEditing ? "ring-2 ring-blue-400 ring-offset-2" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-6 select-none">
          <span className="text-xs text-slate-500">报告生成时间：2026-05-20 14:30</span>
          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors">
            <RefreshCw size={12} />
            重新生成报告（预计20分钟）
          </button>
        </div>

        {/*
          可编辑区为普通 div（非 contentEditable）：用户可选中文字但无法直接键入，
          编辑只能通过 AI 工具栏进行；AI 编辑通过 Range API 直接操作 DOM。
          图表/数据卡片用 select-none 排除在可选范围外。
        */}
        <div
          ref={editorRef}
          onMouseUp={handleEditorMouseUp}
          className={`select-text outline-none transition-opacity ${
            isEditing ? "cursor-text" : ""
          } ${processing ? "opacity-60 pointer-events-none" : ""}`}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              2024年第一季度企业深度洞察与投资价值分析报告
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span>报告编号：{reportId || "R-20240501"}</span>
              <span>发布机构：产业大脑研究院</span>
              <span>日期：2024-05-20</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="lead text-lg text-slate-600 mb-8 border-l-4 border-blue-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
              本报告基于多维数据模型，对目标企业的核心竞争力、市场占位、财务健康度及未来发展潜力进行了全面评估。
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              一、核心观点摘要
            </h3>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>企业在细分赛道保持领先地位，市占率稳步提升至35%以上。</p></li>
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>得益于新一代产品的规模化量产，Q1毛利率环比改善，盈利能力增强。</p></li>
              <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>海外市场拓展顺利，预计全年海外营收占比将突破20%。</p></li>
            </ul>

            <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              二、行业背景与市场空间
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              随着全球数字化转型的深入，所属行业正处于高速成长期。政策红利持续释放，上下游产业链协同效应显著。预计未来三年，该领域市场规模复合年增长率将维持在15%左右，呈现出广阔的蓝海特征。
            </p>
            <div className="h-72 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 mb-8 select-none">
              <div className="text-sm font-semibold text-slate-700 mb-3">近三年企业成长性综合评分趋势</div>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={trendData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" name="成长性评分" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 3, fill: CHART_COLORS[0] }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              三、财务表现分析
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              从近期披露的财报数据来看，企业营收结构进一步优化。研发投入占总营收比例达12%，为后续技术壁垒的构筑提供了强有力的支撑。现金流状况良好，资产负债率处于行业安全区间。
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 select-none">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">+45%</div>
                <div className="text-xs text-slate-500">同比营收增长</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-center">
                <div className="text-2xl font-bold text-sky-600 mb-1">18.5%</div>
                <div className="text-xs text-slate-500">净利润率</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                <div className="text-2xl font-bold text-indigo-500 mb-1">3.2亿</div>
                <div className="text-xs text-slate-500">经营性净现金流</div>
              </div>
            </div>

            <div className="h-72 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 mb-8 shadow-sm shadow-blue-100/50 select-none">
              <div className="text-sm font-semibold text-slate-700 mb-3">近三年季度营收与利润表现</div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={revenueData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="revenue" name="营收（亿元）" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="profit" name="净利润（亿元）" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 select-none">
              <div className="h-64 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 shadow-sm shadow-blue-100/50">
                <div className="text-sm font-semibold text-slate-700 mb-3">技术壁垒与舆情热度趋势</div>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={trendData} margin={{ left: -24, right: 8, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="moat" name="技术壁垒" stroke={CHART_COLORS[2]} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="sentiment" name="舆情热度" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 shadow-sm shadow-blue-100/50">
                <div className="text-sm font-semibold text-slate-700 mb-3">研发投入与专利数量趋势</div>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={rdData} margin={{ left: -24, right: 8, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rd" name="研发投入占比" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="patents" name="新增专利" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 shadow-sm shadow-blue-100/50">
                <div className="text-sm font-semibold text-slate-700 mb-3">国内与海外交付规模</div>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={deliveryData} margin={{ left: -24, right: 8, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="domestic" name="国内交付" fill={CHART_COLORS[0]} radius={[5, 5, 0, 0]} />
                    <Bar dataKey="overseas" name="海外交付" fill={CHART_COLORS[1]} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4 shadow-sm shadow-blue-100/50">
                <div className="text-sm font-semibold text-slate-700 mb-3">成本结构与行业均值对比</div>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={costBarData} margin={{ left: -24, right: 8, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="item" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="current" name="本企业" fill={CHART_COLORS[1]} radius={[5, 5, 0, 0]} />
                    <Bar dataKey="benchmark" name="行业均值" fill={CHART_COLORS[2]} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 select-none">
              {pieGroups.map((group) => (
                <div key={group.title} className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-xl border border-blue-100/80 p-4">
                  <div className="text-sm font-semibold text-slate-700 mb-3">{group.title}</div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={group.data} dataKey="value" nameKey="name" innerRadius={34} outerRadius={58} paddingAngle={3}>
                          {group.data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5">
                    {group.data.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-semibold text-slate-700">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI 操作浮窗 */}
      {toolbarPos && !processing && !supplementOpen && (
        <AIEditToolbar ref={toolbarRef} position={toolbarPos} onAction={handleToolbarAction} />
      )}

      {/* AI 生成中状态 */}
      {processing && (
        <ProcessingOverlay position={processing.position} onCancel={cancelProcessing} />
      )}

      {/* 补充信息内联浮窗 */}
      <SupplementDialog
        ref={supplementRef}
        open={supplementOpen}
        position={supplementPos}
        onDirect={handleDirectFill}
        onAI={handleAIFill}
        onClose={closeSupplement}
      />
    </div>
  );
}
