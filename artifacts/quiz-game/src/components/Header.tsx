import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  showScore?: boolean;
  score?: number;
}

export function Header({ theme, toggleTheme, isMuted, toggleMute, showScore, score = 0 }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center space-x-2">
        <div className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="font-display text-lg tracking-wider text-foreground">BrainBlast</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 pointer-events-auto">
        {showScore && (
          <div className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="font-bold text-accent">Score: {score}</span>
          </div>
        )}
        <button
          onClick={toggleMute}
          className="bg-card/80 backdrop-blur-md p-2.5 rounded-full border border-border shadow-sm hover:bg-muted transition-colors"
          aria-label="Toggle Mute"
        >
          {isMuted ? <VolumeX size={20} className="text-muted-foreground" /> : <Volume2 size={20} className="text-foreground" />}
        </button>
        <button
          onClick={toggleTheme}
          className="bg-card/80 backdrop-blur-md p-2.5 rounded-full border border-border shadow-sm hover:bg-muted transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
