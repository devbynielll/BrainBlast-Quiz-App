import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuiz } from "./hooks/use-quiz";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Header } from "./components/Header";
import { StartScreen } from "./screens/StartScreen";
import { ModeSelectScreen } from "./screens/ModeSelectScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const {
    state,
    startGame,
    submitAnswer,
    nextQuestion,
    setPlayerName,
    goToModeSelect,
    createNewGameSession,
    joinGameByPin,
    goToReview,
    goToResults,
    goToStart,
    exitQuiz,
    toggleTheme,
    toggleMute,
  } = useQuiz();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevScreenRef = useRef(state.screen);

  useEffect(() => {
    const audio = new Audio("/bg-music.mp3");
    audio.loop = false;
    audio.volume = 0.5;
    audio.muted = state.isMuted;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = state.isMuted;
  }, [state.isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const prevScreen = prevScreenRef.current;

    // play only when entering QUIZ
    if (prevScreen !== "QUIZ" && state.screen === "QUIZ") {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    // stop only when leaving QUIZ
    if (prevScreen === "QUIZ" && state.screen !== "QUIZ") {
      audio.pause();
      audio.currentTime = 0;
    }

    prevScreenRef.current = state.screen;
  }, [state.screen]);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen selection:bg-primary/30 selection:text-foreground">
        <AnimatedBackground />

        <Header
          theme={state.theme}
          toggleTheme={toggleTheme}
          isMuted={state.isMuted}
          toggleMute={toggleMute}
          showScore={state.screen === "QUIZ"}
          totalScore={state.totalScore}
          streak={state.streak}
        />

        <AnimatePresence mode="wait">
          {state.screen === "START" && (
            <StartScreen
              key="start"
              onStart={goToModeSelect}
              highScore={state.highScore}
              playerName={state.playerName}
              gamePin={state.gamePin}
              onSetName={setPlayerName}
              onJoinGame={joinGameByPin}
            />
          )}

          {state.screen === "MODE_SELECT" && (
            <ModeSelectScreen
              key="mode-select"
              playerName={state.playerName}
              gamePin={state.gamePin}
              onSelectMode={startGame}
              onBack={goToStart}
            />
          )}

          {state.screen === "QUIZ" && state.questions.length > 0 && (
            <QuizScreen
              key={`quiz-${state.currentQuestionIndex}`}
              question={state.questions[state.currentQuestionIndex]}
              questionIndex={state.currentQuestionIndex}
              totalQuestions={state.totalQuestions}
              shuffledAnswers={state.currentShuffledAnswers}
              timeLeft={state.timeLeft}
              status={state.questionStatus}
              playerAnswer={state.answers[state.currentQuestionIndex]?.playerAnswer ?? null}
              streak={state.streak}
              lastAnswerBonus={state.lastAnswerBonus}
              totalScore={state.totalScore}
              adaptiveDifficulty={state.adaptiveDifficulty}
              difficultyChanged={state.difficultyChanged}
              playerName={state.playerName}
              onSubmit={submitAnswer}
              onNext={nextQuestion}
              onExit={exitQuiz}
            />
          )}

          {state.screen === "RESULTS" && (
            <ResultsScreen
              key="results"
              correctCount={state.correctCount}
              totalQuestions={state.totalQuestions}
              totalScore={state.totalScore}
              highScore={state.highScore}
              maxStreak={state.maxStreak}
              answers={state.answers}
              playerName={state.playerName}
              quizMode={state.quizMode}
              gamePin={state.gamePin}
              onPlayAgain={createNewGameSession}
              onReview={goToReview}
            />
          )}

          {state.screen === "REVIEW" && (
            <ReviewScreen
              key="review"
              answers={state.answers}
              onBack={goToResults}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-3 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-xs font-medium text-muted-foreground/35 select-none">
          Developed by Group 1
        </span>
      </div>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;
