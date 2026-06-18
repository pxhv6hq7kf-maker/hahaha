import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { User, Flame, Bell } from "lucide-react";
import AIChat from "./AIChat";
import { ConfirmProvider } from "./ConfirmDialog";

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lang, setLang] = useState<"zh" | "en">(() => {
    return (localStorage.getItem("app_lang") as "zh" | "en") || "zh";
  });

  const toggleLang = () => {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("app_lang", next);
  };

  useEffect(() => {
    const updateCount = () => {
      try {
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        setUnreadCount(notifications.filter((n: { read?: boolean }) => !n.read).length);
      } catch {
        setUnreadCount(0);
      }
    };
    updateCount();
    const handler = () => updateCount();
    window.addEventListener("storage", handler);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  const handleBellClick = () => {
    navigate("/notifications?from=header");
  };

  return (
    <ConfirmProvider>
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans text-slate-800">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg"><Flame size={16} /></span>
            <span className="font-bold text-lg">
              {lang === "en" ? <span className="font-sans font-oblique" style={{ fontWeight: "bold" }}>GoldSight</span> : "视金"}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* 通知铃铛 */}
            <button
              onClick={handleBellClick}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* 隐藏的清除缓存按钮，hover 显示提示 */}
            <button
              onClick={() => {
                if (confirm("确定清除所有企业缓存吗？清除后所有企业会回到首次生成状态。")) {
                  Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('enterprise_result_') || key === 'notifications') {
                      localStorage.removeItem(key);
                    }
                  });
                  sessionStorage.removeItem('generating_enterprises');
                  location.reload();
                }
              }}
              className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors opacity-50 hover:opacity-100"
              title="一键清除所有企业缓存"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                清除缓存
              </span>
            </button>

            {/* 语言切换 */}
            <button
              onClick={toggleLang}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
              title={lang === "zh" ? "Switch to English" : "切换到中文"}
            >
              {lang === "zh" ? "EN" : "中"}
            </button>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <User size={18} />
              个人中心
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-5 overflow-x-hidden pb-10">
        <Outlet />
      </main>

      {/* <AIChat /> */}
    </div>
    </ConfirmProvider>
  );
}
