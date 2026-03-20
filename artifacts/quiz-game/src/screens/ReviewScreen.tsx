import { motion } from "framer-motion";
import { AnswerRecord } from "@/hooks/use-quiz";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewScreenProps {
  answers: AnswerRecord[];
  onBack: () => void;
}

export function ReviewScreen({ answers, onBack }: ReviewScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
          Review Answers
        </h1>
        <button
          onClick={onBack}
          className="btn-3d bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full font-bold flex items-center space-x-2 border border-border shadow-sm"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Results</span>
        </button>
      </div>

      <div className="space-y-6">
        {answers.map((record, index) => {
          const { question, playerAnswer, isCorrect, isTimeout } = record;
          
          return (
            <motion.div 
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "bg-card p-6 rounded-2xl border shadow-sm relative overflow-hidden",
                isCorrect ? "border-green-500/50" : "border-destructive/50"
              )}
            >
              {/* Status Banner */}
              <div className={cn(
                "absolute top-0 left-0 w-2 h-full",
                isCorrect ? "bg-green-500" : isTimeout ? "bg-muted-foreground" : "bg-destructive"
              )} />
              
              <div className="pl-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-bold text-muted-foreground">Q{index + 1}.</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-muted text-foreground">
                    {question.category}
                  </span>
                  
                  <div className="ml-auto">
                    {isCorrect ? (
                      <span className="flex items-center text-green-500 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={16} className="mr-1" /> Correct
                      </span>
                    ) : isTimeout ? (
                      <span className="flex items-center text-muted-foreground font-bold text-sm bg-muted px-3 py-1 rounded-full">
                        <Clock size={16} className="mr-1" /> Timeout
                      </span>
                    ) : (
                      <span className="flex items-center text-destructive font-bold text-sm bg-destructive/10 px-3 py-1 rounded-full">
                        <XCircle size={16} className="mr-1" /> Wrong
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  {question.text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                    <div className="text-xs font-bold text-green-600 mb-1 uppercase tracking-wider">Correct Answer</div>
                    <div className="font-bold text-foreground">{question.correctAnswer}</div>
                  </div>
                  
                  {!isCorrect && (
                    <div className={cn(
                      "p-3 rounded-xl border",
                      isTimeout ? "bg-muted border-border" : "bg-destructive/10 border-destructive/20"
                    )}>
                      <div className={cn(
                        "text-xs font-bold mb-1 uppercase tracking-wider",
                        isTimeout ? "text-muted-foreground" : "text-destructive"
                      )}>
                        Your Answer
                      </div>
                      <div className={cn(
                        "font-bold",
                        isTimeout ? "text-muted-foreground italic" : "text-foreground"
                      )}>
                        {playerAnswer || "Did not answer"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="btn-3d bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center space-x-2"
        >
          <ArrowLeft size={24} />
          <span>Back to Results</span>
        </button>
      </div>
    </motion.div>
  );
}
