import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Difficulty } from "@/data/questions";
import { getStreakLabel, getStreakMultiplier, getNextDifficulty, getDifficultyBg } from "@/hooks/use-quiz";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle, Flame, Zap, TrendingUp, TrendingDown, Brain } from "lucide-react";

interface QuizScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  shuffledAnswers: string[];
  timeLeft: number;
  status: 'idle' | 'answered' | 'timeout';
  playerAnswer: string | null;
  streak: number;
  lastAnswerBonus: number;
  totalScore: number;
  adaptiveDifficulty: Difficulty;
  difficultyChanged: 'up' | 'down' | null;
  playerName: string;
  onSubmit: (answer: string | null) => void;
  onNext: () => void;
}

const ANSWER_STYLES = [
  { base: 'bg-[#e91e8c] text-white border-[#c0176e] shadow-[0_6px_0_#c0176e]', hover: 'hover:brightness-110' },
  { base: 'bg-[#0891b2] text-white border-[#0670a0] shadow-[0_6px_0_#0670a0]', hover: 'hover:brightness-110' },
  { base: 'bg-[#7c3aed] text-white border-[#6028c7] shadow-[0_6px_0_#6028c7]', hover: 'hover:brightness-110' },
  { base: 'bg-[#d97706] text-white border-[#b46008] shadow-[0_6px_0_#b46008]', hover: 'hover:brightness-110' },
];

const DIFF_LABEL: Record<Difficulty, string> = { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' };

export function QuizScreen({
  question, questionIndex, totalQuestions, shuffledAnswers,
  timeLeft, status, playerAnswer, streak, lastAnswerBonus, totalScore,
  adaptiveDifficulty, difficultyChanged, playerName,
  onSubmit, onNext,
}: QuizScreenProps) {

  useEffect(() => {
    if (status !== 'idle') {
      const fn = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNext(); }
      };
      window.addEventListener('keydown', fn);
      return () => window.removeEventListener('keydown', fn);
    }
    const fn = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 4 && shuffledAnswers[n - 1]) onSubmit(shuffledAnswers[n - 1]);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [status, shuffledAnswers, onSubmit, onNext]);

  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const isDanger = timeLeft <= 5 && status === 'idle';
  const isWarning = timeLeft <= 10 && timeLeft > 5 && status === 'idle';
  const streakLabel = getStreakLabel(streak);
  const multiplier = getStreakMultiplier(streak);
  const LABELS = ['A', 'B', 'C', 'D'];

  // Compute what the NEXT difficulty will be (for feedback bar display)
  const lastIsCorrect = status === 'answered' && playerAnswer === question.correctAnswer;
  const nextDiff = status !== 'idle' ? getNextDifficulty(adaptiveDifficulty, lastIsCorrect) : adaptiveDifficulty;
  const nextDiffChanged = nextDiff !== adaptiveDifficulty;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen flex flex-col pt-20 pb-8 px-4 max-w-4xl mx-auto w-full"
    >
      {/* ── Top bar ── */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-wrap justify-between items-center gap-2">

          {/* Left: question counter + adaptive difficulty */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-muted-foreground bg-card/80 border border-border px-3 py-1 rounded-full">
              Q{questionIndex + 1} <span className="text-muted-foreground/60">/ {totalQuestions}</span>
            </span>

            {/* Adaptive difficulty indicator */}
            <AnimatePresence mode="wait">
              <motion.div
                key={adaptiveDifficulty}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 bg-card/80 border border-border px-3 py-1 rounded-full"
              >
                <Brain size={13} className={
                  adaptiveDifficulty === 'Easy' ? 'text-green-400' :
                  adaptiveDifficulty === 'Hard' ? 'text-red-400' : 'text-yellow-400'
                } />
                <span className={cn(
                  "text-xs font-black uppercase tracking-wide",
                  adaptiveDifficulty === 'Easy' ? 'text-green-400' :
                  adaptiveDifficulty === 'Hard' ? 'text-red-400' : 'text-yellow-400'
                )}>
                  AI: {DIFF_LABEL[adaptiveDifficulty]}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Type badge */}
            <span className={cn(
              "text-xs font-black px-2.5 py-1 rounded-full border",
              question.type === 'SHS'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            )}>
              {question.type === 'SHS' ? '🎓 SHS' : '🌍 Trivia'}
            </span>
          </div>

          {/* Right: streak + score + timer */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <AnimatePresence>
              {streak >= 3 && (
                <motion.div
                  key={streak}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 px-2.5 py-1 rounded-full"
                >
                  {streak >= 5 ? <Zap size={13} className="text-yellow-300 fill-yellow-300" /> : <Flame size={13} className="text-orange-400 fill-orange-400" />}
                  <span className="text-xs font-black text-orange-300">{streak}× {streakLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {multiplier > 1 && (
              <span className="text-xs font-black text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full">
                {multiplier}× BONUS
              </span>
            )}

            <div className="bg-card/80 backdrop-blur-md px-3 py-1 rounded-full border border-border">
              <span className="font-black text-primary text-sm">{totalScore} pts</span>
            </div>

            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full font-display transition-all",
              isDanger ? "bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse"
                : isWarning ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                : "bg-card/80 border border-border text-foreground"
            )}>
              <Clock size={13} />
              <span className={cn("text-lg font-black", isDanger && "text-red-400")}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="bg-card/90 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 md:p-8 mb-5 relative">
        <div className="absolute -top-3.5 left-5 flex gap-2">
          <span className="bg-secondary text-secondary-foreground text-xs font-black px-3 py-1 rounded-full shadow-md">
            {question.category}
          </span>
          <span className={cn("text-xs font-black px-3 py-1 rounded-full shadow-md text-white", getDifficultyBg(question.difficulty))}>
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mt-4 text-center leading-snug">
          {question.text}
        </h2>
      </div>

      {/* ── Answer Buttons ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {shuffledAnswers.map((answer, i) => {
          const style = ANSWER_STYLES[i % 4];
          const isSelected = playerAnswer === answer;
          const isCorrect = answer === question.correctAnswer;
          const showCorrect = status !== 'idle' && isCorrect;
          const showWrong = status === 'answered' && isSelected && !isCorrect;

          let cls = '';
          let anim = '';
          if (status === 'idle') {
            cls = cn(style.base, style.hover, 'active:translate-y-[4px] active:shadow-none cursor-pointer hover:-translate-y-0.5');
          } else if (showCorrect) {
            cls = 'bg-green-500 text-white border-green-700 shadow-[0_6px_0_#15803d] scale-[1.01]';
            if (isSelected) anim = 'animate-bounce-in';
          } else if (showWrong) {
            cls = 'bg-red-500 text-white border-red-700 shadow-[0_6px_0_#b91c1c]';
            anim = 'animate-shake';
          } else {
            cls = 'bg-muted text-muted-foreground border-border shadow-none opacity-40 grayscale cursor-not-allowed';
          }

          return (
            <button
              key={answer}
              disabled={status !== 'idle'}
              onClick={() => onSubmit(answer)}
              className={cn(
                "relative min-h-[80px] p-4 rounded-xl text-base md:text-lg font-bold flex items-center gap-3 text-left transition-all duration-200 border-b-4",
                cls, anim
              )}
            >
              <span className="w-8 h-8 shrink-0 rounded-lg bg-black/20 flex items-center justify-center text-sm font-black">
                {LABELS[i]}
              </span>
              <span className="flex-1 leading-snug">{answer}</span>
              {showCorrect && <CheckCircle2 className="shrink-0 text-white" size={20} />}
              {showWrong && <XCircle className="shrink-0 text-white" size={20} />}
            </button>
          );
        })}
      </div>

      {/* ── Feedback Bar ── */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-xl"
          >
            <div className="flex items-start gap-3 flex-1">
              {status === 'timeout' ? (
                <>
                  <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={24} />
                  <div>
                    <div className="text-base font-black text-amber-400">Time's Up!</div>
                    <div className="text-sm text-muted-foreground">Correct: <span className="font-bold text-foreground">{question.correctAnswer}</span></div>
                  </div>
                </>
              ) : playerAnswer === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={24} />
                  <div>
                    <div className="text-base font-black text-green-400">
                      Correct! +{10} pts
                      {lastAnswerBonus > 0 && (
                        <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="ml-2 text-yellow-300 text-sm">
                          ⚡ +{lastAnswerBonus} bonus!
                        </motion.span>
                      )}
                    </div>
                    {streak >= 2 && <div className="text-sm text-orange-300 font-bold">{streak} in a row! 🔥</div>}
                    {/* Difficulty change preview */}
                    {nextDiffChanged && (
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-green-300">
                        <TrendingUp size={13} />
                        Next difficulty: <span className="font-black">{nextDiff}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400 shrink-0 mt-0.5" size={24} />
                  <div>
                    <div className="text-base font-black text-red-400">Incorrect!</div>
                    <div className="text-sm text-muted-foreground">Correct: <span className="font-bold text-foreground">{question.correctAnswer}</span></div>
                    {nextDiffChanged && (
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-orange-300">
                        <TrendingDown size={13} />
                        Next difficulty: <span className="font-black">{nextDiff}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onNext}
              autoFocus
              className="btn-3d bg-foreground text-background px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 shrink-0 transition-opacity whitespace-nowrap"
            >
              {questionIndex + 1 < totalQuestions ? <>Next <ArrowRight size={16} /></> : <>Results <ArrowRight size={16} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
