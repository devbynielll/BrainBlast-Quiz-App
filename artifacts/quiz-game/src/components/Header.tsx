import { Moon, Sun, Volume2, VolumeX, Flame, Zap } from "lucide-react";
import { getStreakLabel } from "@/hooks/use-quiz";
import { cn } from "@/lib/utils";

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  showScore?: boolean;
  totalScore?: number;
  streak?: number;
}

export function Header({ theme, toggleTheme, isMuted, toggleMute, showScore, totalScore = 0, streak = 0 }: HeaderProps) {
  const streakLabel = getStreakLabel(streak);

  return (
    <header className="fixed top-0 left-0 right-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center z-50 pointer-events-none">
      {/* Logo */}
      <div className="pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-md flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-display text-base tracking-wider text-foreground font-black">BrainBlast</span>
          <span className="hidden sm:inline text-xs font-bold text-muted-foreground">🇵🇭 SHS Quiz</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Live score during quiz */}
        {showScore && (
          <div className="bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-md flex items-center gap-2">
            {streak >= 5 ? (
              <Zap size={15} className="text-yellow-300 fill-yellow-300" />
            ) : streak >= 3 ? (
              <Flame size={15} className="text-orange-400 fill-orange-400" />
            ) : null}
            <span className={cn(
              "font-black text-sm",
              streak >= 5 ? "text-yellow-300" : streak >= 3 ? "text-orange-300" : "text-primary"
            )}>
              {totalScore} pts
            </span>
            {streakLabel && (
              <span className="hidden sm:inline text-xs font-bold text-orange-300">
                {streakLabel}
              </span>
            )}
          </div>
        )}

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="bg-card/80 backdrop-blur-md p-2.5 rounded-full border border-border shadow-md hover:bg-muted transition-colors"
          aria-label="Toggle Mute"
        >
          {isMuted
            ? <VolumeX size={18} className="text-muted-foreground" />
            : <Volume2 size={18} className="text-foreground" />
          }
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="bg-card/80 backdrop-blur-md p-2.5 rounded-full border border-border shadow-md hover:bg-muted transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark'
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-slate-600" />
          }
        </button>
      </div>
    </header>
  );
}
