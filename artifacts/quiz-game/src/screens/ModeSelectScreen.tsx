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

interface ModeConfig {
  mode: QuizMode;
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  questions: string;
  tags: string[];
  gradient: string;
  border: string;
  glow: string;
  iconColor: string;
  badge?: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'SHS',
    icon: <GraduationCap size={36} />,
    title: 'SHS Only',
    subtitle: 'Philippine Curriculum',
    description: 'Questions from all Senior High School strands and core subjects.',
    questions: '10 questions',
    tags: ['Math', 'Science', 'English', 'Filipino', 'ICT', 'STEM', 'ABM', 'HUMSS', 'TVL'],
    gradient: 'from-blue-600/20 to-violet-600/20',
    border: 'border-blue-500/40',
    glow: 'hover:shadow-[0_0_28px_rgba(59,130,246,0.45)] hover:border-blue-400/80',
    iconColor: 'text-blue-400',
  },
  {
    mode: 'Trivia',
    icon: <Globe size={36} />,
    title: 'Trivia Only',
    subtitle: 'General Knowledge',
    description: 'Fun mixed trivia covering science, pop culture, history, and world facts.',
    questions: '5 questions',
    tags: ['Pop Culture', 'World History', 'Science', 'General Knowledge'],
    gradient: 'from-emerald-600/20 to-teal-600/20',
    border: 'border-emerald-500/40',
    glow: 'hover:shadow-[0_0_28px_rgba(16,185,129,0.45)] hover:border-emerald-400/80',
    iconColor: 'text-emerald-400',
  },
  {
    mode: 'Mixed',
    icon: <Shuffle size={36} />,
    title: 'Mixed Mode',
    subtitle: 'Best of Both Worlds',
    description: '10 SHS curriculum questions + 5 general trivia for the ultimate challenge.',
    questions: '15 questions',
    tags: ['SHS Curriculum', 'General Trivia', 'Adaptive AI'],
    gradient: 'from-pink-600/20 to-orange-600/20',
    border: 'border-primary/40',
    glow: 'hover:shadow-[0_0_28px_rgba(233,30,140,0.45)] hover:border-primary/90',
    iconColor: 'text-primary',
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

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute left-4 md:left-8 top-20 flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary mb-2">
            Choose Mode
          </h1>
          <p className="text-base font-bold text-muted-foreground">
            {playerName
              ? <>Ready to play, <span className="text-foreground">{playerName}</span>? Pick your challenge!</>
              : 'Select a quiz mode to begin'}
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-card/60 border border-border px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground">
            Game PIN: <span className="text-secondary tracking-[0.2em]">{gamePin}</span>
          </div>
        </motion.div>

        {/* Mode cards — equal height via items-stretch grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {MODES.map((m, i) => (
            <motion.button
              key={m.mode}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 260, damping: 24 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(m.mode)}
              className={cn(
                // Full height flex column so the button always anchors at the bottom
                "relative flex flex-col items-center text-center",
                "p-6 pt-8 rounded-2xl border-2 bg-gradient-to-b backdrop-blur-md shadow-xl",
                "transition-all duration-250 group",
                m.gradient, m.border, m.glow
              )}
            >
              {/* Recommended badge — absolute so it doesn't push content down */}
              {m.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  {m.badge}
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "mb-4 p-3.5 rounded-2xl bg-card/60 border border-border shrink-0",
                m.iconColor
              )}>
                {m.icon}
              </div>

              {/* Title + subtitle */}
              <h2 className="text-xl font-display font-black text-foreground mb-0.5">{m.title}</h2>
              <p className="text-xs font-bold text-muted-foreground mb-3">{m.subtitle}</p>

              {/* Question count badge */}
              <div className="flex items-center justify-center gap-1.5 bg-card/60 border border-border px-3 py-1.5 rounded-full mb-4 shrink-0">
                <CheckCircle size={13} className="text-green-400" />
                <span className="text-sm font-black text-foreground">{m.questions}</span>
              </div>

              {/* Description — flex-1 so it fills available space and pushes tags + button down evenly */}
              <p className="text-sm text-muted-foreground leading-snug mb-4 flex-1">
                {m.description}
              </p>

              {/* Tags — fixed height section, min-h keeps cards aligned */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-5 min-h-[52px] content-center">
                {m.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-2 py-0.5 rounded-full bg-card/80 border border-border text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Play button — always at bottom, text perfectly centered */}
              <div className={cn(
                "w-full py-3 rounded-xl border text-sm font-black",
                "flex items-center justify-center gap-2",
                "bg-card/60 border-border text-foreground",
                "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
                "transition-all duration-200 shrink-0"
              )}>
                Play {m.title}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
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
          🧠 All modes feature{' '}
          <span className="text-foreground font-bold">Adaptive AI Difficulty</span>
          {' '}— questions get harder as you improve!
        </motion.p>
      </div>
    </motion.div>
  );
}
