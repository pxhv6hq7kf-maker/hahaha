import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { RefreshCw, CheckCircle2, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { REGIONS } from "../data/regions";

const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCaptcha(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return s;
}

const CAPTCHA_COLORS = ["#2563eb", "#7c3aed", "#db2777", "#059669", "#d97706", "#475569"];

function CaptchaImage({ value }: { value: string }) {
  const chars = value.split("");
  return (
    <svg width="100" height="40" viewBox="0 0 100 40" className="rounded-lg bg-slate-50">
      {/* 干扰线 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={i}
          x1={(i * 27) % 100}
          y1={(i * 13 + 5) % 40}
          x2={(i * 41 + 20) % 100}
          y2={(i * 19 + 25) % 40}
          stroke={CAPTCHA_COLORS[i % CAPTCHA_COLORS.length]}
          strokeWidth="1"
          opacity="0.35"
        />
      ))}
      {/* 干扰点 */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 7 + 3) % 100}
          cy={(i * 11 + 4) % 40}
          r="1"
          fill={CAPTCHA_COLORS[i % CAPTCHA_COLORS.length]}
          opacity="0.4"
        />
      ))}
      {/* 字符 */}
      {chars.map((ch, i) => {
        const rotate = (Math.random() - 0.5) * 30;
        const color = CAPTCHA_COLORS[i % CAPTCHA_COLORS.length];
        return (
          <text
            key={i}
            x={18 + i * 22}
            y={27}
            fontSize="22"
            fontWeight="700"
            fontFamily="Georgia, serif"
            fill={color}
            transform={`rotate(${rotate} ${18 + i * 22} 20)`}
            style={{ userSelect: "none" }}
          >
            {ch}
          </text>
        );
      })}
    </svg>
  );
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  position: string;
  region: string;
  captcha: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  department: "",
  position: "",
  region: "",
  captcha: "",
};

export default function BenefitApply() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [agree, setAgree] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "agree", string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);

  const updateField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setForm(prev => ({ ...prev, captcha: "" }));
  };

  const validate = useCallback(() => {
    const next: Partial<Record<keyof FormState | "agree", string>> = {};
    if (!form.name.trim()) next.name = "请输入您的姓名";
    if (!form.phone.trim()) next.phone = "请输入您的手机号";
    else if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) next.phone = "请输入正确的手机号";
    if (!form.email.trim()) next.email = "请输入您的工作邮箱";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "请输入正确的邮箱地址";
    if (!form.company.trim()) next.company = "请输入您的公司/机构";
    if (!form.department.trim()) next.department = "请输入您的部门";
    if (!form.position.trim()) next.position = "请输入您的职位";
    if (!form.region.trim()) next.region = "请选择所属地域";
    if (!form.captcha.trim()) next.captcha = "请输入图形验证码";
    else if (form.captcha.trim().toUpperCase() !== captchaCode) next.captcha = "验证码不正确";
    if (!agree) next.agree = "请勾选同意客户经理联系您";
    return next;
  }, [form, agree, captchaCode]);

  const handleSubmit = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // 验证码错误时刷新
      if (next.captcha) refreshCaptcha();
      return;
    }
    setSubmitted(true);
  };

  const fields: { key: keyof FormState; label: string; placeholder: string; type?: string; maxLength?: number }[] = [
    { key: "name", label: "您的姓名", placeholder: "请输入姓名", maxLength: 20 },
    { key: "phone", label: "您的手机号", placeholder: "请输入手机号", type: "tel", maxLength: 11 },
    { key: "email", label: "您的工作邮箱", placeholder: "请输入工作邮箱", type: "email" },
    { key: "company", label: "您的公司/机构", placeholder: "请输入公司或机构名称", maxLength: 50 },
    { key: "department", label: "您的部门", placeholder: "请输入部门", maxLength: 30 },
    { key: "position", label: "您的职位", placeholder: "请输入职位", maxLength: 30 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      {/* 面包屑 */}
      <section className="pt-4 pb-2">
        <Breadcrumb items={[
          { label: "权益申请" }
        ]} />
      </section>

      {/* 申请表单 */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            申请信息
          </h2>
          <span className="text-xs text-rose-500">* 为必填项</span>
        </div>

        <div className="flex flex-col gap-4 max-w-[480px] mx-auto w-full">
          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {f.label} <span className="text-rose-500">*</span>
              </label>
              <input
                type={f.type || "text"}
                value={form[f.key]}
                maxLength={f.maxLength}
                placeholder={f.placeholder}
                onChange={e => updateField(f.key, e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white outline-none transition-colors ${
                  errors[f.key]
                    ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors[f.key] && <span className="text-xs text-rose-500">{errors[f.key]}</span>}
            </div>
          ))}

          {/* 所属地域 - 树形选择 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              所属地域 <span className="text-rose-500">*</span>
            </label>
            <Popover open={regionOpen} onOpenChange={setRegionOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg border bg-white outline-none transition-colors text-left ${
                    errors.region
                      ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                >
                  <span className={`flex items-center gap-1.5 ${form.region ? "text-slate-700" : "text-slate-400"}`}>
                    <MapPin size={14} className={form.region ? "text-blue-500" : "text-slate-300"} />
                    {form.region || "请选择所属地域"}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${regionOpen ? "rotate-180" : ""}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-80 overflow-y-auto p-1.5" align="start">
                {REGIONS.map(province => (
                  <div key={province.name}>
                    <button
                      type="button"
                      onClick={() => setExpandedProvince(prev => prev === province.name ? null : province.name)}
                      className="w-full flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left"
                    >
                      {expandedProvince === province.name
                        ? <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                        : <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />}
                      {province.name}
                    </button>
                    {expandedProvince === province.name && (
                      <div className="ml-4 border-l border-slate-100 pl-1.5">
                        {province.cities.map(city => {
                          const active = form.region === `${province.name} / ${city}`;
                          return (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                updateField("region", `${province.name} / ${city}`);
                                setExpandedProvince(null);
                                setRegionOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-sm rounded-md transition-colors ${
                                active
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {city}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            {errors.region && <span className="text-xs text-rose-500">{errors.region}</span>}
          </div>

          {/* 图形验证码 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              图形验证码 <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.captcha}
                maxLength={4}
                placeholder="请输入验证码"
                onChange={e => updateField("captcha", e.target.value)}
                className={`flex-1 px-3.5 py-2.5 text-sm rounded-lg border bg-white outline-none transition-colors uppercase ${
                  errors.captcha
                    ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0"
                title="点击刷新验证码"
              >
                <CaptchaImage value={captchaCode} />
                <RefreshCw size={14} className="ml-1" />
              </button>
            </div>
            {errors.captcha && <span className="text-xs text-rose-500">{errors.captcha}</span>}
          </div>
        </div>

        {/* 勾选项 */}
        <div className="mt-5 pt-4 border-t border-slate-100 max-w-[480px] mx-auto w-full">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => {
                setAgree(e.target.checked);
                setErrors(prev => (prev.agree ? { ...prev, agree: undefined } : prev));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200 cursor-pointer"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              允许中知数通客户经理联系我 <span className="text-rose-500">*</span>
            </span>
          </label>
          {errors.agree && <span className="text-xs text-rose-500 mt-1 block">{errors.agree}</span>}
        </div>

        {/* 提交按钮 */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            提交申请
          </button>
        </div>
      </section>

      {/* 提交成功弹窗 */}
      {submitted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="w-full max-w-[360px] rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={16} />
                </span>
                <h2 className="text-base font-semibold text-slate-800">提交成功</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                您的权益申请已提交，我们将在 1-3 个工作日内与您联系，请保持手机畅通。
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => navigate("/benefits")}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
