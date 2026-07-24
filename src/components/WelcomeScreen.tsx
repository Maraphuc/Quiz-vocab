import React from 'react';
import { Play, LineChart, Flame, Sparkles, BookOpen, Trophy, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProgress, ScreenTab } from '../types';

interface WelcomeScreenProps {
  progress: UserProgress;
  onStartLearning: () => void;
  onViewProgress: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  progress,
  onStartLearning,
  onViewProgress,
  onSelectTopic,
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Chỉnh phục A1 - B2
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 fill-amber-400" />
              {progress.streakDays} ngày liên tiếp
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Học Từ Vựng Tiếng Anh Trắc Nghiệm
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed max-w-xs">
              Phương pháp ghi nhớ từ vựng qua phản xạ trắc nghiệm thông minh, ôn từ sai tự động.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-lg font-black text-white">{progress.totalQuizzes}</div>
              <div className="text-[10px] text-indigo-200">Bài Quiz</div>
            </div>
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-lg font-black text-emerald-300">{progress.totalCorrect}</div>
              <div className="text-[10px] text-indigo-200">Từ đã đúng</div>
            </div>
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-lg font-black text-amber-300">{progress.highScore}%</div>
              <div className="text-[10px] text-indigo-200">Điểm cao nhất</div>
            </div>
          </div>

          {/* Two Main Action Buttons (Req 1) */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={onStartLearning}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu học</span>
            </button>
            <button
              onClick={onViewProgress}
              className="py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 border border-white/20"
            >
              <LineChart className="w-4 h-4" />
              <span>Xem tiến độ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">8 Chủ Đề</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">80+ từ vựng phong phú kèm phát âm</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ôn Từ Sai</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tự động lưu và luyện riêng từ chưa nhớ</p>
          </div>
        </div>
      </div>

      {/* Popular Topics Quick Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Chủ đề đề xuất
          </h3>
          <button
            onClick={onStartLearning}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Tất cả chủ đề <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <div
            onClick={() => onSelectTopic('everyday')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                ☀️
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Everyday Life (Cuộc sống hàng ngày)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">10 câu hỏi • Trình độ A1-A2</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>

          <div
            onClick={() => onSelectTopic('work')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                💼
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  Work (Công việc & Văn phòng)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">10 câu hỏi • Trình độ A2-B2</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};
