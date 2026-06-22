import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Sparkles, X } from "lucide-react";

interface ConfirmOptions {
  enterpriseName: string;
  enterpriseId?: string;
  onConfirm: () => void;
}

interface NoticeState {
  message: string;
}

interface ConfirmContextValue {
  requestEnterpriseReport: (options: ConfirmOptions) => void;
  showNotice: (message: string) => void;
}

const MAX_CONCURRENT_GENERATIONS = 3;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

function getGeneratingList(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem("generating_enterprises") || "[]");
  } catch {
    return [];
  }
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const [noticeState, setNoticeState] = useState<NoticeState | null>(null);

  const requestEnterpriseReport = useCallback((options: ConfirmOptions) => {
    const generating = getGeneratingList();
    const alreadyGenerating = options.enterpriseId ? generating.includes(options.enterpriseId) : false;
    if (!alreadyGenerating && generating.length >= MAX_CONCURRENT_GENERATIONS) {
      setNoticeState({ message: `已有 ${generating.length} 份企业报告正在生成中，请完成后再试。` });
      return;
    }
    setConfirmState(options);
  }, []);

  const showNotice = useCallback((message: string) => {
    setNoticeState({ message });
  }, []);

  const closeConfirm = () => setConfirmState(null);
  const closeNotice = () => setNoticeState(null);

  const handleConfirm = () => {
    confirmState?.onConfirm();
    setConfirmState(null);
  };

  const value = useMemo(() => ({ requestEnterpriseReport, showNotice }), [requestEnterpriseReport, showNotice]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      {/* 确认生成报告弹窗 */}
      <AnimatePresence>
        {confirmState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={closeConfirm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-[360px] rounded-xl border border-slate-200 bg-white shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Sparkles size={16} />
                  </span>
                  <h2 className="text-base font-semibold text-slate-800">确认生成报告</h2>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText size={12} />
                    报告对象
                  </div>
                  <p className="mt-1 text-base font-semibold text-slate-900 truncate">{confirmState.enterpriseName}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  查看企业研报将消耗一次报告额度，是否确认生成？
                </p>
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={closeConfirm}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                >
                  确认生成
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示型弹窗（如已达生成上限） */}
      <AnimatePresence>
        {noticeState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={closeNotice}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-[360px] rounded-xl border border-slate-200 bg-white shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Sparkles size={16} />
                  </span>
                  <h2 className="text-base font-semibold text-slate-800">提示</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{noticeState.message}</p>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={closeNotice}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirmEnterpriseReport() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirmEnterpriseReport must be used inside ConfirmProvider");
  }
  return context.requestEnterpriseReport;
}

export function useNotice() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useNotice must be used inside ConfirmProvider");
  }
  return context.showNotice;
}
