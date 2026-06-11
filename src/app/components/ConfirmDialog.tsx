import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Sparkles, X } from "lucide-react";

interface ConfirmOptions {
  enterpriseName: string;
  onConfirm: () => void;
}

interface ConfirmContextValue {
  requestEnterpriseReport: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmOptions | null>(null);

  const requestEnterpriseReport = useCallback((options: ConfirmOptions) => {
    setState(options);
  }, []);

  const handleClose = () => setState(null);

  const handleConfirm = () => {
    state?.onConfirm();
    setState(null);
  };

  const value = useMemo(() => ({ requestEnterpriseReport }), [requestEnterpriseReport]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-900/20"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 px-6 pt-5 pb-6 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner shadow-blue-900/30">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">确认生成报告</h2>
                    <p className="text-xs text-blue-100 mt-0.5">基于多维数据生成企业深度研报</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-5">
                <div className="rounded-xl border border-blue-100 bg-white px-4 py-3.5 shadow-sm shadow-blue-100/60">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <FileText size={13} className="text-blue-500" />
                    报告对象
                  </div>
                  <p className="mt-1.5 text-base font-semibold text-slate-900 truncate">{state.enterpriseName}</p>
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-6">
                  查看企业研报将消耗一次报告额度，是否确认生成？
                </p>
              </div>

              <div className="px-6 pt-5 pb-6 flex items-center justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-300/40 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Sparkles size={14} />
                  确认生成
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
