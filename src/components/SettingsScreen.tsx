import React from 'react';
import { Settings, Volume2, VolumeX, Moon, Sun, RotateCcw, ShieldCheck, Info, Code2, ArrowRight } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetProgress: () => void;
  onOpenPrivacyModal: () => void;
  onOpenFlutterCode: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onOpenPrivacyModal,
  onOpenFlutterCode,
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Cài Đặt Ứng Dụng
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Tùy chỉnh trải nghiệm âm thanh, giao diện và dữ liệu ứng dụng.
        </p>
      </div>

      {/* Main Settings Group */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Âm thanh & Hiệu ứng</h4>
              <p className="text-[11px] text-slate-500">Phát âm thanh đúng/sai và giọng đọc từ vựng</p>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Chế độ tối (Dark Mode)</h4>
              <p className="text-[11px] text-slate-500">Giao diện màu tối giúp dịu mắt khi học đêm</p>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Flutter Source Code Banner */}
        <div
          onClick={onOpenFlutterCode}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Mã Nguồn Flutter & Google Play Guide</h4>
              <p className="text-[11px] text-indigo-100">Xem full code Dart, pubspec.yaml & hướng dẫn build .aab</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </div>
      </div>

      {/* Legal & App Info Group */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        {/* Privacy Policy */}
        <button
          onClick={onOpenPrivacyModal}
          className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-750 rounded-2xl transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Chính sách quyền riêng tư</h4>
              <p className="text-[10px] text-slate-500">Cam kết bảo mật dữ liệu local 100%</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Version Info */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Phiên bản ứng dụng</h4>
              <p className="text-[10px] text-slate-500">Quiz Vocab v{settings.version}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">Production Ready</span>
        </div>
      </div>

      {/* Reset Progress Danger Zone */}
      <div className="p-4 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          Đặt lại tiến độ học tập
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Xóa toàn bộ điểm số, chuỗi streak và danh sách từ sai đã lưu.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập?')) {
              onResetProgress();
            }
          }}
          className="mt-2 py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition active:scale-95"
        >
          Xóa & Reset tiến độ
        </button>
      </div>
    </div>
  );
};
