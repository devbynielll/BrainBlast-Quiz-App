import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AnswerRecord } from "@/hooks/use-quiz";
import { RotateCcw, ListChecks, Trophy } from "lucide-react";

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  highScore: number;
  answers: AnswerRecord[];
  onPlayAgain: () => void;
  onReview: () => void;
}

export function ResultsScreen({
  score,
  totalQuestions,
  highScore,
  answers,
  onPlayAgain,
  onReview
}: ResultsScreenProps) {

  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  if (percentage === 100) message = "🏆 Legendary!";
  else if (percentage >= 80) message = "⭐ Excellent!";
  else if (percentage >= 60) message = "👍 Great Job!";
  else if (percentage >= 40) message = "😊 Good Effort!";
  else message = "💪 Keep Practicing!";

  useEffect(() => {
    if (percentage >= 70) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#EC4899', '#3B82F6', '#EAB308']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#EC4899', '#3B82F6', '#EAB308']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [percentage]);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const timeoutCount = answers.filter(a => a.isTimeout).length;
  const wrongCount = totalQuestions - correctCount - timeoutCount;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center p-4 pt-20"
    >
      <div className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-[2rem] p-8 md:p-12 text-center">
        
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2"
        >
          {message}
        </motion.h1>
        
        <div className="flex justify-center items-center my-8">
          <div className="relative w-48 h-48 rounded-full border-8 border-primary/20 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-primary">{score}</span>
            <span className="text-xl font-bold text-muted-foreground border-t-2 border-border mt-2 pt-2 w-1/2">/ {totalQuestions}</span>
            
            {/* Circular progress highlight */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.89} 289`}
                className="text-primary"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
            <div className="text-3xl font-black text-green-500">{correctCount}</div>
            <div className="text-sm font-bold text-green-600/80 uppercase">Correct</div>
          </div>
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4">
            <div className="text-3xl font-black text-destructive">{wrongCount}</div>
            <div className="text-sm font-bold text-destructive/80 uppercase">Wrong</div>
          </div>
          <div className="bg-muted border border-border rounded-2xl p-4">
            <div className="text-3xl font-black text-muted-foreground">{timeoutCount}</div>
            <div className="text-sm font-bold text-muted-foreground/80 uppercase">Missed</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-accent bg-accent/10 py-3 rounded-xl border border-accent/20 mb-8 font-bold text-lg">
          <Trophy size={24} />
          <span>High Score: {highScore}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onPlayAgain}
            className="btn-3d flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-xl flex items-center justify-center space-x-2"
          >
            <RotateCcw size={24} />
            <span>Play Again</span>
          </button>
          <button
            onClick={onReview}
            className="btn-3d flex-1 bg-secondary text-secondary-foreground py-4 rounded-xl font-bold text-xl flex items-center justify-center space-x-2"
          >
            <ListChecks size={24} />
            <span>Review Answers</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
