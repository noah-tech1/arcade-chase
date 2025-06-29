import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import GameCanvas from "./components/Game/GameCanvas";
import StartScreen from "./components/Game/StartScreen";
import GameOverScreen from "./components/Game/GameOverScreen";
import GameUI from "./components/Game/GameUI";
import TouchControls from "./components/Game/TouchControls";
import LoadingScreen from "./components/Game/LoadingScreen";
import InstallPWA from "./components/PWA/InstallPWA";
import "./index.css";

const queryClient = new QueryClient();

function GameApp() {
  const { phase, transitionType } = useGame();
  const { setHitSound, setSuccessSound } = useAudio();
  const audioInitialized = useRef(false);

  useEffect(() => {
    // Initialize audio on first user interaction
    const initAudio = () => {
      if (!audioInitialized.current) {
        // Create audio elements for sound effects
        const hitAudio = new Audio();
        hitAudio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Hyvmw=";
        
        const successAudio = new Audio();
        successAudio.src = "data:audio/wav;base64,UklGRqIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Hyvmz=";
        
        setHitSound(hitAudio);
        setSuccessSound(successAudio);
        audioInitialized.current = true;
      }
    };

    // Listen for any user interaction to initialize audio
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [setHitSound, setSuccessSound]);

  return (
    <div className="game-container">
      <InstallPWA />
      {phase === "ready" && <StartScreen />}
      {phase === "loading" && <LoadingScreen transitionType={transitionType} />}
      {phase === "playing" && (
        <>
          <GameCanvas />
          <GameUI />
          <TouchControls />
        </>
      )}
      {(phase === "gameOver" || phase === "ended") && <GameOverScreen />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameApp />
    </QueryClientProvider>
  );
}

export default App;
