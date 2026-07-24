import { AppSettings, UserProgress, VocabWord, WrongWordRecord } from '../types';

const PROGRESS_STORAGE_KEY = 'quiz_vocab_user_progress_v1';
const SETTINGS_STORAGE_KEY = 'quiz_vocab_app_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  darkMode: false,
  autoSpeak: true,
  version: '1.0.0+1'
};

const DEFAULT_PROGRESS: UserProgress = {
  totalQuizzes: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  highScore: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  topicStats: {},
  wrongWords: []
};

export const storageService = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;

      const parsed: UserProgress = JSON.parse(data);
      // Check and update streak logic
      const today = new Date().toISOString().split('T')[0];
      const lastActive = parsed.lastActiveDate || today;

      if (lastActive !== today) {
        const lastDateObj = new Date(lastActive);
        const todayObj = new Date(today);
        const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          parsed.streakDays += 1;
          parsed.lastActiveDate = today;
        } else if (diffDays > 1) {
          parsed.streakDays = 1;
          parsed.lastActiveDate = today;
        }
        this.saveProgress(parsed);
      }

      return parsed;
    } catch {
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: UserProgress) {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  },

  recordQuizFinished(topicId: string, correctCount: number, totalQuestions: number, wrongWordsList: VocabWord[]) {
    const progress = this.getProgress();
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    progress.totalQuizzes += 1;
    progress.totalCorrect += correctCount;
    progress.totalQuestions += totalQuestions;

    if (scorePct > progress.highScore) {
      progress.highScore = scorePct;
    }

    // Topic stats
    if (!progress.topicStats[topicId]) {
      progress.topicStats[topicId] = { completedCount: 0, highestScore: 0 };
    }
    progress.topicStats[topicId].completedCount += 1;
    if (scorePct > progress.topicStats[topicId].highestScore) {
      progress.topicStats[topicId].highestScore = scorePct;
    }

    // Wrong words list management
    wrongWordsList.forEach((word) => {
      const existingIdx = progress.wrongWords.findIndex((item) => item.wordId === word.id);
      if (existingIdx >= 0) {
        progress.wrongWords[existingIdx].wrongCount += 1;
        progress.wrongWords[existingIdx].lastWrongAt = new Date().toISOString();
      } else {
        progress.wrongWords.push({
          wordId: word.id,
          word,
          wrongCount: 1,
          lastWrongAt: new Date().toISOString()
        });
      }
    });

    this.saveProgress(progress);
    return progress;
  },

  removeWrongWord(wordId: string) {
    const progress = this.getProgress();
    progress.wrongWords = progress.wrongWords.filter((item) => item.wordId !== wordId);
    this.saveProgress(progress);
    return progress;
  },

  resetProgress() {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    return DEFAULT_PROGRESS;
  }
};
