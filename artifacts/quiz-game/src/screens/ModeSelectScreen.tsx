import { ReactNode } from "react";
import { motion } from "framer-motion";
import { QuizMode } from "@/hooks/use-quiz";
import { GraduationCap, Globe, Shuffle, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSelectScreenProps {
  playerName: string;
  gamePin: string;
  onSelectMode: (mode: QuizMode) => void;
  onBack: () => void;
}

const MODES: {
  mode: QuizMode;
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  questions: string;
  tags: string[];
  gradient: string;
  border: string;
  badge?: string;
}[] = [
  {
    mode: 'SHS',
    icon: <GraduationCap size={40} />,
    title: 'SHS Only',
    subtitle: 'Philippine Curriculum',
    description: 'Questions covering all Senior High School strands and core subjects.',
    questions: '10 questions',
    tags: ['Math', 'Science', 'English', 'Filipino', 'ICT', 'STEM', 'ABM', 'HUMSS', 'TVL'],
    gradient: 'from-blue-600/20 to-violet-600/20',
    border: 'border-blue-500/40 hover:border-blue-400/70',
  },
  {
    mode: 'Trivia',
    icon: <Globe size={40} />,
    title: 'Trivia Only',
    subtitle: 'General Knowledge',
    description: 'Fun mixed trivia covering science, pop culture, history, and world facts.',
    questions: '5 questions',
    tags: ['Pop Culture', 'World History', 'Science', 'General Knowledge'],
    gradient: 'from-emerald-600/20 to-teal-600/20',
    border: 'border-emerald-500/40 hover:border-emerald-400/70',
  },
  {
    mode: 'Mixed',
    icon: <Shuffle size={40} />,
    title: 'Mixed Mode',
    subtitle: 'Best of Both Worlds',
    description: '10 SHS curriculum questions + 5 general trivia for the ultimate challenge.',
    questions: '15 questions',
    tags: ['SHS Curriculum', 'General Trivia', 'Adaptive AI'],
    gradient: 'from-pink-600/20 to-orange-600/20',
    border: 'border-primary/40 hover:border-primary/80',
    badge: '⭐ RECOMMENDED',
  },
];

export function ModeSelectScreen({ playerName, gamePin, onSelectMode, onBack }: ModeSelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
    >
      <div className="max-w-3xl w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              onClick={onBack}
              className="absolute left-4 md:left-8 top-20 flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary mb-2">
            Choose Mode
          </h1>
          {playerName ? (
            <p className="text-lg font-bold text-muted-foreground">
              Ready to play, <span className="text-foreground">{playerName}</span>? Pick your challenge!
            </p>
          ) : (
            <p className="text-lg font-bold text-muted-foreground">Select a quiz mode to begin</p>
          )}
          <div className="inline-flex items-center gap-2 mt-3 bg-card/60 border border-border px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground">
            Game PIN: <span className="text-secondary tracking-widest">{gamePin}</span>
          </div>
        </motion.div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODES.map((m, i) => (
            <motion.button
              key={m.mode}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 260, damping: 24 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(m.mode)}
              className={cn(
                "relative flex flex-col items-center text-center p-6 rounded-2xl border-2 bg-gradient-to-b backdrop-blur-md shadow-xl transition-all duration-200 text-left group",
                m.gradient, m.border
              )}
            >
              {/* Recommended badge */}
              {m.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  {m.badge}
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "mb-4 p-4 rounded-2xl bg-card/60 border border-border",
                m.mode === 'SHS' ? 'text-blue-400' :
                m.mode === 'Trivia' ? 'text-emerald-400' : 'text-primary'
              )}>
                {m.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl font-display font-black text-foreground mb-0.5">{m.title}</h2>
              <p className="text-xs font-bold text-muted-foreground mb-3">{m.subtitle}</p>

              {/* Question count */}
              <div className="flex items-center gap-1.5 bg-card/60 border border-border px-3 py-1.5 rounded-full mb-4">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-sm font-black text-foreground">{m.questions}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug mb-4">{m.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {m.tags.map(tag => (
                  <span key={tag} className="text-xs font-bold px-2 py-0.5 rounded-full bg-card/80 border border-border text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Play arrow on hover */}
              <div className="mt-5 w-full py-2.5 rounded-xl bg-card/60 border border-border text-sm font-black text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200">
                Play {m.title} →
              </div>
            </motion.button>
          ))}
        </div>

        {/* Adaptive hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          🧠 All modes feature <span className="text-foreground font-bold">Adaptive AI Difficulty</span> — questions get harder as you improve!
        </motion.p>
      </div>
    </motion.div>
  );
}
