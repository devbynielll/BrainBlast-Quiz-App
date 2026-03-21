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

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface QuizState {
  screen: GameScreen;
  quizMode: QuizMode;
  playerName: string;
  gamePin: string;
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

const SHS_ONLY_COUNT = 10;
const TRIVIA_ONLY_COUNT = 5;
const MIXED_SHS = 10;
const MIXED_TRIVIA = 5;
const TIME_PER_QUESTION = 15;
const BASE_POINTS = 10;
const HIGH_SCORE_KEY = 'brainblast-highscore';
const THEME_KEY = 'brainblast-theme';
const PLAYERNAME_KEY = 'brainblast-playername';
export const LEADERBOARD_KEY = 'brainblast-leaderboard';

function genPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]'); } catch { return []; }
}

export function saveToLeaderboard(name: string, score: number): LeaderboardEntry[] {
  const entries = loadLeaderboard();
  entries.push({ name: name.trim() || 'Anonymous', score, date: new Date().toLocaleDateString('en-PH') });
  entries.sort((a, b) => b.score - a.score);
  const top5 = entries.slice(0, 5);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top5));
  return top5;
}

export function getNextDifficulty(current: Difficulty, wasCorrect: boolean): Difficulty {
  if (wasCorrect) {
    if (current === 'Easy') return 'Medium';
    if (current === 'Medium') return 'Hard';
    return 'Hard';
  }
  if (current === 'Hard') return 'Medium';
  if (current === 'Medium') return 'Easy';
  return 'Easy';
}

function pickQuestion(pool: Question[], difficulty: Difficulty): Question | null {
  const order: Difficulty[] =
    difficulty === 'Easy' ? ['Easy', 'Medium', 'Hard'] :
    difficulty === 'Hard' ? ['Hard', 'Medium', 'Easy'] :
    ['Medium', 'Easy', 'Hard'];
  for (const diff of order) {
    const m = pool.filter(q => q.difficulty === diff);
    if (m.length > 0) return m[Math.floor(Math.random() * m.length)];
  }
  return pool[0] ?? null;
}

function buildPool(mode: QuizMode): Question[] {
  const shs = shuffleArray(SHS_QUESTIONS);
  const trivia = shuffleArray(TRIVIA_QUESTIONS);
  if (mode === 'SHS') return shs.slice(0, SHS_ONLY_COUNT);
  if (mode === 'Trivia') return trivia.slice(0, TRIVIA_ONLY_COUNT);
  return shuffleArray([...shs.slice(0, MIXED_SHS), ...trivia.slice(0, MIXED_TRIVIA)]);
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

export function getDifficultyColor(d: Difficulty): string {
  if (d === 'Easy') return 'text-green-400';
  if (d === 'Hard') return 'text-red-400';
  return 'text-yellow-400';
}

export function getDifficultyBg(d: Difficulty): string {
  if (d === 'Easy') return 'bg-green-500';
  if (d === 'Hard') return 'bg-red-500';
  return 'bg-yellow-500 text-black';
}

function calcBonus(timeLeft: number, streak: number): number {
  let sp = 0;
  if (timeLeft >= 11) sp = 5;
  else if (timeLeft >= 6) sp = 3;
  else if (timeLeft >= 1) sp = 1;
  return Math.round(sp * getStreakMultiplier(streak));
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => {
    const hs = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    const theme = (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
    const playerName = localStorage.getItem(PLAYERNAME_KEY) || '';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return {
      screen: 'START', quizMode: 'Mixed',
      playerName, gamePin: genPin(),
      questions: [], remainingPool: [], totalQuestions: 15,
      currentQuestionIndex: 0, currentShuffledAnswers: [],
      adaptiveDifficulty: 'Medium', difficultyChanged: null,
      correctCount: 0, bonusPoints: 0, totalScore: 0, highScore: hs,
      answers: [], timeLeft: TIME_PER_QUESTION,
      isMuted: false, theme, questionStatus: 'idle',
      streak: 0, maxStreak: 0, lastAnswerBonus: 0,
    };
  });

  const toggleTheme = useCallback(() => {
    setState(s => {
      const t = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, t);
      document.documentElement.classList.toggle('dark', t === 'dark');
      return { ...s, theme: t };
    });
  }, []);

  const toggleMute = useCallback(() => setState(s => ({ ...s, isMuted: !s.isMuted })), []);

  const setPlayerName = useCallback((name: string) => {
    localStorage.setItem(PLAYERNAME_KEY, name);
    setState(s => ({ ...s, playerName: name }));
  }, []);

  const goToStart = useCallback(() => setState(s => ({ ...s, screen: 'START' })), []);

  const goToModeSelect = useCallback(() => {
    setState(s => ({ ...s, screen: 'MODE_SELECT', gamePin: genPin() }));
  }, []);

  const startGame = useCallback((mode: QuizMode) => {
    const pool = buildPool(mode);
    const firstQ = pickQuestion(pool, 'Medium') ?? pool[0];
    const remaining = pool.filter(q => q.id !== firstQ.id);
    setState(s => ({
      ...s,
      screen: 'QUIZ', quizMode: mode,
      questions: [firstQ], remainingPool: remaining,
      totalQuestions: pool.length,
      currentQuestionIndex: 0,
      currentShuffledAnswers: shuffleArray([firstQ.correctAnswer, ...firstQ.incorrectAnswers]),
      adaptiveDifficulty: firstQ.difficulty, difficultyChanged: null,
      correctCount: 0, bonusPoints: 0, totalScore: 0,
      answers: [], timeLeft: TIME_PER_QUESTION, questionStatus: 'idle',
      streak: 0, maxStreak: 0, lastAnswerBonus: 0,
    }));
  }, []);

  const submitAnswer = useCallback((answer: string | null) => {
    setState(s => {
      if (s.questionStatus !== 'idle') return s;
      const q = s.questions[s.currentQuestionIndex];
      const isCorrect = answer !== null && answer === q.correctAnswer;
      const isTimeout = answer === null;
      const timeUsed = TIME_PER_QUESTION - s.timeLeft;
      const newStreak = isCorrect ? s.streak + 1 : 0;
      const newMaxStreak = Math.max(newStreak, s.maxStreak);
      const bonusEarned = isCorrect ? calcBonus(s.timeLeft, newStreak - 1) : 0;
      const newRecord: AnswerRecord = { question: q, playerAnswer: answer, isCorrect, isTimeout, timeUsed, bonusEarned, streakAtAnswer: newStreak };
      const newCorrect = isCorrect ? s.correctCount + 1 : s.correctCount;
      const newBonus = s.bonusPoints + bonusEarned;
      const newScore = newCorrect * BASE_POINTS + newBonus;
      const nextDiff = getNextDifficulty(s.adaptiveDifficulty, isCorrect);
      let changed: 'up' | 'down' | null = null;
      if (nextDiff !== s.adaptiveDifficulty) {
        changed = (nextDiff === 'Hard') || (nextDiff === 'Medium' && s.adaptiveDifficulty === 'Easy') ? 'up' : 'down';
      }
      return {
        ...s, questionStatus: isTimeout ? 'timeout' : 'answered',
        correctCount: newCorrect, bonusPoints: newBonus, totalScore: newScore,
        answers: [...s.answers, newRecord],
        streak: newStreak, maxStreak: newMaxStreak,
        lastAnswerBonus: bonusEarned, difficultyChanged: changed,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const isLast = s.currentQuestionIndex === s.totalQuestions - 1;
      if (isLast) {
        const hs = Math.max(s.totalScore, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, hs.toString());
        return { ...s, screen: 'RESULTS', highScore: hs };
      }
      const lastAns = s.answers[s.answers.length - 1];
      const wasCorrect = lastAns?.isCorrect ?? false;
      const nextDiff = getNextDifficulty(s.adaptiveDifficulty, wasCorrect);
      const nextQ = pickQuestion(s.remainingPool, nextDiff);
      if (!nextQ) {
        const hs = Math.max(s.totalScore, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, hs.toString());
        return { ...s, screen: 'RESULTS', highScore: hs };
      }
      return {
        ...s,
        questions: [...s.questions, nextQ],
        remainingPool: s.remainingPool.filter(q => q.id !== nextQ.id),
        currentQuestionIndex: s.currentQuestionIndex + 1,
        currentShuffledAnswers: shuffleArray([nextQ.correctAnswer, ...nextQ.incorrectAnswers]),
        adaptiveDifficulty: nextDiff, difficultyChanged: null,
        timeLeft: TIME_PER_QUESTION, questionStatus: 'idle', lastAnswerBonus: 0,
      };
    });
  }, []);

  const goToReview = useCallback(() => setState(s => ({ ...s, screen: 'REVIEW' })), []);
  const goToResults = useCallback(() => setState(s => ({ ...s, screen: 'RESULTS' })), []);

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

  useEffect(() => {
    if (state.screen === 'QUIZ' && state.questionStatus === 'idle' && state.timeLeft === 0) {
      submitAnswer(null);
    }
  }, [state.timeLeft, state.screen, state.questionStatus, submitAnswer]);

  return {
    state, startGame, submitAnswer, nextQuestion,
    setPlayerName, goToModeSelect, goToReview, goToResults, goToStart,
    toggleTheme, toggleMute,
  };
}
