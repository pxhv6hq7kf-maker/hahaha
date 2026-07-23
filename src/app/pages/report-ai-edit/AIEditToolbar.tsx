import { forwardRef } from "react";
import { Wand2, Minimize2, Maximize2, SpellCheck, MessageSquarePlus } from "lucide-react";
import type { AIAction } from "./aiGenerate";

interface AIEditToolbarProps {
  /** 相对视口的定位（选区右上方） */
  position: { top: number; left: number };
  onAction: (action: AIAction) => void;
}

const ACTIONS: { key: AIAction; label: string; icon: typeof Wand2 }[] = [
  { key: "polish", label: "AI 润色", icon: Wand2 },
  { key: "compress", label: "精简压缩", icon: Minimize2 },
  { key: "expand", label: "内容扩写", icon: Maximize2 },
  { key: "correct", label: "纠错修正", icon: SpellCheck },
  { key: "supplement", label: "补充信息", icon: MessageSquarePlus },
];

/**
 * 悬浮 AI 操作浮窗：选中文本后在鼠标松开位置（右上方）弹出。
 * 点击按钮触发对应 AI 动作；浮窗的显隐与关闭由父组件统一管理。
 */
const AIEditToolbar = forwardRef<HTMLDivElement, AIEditToolbarProps>(
  ({ position, onAction }, ref) => {
    return (
      <div
        ref={ref}
        className="fixed z-[120] flex items-center gap-1 bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-xl p-1"
        style={{ top: position.top, left: position.left }}
        // 阻止点击浮窗时浏览器清除选区，保证父组件持有的 Range 仍有效
        onMouseDown={(e) => e.preventDefault()}
      >
        {ACTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onAction(key)}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    );
  }
);

AIEditToolbar.displayName = "AIEditToolbar";
export default AIEditToolbar;
