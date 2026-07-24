import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Eraser,
  History,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Send,
  X,
  Loader2,
} from "lucide-react";
import {
  generateUpdate,
  genId,
  type ChatSession,
  type ChatMessage,
  type UploadedFile,
} from "./chatMock";
import HistoryDrawer from "./HistoryDrawer";

interface ReportAIChatProps {
  reportId: string;
  reportContentRef: React.RefObject<HTMLDivElement | null>;
  onUpdateReport: (content: string) => void;
}

const WELCOME =
  "您好，我是研报 AI 助手。可输入指令（如：结合上传调研资料补充现场调研信息、重构行业分析段落、统一全文文风），并可上传调研纪要、走访记录、财报等素材，我将为您智能更新研报。";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function newSession(firstText = WELCOME): ChatSession {
  return {
    id: genId(),
    title: "新对话",
    messages: [{ id: genId(), role: "ai", text: firstText }],
    createdAt: Date.now(),
  };
}

/**
 * 研报底部悬浮 AI 对话窗口：常驻展示，可收起/展开。
 * 支持文字指令输入、本地文件上传；发送后 mock 调用 Claude Code 分析，
 * 完成后直接替换更新研报，并回复本次主要操作内容。
 * 支持新建/清空/历史对话查看，localStorage 持久化。
 */
export default function ReportAIChat({ reportId, reportContentRef, onUpdateReport }: ReportAIChatProps) {
  const storageKey = `report_chat_sessions_${reportId}`;

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) return arr as ChatSession[];
      }
    } catch {
      /* ignore */
    }
    return [newSession()];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => sessions[0].id);
  const [isExpanded, setIsExpanded] = useState(true);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const generatingTaskRef = useRef<{ cancel: () => void } | null>(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];

  // 持久化
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    } catch {
      /* ignore */
    }
  }, [sessions, storageKey]);

  // 滚动到底
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, isGenerating, isExpanded]);

  // textarea 自适应高度
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
    }
  }, [input]);

  const updateSession = (id: string, updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isGenerating) return;
    const sessionId = currentSessionId;
    const sentFiles = [...files];
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      text,
      files: sentFiles.length ? sentFiles : undefined,
    };
    updateSession(sessionId, (s) => ({
      ...s,
      title: s.messages.length <= 1 ? text.slice(0, 24) : s.title,
      messages: [...s.messages, userMsg],
    }));
    setInput("");
    setFiles([]);
    setIsExpanded(true);

    setIsGenerating(true);
    const reportText = reportContentRef.current?.innerText || "";
    const task = generateUpdate(text, sentFiles, reportText);
    generatingTaskRef.current = task;

    task.promise.then((result) => {
      const aiMsg: ChatMessage = {
        id: genId(),
        role: "ai",
        text: result.summary,
        actions: result.actions,
      };
      updateSession(sessionId, (s) => ({ ...s, messages: [...s.messages, aiMsg] }));
      // 分析完成后直接替换更新研报原文
      onUpdateReport(result.newContent);
      setIsGenerating(false);
      generatingTaskRef.current = null;
    });
  };

  const handleCancelGenerate = () => {
    generatingTaskRef.current?.cancel();
    setIsGenerating(false);
    generatingTaskRef.current = null;
    updateSession(currentSessionId, (s) => ({
      ...s,
      messages: [...s.messages, { id: genId(), role: "ai", text: "已取消生成。" }],
    }));
  };

  const handleNewChat = () => {
    const s = newSession("您好，我是研报 AI 助手。可输入指令（如：结合上传调研资料补充现场调研信息、重构行业分析段落、统一全文文风），并可上传调研纪要、走访记录、财报等素材，我将为您智能更新研报。");
    setSessions((prev) => [s, ...prev]);
    setCurrentSessionId(s.id);
    setInput("");
    setFiles([]);
  };

  const handleClearChat = () => {
    updateSession(currentSessionId, (s) => ({
      ...s,
      title: "新对话",
      messages: [{ id: genId(), role: "ai", text: WELCOME }],
    }));
    setInput("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list.map((f) => ({ name: f.name, size: f.size }))]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <>
      <div className="fixed bottom-2 left-0 right-0 z-[150] px-4 pointer-events-none">
        <div className="pointer-events-auto mx-auto w-full max-w-[928px] bg-white border border-slate-200 rounded-xl shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
          {/* 头部 */}
          {isExpanded && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles size={15} className="text-blue-600" />
                研报 AI 编辑助手
                {isGenerating && (
                  <span className="text-xs text-blue-500 font-normal flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" />
                    AI智能体分析中
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={handleNewChat} title="新建对话" className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <Plus size={15} />
                </button>
                <button onClick={handleClearChat} title="清空对话" className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <Eraser size={15} />
                </button>
                <button onClick={() => setShowHistory(true)} title="历史对话" className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <History size={15} />
                </button>
                <button onClick={() => setIsExpanded(false)} title="收起" className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          )}

          {/* 消息列表 */}
          {isExpanded && (
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3 bg-white">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.files.map((f, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-1.5 text-xs ${msg.role === "user" ? "text-blue-50" : "text-slate-500"}`}
                          >
                            <Paperclip size={11} />
                            {f.name}
                            <span className="opacity-70">({formatSize(f.size)})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.actions.map((a, i) => (
                          <span
                            key={i}
                            className={`text-[11px] px-1.5 py-0.5 rounded ${
                              msg.role === "user"
                                ? "bg-blue-500/30 text-white"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-slate-400 flex items-center gap-1.5">
                    <Loader2 size={14} className="animate-spin" />
                    AI智能体分析中…【返回过程信息】
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* 待上传文件列表 */}
          {isExpanded && files.length > 0 && (
            <div className="px-4 pt-2 flex flex-wrap gap-1.5">
              {files.map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 rounded px-2 py-1">
                  <Paperclip size={11} />
                  {f.name}
                  <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="flex items-end gap-2 p-3 border-t border-slate-100">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="上传文件"
              disabled={isGenerating}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 disabled:opacity-40"
            >
              <Paperclip size={16} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="输入研报编辑需求，如：结合上传调研资料补充现场调研信息"
              rows={1}
              className="flex-1 resize-none bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-slate-200 placeholder:text-slate-400"
            />
            {isGenerating ? (
              <button
                onClick={handleCancelGenerate}
                className="flex-shrink-0 h-9 px-3 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
              >
                <X size={14} />
                取消
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex-shrink-0 h-9 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Send size={14} />
                发送
              </button>
            )}
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                title="展开对话"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
              >
                <ChevronUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <HistoryDrawer
        open={showHistory}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelect={(id) => {
          setCurrentSessionId(id);
          setShowHistory(false);
        }}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
}
