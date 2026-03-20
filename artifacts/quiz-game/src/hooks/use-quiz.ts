import { useState, useEffect, useCallback } from 'react';
import { QUESTION_POOL, Question, shuffleArray } from '../data/questions';

export type GameScreen = 'START' | 'QUIZ' | 'RESULTS' | 'REVIEW';

export interface AnswerRecord {
  question: Question;
  playerAnswer: string | null;
  isCorrect: boolean;
  isTimeout: boolean;
}

export interface QuizState {
  screen: GameScreen;
  questions: Question[];
  currentQuestionIndex: number;
  currentShuffledAnswers: string[];
  score: number;
  highScore: number;
  answers: AnswerRecord[];
  timeLeft: number;
  isMuted: boolean;
  theme: 'dark' | 'light';
  questionStatus: 'idle' | 'answered' | 'timeout';
}

const QUESTIONS_PER_GAME = 10;
const TIME_PER_QUESTION = 15;
const HIGH_SCORE_KEY = 'brainblast-highscore';
const THEME_KEY = 'brainblast-theme';

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => {
    const savedHighScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    const savedTheme = (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
    
    // Apply initial theme
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
      score: 0,
      highScore: savedHighScore,
      answers: [],
      timeLeft: TIME_PER_QUESTION,
      isMuted: false,
      theme: savedTheme,
      questionStatus: 'idle',
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
      score: 0,
      answers: [],
      timeLeft: TIME_PER_QUESTION,
      questionStatus: 'idle',
    }));
  }, []);

  const submitAnswer = useCallback((answer: string | null) => {
    setState(s => {
      if (s.questionStatus !== 'idle') return s; // Prevent multiple submissions

      const currentQ = s.questions[s.currentQuestionIndex];
      const isCorrect = answer === currentQ.correctAnswer;
      const isTimeout = answer === null;

      const newRecord: AnswerRecord = {
        question: currentQ,
        playerAnswer: answer,
        isCorrect,
        isTimeout
      };

      const newScore = isCorrect ? s.score + 1 : s.score;

      return {
        ...s,
        questionStatus: isTimeout ? 'timeout' : 'answered',
        score: newScore,
        answers: [...s.answers, newRecord]
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const isLastQuestion = s.currentQuestionIndex === s.questions.length - 1;
      
      if (isLastQuestion) {
        const newHighScore = Math.max(s.score, s.highScore);
        localStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
        return {
          ...s,
          screen: 'RESULTS',
          highScore: newHighScore
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
      };
    });
  }, []);

  const goToReview = useCallback(() => {
    setState(s => ({ ...s, screen: 'REVIEW' }));
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
          submitAnswer(null); // Timeout
          return { ...s, timeLeft: 0 };
        }
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.screen, state.questionStatus, submitAnswer]);

  return {
    state,
    startGame,
    submitAnswer,
    nextQuestion,
    goToReview,
    goToStart,
    toggleTheme,
    toggleMute
  };
}
