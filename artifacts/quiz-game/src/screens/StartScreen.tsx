import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Trophy, BookOpen, Zap, Clock, Star, User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadLeaderboard, LeaderboardEntry } from "@/hooks/use-quiz";

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
  playerName: string;
  gamePin: string;
  onSetName: (name: string) => void;
}

const howToPlay = [
  { icon: <BookOpen size={15} />, text: "Choose a mode: SHS, Trivia, or Mixed, then answer questions to earn points.", color: "text-primary" },
  { icon: <Clock size={15} />, text: "15 seconds per question — faster answers earn bonus points!", color: "text-secondary" },
  { icon: <Zap size={15} />, text: "Build correct-answer streaks for up to 2× score multipliers.", color: "text-yellow-400" },
  { icon: <Star size={15} />, text: "Difficulty adapts as you play. Press 1–4 keys to answer quickly.", color: "text-purple-400" },
];

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

export function StartScreen({ onStart, highScore, playerName, gamePin, onSetName }: StartScreenProps) {
  const [nameInput, setNameInput] = useState(playerName);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  const handleNameBlur = () => {
    onSetName(nameInput.trim());
  };

  const handlePlay = () => {
    onSetName(nameInput.trim());
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-start px-4 py-24"
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-6">

        {/* Title */}
        <motion.div
          initial={{ scale: 0.7, rotate: -4 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary leading-none pb-2">
            BrainBlast
          </h1>
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border px-5 py-2 rounded-full shadow-lg">
            <span className="text-base font-bold text-foreground">🇵🇭 Senior High School Quiz Platform</span>
          </div>
        </motion.div>

        {/* Game PIN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border px-6 py-3 rounded-2xl shadow-md"
        >
          <Hash className="text-secondary shrink-0" size={20} />
          <div className="text-left">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Game PIN</div>
            <div className="text-2xl font-black tracking-[0.2em] text-secondary">{gamePin}</div>
          </div>
        </motion.div>

        {/* Player Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full"
        >
          <label className="block text-left text-sm font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
            <User size={14} /> Your Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && handlePlay()}
            placeholder="Enter your name…"
            maxLength={24}
            className="w-full bg-card/80 backdrop-blur-md border border-border rounded-xl px-5 py-3.5 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
        </motion.div>

        {/* High Score */}
        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-2xl"
          >
            <Trophy className="text-yellow-400 shrink-0" size={22} />
            <div className="text-left">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Personal Best</div>
              <div className="text-xl font-black text-yellow-400">{highScore} pts</div>
            </div>
          </motion.div>
        )}

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handlePlay}
          className="w-full bg-primary text-primary-foreground font-display text-2xl px-10 py-5 rounded-2xl flex items-center justify-center gap-4 shadow-[0_8px_0_#c0176e,0_0_40px_rgba(233,30,140,0.4)] active:translate-y-[4px] active:shadow-[0_4px_0_#c0176e] transition-all duration-150"
        >
          <Play size={28} fill="currentColor" />
          {nameInput.trim() ? `Let's Go, ${nameInput.trim().split(' ')[0]}!` : 'Start Quiz!'}
        </motion.button>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full bg-card/70 backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-400 shrink-0" size={18} />
              <h2 className="text-base font-black text-foreground">Top Scores</h2>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl border",
                  i === 0 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-muted/40 border-border"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{MEDAL[i]}</span>
                    <span className={cn("font-bold text-sm", i === 0 ? "text-yellow-400" : "text-foreground")}>
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={cn("font-black text-base", i === 0 ? "text-yellow-400" : "text-primary")}>
                      {entry.score} pts
                    </span>
                    <div className="text-xs text-muted-foreground">{entry.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-border shadow-xl w-full text-left"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-primary shrink-0" size={18} />
            <h2 className="text-base font-black text-foreground">How to Play</h2>
          </div>
          <ul className="space-y-2.5">
            {howToPlay.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={cn("shrink-0 mt-0.5", item.color)}>{item.icon}</div>
                <span className="text-sm font-medium text-muted-foreground leading-snug">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Subject tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {['Math', 'Science', 'English', 'Filipino', 'ICT', 'Research', 'STEM', 'ABM', 'HUMSS', 'TVL', 'Trivia'].map(tag => (
            <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-card/60 border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
