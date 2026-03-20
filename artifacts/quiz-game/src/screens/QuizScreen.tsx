import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/questions";
import { getLevel, getLevelColor, getStreakLabel, getStreakMultiplier } from "@/hooks/use-quiz";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle, Flame, Zap } from "lucide-react";

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
  onSubmit: (answer: string | null) => void;
  onNext: () => void;
}

const ANSWER_STYLES = [
  { base: 'bg-[#e91e8c] text-white border-[#c0176e] shadow-[0_6px_0_#c0176e]', hover: 'hover:bg-[#d4178a]' },
  { base: 'bg-[#0891b2] text-white border-[#0670a0] shadow-[0_6px_0_#0670a0]', hover: 'hover:bg-[#0780a5]' },
  { base: 'bg-[#7c3aed] text-white border-[#6028c7] shadow-[0_6px_0_#6028c7]', hover: 'hover:bg-[#6d28d9]' },
  { base: 'bg-[#d97706] text-white border-[#b46008] shadow-[0_6px_0_#b46008]', hover: 'hover:bg-[#c47005]' },
];

export function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  shuffledAnswers,
  timeLeft,
  status,
  playerAnswer,
  streak,
  lastAnswerBonus,
  totalScore,
  onSubmit,
  onNext,
}: QuizScreenProps) {

  // Keyboard bindings
  useEffect(() => {
    if (status !== 'idle') {
      const handleNextKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
      };
      window.addEventListener('keydown', handleNextKey);
      return () => window.removeEventListener('keydown', handleNextKey);
    }

    const handleAnswerKey = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4 && shuffledAnswers[num - 1]) {
        onSubmit(shuffledAnswers[num - 1]);
      }
    };
    window.addEventListener('keydown', handleAnswerKey);
    return () => window.removeEventListener('keydown', handleAnswerKey);
  }, [status, shuffledAnswers, onSubmit, onNext]);

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;
  const isDangerTime = timeLeft <= 5 && status === 'idle';
  const isWarningTime = timeLeft <= 10 && timeLeft > 5 && status === 'idle';
  const level = getLevel(questionIndex);
  const levelColor = getLevelColor(questionIndex);
  const streakLabel = getStreakLabel(streak);
  const multiplier = getStreakMultiplier(streak);

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen flex flex-col pt-24 pb-8 px-4 max-w-4xl mx-auto w-full"
    >
      {/* Progress & Stats Row */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Level badge */}
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-card/80 border border-border", levelColor)}>
              {level}
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              Q{questionIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Right side: streak + timer + score */}
          <div className="flex items-center gap-2">
            {/* Streak indicator */}
            <AnimatePresence>
              {streak >= 3 && (
                <motion.div
                  key={streak}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 px-3 py-1 rounded-full"
                >
                  {streak >= 5 ? (
                    <Zap size={14} className="text-yellow-300 fill-yellow-300" />
                  ) : (
                    <Flame size={14} className="text-orange-400 fill-orange-400" />
                  )}
                  <span className="text-sm font-black text-orange-300">{streak}x {streakLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Multiplier badge */}
            {multiplier > 1 && (
              <span className="text-xs font-black text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full">
                {multiplier}x BONUS
              </span>
            )}

            {/* Score */}
            <div className="bg-card/80 backdrop-blur-md px-3 py-1 rounded-full border border-border shadow-sm">
              <span className="font-black text-primary text-sm">{totalScore} pts</span>
            </div>

            {/* Timer */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full font-display transition-all",
              isDangerTime
                ? "bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse"
                : isWarningTime
                ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                : "bg-card/80 border border-border text-foreground"
            )}>
              <Clock size={14} />
              <span className={cn("text-lg font-black", isDangerTime && "text-red-400")}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card/90 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 md:p-10 mb-6 relative">
        {/* Category & Difficulty badges */}
        <div className="absolute -top-3.5 left-5 flex gap-2">
          <span className="bg-secondary text-secondary-foreground text-xs font-black px-3 py-1 rounded-full shadow-md">
            {question.category}
          </span>
          <span className={cn(
            "text-xs font-black px-3 py-1 rounded-full shadow-md text-white",
            question.difficulty === 'Easy' ? "bg-green-500" :
            question.difficulty === 'Medium' ? "bg-yellow-500 text-black" : "bg-red-500"
          )}>
            {question.difficulty}
          </span>
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-foreground mt-3 text-center leading-tight">
          {question.text}
        </h2>
      </div>

      {/* Answer Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {shuffledAnswers.map((answer, i) => {
          const style = ANSWER_STYLES[i % 4];
          const isSelected = playerAnswer === answer;
          const isCorrectAnswer = answer === question.correctAnswer;
          const showAsCorrect = status !== 'idle' && isCorrectAnswer;
          const showAsWrong = status === 'answered' && isSelected && !isCorrectAnswer;

          let btnClass = '';
          let animClass = '';

          if (status === 'idle') {
            btnClass = cn(style.base, style.hover, 'active:translate-y-[4px] active:shadow-none cursor-pointer');
          } else if (showAsCorrect) {
            btnClass = 'bg-green-500 text-white border-green-700 shadow-[0_6px_0_#15803d] scale-[1.01]';
            if (isSelected) animClass = 'animate-bounce-in';
          } else if (showAsWrong) {
            btnClass = 'bg-red-500 text-white border-red-700 shadow-[0_6px_0_#b91c1c]';
            animClass = 'animate-shake';
          } else {
            btnClass = 'bg-muted text-muted-foreground border-border shadow-none opacity-40 grayscale cursor-not-allowed';
          }

          return (
            <button
              key={answer}
              disabled={status !== 'idle'}
              onClick={() => onSubmit(answer)}
              className={cn(
                "relative min-h-[90px] p-5 rounded-xl text-base md:text-xl font-bold flex items-center gap-4 text-left transition-all duration-200 border-b-4",
                btnClass,
                animClass,
                status === 'idle' && 'hover:brightness-110 hover:-translate-y-0.5'
              )}
            >
              {/* Number label */}
              <span className="w-9 h-9 shrink-0 rounded-lg bg-black/20 flex items-center justify-center text-sm font-black">
                {LABELS[i]}
              </span>
              <span className="flex-1 leading-snug">{answer}</span>

              {/* Status icon */}
              {showAsCorrect && <CheckCircle2 className="shrink-0 text-white" size={24} />}
              {showAsWrong && <XCircle className="shrink-0 text-white" size={24} />}
            </button>
          );
        })}
      </div>

      {/* Feedback bar */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-xl"
          >
            <div className="flex items-center gap-3">
              {status === 'timeout' ? (
                <>
                  <AlertCircle className="text-amber-400 shrink-0" size={28} />
                  <div>
                    <div className="text-lg font-black text-amber-400">Time's Up!</div>
                    <div className="text-sm text-muted-foreground">Correct: {question.correctAnswer}</div>
                  </div>
                </>
              ) : playerAnswer === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="text-green-400 shrink-0" size={28} />
                  <div>
                    <div className="text-lg font-black text-green-400">
                      Correct! +{10} pts
                      {lastAnswerBonus > 0 && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-2 text-yellow-300 text-base"
                        >
                          ⚡ +{lastAnswerBonus} bonus!
                        </motion.span>
                      )}
                    </div>
                    {streak >= 2 && (
                      <div className="text-sm text-orange-300 font-bold">{streak} in a row! 🔥</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400 shrink-0" size={28} />
                  <div>
                    <div className="text-lg font-black text-red-400">Nice Try!</div>
                    <div className="text-sm text-muted-foreground">Correct: {question.correctAnswer}</div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onNext}
              autoFocus
              className="btn-3d bg-foreground text-background px-6 py-3 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:opacity-90 shrink-0 transition-opacity"
            >
              {questionIndex + 1 < totalQuestions ? (
                <>Next Question <ArrowRight size={18} /></>
              ) : (
                <>See Results <ArrowRight size={18} /></>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
