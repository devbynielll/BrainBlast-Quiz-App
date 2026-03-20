import { motion } from "framer-motion";
import { Play, Trophy, BookOpen, Zap, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const howToPlay = [
  { icon: <BookOpen size={16} />, text: "Answer 10 random SHS questions from various subjects.", color: "text-primary" },
  { icon: <Clock size={16} />, text: "You have 15 seconds per question — be quick for bonus points!", color: "text-secondary" },
  { icon: <Zap size={16} />, text: "Build a streak of correct answers to earn a score multiplier!", color: "text-yellow-400" },
  { icon: <Star size={16} />, text: "Press keys 1, 2, 3 or 4 to answer using your keyboard.", color: "text-purple-400" },
];

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="max-w-xl w-full flex flex-col items-center text-center space-y-7">

        {/* Title */}
        <motion.div
          initial={{ scale: 0.7, rotate: -4 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary leading-none pb-2">
            BrainBlast
          </h1>
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border px-5 py-2.5 rounded-full shadow-lg">
            <span className="text-base md:text-lg font-bold text-foreground">🇵🇭 Senior High School Quiz</span>
          </div>
        </motion.div>

        {/* High Score */}
        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-2xl"
          >
            <Trophy className="text-yellow-400 shrink-0" size={26} />
            <div className="text-left">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your High Score</div>
              <div className="text-2xl font-black text-yellow-400">{highScore} pts</div>
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onStart}
          className="w-full bg-primary text-primary-foreground font-display text-2xl px-10 py-5 rounded-2xl flex items-center justify-center gap-4 shadow-[0_8px_0_#c0176e,0_0_40px_rgba(233,30,140,0.4)] active:translate-y-[4px] active:shadow-[0_4px_0_#c0176e] transition-all duration-150"
        >
          <Play size={28} fill="currentColor" />
          Start Quiz!
        </motion.button>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-card/70 backdrop-blur-md p-6 rounded-2xl border border-border shadow-xl w-full text-left"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-primary shrink-0" size={20} />
            <h2 className="text-lg font-black text-foreground">How to Play</h2>
          </div>
          <ul className="space-y-3">
            {howToPlay.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={cn("shrink-0 mt-0.5", item.color)}>{item.icon}</div>
                <span className="text-sm font-medium text-muted-foreground leading-snug">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Subject topics hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {['Math', 'Science', 'English', 'Filipino', 'ICT', 'Research', 'STEM', 'ABM', 'HUMSS', 'TVL'].map(tag => (
            <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-card/60 border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
