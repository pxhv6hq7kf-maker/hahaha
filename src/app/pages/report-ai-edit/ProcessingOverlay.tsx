import { Loader2, X } from "lucide-react";

interface ProcessingOverlayProps {
  /** 相对视口的定位（浮于选区附近） */
  position: { top: number; left: number };
  onCancel: () => void;
}

/**
 * AI 生成中状态卡片：浮于选区位置，展示加载动画 + 提示 + 取消按钮。
 * 此时编辑区已整体置灰并禁止交互，仅本卡片可点击。
 */
export default function ProcessingOverlay({ position, onCancel }: ProcessingOverlayProps) {
  return (
    <div
      className="fixed z-[120] pointer-events-auto"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center gap-3 bg-white border border-blue-200 shadow-lg shadow-blue-100/50 rounded-xl pl-3 pr-2 py-2">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        <span className="text-sm text-slate-600 font-medium">AI 编辑中，请稍候</span>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          <X size={12} />
          取消生成
        </button>
      </div>
    </div>
  );
}
