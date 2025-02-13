
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
    characterPosition: 50, // percentage
    raindrops: [],
    gameAssets: { ...DEFAULT_ASSETS, ...customAssets },
  });

  const moveCharacter = useCallback((direction: 'left' | 'right') => {
    setGameState(prev => {
      const newPosition = direction === 'left' 
        ? Math.max(0, prev.characterPosition - 5)
        : Math.min(100, prev.characterPosition + 5);
      
      return { ...prev, characterPosition: newPosition };
    });
  }, []);

  const createRaindrop = useCallback(() => {
    const newRaindrop: Raindrop = {
      id: Date.now(),
      x: Math.random() * 100,
      y: -5,
      speed: 2 + Math.random() * 2,
    };

    setGameState(prev => ({
      ...prev,
      raindrops: [...prev.raindrops, newRaindrop],
    }));
  }, []);

  const updateRaindrops = useCallback(() => {
    setGameState(prev => {
      const updatedRaindrops = prev.raindrops
        .map(drop => ({ ...drop, y: drop.y + drop.speed }))
        .filter(drop => drop.y < 100);

      const catchCheck = updatedRaindrops.find(drop => {
        // Adjust the catch detection for the new basket position (shifted right)
        const isInBasketXRange = Math.abs(drop.x - (prev.characterPosition + 4)) < 10;
        const isInBasketYRange = drop.y > 80 && drop.y < 90;
        return isInBasketXRange && isInBasketYRange;
      });

      if (catchCheck) {
        const newScore = prev.score + 1;
        const remainingDrops = updatedRaindrops.filter(d => d.id !== catchCheck.id);
        
        return {
          ...prev,
          score: newScore,
          isGameOver: newScore >= 5,
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

  const updateAssets = useCallback((newAssets: Partial<GameAssets>) => {
    setGameState(prev => ({
      ...prev,
      gameAssets: { ...prev.gameAssets, ...newAssets },
    }));
  }, []);

  return {
    gameState,
    moveCharacter,
    createRaindrop,
    updateRaindrops,
    resetGame,
    updateAssets,
  };
};
