import React from 'react';
import { BarChart3, Flame, Award, CheckCircle2, BookOpen, Trophy, Sparkles, Zap } from 'lucide-react';
import { UserProgress } from '../types';
import { TOPICS } from '../data/vocabulary';

interface ProgressScreenProps {
  progress: UserProgress;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress }) => {
  const totalTopicsLearned = Object.keys(progress.topicStats).length;
  const overallAccuracy =
    progress.totalQuestions > 0
      ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
      : 0;

  // Calculate circular stroke offset
  const circumference = 2 * Math.PI * 48; // r = 48
  const strokeOffset = circumference - (overallAccuracy / 100) * circumference;

  let ratingText = 'Chưa xếp loại';
  let ratingColor = 'text-slate-500';
  if (overallAccuracy >= 85) {
    ratingText = 'Xuất sắc';
    ratingColor = 'text-emerald-500';
  } else if (overallAccuracy >= 70) {
    ratingText = 'Tốt';
    ratingColor = 'text-indigo-600 dark:text-indigo-400';
  } else if (overallAccuracy >= 50) {
    ratingText = 'Khá';
    ratingColor = 'text-amber-500';
  } else if (progress.totalQuestions > 0) {
    ratingText = 'Cần luyện thêm';
    ratingColor = 'text-rose-500';
  }

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Tiến Độ Học Tập
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Thống kê kết quả luyện tập, chuỗi streak và tỷ lệ chính xác.
        </p>
      </div>

      {/* Main Accuracy Ring Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg shadow-indigo-100 dark:shadow-none flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-slate-100 dark:text-slate-700"
            />
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="url(#accuracyGradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {overallAccuracy}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Chính xác
            </span>
          </div>
        </div>

        <div>
          <p className={`text-sm font-black ${ratingColor}`}>
            Xếp loại: {ratingText}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Dựa trên {progress.totalQuestions} câu hỏi trắc nghiệm đã làm
          </p>
        </div>
      </div>

      {/* Streak Hero Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-amber-100">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            Chuỗi ngày học tập
          </div>
          <h3 className="text-2xl font-black">{progress.streakDays} Ngày Liên Tiếp</h3>
          <p className="text-xs text-amber-100">Duy trì thói quen học mỗi ngày để nâng cao phản xạ!</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shrink-0">
          🔥
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{progress.totalQuizzes}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng bài Quiz</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{progress.totalCorrect}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Từ trả lời đúng</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{progress.highScore}%</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm cao nhất</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{totalTopicsLearned}/8</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chủ đề đã học</div>
        </div>
      </div>

      {/* Topics Mastery Breakdown */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Tiến độ từng Chủ đề ({totalTopicsLearned}/8)
          </h3>
        </div>

        <div className="space-y-3">
          {TOPICS.map((topic) => {
            const stats = progress.topicStats[topic.id];
            const score = stats ? stats.highestScore : 0;

            return (
              <div key={topic.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {topic.title} ({topic.titleVi})
                  </span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">
                    {score}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

