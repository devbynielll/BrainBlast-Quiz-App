import { motion } from "framer-motion";
import { Play, Trophy, Info } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-xl w-full flex flex-col items-center text-center space-y-8">
        
        {/* Title Section */}
        <div className="space-y-4 relative">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-sm filter">
              BrainBlast
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-card px-6 py-2 rounded-full border border-border shadow-lg"
          >
            <p className="text-xl md:text-2xl font-bold text-foreground">
              Test Your Knowledge! 🚀
            </p>
          </motion.div>
        </div>

        {/* High Score Badge */}
        {highScore > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 px-6 py-3 rounded-2xl shadow-inner"
          >
            <Trophy className="text-accent" size={28} />
            <span className="text-lg font-bold text-foreground">High Score:</span>
            <span className="text-2xl font-black text-primary">{highScore} pts</span>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-3d w-full md:w-auto bg-primary text-primary-foreground font-display text-3xl px-12 py-6 rounded-2xl flex items-center justify-center space-x-4 shadow-[0_0_40px_rgba(236,72,153,0.4)]"
        >
          <span>Start Quiz!</span>
          <Play size={32} fill="currentColor" />
        </motion.button>

        {/* How to Play */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border shadow-xl w-full text-left"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Info className="text-secondary" />
            <h2 className="text-xl font-bold text-foreground">How to Play</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground font-medium">
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 text-sm">1</span>
              Answer 10 random questions from various categories.
            </li>
            <li className="flex items-start">
              <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 text-sm">2</span>
              You have exactly 15 seconds per question. Be quick!
            </li>
            <li className="flex items-start">
              <span className="bg-accent/20 text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 text-sm">3</span>
              Keyboard shortcut: Press 1, 2, 3, or 4 to select answers.
            </li>
          </ul>
        </motion.div>

      </div>
    </motion.div>
  );
}
