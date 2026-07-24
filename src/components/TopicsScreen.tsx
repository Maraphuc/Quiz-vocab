import React, { useState } from 'react';
import { Search, Sun, GraduationCap, Briefcase, Plane, Utensils, Laptop, HeartPulse, TrendingUp, Play, CheckCircle2, Trophy } from 'lucide-react';
import { TOPICS } from '../data/vocabulary';
import { Topic, UserProgress } from '../types';

interface TopicsScreenProps {
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
}

export const TopicsScreen: React.FC<TopicsScreenProps> = ({ progress, onSelectTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Plane': return <Plane className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const filteredTopics = TOPICS.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.titleVi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || topic.level.includes(selectedLevel);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          Chủ Đề Từ Vựng
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Chọn chủ đề phù hợp để bắt đầu bài quiz 10 câu hỏi trắc nghiệm.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả cấp độ' : `Trình độ ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTopics.map((topic, index) => {
          const stats = progress.topicStats[topic.id];
          const hasLearned = stats && stats.completedCount > 0;

          // Vibrant card color themes matching Screen 1 in design mockup
          const themeStyles = [
            { bg: 'bg-blue-50/80 dark:bg-blue-950/30', border: 'border-blue-100 dark:border-blue-900/50', badge: 'text-blue-500 bg-blue-500/10' },
            { bg: 'bg-purple-50/80 dark:bg-purple-950/30', border: 'border-purple-100 dark:border-purple-900/50', badge: 'text-purple-500 bg-purple-500/10' },
            { bg: 'bg-orange-50/80 dark:bg-orange-950/30', border: 'border-orange-100 dark:border-orange-900/50', badge: 'text-orange-500 bg-orange-500/10' },
            { bg: 'bg-emerald-50/80 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/50', badge: 'text-emerald-500 bg-emerald-500/10' },
          ];

          const currentTheme = themeStyles[index % themeStyles.length];

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`relative overflow-hidden p-4 rounded-3xl ${currentTheme.bg} border ${currentTheme.border} shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${topic.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}
                  >
                    {getTopicIcon(topic.icon)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] shadow-xs">
                      {topic.level}
                    </span>
                    {hasLearned && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.highestScore}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {topic.title}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {topic.titleVi}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Footer Row */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
                  {topic.questionCount} từ vựng
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs group-hover:bg-indigo-700 transition flex items-center gap-1">
                  <span>Bắt đầu</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
