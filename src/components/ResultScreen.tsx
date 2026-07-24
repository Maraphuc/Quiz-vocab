import React from 'react';
import { Trophy, RotateCcw, Grid, Bookmark, CheckCircle2, XCircle, Award, Sparkles, ArrowRight } from 'lucide-react';
import { VocabWord } from '../types';

interface ResultScreenProps {
  topicTitle: string;
  correctCount: number;
  totalQuestions: number;
  wrongWords: VocabWord[];
  onRetry: () => void;
  onSelectAnotherTopic: () => void;
  onReviewWrongWords: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  topicTitle,
  correctCount,
  totalQuestions,
  wrongWords,
  onRetry,
  onSelectAnotherTopic,
  onReviewWrongWords,
}) => {
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let rating: 'Xuất sắc' | 'Tốt' | 'Cần luyện thêm' = 'Cần luyện thêm';
  let ratingColor = 'text-amber-500 bg-amber-500/10';
  let badgeIcon = <Award className="w-6 h-6 text-amber-500" />;

  if (percentage >= 80) {
    rating = 'Xuất sắc';
    ratingColor = 'text-emerald-500 bg-emerald-500/10';
    badgeIcon = <Trophy className="w-6 h-6 text-emerald-500" />;
  } else if (percentage >= 60) {
    rating = 'Tốt';
    ratingColor = 'text-indigo-500 bg-indigo-500/10';
    badgeIcon = <Sparkles className="w-6 h-6 text-indigo-500" />;
  }

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-center">
      {/* Result Hero Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shadow-inner">
          {badgeIcon}
        </div>

        <div className="space-y-1">
          <span className={`inline-block px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider ${ratingColor}`}>
            Đạt {rating}
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {percentage}%
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {topicTitle}
          </p>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div className="text-left">
              <div className="text-base font-black">{correctCount} câu</div>
              <div className="text-[10px] opacity-80">Trả lời đúng</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500" />
            <div className="text-left">
              <div className="text-base font-black">{wrongWords.length} câu</div>
              <div className="text-[10px] opacity-80">Trả lời sai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wrong Words Quick Preview */}
      {wrongWords.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-600" />
              Đã lưu {wrongWords.length} từ cần ôn lại
            </span>
            <button
              onClick={onReviewWrongWords}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-400 underline hover:text-amber-900"
            >
              Ôn ngay
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {wrongWords.map((w, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
              >
                {w.word} ({w.meaning})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3 Main Action Buttons (Req 5) */}
      <div className="space-y-2.5">
        <button
          onClick={onRetry}
          className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại bài quiz này</span>
        </button>

        <button
          onClick={onSelectAnotherTopic}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <Grid className="w-4 h-4" />
          <span>Chọn chủ đề khác</span>
        </button>

        {wrongWords.length > 0 && (
          <button
            onClick={onReviewWrongWords}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-sm border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Bookmark className="w-4 h-4" />
            <span>Xem từ sai & Luyện tập riêng ({wrongWords.length} từ)</span>
          </button>
        )}
      </div>
    </div>
  );
};
