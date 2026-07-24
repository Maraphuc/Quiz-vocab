import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, CheckCircle2, XCircle, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Question, QuestionType, VocabWord } from '../types';
import { soundService } from '../services/soundService';

interface QuizScreenProps {
  topicTitle: string;
  questions: Question[];
  soundEnabled: boolean;
  onFinishQuiz: (correctCount: number, totalQuestions: number, wrongWords: VocabWord[]) => void;
  onExitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  topicTitle,
  questions,
  soundEnabled,
  onFinishQuiz,
  onExitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<VocabWord[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Auto speak word if sound is enabled
    if (soundEnabled && currentQuestion) {
      soundService.speakEnglish(currentQuestion.word.word);
    }
  }, [currentIndex, currentQuestion, soundEnabled]);

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-600 dark:text-slate-300 font-bold">Không tìm thấy câu hỏi!</p>
        <button
          onClick={onExitQuiz}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (soundEnabled) soundService.playCorrect();
    } else {
      setWrongWords((prev) => [...prev, currentQuestion.word]);
      if (soundEnabled) soundService.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished all questions
      const finalScore = selectedOption === currentQuestion.correctAnswer ? score + 1 : score;
      onFinishQuiz(finalScore, questions.length, wrongWords);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExitQuiz}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
          title="Thoát bài quiz"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{topicTitle}</h3>
          <p className="text-[10px] text-slate-500">
            Câu {currentIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
          Đúng: {score}
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card with Indigo Top Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        {/* Vibrant Indigo Banner Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white text-center space-y-3 relative">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-100">
            <span className="bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-md">
              CÂU {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}/{questions.length < 10 ? `0${questions.length}` : questions.length}
            </span>
            <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-lg font-black shadow-xs">
              Score: {score * 100}
            </span>
          </div>

          {/* Progress Bar inside Header */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="pt-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-100 font-bold text-[10px] tracking-widest uppercase mb-2">
              <HelpCircle className="w-3 h-3 text-amber-300" />
              {currentQuestion.type === QuestionType.EN_TO_VI && 'Chọn nghĩa tiếng Việt'}
              {currentQuestion.type === QuestionType.VI_TO_EN && 'Tìm từ tiếng Anh'}
              {currentQuestion.type === QuestionType.FILL_BLANK && 'Điền từ vào câu'}
            </div>

            <h2 className="text-2xl font-black italic tracking-tight text-white leading-tight">
              {currentQuestion.prompt}
            </h2>

            {currentQuestion.word.pronunciation && (
              <p className="text-xs text-indigo-200 mt-1 font-medium">
                {currentQuestion.word.pronunciation}
              </p>
            )}

            {currentQuestion.subPrompt && (
              <p className="text-xs font-semibold text-amber-300 bg-white/10 py-1.5 px-3 rounded-xl inline-block mt-2">
                {currentQuestion.subPrompt}
              </p>
            )}
          </div>

          {/* Audio Speaker Button */}
          <div className="pt-1 flex justify-center">
            <button
              onClick={() => soundService.speakEnglish(currentQuestion.word.word)}
              className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 font-bold text-xs transition active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Nghe phát âm</span>
            </button>
          </div>
        </div>

        {/* 4 Choices Grid */}
        <div className="p-5 space-y-2.5 bg-white dark:bg-slate-800">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let btnStyle =
              'bg-slate-50 dark:bg-slate-750 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-400 font-bold';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold italic';
              } else if (isSelected && !isCorrect) {
                btnStyle =
                  'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-700 dark:text-rose-300 font-extrabold';
              } else {
                btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-transparent';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`w-full py-4 px-4 rounded-2xl text-left font-bold text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box when Answered */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>Giải thích & Từ vựng:</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentQuestion.explanation}
          </p>

          <button
            onClick={handleNextQuestion}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>{currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
