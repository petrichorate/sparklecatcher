import { useState, useEffect, useCallback } from 'react';

export interface GameAssets {
  background: string;
  character: string;
  basket: string;
  raindrop: string;
  winScreen: string;
}

export interface Raindrop {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export interface GameState {
  score: number;
  isGameOver: boolean;
  characterPosition: number;
  raindrops: Raindrop[];
  gameAssets: GameAssets;
}

const DEFAULT_ASSETS: GameAssets = {
  background: '/placeholder.svg',
  character: '/placeholder.svg',
  basket: '/placeholder.svg',
  raindrop: '/placeholder.svg',
  winScreen: '/placeholder.svg',
};

export const useGameState = (customAssets?: Partial<GameAssets>) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isGameOver: false,
    characterPosition: 50,
    raindrops: [],
    gameAssets: { ...DEFAULT_ASSETS, ...customAssets },
  });

  const moveCharacter = useCallback((direction: 'left' | 'right') => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const newPosition = direction === 'left' 
        ? Math.max(10, prev.characterPosition - 5)
        : Math.min(90, prev.characterPosition + 5);
      
      return { ...prev, characterPosition: newPosition };
    });
  }, []);

  const createRaindrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const newRaindrop: Raindrop = {
        id: Date.now(),
        x: Math.random() * 100,
        y: -5,
        speed: 1 + Math.random() * 1,
      };

      return {
        ...prev,
        raindrops: [...prev.raindrops, newRaindrop],
      };
    });
  }, []);

  const updateRaindrops = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const updatedRaindrops = prev.raindrops
        .map(drop => ({ ...drop, y: drop.y + drop.speed }));

      const remainingDrops: Raindrop[] = [];
      let scoreIncrement = 0;

      updatedRaindrops.forEach(drop => {
        const basketPosition = prev.characterPosition + 8;
        const isInBasketXRange = Math.abs(drop.x - basketPosition) < 10;
        const isInBasketYRange = drop.y >= 60 && drop.y <= 80;
        const isBelowScreen = drop.y >= 100;
        
        if (isInBasketXRange && isInBasketYRange) {
          scoreIncrement++;
        } else if (!isBelowScreen) {
          remainingDrops.push(drop);
        }
      });

      if (scoreIncrement > 0) {
        const newScore = prev.score + scoreIncrement;
        return {
          ...prev,
          score: newScore,
          isGameOver: newScore >= 5,
          raindrops: remainingDrops,
        };
      }

      return {
        ...prev,
        raindrops: remainingDrops,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      isGameOver: false,
      characterPosition: 50,
      raindrops: [],
    }));
  }, []);

  return {
    gameState,
    moveCharacter,
    createRaindrop,
    updateRaindrops,
    resetGame,
  };
};
