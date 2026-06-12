import { useNavigate, useSearchParams } from "react-router";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function GenerationFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enterpriseName = searchParams.get("enterpriseName") || "宇树科技";

  const handleRetry = () => {
    navigate(`/queue?enterpriseName=${encodeURIComponent(enterpriseName)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center px-4">
      {/* Status Icon */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-rose-100 to-red-100">
        <AlertCircle size={36} className="text-rose-600" />
      </div>

      {/* Status Text */}
      <h1 className="text-xl font-bold text-slate-800 mb-3">生成失败</h1>
      <p className="text-sm text-slate-500 mb-8 text-center leading-8">
        {enterpriseName} 的研报生成失败，请重试。
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} /> 重试
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-700 transition-colors"
        >
          返回
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-400 mt-6 text-center">
        如多次重试仍失败，请联系客服
      </p>
    </div>
  );
}
