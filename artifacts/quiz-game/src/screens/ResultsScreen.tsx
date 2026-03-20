import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AnswerRecord } from "@/hooks/use-quiz";
import { RotateCcw, ListChecks, Trophy, Star, Flame, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsScreenProps {
  correctCount: number;
  totalQuestions: number;
  totalScore: number;
  highScore: number;
  maxStreak: number;
  answers: AnswerRecord[];
  onPlayAgain: () => void;
  onReview: () => void;
}

function getPerformanceData(pct: number) {
  if (pct === 100) return { label: '🏆 Legendary!', sub: 'You got a perfect score! Amazing!', color: 'text-yellow-400' };
  if (pct >= 80) return { label: '⭐ Excellent!', sub: 'Outstanding performance! Keep it up!', color: 'text-yellow-300' };
  if (pct >= 60) return { label: '👍 Great Job!', sub: 'Solid effort! You know your stuff.', color: 'text-green-400' };
  if (pct >= 40) return { label: '😊 Good Effort!', sub: 'You\'re on your way! Keep studying!', color: 'text-blue-400' };
  return { label: '💪 Keep Practicing!', sub: 'Don\'t give up! Review and try again.', color: 'text-rose-400' };
}

export function ResultsScreen({
  correctCount,
  totalQuestions,
  totalScore,
  highScore,
  maxStreak,
  answers,
  onPlayAgain,
  onReview,
}: ResultsScreenProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const performance = getPerformanceData(percentage);
  const wrongCount = answers.filter(a => !a.isCorrect && !a.isTimeout).length;
  const timeoutCount = answers.filter(a => a.isTimeout).length;
  const totalBonus = answers.reduce((sum, a) => sum + a.bonusEarned, 0);
  const avgTime = answers.reduce((sum, a) => sum + a.timeUsed, 0) / answers.length;
  const isHighScore = totalScore >= highScore && totalScore > 0;

  useEffect(() => {
    if (percentage >= 60) {
      const duration = percentage >= 80 ? 4000 : 2000;
      const end = Date.now() + duration;
      const colors = ['#e91e8c', '#0891b2', '#7c3aed', '#eab308', '#22c55e'];

      const frame = () => {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [percentage]);

  const statCards = [
    { label: 'Correct', value: correctCount, icon: <Target size={20} />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    { label: 'Wrong', value: wrongCount, icon: <ListChecks size={20} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    { label: 'Missed', value: timeoutCount, icon: <Clock size={20} />, color: 'text-muted-foreground', bg: 'bg-muted/40 border-border' },
    { label: 'Best Streak', value: maxStreak, icon: <Flame size={20} />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className="min-h-screen flex items-center justify-center p-4 pt-20"
    >
      <div className="max-w-2xl w-full">
        {/* Main card */}
        <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 md:p-12 text-center">
          {/* Performance headline */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className={cn("text-4xl md:text-5xl font-display font-black mb-1", performance.color)}>
              {performance.label}
            </h1>
            <p className="text-muted-foreground font-medium mb-8">{performance.sub}</p>
          </motion.div>

          {/* Score circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="44"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${276}`}
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * percentage / 100) }}
                  transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-foreground">{percentage}%</span>
                <span className="text-sm font-bold text-muted-foreground">{correctCount}/{totalQuestions}</span>
              </div>
            </div>
          </motion.div>

          {/* Total score + bonus breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-4 mb-6"
          >
            <div className="flex justify-center items-baseline gap-2 mb-1">
              <span className="text-4xl font-black text-primary">{totalScore}</span>
              <span className="text-lg font-bold text-muted-foreground">total points</span>
            </div>
            <div className="flex justify-center gap-4 text-sm font-medium text-muted-foreground flex-wrap">
              <span>Base: {correctCount * 10} pts</span>
              <span className="text-yellow-400">⚡ Bonus: +{totalBonus} pts</span>
              <span>Avg time: {avgTime.toFixed(1)}s</span>
            </div>
          </motion.div>

          {/* Stat grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {statCards.map((s) => (
              <div key={s.label} className={cn("border rounded-2xl p-4 text-center", s.bg)}>
                <div className={cn("flex justify-center mb-1", s.color)}>{s.icon}</div>
                <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* High score */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border mb-8 font-bold text-base",
              isHighScore
                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                : "bg-card border-border text-muted-foreground"
            )}
          >
            <Trophy size={20} className={isHighScore ? "text-yellow-400" : ""} />
            {isHighScore
              ? <span>🎉 New High Score: <strong>{highScore} pts</strong></span>
              : <span>High Score: <strong>{highScore} pts</strong></span>
            }
            <Star size={16} className={isHighScore ? "text-yellow-400 fill-yellow-400" : "hidden"} />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onPlayAgain}
              className="btn-3d flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <RotateCcw size={22} />
              Play Again
            </button>
            <button
              onClick={onReview}
              className="btn-3d flex-1 bg-card text-foreground border border-border py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-muted transition-all"
            >
              <ListChecks size={22} />
              Review Answers
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
