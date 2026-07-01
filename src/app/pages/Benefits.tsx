import { useState, useEffect } from "react";
import { FileText, Clock, Receipt } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

interface BenefitRecord {
  id: number;
  title: string;
  enterprise: string;
  amount: number;
  type: "研报生成" | "补充权益" | "其他";
  time: string;
}

interface BenefitsData {
  total: number;
  used: number;
  records: BenefitRecord[];
}

const INITIAL_BENEFITS: BenefitsData = {
  total: 10,
  used: 2,
  records: [
    { id: 1, title: "宁德时代2024Q1深度研报", enterprise: "宁德时代", amount: 1, type: "研报生成", time: "2024-05-20 14:30" },
    { id: 2, title: "比亚迪年度投资价值分析", enterprise: "比亚迪", amount: 1, type: "研报生成", time: "2024-05-18 10:15" },
  ],
};

export default function Benefits() {
  const [data, setData] = useState<BenefitsData>({ total: 0, used: 0, records: [] });

  useEffect(() => {
    loadBenefits();
  }, []);

  const loadBenefits = () => {
    try {
      const raw = localStorage.getItem("benefits");
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        setData(INITIAL_BENEFITS);
        localStorage.setItem("benefits", JSON.stringify(INITIAL_BENEFITS));
      }
    } catch {
      setData({ total: 0, used: 0, records: [] });
    }
  };

  const remaining = Math.max(0, data.total - data.used);
  const progress = data.total > 0 ? Math.min(100, (remaining / data.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 面包屑 */}
      <section className="pt-4 pb-2">
        <Breadcrumb items={[
          { label: "个人中心", to: "/profile" },
          { label: "个人权益" }
        ]} />
      </section>

      {/* 剩余权益 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            剩余权益
          </h2>
          <span className="text-xs text-slate-400">权益可用于生成企业研报</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-blue-600">{remaining}</span>
              <span className="text-sm text-slate-400">次</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">已用 {data.used} 次 / 共 {data.total} 次</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">剩余比例</span>
            <p className="text-lg font-bold text-slate-700">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </section>

      {/* 权益消费记录 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            权益消费记录
          </h2>
          <span className="text-xs text-slate-400">共 {data.records.length} 条</span>
        </div>
        {data.records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <Receipt size={32} className="opacity-20" />
            <p className="text-sm">暂无消费记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.records.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm border flex-shrink-0 bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 border-indigo-200">
                    <FileText size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-700 block truncate">{rec.title}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock size={11} />
                      {rec.time}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">{rec.type}</span>
                  <span className="text-sm font-bold text-rose-500">-{rec.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
