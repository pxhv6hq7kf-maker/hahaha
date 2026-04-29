import { Outlet } from "react-router";
import AIChat from "./AIChat";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans text-slate-800">
      {/* 页面容器：统一宽度（建议1200px，自适应屏幕），居中布局，无横向滚动条；页面间距统一（上下内边距20px，左右内边距16px） */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-5 overflow-x-hidden pb-24">
        <Outlet />
      </main>
      
      {/* 全局底部 AI 对话框 */}
      <AIChat />
    </div>
  );
}
