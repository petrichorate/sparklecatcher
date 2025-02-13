
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GameState, Raindrop } from '@/hooks/useGameState';

interface GameStageProps {
  gameState: GameState;
  onMove: (direction: 'left' | 'right') => void;
}

export const GameStage = ({ gameState, onMove }: GameStageProps) => {
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
      <AnimatePresence>
        {gameState.raindrops.map((drop: Raindrop) => (
          <motion.div
            key={drop.id}
            className="absolute w-6 h-6"
            initial={{ y: -20, x: `${drop.x}%`, opacity: 0 }}
            animate={{ y: `${drop.y}vh`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
        className="absolute bottom-20 w-20 h-20"
        style={{ left: `calc(${gameState.characterPosition}% - 40px)` }}
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
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 object-contain"
        />
      </motion.div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => onMove('left')}
          className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => onMove('right')}
          className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};
