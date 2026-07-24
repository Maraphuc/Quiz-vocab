import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TopicsScreen } from './components/TopicsScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { WrongWordsScreen } from './components/WrongWordsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';

import { AppSettings, ScreenTab, UserProgress, VocabWord } from './types';
import { TOPICS, VOCAB_DATA } from './data/vocabulary';
import { storageService } from './services/storageService';
import { generateQuestionsForWords } from './services/questionGenerator';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [progress, setProgress] = useState<UserProgress>(() => storageService.getProgress());
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Quiz active state
  const [activeQuizTopicId, setActiveQuizTopicId] = useState<string | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<ReturnType<typeof generateQuestionsForWords> | null>(null);
  const [quizResultData, setQuizResultData] = useState<{
    correctCount: number;
    totalQuestions: number;
    wrongWords: VocabWord[];
  } | null>(null);

  // Modals
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFlutterCodeOpen, setIsFlutterCodeOpen] = useState(false);

  // Apply dark mode class to document root
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const handleStartTopicQuiz = (topicId: string) => {
    const topicWords = VOCAB_DATA.filter((w) => w.topicId === topicId);
    if (topicWords.length === 0) return;

    const questions = generateQuestionsForWords(topicWords, VOCAB_DATA);
    setActiveQuizTopicId(topicId);
    setActiveQuizQuestions(questions);
    setQuizResultData(null);
    setActiveTab('quiz');
  };

  const handleStartWrongWordsQuiz = () => {
    if (progress.wrongWords.length === 0) return;
    const words = progress.wrongWords.map((item) => item.word);
    const questions = generateQuestionsForWords(words, VOCAB_DATA);

    setActiveQuizTopicId('wrong_review');
    setActiveQuizQuestions(questions);
    setQuizResultData(null);
    setActiveTab('quiz');
  };

  const handleFinishQuiz = (correctCount: number, totalQuestions: number, wrongWords: VocabWord[]) => {
    const currentTopicId = activeQuizTopicId || 'general';
    const updatedProgress = storageService.recordQuizFinished(
      currentTopicId,
      correctCount,
      totalQuestions,
      wrongWords
    );

    setProgress(updatedProgress);
    setQuizResultData({
      correctCount,
      totalQuestions,
      wrongWords
    });
  };

  const handleRemoveWrongWord = (wordId: string) => {
    const updatedProgress = storageService.removeWrongWord(wordId);
    setProgress(updatedProgress);
  };

  const handleResetProgress = () => {
    const reset = storageService.resetProgress();
    setProgress(reset);
  };

  const getTopicTitle = (topicId: string) => {
    if (topicId === 'wrong_review') return 'Ôn tập Từ Sai';
    const found = TOPICS.find((t) => t.id === topicId);
    return found ? `${found.title} (${found.titleVi})` : 'Quiz Từ Vựng';
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 ${isMobileFrame ? 'py-4 sm:py-8 px-2' : ''}`}>
      {/* Outer Container (Simulates Phone shell when isMobileFrame = true) */}
      <div
        className={`mx-auto bg-white dark:bg-slate-900 transition-all duration-300 shadow-2xl overflow-hidden relative ${
          isMobileFrame
            ? 'max-w-md rounded-[2.5rem] border-[8px] border-slate-800 dark:border-slate-800 min-h-[844px] flex flex-col justify-between'
            : 'max-w-4xl min-h-screen'
        }`}
      >
        {/* Header Bar */}
        <Header
          settings={settings}
          streakDays={progress.streakDays}
          activeTab={activeTab}
          isMobileFrame={isMobileFrame}
          onUpdateSettings={handleUpdateSettings}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 max-w-md mx-auto w-full overflow-y-auto">
          {/* 1. Home Tab */}
          {activeTab === 'home' && (
            <WelcomeScreen
              progress={progress}
              onStartLearning={() => setActiveTab('quiz')}
              onViewProgress={() => setActiveTab('progress')}
              onSelectTopic={handleStartTopicQuiz}
            />
          )}

          {/* 2. Quiz Tab */}
          {activeTab === 'quiz' && (
            <>
              {!activeQuizQuestions && (
                <TopicsScreen
                  progress={progress}
                  onSelectTopic={handleStartTopicQuiz}
                />
              )}

              {activeQuizQuestions && !quizResultData && (
                <QuizScreen
                  topicTitle={getTopicTitle(activeQuizTopicId || '')}
                  questions={activeQuizQuestions}
                  soundEnabled={settings.soundEnabled}
                  onFinishQuiz={handleFinishQuiz}
                  onExitQuiz={() => {
                    setActiveQuizQuestions(null);
                    setActiveQuizTopicId(null);
                  }}
                />
              )}

              {quizResultData && (
                <ResultScreen
                  topicTitle={getTopicTitle(activeQuizTopicId || '')}
                  correctCount={quizResultData.correctCount}
                  totalQuestions={quizResultData.totalQuestions}
                  wrongWords={quizResultData.wrongWords}
                  onRetry={() => {
                    if (activeQuizTopicId === 'wrong_review') {
                      handleStartWrongWordsQuiz();
                    } else if (activeQuizTopicId) {
                      handleStartTopicQuiz(activeQuizTopicId);
                    }
                  }}
                  onSelectAnotherTopic={() => {
                    setActiveQuizQuestions(null);
                    setActiveQuizTopicId(null);
                    setQuizResultData(null);
                  }}
                  onReviewWrongWords={() => {
                    setActiveQuizQuestions(null);
                    setActiveQuizTopicId(null);
                    setQuizResultData(null);
                    setActiveTab('wrong');
                  }}
                />
              )}
            </>
          )}

          {/* 3. Wrong Words Tab */}
          {activeTab === 'wrong' && (
            <WrongWordsScreen
              wrongWordsList={progress.wrongWords}
              onRemoveWord={handleRemoveWrongWord}
              onStartWrongQuiz={handleStartWrongWordsQuiz}
            />
          )}

          {/* 4. Progress Tab */}
          {activeTab === 'progress' && (
            <ProgressScreen progress={progress} />
          )}

          {/* 5. Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetProgress={handleResetProgress}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          wrongCount={progress.wrongWords.length}
          onTabChange={(tab) => {
            // Reset active quiz when changing tabs
            if (tab !== 'quiz') {
              setActiveQuizQuestions(null);
              setActiveQuizTopicId(null);
              setQuizResultData(null);
            }
            setActiveTab(tab);
          }}
        />
      </div>

      {/* Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <FlutterCodeViewer
        isOpen={isFlutterCodeOpen}
        onClose={() => setIsFlutterCodeOpen(false)}
      />
    </div>
  );
}
