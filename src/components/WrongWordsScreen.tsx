import React, { useState } from 'react';
import { Bookmark, Volume2, Play, Trash2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WrongWordRecord } from '../types';
import { soundService } from '../services/soundService';

interface WrongWordsScreenProps {
  wrongWordsList: WrongWordRecord[];
  onRemoveWord: (wordId: string) => void;
  onStartWrongQuiz: () => void;
}

export const WrongWordsScreen: React.FC<WrongWordsScreenProps> = ({
  wrongWordsList,
  onRemoveWord,
  onStartWrongQuiz,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = wrongWordsList.filter(
    (item) =>
      item.word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Title & Start Quiz Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
            Từ Cần Ôn Lại
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Danh sách các từ bạn đã làm sai trong các bài quiz trước.
          </p>
        </div>

        {wrongWordsList.length > 0 && (
          <button
            onClick={onStartWrongQuiz}
            className="py-2.5 px-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Quiz từ sai</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {wrongWordsList.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Tuyệt vời! Không có từ sai nào
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Bạn đã trả lời đúng tất cả các từ hoặc chưa thực hiện bài quiz nào. Hãy chọn một chủ đề để thử sức nhé!
          </p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm từ hoặc nghĩa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {/* List of Wrong Words */}
          <div className="space-y-2.5">
            {filteredWords.map((item) => (
              <div
                key={item.wordId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between group hover:border-rose-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.word.word}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {item.word.pronunciation}
                    </span>
                    <button
                      onClick={() => soundService.speakEnglish(item.word.word)}
                      className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition"
                      title="Phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {item.word.meaning}
                  </p>

                  <p className="text-[11px] text-slate-500 italic">
                    "{item.word.example}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                    Sai {item.wrongCount} lần
                  </span>
                  <button
                    onClick={() => onRemoveWord(item.wordId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Đã nhớ - Xóa khỏi danh sách từ sai"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
