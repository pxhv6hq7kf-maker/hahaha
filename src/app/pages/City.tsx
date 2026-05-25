import { useParams, Link, useSearchParams } from "react-router";
import { MapPin, Factory, Users, Building2, TrendingUp, ChevronRight } from "lucide-react";
import { CITIES } from "../data/cities";
import Breadcrumb from "../components/Breadcrumb";

export default function City() {
  const { cityId } = useParams();
  const [searchParams] = useSearchParams();
  const cityName = searchParams.get("cityName") || decodeURIComponent(cityId || "");
  const city = CITIES.find(c => c.id === cityId || c.name === cityName) || CITIES[0];

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 1. 顶部区域：面包屑 + 城市头 */}
      <section className="pt-4 pb-2 flex items-center justify-center relative">
        <div className="absolute left-0">
          <Breadcrumb items={[{ label: city.name }]} />
        </div>
      </section>

      {/* 2. 城市头部信息区 */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
        {/* 背景装饰 */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-cyan-300" />
                <h1 className="text-3xl font-bold tracking-tight">{city.name}</h1>
              </div>
              <div className="flex gap-2 flex-wrap">
                {city.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 核心数据三卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/8 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-xs text-white/60 mb-1.5 flex items-center gap-1">
                <Factory size={12} />
                产业体系
              </div>
              <div className="text-lg font-semibold text-white">{city.industrySystem}</div>
            </div>
            <div className="bg-white/8 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-xs text-white/60 mb-1.5 flex items-center gap-1">
                <TrendingUp size={12} />
                产业总产值
              </div>
              <div className="text-lg font-semibold text-cyan-300">{city.output}</div>
            </div>
            <div className="bg-white/8 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-xs text-white/60 mb-1.5 flex items-center gap-1">
                <Users size={12} />
                产业从业人员
              </div>
              <div className="text-lg font-semibold text-emerald-300">{city.employees}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 产业发展概况区 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
          <h2 className="text-base font-bold text-slate-800">产业发展概况</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：概况文字 */}
          <div className="lg:col-span-2">
            <p className="text-sm text-slate-600 leading-relaxed">{city.overview}</p>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">区域内企业总数</div>
                <div className="text-2xl font-bold text-slate-800">{city.totalEnterprises.toLocaleString()}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">上市企业数</div>
                <div className="text-2xl font-bold text-blue-600">{city.listedEnterprises}</div>
              </div>
            </div>
          </div>

          {/* 右侧：核心指标 */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
              <Building2 size={12} />
              产业发展核心指标
            </div>
            <div className="space-y-2.5">
              {city.coreMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600">{metric.label}</span>
                  <span className="text-sm font-semibold text-slate-800">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 重点产业区 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          <h2 className="text-base font-bold text-slate-800">重点产业</h2>
        </div>

        <div className="space-y-5">
          {(() => {
            // 按分组渲染
            const groups: { name: string; industries: string[] }[] = [];
            let currentGroup: { name: string; industries: string[] } | null = null;
            city.industries.forEach((ind) => {
              if (ind.isGroup) {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = { name: ind.name, industries: [] };
              } else {
                if (currentGroup) {
                  currentGroup.industries.push(ind.name);
                } else {
                  currentGroup = { name: "其他重点产业", industries: [ind.name] };
                }
              }
            });
            if (currentGroup) groups.push(currentGroup);

            return groups.map((group) => (
              <div key={group.name}>
                <div className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {group.name}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {group.industries.map((ind) => (
                    <Link
                      key={ind}
                      to={`/industry/${encodeURIComponent(ind)}?industryName=${encodeURIComponent(ind)}&cityName=${encodeURIComponent(city.name)}`}
                      className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100 hover:border-emerald-200 transition-all group"
                    >
                      <span className="truncate">{ind}</span>
                      <ChevronRight size={12} className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </section>
    </div>
  );
}
