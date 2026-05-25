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

      {/* 3. 区域发展概况区 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
          <h2 className="text-base font-bold text-slate-800">区域发展概况</h2>
        </div>

        <div>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">{city.overview}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "区域内企业总数", value: city.totalEnterprises.toLocaleString(), highlight: true },
              { label: "上市企业数", value: city.listedEnterprises, highlight: true },
              ...city.coreMetrics,
            ].map((metric) => (
              <div key={metric.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Building2 size={11} className="text-slate-300" />
                  {metric.label}
                </div>
                <div className={`text-xl font-bold ${metric.highlight ? "text-blue-600" : "text-slate-800"}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 产业链空间分布 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
          <h2 className="text-base font-bold text-slate-800">产业链空间分布</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 左侧：空间分布说明 */}
          <div className="lg:col-span-1 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
            <div className="text-sm font-semibold text-slate-800 mb-2">空间格局判断</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {city.name}产业链呈现“核心城区研发设计 + 重点园区中试转化 + 外围制造基地规模化”的空间分布特征。核心创新资源集中于高新区、经开区和国家级新区，先进制造环节沿交通廊道与产业园区外溢。
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "研发设计", value: "核心区" },
                { label: "中试转化", value: "高新区" },
                { label: "规模制造", value: "产业园" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white p-2 border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 mb-0.5">{item.label}</div>
                  <div className="text-xs font-semibold text-blue-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：城区/园区卡片 */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                area: `${city.name}高新区`,
                role: "研发创新核心区",
                industries: city.industries.filter(i => !i.isGroup).slice(0, 3).map(i => i.name),
                feature: "高校院所、创新平台和科技企业密集，承担技术源头创新与早期孵化。",
              },
              {
                area: `${city.name}经开区`,
                role: "先进制造承载区",
                industries: city.industries.filter(i => !i.isGroup).slice(3, 6).map(i => i.name),
                feature: "面向产业化和规模制造，聚集链主企业、核心零部件和供应链配套。",
              },
              {
                area: `${city.name}临港/空港片区`,
                role: "开放协同枢纽区",
                industries: city.industries.filter(i => !i.isGroup).slice(6, 9).map(i => i.name),
                feature: "连接外贸、物流、保税与跨境研发协同，适合高附加值制造和国际业务布局。",
              },
              {
                area: `${city.name}新城/新区`,
                role: "未来产业拓展区",
                industries: city.industries.filter(i => !i.isGroup).slice(9, 12).map(i => i.name),
                feature: "承接未来产业、数字经济和绿色低碳项目，具备土地、基金和政策组合优势。",
              },
            ].map((area) => (
              <div key={area.area} className="rounded-xl border border-slate-100 bg-white p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{area.area}</div>
                    <div className="text-xs text-blue-600 mt-0.5">{area.role}</div>
                  </div>
                  <MapPin size={16} className="text-slate-300 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {area.industries.map((ind) => (
                    <Link
                      key={ind}
                      to={`/industry/${encodeURIComponent(ind)}?industryName=${encodeURIComponent(ind)}&cityName=${encodeURIComponent(city.name)}`}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      {ind}
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{area.feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 重点产业区 */}
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
