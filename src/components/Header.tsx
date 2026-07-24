import React from 'react';
import { Flame, Volume2, VolumeX, Moon, Sun, Smartphone, Code2, Sparkles } from 'lucide-react';
import { AppSettings, ScreenTab } from '../types';

interface HeaderProps {
  settings: AppSettings;
  streakDays: number;
  activeTab: ScreenTab;
  isMobileFrame: boolean;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onToggleFrame: () => void;
  onOpenFlutterCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  streakDays,
  isMobileFrame,
  onUpdateSettings,
  onToggleFrame,
  onOpenFlutterCode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* App Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base leading-none bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Quiz Vocab
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              A1 - B2 English
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{streakDays} ngày</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={settings.darkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
          >
            {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Mobile Frame Toggle */}
          <button
            onClick={onToggleFrame}
            className={`p-1.5 rounded-lg transition ${
              isMobileFrame
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isMobileFrame ? 'Khung thiết bị di động' : 'Toàn màn hình'}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Flutter Code Modal Button */}
          <button
            onClick={onOpenFlutterCode}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition"
            title="Xem mã nguồn Flutter & Hướng dẫn Google Play"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code Flutter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
