import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AnswerRecord, saveToLeaderboard, loadLeaderboard, LeaderboardEntry } from "@/hooks/use-quiz";
import { useState } from "react";
import { RotateCcw, ListChecks, Trophy, Star, Flame, Target, Clock, Brain, TrendingUp, TrendingDown, Award, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsScreenProps {
  correctCount: number;
  totalQuestions: number;
  totalScore: number;
  highScore: number;
  maxStreak: number;
  answers: AnswerRecord[];
  playerName: string;
  quizMode: string;
  gamePin: string;
  onPlayAgain: () => void;
  onReview: () => void;
}

function getPerformanceData(pct: number) {
  if (pct === 100) return { label: '🏆 Legendary!', sub: 'Perfect score! You\'re a BrainBlast champion!', color: 'text-yellow-400' };
  if (pct >= 80) return { label: '⭐ Excellent!', sub: 'Outstanding performance! Top of the class!', color: 'text-yellow-300' };
  if (pct >= 60) return { label: '👍 Great Job!', sub: 'Solid effort — you know your stuff!', color: 'text-green-400' };
  if (pct >= 40) return { label: '😊 Good Effort!', sub: 'You\'re learning! Keep studying and try again.', color: 'text-blue-400' };
  return { label: '💪 Keep Going!', sub: 'Don\'t give up — review and come back stronger!', color: 'text-rose-400' };
}

function analyzeCategories(answers: AnswerRecord[]) {
  const map: Record<string, { correct: number; total: number }> = {};
  for (const a of answers) {
    const c = a.question.category;
    if (!map[c]) map[c] = { correct: 0, total: 0 };
    map[c].total++;
    if (a.isCorrect) map[c].correct++;
  }
  return Object.entries(map).map(([cat, d]) => ({
    category: cat,
    correct: d.correct,
    total: d.total,
    pct: Math.round((d.correct / d.total) * 100),
  })).sort((a, b) => b.pct - a.pct);
}

function getStrand(cats: ReturnType<typeof analyzeCategories>): string {
  const map: Record<string, string[]> = {
    STEM: ['Mathematics', 'Science', 'STEM'],
    ABM: ['ABM', 'General Academic'],
    HUMSS: ['HUMSS', 'English', 'Filipino', 'Research'],
    TVL: ['TVL', 'ICT'],
    GAS: ['General Academic', 'Research', 'ICT'],
  };
  const scores: Record<string, { total: number; count: number }> = {};
  for (const [strand, scats] of Object.entries(map)) {
    scores[strand] = { total: 0, count: 0 };
    for (const c of cats) {
      if (scats.includes(c.category)) { scores[strand].total += c.pct; scores[strand].count++; }
    }
  }
  return Object.entries(scores)
    .map(([s, d]) => ({ s, avg: d.count > 0 ? d.total / d.count : 0 }))
    .sort((a, b) => b.avg - a.avg)[0]?.s ?? 'STEM';
}

function computeAchievements(answers: AnswerRecord[], maxStreak: number) {
  const list: { icon: string; title: string; desc: string }[] = [];
  if (maxStreak >= 3) list.push({ icon: '🔥', title: 'Hot Streak', desc: `${maxStreak} correct answers in a row!` });
  if (answers.some(a => a.isCorrect && a.timeUsed < 5)) list.push({ icon: '⚡', title: 'Fast Thinker', desc: 'Answered in under 5 seconds!' });
  if (answers.every(a => a.isCorrect)) list.push({ icon: '👑', title: 'Perfect Run', desc: 'All questions answered correctly!' });
  const shs = answers.filter(a => a.question.type === 'SHS');
  if (shs.length > 0 && shs.filter(a => a.isCorrect).length / shs.length >= 0.8) {
    list.push({ icon: '🎓', title: 'SHS Master', desc: '80%+ on SHS curriculum questions!' });
  }
  if (answers.reduce((s, a) => s + a.bonusEarned, 0) >= 20) {
    list.push({ icon: '🚀', title: 'Speed Demon', desc: 'Earned 20+ bonus points through speed!' });
  }
  return list;
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

export function ResultsScreen({
  correctCount, totalQuestions, totalScore, highScore, maxStreak,
  answers, playerName, quizMode, gamePin, onPlayAgain, onReview,
}: ResultsScreenProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const performance = getPerformanceData(percentage);
  const wrongCount = answers.filter(a => !a.isCorrect && !a.isTimeout).length;
  const timeoutCount = answers.filter(a => a.isTimeout).length;
  const totalBonus = answers.reduce((sum, a) => sum + a.bonusEarned, 0);
  const avgTime = answers.length > 0 ? answers.reduce((sum, a) => sum + a.timeUsed, 0) / answers.length : 0;
  const isHighScore = totalScore >= highScore && totalScore > 0;
  const categories = analyzeCategories(answers);
  const strong = categories.filter(c => c.pct >= 67);
  const weak = categories.filter(c => c.pct < 34);
  const strand = getStrand(categories);
  const achievements = computeAchievements(answers, maxStreak);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!savedRef.current && totalScore > 0) {
      savedRef.current = true;
      const updated = saveToLeaderboard(playerName || 'Anonymous', totalScore);
      setLeaderboard(updated);
    } else {
      setLeaderboard(loadLeaderboard());
    }
  }, []);

  useEffect(() => {
    if (percentage >= 60) {
      const duration = percentage >= 80 ? 4000 : 2000;
      const end = Date.now() + duration;
      const colors = ['#e91e8c', '#0891b2', '#7c3aed', '#eab308', '#22c55e'];
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [percentage]);

  const statCards = [
    { label: 'Correct', value: correctCount, icon: <Target size={18} />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    { label: 'Wrong', value: wrongCount, icon: <ListChecks size={18} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    { label: 'Missed', value: timeoutCount, icon: <Clock size={18} />, color: 'text-muted-foreground', bg: 'bg-muted/40 border-border' },
    { label: 'Best Streak', value: maxStreak, icon: <Flame size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  ];

  const strandColors: Record<string, string> = {
    STEM: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    ABM: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    HUMSS: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    TVL: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    GAS: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className="min-h-screen flex items-start justify-center p-4 pt-20 pb-12"
    >
      <div className="max-w-2xl w-full space-y-4">

        {/* Main results card */}
        <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-6 md:p-10 text-center">

          {/* Player name + mode + PIN */}
          {playerName && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
              className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <span className="text-sm font-bold text-muted-foreground bg-muted/50 border border-border px-3 py-1 rounded-full">
                👤 {playerName}
              </span>
              <span className="text-sm font-bold text-muted-foreground bg-muted/50 border border-border px-3 py-1 rounded-full">
                {quizMode === 'Mixed' ? '🎯 Mixed' : quizMode === 'SHS' ? '🎓 SHS' : '🌍 Trivia'} Mode
              </span>
              <span className="text-sm font-bold text-muted-foreground bg-muted/50 border border-border px-3 py-1 rounded-full flex items-center gap-1">
                <Hash size={12} />{gamePin}
              </span>
            </motion.div>
          )}

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className={cn("text-4xl md:text-5xl font-display font-black mb-1", performance.color)}>
              {performance.label}
            </h1>
            <p className="text-muted-foreground font-medium mb-6">{performance.sub}</p>
          </motion.div>

          {/* Score circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="44" fill="transparent"
                  stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="276"
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * percentage / 100) }}
                  transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-foreground">{percentage}%</span>
                <span className="text-sm font-bold text-muted-foreground">{correctCount}/{totalQuestions}</span>
              </div>
            </div>
          </motion.div>

          {/* Score breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-4 mb-5"
          >
            <div className="flex justify-center items-baseline gap-2 mb-1">
              <span className="text-4xl font-black text-primary">{totalScore}</span>
              <span className="text-base font-bold text-muted-foreground">total points</span>
            </div>
            <div className="flex justify-center gap-4 text-sm font-medium text-muted-foreground flex-wrap">
              <span>Base: {correctCount * 10} pts</span>
              <span className="text-yellow-400">⚡ Bonus: +{totalBonus} pts</span>
              <span>Avg time: {avgTime.toFixed(1)}s</span>
            </div>
          </motion.div>

          {/* Stat grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5"
          >
            {statCards.map(s => (
              <div key={s.label} className={cn("border rounded-2xl p-3 text-center", s.bg)}>
                <div className={cn("flex justify-center mb-1", s.color)}>{s.icon}</div>
                <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* High score */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border mb-5 font-bold text-sm",
              isHighScore ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" : "bg-card border-border text-muted-foreground"
            )}
          >
            <Trophy size={18} className={isHighScore ? "text-yellow-400" : ""} />
            {isHighScore
              ? <span>🎉 New High Score: <strong>{highScore} pts</strong></span>
              : <span>High Score: <strong>{highScore} pts</strong></span>
            }
            {isHighScore && <Star size={15} className="text-yellow-400 fill-yellow-400" />}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onPlayAgain}
              className="btn-3d flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <RotateCcw size={20} /> Play Again
            </button>
            <button
              onClick={onReview}
              className="btn-3d flex-1 bg-card text-foreground border border-border py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-muted transition-all"
            >
              <ListChecks size={20} /> Review Answers
            </button>
          </motion.div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-yellow-400" size={18} />
              <h2 className="text-base font-black text-foreground">Achievements Unlocked!</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2.5 rounded-xl"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <div className="font-black text-sm text-yellow-400">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Smart Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-primary" size={18} />
            <h2 className="text-base font-black text-foreground">Smart Performance Analysis</h2>
          </div>

          {/* Strand recommendation */}
          <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border mb-4", strandColors[strand] || strandColors.GAS)}>
            <div className="text-2xl">🧑‍🎓</div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">Suggested Strand</div>
              <div className="text-xl font-black">{strand}</div>
              <div className="text-xs mt-0.5 opacity-80">Based on your strongest subject performance</div>
            </div>
          </div>

          {/* Category breakdown */}
          {categories.length > 0 && (
            <div className="space-y-2 mb-4">
              {categories.map(c => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-28 shrink-0 truncate">{c.category}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", c.pct >= 67 ? "bg-green-500" : c.pct >= 34 ? "bg-yellow-500" : "bg-red-500")}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-black w-14 text-right text-foreground">{c.correct}/{c.total} ({c.pct}%)</span>
                </div>
              ))}
            </div>
          )}

          {/* Strong / Weak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strong.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="text-xs font-black text-green-400 uppercase tracking-wide">Strong Subjects</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strong.map(c => (
                    <span key={c.category} className="text-xs font-bold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {weak.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown size={14} className="text-red-400" />
                  <span className="text-xs font-black text-red-400 uppercase tracking-wide">Needs Review</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {weak.map(c => (
                    <span key={c.category} className="text-xs font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="text-yellow-400" size={18} />
              <h2 className="text-base font-black text-foreground">Top Scores</h2>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => {
                const isMe = entry.name === (playerName || 'Anonymous') && entry.score === totalScore;
                return (
                  <div key={i} className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-xl border",
                    i === 0 ? "bg-yellow-500/10 border-yellow-500/30"
                      : isMe ? "bg-primary/10 border-primary/30"
                      : "bg-muted/40 border-border"
                  )}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{MEDAL[i]}</span>
                      <span className={cn("font-bold text-sm", i === 0 ? "text-yellow-400" : isMe ? "text-primary" : "text-foreground")}>
                        {entry.name} {isMe && <span className="text-xs">(You)</span>}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={cn("font-black text-base", i === 0 ? "text-yellow-400" : "text-primary")}>
                        {entry.score} pts
                      </span>
                      <div className="text-xs text-muted-foreground">{entry.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
