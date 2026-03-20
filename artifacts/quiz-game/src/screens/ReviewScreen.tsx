import { motion } from "framer-motion";
import { AnswerRecord } from "@/hooks/use-quiz";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewScreenProps {
  answers: AnswerRecord[];
  onBack: () => void;
}

export function ReviewScreen({ answers, onBack }: ReviewScreenProps) {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalBonus = answers.reduce((sum, a) => sum + a.bonusEarned, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto w-full"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-foreground">Review Answers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {correctCount}/{answers.length} correct · +{totalBonus} bonus pts
          </p>
        </div>
        <button
          onClick={onBack}
          className="btn-3d bg-card text-foreground border border-border px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-muted transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Results</span>
        </button>
      </div>

      {/* Answer cards */}
      <div className="space-y-4">
        {answers.map((record, index) => {
          const { question, playerAnswer, isCorrect, isTimeout, bonusEarned, streakAtAnswer, timeUsed } = record;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={cn(
                "bg-card rounded-2xl border shadow-sm relative overflow-hidden",
                isCorrect ? "border-green-500/40" : isTimeout ? "border-border" : "border-red-500/40"
              )}
            >
              {/* Left color stripe */}
              <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full rounded-l-2xl",
                isCorrect ? "bg-green-500" : isTimeout ? "bg-muted-foreground/40" : "bg-red-500"
              )} />

              <div className="pl-5 pr-5 pt-4 pb-5">
                {/* Top meta row */}
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span className="text-xs font-black text-muted-foreground">Q{index + 1}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                    {question.category}
                  </span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded text-white",
                    question.difficulty === 'Easy' ? "bg-green-500" :
                    question.difficulty === 'Medium' ? "bg-yellow-500 text-black" : "bg-red-500"
                  )}>
                    {question.difficulty}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    {bonusEarned > 0 && (
                      <span className="flex items-center gap-1 text-xs font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        <Zap size={11} />+{bonusEarned} bonus
                      </span>
                    )}
                    {streakAtAnswer >= 3 && (
                      <span className="text-xs font-black text-orange-400">🔥 {streakAtAnswer} streak</span>
                    )}
                    <span className="text-xs text-muted-foreground">{timeUsed.toFixed(0)}s used</span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={14} /> Correct
                      </span>
                    ) : isTimeout ? (
                      <span className="flex items-center gap-1 text-muted-foreground font-bold text-xs bg-muted border border-border px-2.5 py-0.5 rounded-full">
                        <Clock size={14} /> Timeout
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 font-bold text-xs bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                        <XCircle size={14} /> Wrong
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <h3 className="text-base md:text-lg font-bold text-foreground mb-4 leading-snug">
                  {question.text}
                </h3>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                    <div className="text-xs font-black text-green-400 mb-1 uppercase tracking-wider">✓ Correct Answer</div>
                    <div className="font-bold text-foreground text-sm">{question.correctAnswer}</div>
                  </div>

                  {!isCorrect && (
                    <div className={cn(
                      "p-3 rounded-xl border",
                      isTimeout ? "bg-muted/50 border-border" : "bg-red-500/10 border-red-500/20"
                    )}>
                      <div className={cn(
                        "text-xs font-black mb-1 uppercase tracking-wider",
                        isTimeout ? "text-muted-foreground" : "text-red-400"
                      )}>
                        {isTimeout ? "⏰ Your Answer" : "✗ Your Answer"}
                      </div>
                      <div className={cn(
                        "font-bold text-sm",
                        isTimeout ? "text-muted-foreground italic" : "text-foreground"
                      )}>
                        {playerAnswer || "Did not answer (time ran out)"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom back button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className="btn-3d bg-primary text-primary-foreground px-8 py-4 rounded-xl font-black text-lg flex items-center gap-2 hover:brightness-110 transition-all"
        >
          <ArrowLeft size={22} />
          Back to Results
        </button>
      </div>
    </motion.div>
  );
}
