
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
        .map(drop => ({ ...drop, y: drop.y + drop.speed }))
        .filter(drop => drop.y < 100);

      const catchCheck = updatedRaindrops.find(drop => {
        const basketPosition = prev.characterPosition + 8;
        const isInBasketXRange = Math.abs(drop.x - basketPosition) < 8;
        const isInBasketYRange = drop.y > 75 && drop.y < 85;
        
        const caught = isInBasketXRange && isInBasketYRange;
        return caught;
      });

      if (catchCheck) {
        const newScore = prev.score + 1;
        const remainingDrops = updatedRaindrops.filter(d => d.id !== catchCheck.id);
        
        return {
          ...prev,
          score: newScore,
          isGameOver: newScore === 5,
          raindrops: remainingDrops,
        };
      }

      return {
        ...prev,
        raindrops: updatedRaindrops,
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
