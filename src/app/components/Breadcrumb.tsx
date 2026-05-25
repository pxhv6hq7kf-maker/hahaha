import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-1 text-xs">
      <Link
        to="/home"
        className="flex items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors font-medium"
      >
        <Home size={12} />
        <span className="hidden sm:inline">首页</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-slate-300" />
          {item.to && index < items.length - 1 ? (
            <Link
              to={item.to}
              className="text-slate-400 hover:text-blue-500 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600 font-medium truncate max-w-[160px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
