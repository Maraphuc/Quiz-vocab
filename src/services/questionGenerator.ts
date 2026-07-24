import { Question, QuestionType, VocabWord } from '../types';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateQuestionsForWords(words: VocabWord[], allWordsPool: VocabWord[]): Question[] {
  const shuffledWords = shuffleArray(words);

  return shuffledWords.map((word, index) => {
    // Pick question type dynamically
    const types = [QuestionType.EN_TO_VI, QuestionType.VI_TO_EN, QuestionType.FILL_BLANK];
    const questionType = types[index % types.length];

    if (questionType === QuestionType.EN_TO_VI) {
      // Prompt: "Từ '{word}' có nghĩa tiếng Việt là gì?"
      const correctAnswer = word.meaning;
      // Get 3 wrong choices from word.wrongOptions or random other words
      const wrongChoices = word.wrongOptions && word.wrongOptions.length >= 3
        ? word.wrongOptions.slice(0, 3)
        : allWordsPool
            .filter((w) => w.id !== word.id)
            .map((w) => w.meaning)
            .slice(0, 3);

      const options = shuffleArray([correctAnswer, ...wrongChoices]);

      return {
        id: `q_${word.id}_${index}`,
        word,
        type: QuestionType.EN_TO_VI,
        prompt: `Nghĩa tiếng Việt của từ "${word.word}" là gì?`,
        subPrompt: word.pronunciation,
        options,
        correctAnswer,
        explanation: `"${word.word}" (${word.pronunciation}) có nghĩa là: ${word.meaning}. Ví dụ: ${word.example}`
      };
    } else if (questionType === QuestionType.VI_TO_EN) {
      // Prompt: "Từ tiếng Anh nào mang nghĩa: '{meaning}'?"
      const correctAnswer = word.word;
      const wrongEnglishWords = shuffleArray(
        allWordsPool.filter((w) => w.id !== word.id).map((w) => w.word)
      ).slice(0, 3);

      const options = shuffleArray([correctAnswer, ...wrongEnglishWords]);

      return {
        id: `q_${word.id}_${index}`,
        word,
        type: QuestionType.VI_TO_EN,
        prompt: `Từ tiếng Anh nào mang nghĩa "${word.meaning}"?`,
        options,
        correctAnswer,
        explanation: `"${word.meaning}" trong tiếng Anh là "${word.word}" (${word.pronunciation}).`
      };
    } else {
      // FILL_BLANK
      const correctAnswer = word.word;
      const sentencePrompt = word.example.includes('___')
        ? word.example
        : word.example.replace(new RegExp(word.word, 'gi'), '___');

      const wrongEnglishWords = shuffleArray(
        allWordsPool.filter((w) => w.id !== word.id).map((w) => w.word)
      ).slice(0, 3);

      const options = shuffleArray([correctAnswer, ...wrongEnglishWords]);

      return {
        id: `q_${word.id}_${index}`,
        word,
        type: QuestionType.FILL_BLANK,
        prompt: 'Chọn từ phù hợp để điền vào chỗ trống:',
        subPrompt: sentencePrompt,
        options,
        correctAnswer,
        explanation: `Câu hoàn chỉnh: "${sentencePrompt.replace('___', word.word)}". Dịch nghĩa: ${word.meaning}.`
      };
    }
  });
}
