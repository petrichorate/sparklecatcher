import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Raindrop } from '@/hooks/useGameState';

interface GameStageProps {
  gameState: GameState;
  onMove: (direction: 'left' | 'right') => void;
  onReset: () => void;
}

export const GameStage = ({ gameState, onMove, onReset }: GameStageProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') onMove('left');
    if (e.key === 'ArrowRight') onMove('right');
  }, [onMove]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const diff = touchStart - e.touches[0].clientX;
    if (Math.abs(diff) > 30) {
      onMove(diff > 0 ? 'left' : 'right');
      setTouchStart(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderRaindropCounter = () => {
    return (
      <div className="absolute top-4 left-4 flex gap-2">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="w-6 h-6"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: index < gameState.score ? 1 : 0.35 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={gameState.gameAssets.raindrop} 
              alt="raindrop counter"
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="relative w-full h-[80vh] overflow-hidden rounded-lg shadow-lg"
      style={{
        backgroundImage: `url(${gameState.gameAssets.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setTouchStart(null)}
    >
      {renderRaindropCounter()}

      <AnimatePresence mode="popLayout">
        {gameState.raindrops.map((drop: Raindrop) => (
          <motion.div
            key={drop.id}
            className="absolute w-10 h-10"
            style={{
              left: `${drop.x}%`,
              top: 0,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: `${drop.y}vh`, opacity: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.05,
              exit: { duration: 0.01 }
            }}
          >
            <img 
              src={gameState.gameAssets.raindrop} 
              alt="raindrop"
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-20 w-48 h-48"
        style={{ left: `calc(${gameState.characterPosition}% - 96px)` }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <img 
          src={gameState.gameAssets.character} 
          alt="character"
          className="w-full h-full object-contain"
        />
        <img 
          src={gameState.gameAssets.basket} 
          alt="basket"
          className="absolute bottom-2 left-[95%] transform -translate-x-1/2 w-20 h-20 object-contain"
        />
      </motion.div>

      {!gameState.isGameOver && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => onMove('left')}
            className="w-12 h-12 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/Left.png" 
              alt="move left"
              className="w-full h-full object-contain"
            />
          </button>
          <button
            onClick={() => onMove('right')}
            className="w-12 h-12 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/Right.png" 
              alt="move right"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      )}

      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative flex items-center justify-center translate-y-[-15%]">
              <motion.div
                className="w-[400px]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src="/Message.png" 
                  alt="You won!"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={onReset}
                  className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 
                          px-6 py-3 bg-white/20 hover:bg-white/30 
                          transition-colors rounded-full text-white font-semibold 
                          shadow-lg backdrop-blur-sm"
                >
                  Play Again
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
