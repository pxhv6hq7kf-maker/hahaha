import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Download, Printer, Share2, FileText, CheckCircle2 } from "lucide-react";

export default function Report() {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const enterpriseId = searchParams.get("enterpriseId");
  const navigate = useNavigate();

  const handleBack = () => {
    if (enterpriseId) {
      navigate(`/enterprise/${enterpriseId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in min-h-[80vh]">
      {/* Header Actions */}
      <section className="flex items-center justify-between pt-4 pb-4 border-b border-slate-200">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">返回企业页</span>
        </button>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
            <Printer size={18} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
            <Download size={16} />
            下载 PDF
          </button>
        </div>
      </section>

      {/* Report Content Mock */}
      <section className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-10 lg:p-16 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <FileText size={16} />
            深度研究报告
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            2024年第一季度企业深度洞察与投资价值分析报告
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>报告编号：{reportId || "R-20240501"}</span>
            <span>发布机构：产业大脑研究院</span>
            <span>日期：2024-05-20</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="lead text-lg text-slate-600 mb-8 border-l-4 border-blue-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
            本报告基于多维数据模型，对目标企业的核心竞争力、市场占位、财务健康度及未来发展潜力进行了全面评估。
          </p>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="text-blue-600" size={20} />
            一、核心观点摘要
          </h3>
          <ul className="space-y-3 text-slate-600 mb-8">
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>企业在细分赛道保持领先地位，市占率稳步提升至35%以上。</p></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>得益于新一代产品的规模化量产，Q1毛利率环比改善，盈利能力增强。</p></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><p>海外市场拓展顺利，预计全年海外营收占比将突破20%。</p></li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="text-blue-600" size={20} />
            二、行业背景与市场空间
          </h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            随着全球数字化转型的深入，所属行业正处于高速成长期。政策红利持续释放，上下游产业链协同效应显著。预计未来三年，该领域市场规模复合年增长率将维持在15%左右，呈现出广阔的蓝海特征。
          </p>
          <div className="h-48 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm mb-8 italic">
            [图表占位：行业市场规模增长趋势预测图]
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="text-blue-600" size={20} />
            三、财务表现分析
          </h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            从近期披露的财报数据来看，企业营收结构进一步优化。研发投入占总营收比例达12%，为后续技术壁垒的构筑提供了强有力的支撑。现金流状况良好，资产负债率处于行业安全区间。
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
              <div className="text-2xl font-bold text-blue-700 mb-1">+45%</div>
              <div className="text-xs text-slate-500">同比营收增长</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-1">18.5%</div>
              <div className="text-xs text-slate-500">净利润率</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
              <div className="text-2xl font-bold text-purple-700 mb-1">3.2亿</div>
              <div className="text-xs text-slate-500">经营性净现金流</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
