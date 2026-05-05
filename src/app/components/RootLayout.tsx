import { Outlet, Link, useLocation } from "react-router";
import { User, Flame } from "lucide-react";
import AIChat from "./AIChat";

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans text-slate-800">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg"><Flame size={16} /></span>
            <span className="font-bold text-lg">研知</span>
          </Link>
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
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-5 overflow-x-hidden pb-24">
        <Outlet />
      </main>

      <AIChat />
    </div>
  );
}
