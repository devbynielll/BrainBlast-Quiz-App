import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/questions";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface QuizScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  shuffledAnswers: string[];
  timeLeft: number;
  status: 'idle' | 'answered' | 'timeout';
  playerAnswer: string | null;
  onSubmit: (answer: string | null) => void;
  onNext: () => void;
}

const ANSWER_COLORS = [
  'bg-primary text-primary-foreground border-primary hover:bg-primary/90', // Pink
  'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90', // Cyan
  'bg-accent text-accent-foreground border-accent hover:bg-accent/90', // Yellow
  'bg-[#8B5CF6] text-white border-[#8B5CF6] hover:bg-[#7C3AED]'  // Purple
];

export function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  shuffledAnswers,
  timeLeft,
  status,
  playerAnswer,
  onSubmit,
  onNext
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
      if (num >= 1 && num <= 4) {
        onSubmit(shuffledAnswers[num - 1]);
      }
    };
    window.addEventListener('keydown', handleAnswerKey);
    return () => window.removeEventListener('keydown', handleAnswerKey);
  }, [status, shuffledAnswers, onSubmit, onNext]);

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;
  const isDangerTime = timeLeft <= 5 && status === 'idle';

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex flex-col pt-24 pb-8 px-4 max-w-4xl mx-auto w-full"
    >
      {/* Progress Bar & Header */}
      <div className="w-full space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          <span className={cn(
            "flex items-center space-x-1 px-3 py-1 rounded-full",
            isDangerTime ? "text-destructive bg-destructive/10 animate-pulse-fast" : "text-foreground bg-card shadow-sm"
          )}>
            <Clock size={16} />
            <span className="text-xl font-display">{timeLeft}s</span>
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border shadow-xl rounded-3xl p-6 md:p-10 mb-8 relative">
        <div className="absolute -top-4 left-6 flex space-x-2">
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {question.category}
          </span>
          <span className={cn(
            "text-xs font-bold px-3 py-1 rounded-full shadow-sm text-white",
            question.difficulty === 'Easy' ? "bg-green-500" :
            question.difficulty === 'Medium' ? "bg-accent text-accent-foreground" : "bg-destructive"
          )}>
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-4 text-center leading-tight">
          {question.text}
        </h2>
      </div>

      {/* Answers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {shuffledAnswers.map((answer, i) => {
          const isSelected = playerAnswer === answer;
          const isCorrectAnswer = answer === question.correctAnswer;
          const showAsCorrect = status !== 'idle' && isCorrectAnswer;
          const showAsWrong = status === 'answered' && isSelected && !isCorrectAnswer;
          
          let buttonStateClass = ANSWER_COLORS[i];
          let animationClass = "";

          if (status !== 'idle') {
            if (showAsCorrect) {
              buttonStateClass = "bg-green-500 text-white border-green-600 scale-[1.02] shadow-lg z-10";
              if (isSelected) animationClass = "animate-bounce-in";
            } else if (showAsWrong) {
              buttonStateClass = "bg-destructive text-white border-destructive/80 opacity-90";
              animationClass = "animate-shake";
            } else {
              buttonStateClass = "bg-muted text-muted-foreground border-border opacity-50 grayscale";
            }
          }

          return (
            <button
              key={answer}
              disabled={status !== 'idle'}
              onClick={() => onSubmit(answer)}
              className={cn(
                "relative btn-3d min-h-[100px] p-6 rounded-2xl text-xl md:text-2xl font-bold flex items-center justify-center text-center transition-all duration-300",
                buttonStateClass,
                animationClass
              )}
            >
              <span className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm">
                {i + 1}
              </span>
              {answer}
              
              {/* Result Icons */}
              {showAsCorrect && <CheckCircle2 className="absolute top-4 right-4 text-white" size={28} />}
              {showAsWrong && <XCircle className="absolute top-4 right-4 text-white" size={28} />}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-lg mt-auto"
          >
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              {status === 'timeout' ? (
                <>
                  <AlertCircle className="text-destructive" size={32} />
                  <span className="text-xl font-bold text-destructive">Time's Up!</span>
                </>
              ) : playerAnswer === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="text-green-500" size={32} />
                  <span className="text-xl font-bold text-green-500">Correct! +1 Point</span>
                </>
              ) : (
                <>
                  <XCircle className="text-destructive" size={32} />
                  <span className="text-xl font-bold text-destructive">Nice Try!</span>
                </>
              )}
            </div>
            
            <button
              onClick={onNext}
              className="btn-3d w-full md:w-auto bg-foreground text-background px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:opacity-90"
              autoFocus
            >
              <span>Next Question</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
