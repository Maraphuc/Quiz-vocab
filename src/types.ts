export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  topicId: string;
  level: Level;
  wrongOptions: string[]; // 3 wrong Vietnamese options or English alternatives
}

export interface Topic {
  id: string;
  title: string;
  titleVi: string;
  icon: string; // Lucide icon name
  questionCount: number;
  level: string; // e.g. "A1 - B2"
  description: string;
  color: string; // Tailwind color class
}

export enum QuestionType {
  EN_TO_VI = 'EN_TO_VI',     // Pick Vietnamese meaning for English word
  VI_TO_EN = 'VI_TO_EN',     // Pick English word for Vietnamese meaning
  FILL_BLANK = 'FILL_BLANK', // Fill missing word in sentence
}

export interface Question {
  id: string;
  word: VocabWord;
  type: QuestionType;
  prompt: string;          // Heading/Question text
  subPrompt?: string;      // Sentence with blank or context
  options: string[];       // 4 randomized choices
  correctAnswer: string;   // The exact correct choice string
  explanation?: string;
}

export interface QuizResult {
  topicId: string;
  topicTitle: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  rating: 'Xuất sắc' | 'Tốt' | 'Cần luyện thêm';
  wrongWords: VocabWord[];
  completedAt: string;
}

export interface WrongWordRecord {
  wordId: string;
  word: VocabWord;
  wrongCount: number;
  lastWrongAt: string;
}

export interface UserProgress {
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  highScore: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  topicStats: Record<string, { completedCount: number; highestScore: number }>;
  wrongWords: WrongWordRecord[];
}

export interface AppSettings {
  soundEnabled: boolean;
  darkMode: boolean;
  autoSpeak: boolean;
  version: string;
}

export type ScreenTab = 'home' | 'quiz' | 'wrong' | 'progress' | 'settings' | 'flutter_code';
