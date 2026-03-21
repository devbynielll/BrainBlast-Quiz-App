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
    goToReview,
    goToResults,
    goToStart,
    toggleTheme,
    toggleMute,
  } = useQuiz();

  return (
    <TooltipProvider>
      <div className="relative min-h-screen selection:bg-primary/30 selection:text-foreground">
        <AnimatedBackground />

        <Header
          theme={state.theme}
          toggleTheme={toggleTheme}
          isMuted={state.isMuted}
          toggleMute={toggleMute}
          showScore={state.screen === 'QUIZ'}
          totalScore={state.totalScore}
          streak={state.streak}
        />

        <AnimatePresence mode="wait">
          {state.screen === 'START' && (
            <StartScreen
              key="start"
              onStart={goToModeSelect}
              highScore={state.highScore}
              playerName={state.playerName}
              gamePin={state.gamePin}
              onSetName={setPlayerName}
            />
          )}

          {state.screen === 'MODE_SELECT' && (
            <ModeSelectScreen
              key="mode-select"
              playerName={state.playerName}
              gamePin={state.gamePin}
              onSelectMode={startGame}
              onBack={goToStart}
            />
          )}

          {state.screen === 'QUIZ' && state.questions.length > 0 && (
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
            />
          )}

          {state.screen === 'RESULTS' && (
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
              onPlayAgain={goToModeSelect}
              onReview={goToReview}
            />
          )}

          {state.screen === 'REVIEW' && (
            <ReviewScreen
              key="review"
              answers={state.answers}
              onBack={goToResults}
            />
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
