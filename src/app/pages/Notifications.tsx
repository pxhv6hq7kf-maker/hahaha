import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Bell, Check, Trash2, FileText, Search, Clock, AlertCircle } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

interface Notification {
  id: string;
  type: "generation_complete" | "generation_notify" | "generation_failed" | "system";
  title: string;
  content?: string;
  time: string;
  read: boolean;
  enterpriseId?: string;
  enterpriseName?: string;
}

function getEnterpriseName(item: Notification) {
  return item.enterpriseName || item.title.replace(/^已设置提醒：/, "").replace(/\s*研报生成完成.*$/, "").replace(/\s*生成完成后将通知您.*$/, "");
}

export default function Notifications() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      let list: Notification[] = JSON.parse(localStorage.getItem("notifications") || "[]");
      // 首次访问注入一条"生成失败需要重试"的消息示例（仅注入一次）
      const sampleAdded = localStorage.getItem("notifications_failed_sample_added") === "true";
      const hasFailedRecord = Array.isArray(list) && list.some(n => n.type === "generation_failed");
      if (!sampleAdded && !hasFailedRecord) {
        const sample: Notification = {
          id: "sample_failed_1",
          type: "generation_failed",
          title: "寒武纪 研报生成失败",
          content: "研报生成失败，请重试",
          time: "12:30",
          read: false,
          enterpriseId: "4",
          enterpriseName: "寒武纪",
        };
        list = [sample, ...(Array.isArray(list) ? list : [])];
        localStorage.setItem("notifications", JSON.stringify(list));
      }
      localStorage.setItem("notifications_failed_sample_added", "true");
      setNotifications(list);
    } catch {
      setNotifications([]);
    }
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("确定清空所有通知吗？")) {
      setNotifications([]);
      localStorage.setItem("notifications", JSON.stringify([]));
    }
  };

  const deleteOne = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markOneRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationContent = (item: Notification, clickable: boolean) => (
    <>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        item.type === "generation_complete" ? "bg-emerald-100 text-emerald-600" :
        item.type === "generation_notify" ? "bg-amber-100 text-amber-600" :
        item.type === "generation_failed" ? "bg-rose-100 text-rose-600" :
        "bg-blue-100 text-blue-600"
      }`}>
        {item.type === "generation_complete" ? <FileText size={16} /> :
         item.type === "generation_failed" ? <AlertCircle size={16} /> :
         <Bell size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {!item.read && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>}
          <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
        </div>
        {item.content && (
          <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock size={11} />
            {item.time}
          </span>
          {clickable && (
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
              <Search size={11} />
              查看企业详情
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-6 pb-10 fade-in">
      <section className="pt-4 pb-2 flex items-center justify-center relative">
        <div className="absolute left-0">
          <Breadcrumb items={from === "profile"
            ? [
                { label: "个人中心", to: "/profile" },
                { label: "消息中心" }
              ]
            : [
                { label: "消息中心" }
              ]
          } />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <Bell size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">消息中心</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              共 {notifications.length} 条通知，{unreadCount} 条未读
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {unreadCount > 0 && (
            <span className="text-rose-500 font-medium">您有 {unreadCount} 条新消息</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          >
            <Check size={14} />
            全部已读
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
          >
            <Trash2 size={14} />
            清空全部
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Bell size={40} className="opacity-20" />
            <p className="text-sm">暂无通知</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => {
              const enterpriseName = getEnterpriseName(item);
              const clickable = Boolean(item.enterpriseId && enterpriseName);
              const className = `p-4 flex items-start gap-3 transition-colors group ${item.read ? "bg-white" : "bg-blue-50/40"} hover:bg-slate-50 ${clickable ? "cursor-pointer" : ""}`;

              return clickable ? (
                <Link
                  key={item.id}
                  to={`/enterprise/${encodeURIComponent(item.enterpriseId as string)}?enterpriseName=${encodeURIComponent(enterpriseName)}`}
                  onClick={() => markOneRead(item.id)}
                  className={className}
                >
                  {renderNotificationContent(item, true)}
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      deleteOne(item.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </Link>
              ) : (
                <div key={item.id} className={className}>
                  {renderNotificationContent(item, false)}
                  <button
                    onClick={() => deleteOne(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
