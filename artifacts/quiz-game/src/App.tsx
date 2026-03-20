import { AnimatePresence } from "framer-motion";
import { useQuiz } from "./hooks/use-quiz";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Header } from "./components/Header";
import { StartScreen } from "./screens/StartScreen";
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
    goToReview, 
    goToStart,
    toggleTheme,
    toggleMute
  } = useQuiz();

  return (
    <TooltipProvider>
      <div className="relative min-h-screen selection:bg-primary selection:text-white">
        <AnimatedBackground />
        
        <Header 
          theme={state.theme} 
          toggleTheme={toggleTheme} 
          isMuted={state.isMuted} 
          toggleMute={toggleMute}
          showScore={state.screen === 'QUIZ'}
          score={state.score}
        />

        <AnimatePresence mode="wait">
          {state.screen === 'START' && (
            <StartScreen 
              key="start" 
              onStart={startGame} 
              highScore={state.highScore} 
            />
          )}
          
          {state.screen === 'QUIZ' && (
            <QuizScreen 
              key="quiz"
              question={state.questions[state.currentQuestionIndex]}
              questionIndex={state.currentQuestionIndex}
              totalQuestions={state.questions.length}
              shuffledAnswers={state.currentShuffledAnswers}
              timeLeft={state.timeLeft}
              status={state.questionStatus}
              playerAnswer={state.answers[state.currentQuestionIndex]?.playerAnswer || null}
              onSubmit={submitAnswer}
              onNext={nextQuestion}
            />
          )}

          {state.screen === 'RESULTS' && (
            <ResultsScreen
              key="results"
              score={state.score}
              totalQuestions={state.questions.length}
              highScore={state.highScore}
              answers={state.answers}
              onPlayAgain={startGame}
              onReview={goToReview}
            />
          )}

          {state.screen === 'REVIEW' && (
            <ReviewScreen
              key="review"
              answers={state.answers}
              onBack={() => {
                // Keep the results screen state intact, just change view
                // We map this to a mock function to go back to RESULTS
                // For simplicity, we just reuse the 'Go To Start' or add a custom handler
                // Actually let's just make it go to Start instead, or modify state manually.
                // Modifying to go to Start for simplicity, or we can add a 'back to results' method.
                // Let's use the onBack to go to Start since play again is there.
                goToStart();
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
