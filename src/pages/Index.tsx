
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { GameStage } from '@/components/GameStage';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { WinScreen } from '@/components/WinScreen';

const RAINDROP_INTERVAL = 2000; // 2 seconds
const GAME_TICK = 50; // 50ms

const Index = () => {
  const {
    gameState,
    moveCharacter,
    createRaindrop,
    updateRaindrops,
    resetGame,
  } = useGameState({
    background: '/placeholder.svg',
    character: '/lovable-uploads/77a2d4c1-c13c-433b-9c85-0d70ab9ea60b.png',
    basket: '/lovable-uploads/a7232ff0-2627-4d2e-ba28-8383746727fd.png',
    raindrop: '/lovable-uploads/0e16bf6e-d316-4391-8fc3-51b1c509fe4c.png',
    winScreen: '/placeholder.svg',
  });

  useEffect(() => {
    const dropInterval = setInterval(createRaindrop, RAINDROP_INTERVAL);
    const gameInterval = setInterval(updateRaindrops, GAME_TICK);

    return () => {
      clearInterval(dropInterval);
      clearInterval(gameInterval);
    };
  }, [createRaindrop, updateRaindrops]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-primary via-game-secondary to-game-accent">
      <div className="container mx-auto px-4 py-8">
        <ScoreDisplay score={gameState.score} />
        
        <GameStage
          gameState={gameState}
          onMove={moveCharacter}
        />

        <AnimatePresence>
          {gameState.isGameOver && (
            <WinScreen
              onRestart={resetGame}
              winScreenImage={gameState.gameAssets.winScreen}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
