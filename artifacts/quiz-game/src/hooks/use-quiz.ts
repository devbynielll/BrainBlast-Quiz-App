import { useState, useEffect, useCallback } from 'react';
import { QUESTION_POOL, Question, shuffleArray } from '../data/questions';

export type GameScreen = 'START' | 'QUIZ' | 'RESULTS' | 'REVIEW';

export interface AnswerRecord {
  question: Question;
  playerAnswer: string | null;
  isCorrect: boolean;
  isTimeout: boolean;
  timeUsed: number;
  bonusEarned: number;
  streakAtAnswer: number;
}

export interface QuizState {
  screen: GameScreen;
  questions: Question[];
  currentQuestionIndex: number;
  currentShuffledAnswers: string[];
  correctCount: number;
  bonusPoints: number;
  totalScore: number;
  highScore: number;
  answers: AnswerRecord[];
  timeLeft: number;
  isMuted: boolean;
  theme: 'dark' | 'light';
  questionStatus: 'idle' | 'answered' | 'timeout';
  streak: number;
  maxStreak: number;
  lastAnswerBonus: number;
}

const QUESTIONS_PER_GAME = 10;
const TIME_PER_QUESTION = 15;
const BASE_POINTS = 10;
const HIGH_SCORE_KEY = 'brainblast-shs-highscore';
const THEME_KEY = 'brainblast-theme';

export function getLevel(questionIndex: number): string {
  if (questionIndex < 3) return 'Beginner';
  if (questionIndex < 7) return 'Intermediate';
  return 'Expert';
}

export function getLevelColor(questionIndex: number): string {
  if (questionIndex < 3) return 'text-green-400';
  if (questionIndex < 7) return 'text-yellow-400';
  return 'text-red-400';
}

export function getStreakLabel(streak: number): string {
  if (streak >= 5) return '⚡ On Fire!';
  if (streak >= 3) return '🔥 Hot Streak!';
  return '';
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 5) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

function calculateBonus(timeLeft: number, streak: number): number {
  let speedBonus = 0;
  if (timeLeft >= 11) speedBonus = 5;
  else if (timeLeft >= 6) speedBonus = 3;
  else if (timeLeft >= 1) speedBonus = 1;

  const multiplier = getStreakMultiplier(streak);
  return Math.round(speedBonus * multiplier);
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => {
    const savedHighScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    const savedTheme = (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return {
      screen: 'START',
      questions: [],
      currentQuestionIndex: 0,
      currentShuffledAnswers: [],
      correctCount: 0,
      bonusPoints: 0,
      totalScore: 0,
      highScore: savedHighScore,
      answers: [],
      timeLeft: TIME_PER_QUESTION,
      isMuted: false,
      theme: savedTheme,
      questionStatus: 'idle',
      streak: 0,
      maxStreak: 0,
      lastAnswerBonus: 0,
    };
  });

  const toggleTheme = useCallback(() => {
    setState(s => {
      const newTheme = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...s, theme: newTheme };
    });
  }, []);

  const toggleMute = useCallback(() => {
    setState(s => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const startGame = useCallback(() => {
    const shuffledPool = shuffleArray(QUESTION_POOL);
    const selectedQuestions = shuffledPool.slice(0, QUESTIONS_PER_GAME);
    const firstQuestion = selectedQuestions[0];

    setState(s => ({
      ...s,
      screen: 'QUIZ',
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      currentShuffledAnswers: shuffleArray([
        firstQuestion.correctAnswer,
        ...firstQuestion.incorrectAnswers
      ]),
      correctCount: 0,
      bonusPoints: 0,
      totalScore: 0,
      answers: [],
      timeLeft: TIME_PER_QUESTION,
      questionStatus: 'idle',
      streak: 0,
      maxStreak: 0,
      lastAnswerBonus: 0,
    }));
  }, []);

  const submitAnswer = useCallback((answer: string | null) => {
    setState(s => {
      if (s.questionStatus !== 'idle') return s;

      const currentQ = s.questions[s.currentQuestionIndex];
      const isCorrect = answer === currentQ.correctAnswer;
      const isTimeout = answer === null;
      const timeUsed = TIME_PER_QUESTION - s.timeLeft;

      const newStreak = isCorrect ? s.streak + 1 : 0;
      const newMaxStreak = Math.max(newStreak, s.maxStreak);

      let bonusEarned = 0;
      if (isCorrect) {
        bonusEarned = calculateBonus(s.timeLeft, newStreak - 1);
      }

      const newRecord: AnswerRecord = {
        question: currentQ,
        playerAnswer: answer,
        isCorrect,
        isTimeout,
        timeUsed,
        bonusEarned,
        streakAtAnswer: newStreak,
      };

      const newCorrectCount = isCorrect ? s.correctCount + 1 : s.correctCount;
      const newBonusPoints = s.bonusPoints + bonusEarned;
      const newTotalScore = newCorrectCount * BASE_POINTS + newBonusPoints;

      return {
        ...s,
        questionStatus: isTimeout ? 'timeout' : 'answered',
        correctCount: newCorrectCount,
        bonusPoints: newBonusPoints,
        totalScore: newTotalScore,
        answers: [...s.answers, newRecord],
        streak: newStreak,
        maxStreak: newMaxStreak,
        lastAnswerBonus: bonusEarned,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const isLastQuestion = s.currentQuestionIndex === s.questions.length - 1;

      if (isLastQuestion) {
        const newHighScore = Math.max(s.totalScore, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
        return {
          ...s,
          screen: 'RESULTS',
          highScore: newHighScore,
        };
      }

      const nextIndex = s.currentQuestionIndex + 1;
      const nextQ = s.questions[nextIndex];

      return {
        ...s,
        currentQuestionIndex: nextIndex,
        currentShuffledAnswers: shuffleArray([
          nextQ.correctAnswer,
          ...nextQ.incorrectAnswers
        ]),
        timeLeft: TIME_PER_QUESTION,
        questionStatus: 'idle',
        lastAnswerBonus: 0,
      };
    });
  }, []);

  const goToReview = useCallback(() => {
    setState(s => ({ ...s, screen: 'REVIEW' }));
  }, []);

  const goToResults = useCallback(() => {
    setState(s => ({ ...s, screen: 'RESULTS' }));
  }, []);

  const goToStart = useCallback(() => {
    setState(s => ({ ...s, screen: 'START' }));
  }, []);

  // Timer logic
  useEffect(() => {
    if (state.screen !== 'QUIZ' || state.questionStatus !== 'idle') return;

    const timer = setInterval(() => {
      setState(s => {
        if (s.timeLeft <= 1) {
          clearInterval(timer);
          return { ...s, timeLeft: 0 };
        }
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.screen, state.questionStatus, state.currentQuestionIndex]);

  // Auto-submit on timeout
  useEffect(() => {
    if (state.screen === 'QUIZ' && state.questionStatus === 'idle' && state.timeLeft === 0) {
      submitAnswer(null);
    }
  }, [state.timeLeft, state.screen, state.questionStatus, submitAnswer]);

  return {
    state,
    startGame,
    submitAnswer,
    nextQuestion,
    goToReview,
    goToResults,
    goToStart,
    toggleTheme,
    toggleMute,
  };
}
