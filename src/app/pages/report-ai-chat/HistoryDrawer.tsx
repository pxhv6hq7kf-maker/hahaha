import { AnimatePresence, motion } from "motion/react";
import { X, MessageSquare } from "lucide-react";
import type { ChatSession } from "./chatMock";

interface HistoryDrawerProps {
  open: boolean;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** 历史对话抽屉：列出所有会话，点击切换查看，当前会话高亮。 */
export default function HistoryDrawer({
  open,
  sessions,
  currentSessionId,
  onSelect,
  onClose,
}: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/20"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 right-0 bottom-0 z-[181] w-[340px] max-w-[85vw] bg-white border-l border-slate-200 shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <MessageSquare size={16} className="text-blue-600" />
                历史对话
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sessions.length === 0 && (
                <div className="text-center text-sm text-slate-400 mt-10">暂无历史对话</div>
              )}
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    s.id === currentSessionId
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-medium text-slate-700 truncate">
                    {s.title || "新对话"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {s.messages.length} 条消息 ·{" "}
                    {new Date(s.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
