import type { FC } from "react";
import type { PGConfig } from "../config/pgConfig";
import { History, Settings } from "lucide-react";

interface HeaderProps {
  config: PGConfig;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  billCount: number;
}

export const Header: FC<HeaderProps> = ({
  config,
  onOpenHistory,
  onOpenSettings,
  billCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* PG Branding */}
        <div className="flex items-center gap-3 min-w-0">
          {config.logoUrl && (
            <img
              src={config.logoUrl}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-md border border-slate-200 p-0.5 bg-white shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate tracking-tight uppercase">
              {config.pgName}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Payment Receipt Generator
            </p>
          </div>
        </div>

        {/* Action Buttons: History & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="View Bill History"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {billCount > 0 && (
              <span className="ml-0.5 bg-slate-300 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {billCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Settings & PG Details"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
