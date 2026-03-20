import { useState, useEffect, useCallback } from 'react';
import { SHS_QUESTIONS, TRIVIA_QUESTIONS, Question, Difficulty, shuffleArray } from '../data/questions';

export type GameScreen = 'START' | 'MODE_SELECT' | 'QUIZ' | 'RESULTS' | 'REVIEW';
export type QuizMode = 'SHS' | 'Trivia' | 'Mixed';

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
  quizMode: QuizMode;
  questions: Question[];
  remainingPool: Question[];
  totalQuestions: number;
  currentQuestionIndex: number;
  currentShuffledAnswers: string[];
  adaptiveDifficulty: Difficulty;
  difficultyChanged: 'up' | 'down' | null;
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

const QUESTIONS_PER_GAME = 15;
const SHS_COUNT = 10;
const TRIVIA_COUNT = 5;
const TIME_PER_QUESTION = 15;
const BASE_POINTS = 10;
const HIGH_SCORE_KEY = 'brainblast-shs-highscore';
const THEME_KEY = 'brainblast-theme';

export function getNextDifficulty(current: Difficulty, wasCorrect: boolean): Difficulty {
  if (wasCorrect) {
    if (current === 'Easy') return 'Medium';
    if (current === 'Medium') return 'Hard';
    return 'Hard';
  } else {
    if (current === 'Hard') return 'Medium';
    if (current === 'Medium') return 'Easy';
    return 'Easy';
  }
}

function pickQuestion(pool: Question[], difficulty: Difficulty): Question | null {
  const order: Difficulty[] =
    difficulty === 'Easy' ? ['Easy', 'Medium', 'Hard'] :
    difficulty === 'Hard' ? ['Hard', 'Medium', 'Easy'] :
    ['Medium', 'Easy', 'Hard'];

  for (const diff of order) {
    const matches = pool.filter(q => q.difficulty === diff);
    if (matches.length > 0) {
      return matches[Math.floor(Math.random() * matches.length)];
    }
  }
  return pool[0] ?? null;
}

function buildPool(mode: QuizMode): Question[] {
  const shsShuffled = shuffleArray(SHS_QUESTIONS);
  const triviaShuffled = shuffleArray(TRIVIA_QUESTIONS);

  if (mode === 'SHS') return shsShuffled.slice(0, QUESTIONS_PER_GAME);
  if (mode === 'Trivia') return triviaShuffled.slice(0, QUESTIONS_PER_GAME);
  // Mixed: 10 SHS + 5 Trivia
  return shuffleArray([...shsShuffled.slice(0, SHS_COUNT), ...triviaShuffled.slice(0, TRIVIA_COUNT)]);
}

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
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    return {
      screen: 'START',
      quizMode: 'Mixed',
      questions: [],
      remainingPool: [],
      totalQuestions: QUESTIONS_PER_GAME,
      currentQuestionIndex: 0,
      currentShuffledAnswers: [],
      adaptiveDifficulty: 'Medium',
      difficultyChanged: null,
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
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { ...s, theme: newTheme };
    });
  }, []);

  const toggleMute = useCallback(() => {
    setState(s => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const goToModeSelect = useCallback(() => {
    setState(s => ({ ...s, screen: 'MODE_SELECT' }));
  }, []);

  const startGame = useCallback((mode: QuizMode) => {
    const pool = buildPool(mode);
    const firstQ = pickQuestion(pool, 'Medium') ?? pool[0];
    const remaining = pool.filter(q => q.id !== firstQ.id);

    setState(s => ({
      ...s,
      screen: 'QUIZ',
      quizMode: mode,
      questions: [firstQ],
      remainingPool: remaining,
      totalQuestions: pool.length,
      currentQuestionIndex: 0,
      currentShuffledAnswers: shuffleArray([firstQ.correctAnswer, ...firstQ.incorrectAnswers]),
      adaptiveDifficulty: firstQ.difficulty,
      difficultyChanged: null,
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

      const nextDiff = getNextDifficulty(s.adaptiveDifficulty, isCorrect && !isTimeout);
      const changed =
        nextDiff !== s.adaptiveDifficulty
          ? nextDiff === 'Easy' || (nextDiff === 'Medium' && s.adaptiveDifficulty === 'Hard') ? 'down' : 'up'
          : null;

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
        difficultyChanged: changed,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const isLastQuestion = s.currentQuestionIndex === s.totalQuestions - 1;

      if (isLastQuestion) {
        const newHighScore = Math.max(s.totalScore, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
        return { ...s, screen: 'RESULTS', highScore: newHighScore };
      }

      const lastAnswer = s.answers[s.answers.length - 1];
      const wasCorrect = lastAnswer?.isCorrect ?? false;
      const nextDiff = getNextDifficulty(s.adaptiveDifficulty, wasCorrect);

      const nextQ = pickQuestion(s.remainingPool, nextDiff);
      if (!nextQ) {
        const newHighScore = Math.max(s.totalScore, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
        return { ...s, screen: 'RESULTS', highScore: newHighScore };
      }

      const newPool = s.remainingPool.filter(q => q.id !== nextQ.id);

      return {
        ...s,
        questions: [...s.questions, nextQ],
        remainingPool: newPool,
        currentQuestionIndex: s.currentQuestionIndex + 1,
        currentShuffledAnswers: shuffleArray([nextQ.correctAnswer, ...nextQ.incorrectAnswers]),
        adaptiveDifficulty: nextDiff,
        difficultyChanged: null,
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

  // Timer
  useEffect(() => {
    if (state.screen !== 'QUIZ' || state.questionStatus !== 'idle') return;
    const timer = setInterval(() => {
      setState(s => {
        if (s.timeLeft <= 1) { clearInterval(timer); return { ...s, timeLeft: 0 }; }
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
    goToModeSelect,
    goToReview,
    goToResults,
    goToStart,
    toggleTheme,
    toggleMute,
  };
}
