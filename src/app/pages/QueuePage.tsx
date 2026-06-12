import { useNavigate, useSearchParams } from "react-router";
import { Loader2, ArrowLeft } from "lucide-react";

export default function QueuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enterpriseName = searchParams.get("enterpriseName") || "智元机器人";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center px-4">
      {/* Status Icon */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-amber-100 to-orange-100">
        <Loader2 size={36} className="text-amber-600 animate-spin" />
      </div>

      {/* Status Text */}
      <h1 className="text-xl font-bold text-slate-800 mb-3">任务等待中</h1>
      <p className="text-sm text-slate-500 mb-8 text-center leading-8">
        前方排队人数较多，请耐心等待……
        <br />
        您可返回继续浏览，完成后将通过消息中心提示您。
      </p>

      {/* Action Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={16} /> 返回
      </button>

    </div>
  );
}
