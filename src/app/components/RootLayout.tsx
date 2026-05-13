import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { User, Flame, Bell } from "lucide-react";
import AIChat from "./AIChat";

export default function RootLayout() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

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
    try {
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const updated = notifications.map((n: { read?: boolean }) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans text-slate-800">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg"><Flame size={16} /></span>
            <span className="font-bold text-lg">研知</span>
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

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-5 overflow-x-hidden pb-24">
        <Outlet />
      </main>

      <AIChat />
    </div>
  );
}
