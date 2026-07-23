import { useState, useEffect, useRef, forwardRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PenLine, Wand2 } from "lucide-react";

interface SupplementDialogProps {
  open: boolean;
  position: { top: number; left: number; width: number } | null;
  /** 直接填入：在选中文本后追加用户输入原文 */
  onDirect: (text: string) => void;
  /** AI 填入：由 AI 优化为研报风格后在选中文本后追加 */
  onAI: (text: string) => void;
  onClose: () => void;
}

/**
 * 补充信息内联浮窗：窄长条，宽度占视口 2/3，定位在选中文本上方。
 * 含输入框 + 直接填入 / AI 填入，均在选中文本之后追加，不替换原文。
 */
const SupplementDialog = forwardRef<HTMLDivElement, SupplementDialogProps>(
  ({ open, position, onDirect, onAI, onClose }, ref) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (open) {
        setValue("");
        const t = setTimeout(() => textareaRef.current?.focus(), 50);
        return () => clearTimeout(t);
      }
    }, [open]);

    const trimmed = value.trim();
    const submit = (fn: (t: string) => void) => {
      if (!trimmed) return;
      fn(trimmed);
    };

    return (
      <AnimatePresence>
        {open && position && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[130] max-w-[calc(100vw-16px)] bg-white border border-slate-200 shadow-xl shadow-slate-300/40 rounded-xl p-3"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="补充信息：输入内容后可直接填入，或由 AI 优化为研报风格后填入（将填入选中文本之后）"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-400"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => submit(onDirect)}
                disabled={!trimmed}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <PenLine size={14} />
                直接填入
              </button>
              <button
                onClick={() => submit(onAI)}
                disabled={!trimmed}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Wand2 size={14} />
                AI 填入
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

SupplementDialog.displayName = "SupplementDialog";
export default SupplementDialog;
