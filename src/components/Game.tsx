'use client';

import { useEffect, useRef, useState } from 'react';

interface Pipe {
  x: number;
  gapStart: number;
}

interface GameState {
  birdPosition: number;
  birdVelocity: number;
  pipes: Pipe[];
  score: number;
  highScore: number;
  gameOver: boolean;
  speed: number;
  currentGapSize: number;
}

const GRAVITY = 0.8;
const JUMP_FORCE = -10;
const INITIAL_PIPE_SPEED = 5;
const INITIAL_PIPE_GAP = 150;
const MIN_PIPE_GAP = 100; // Minimum gap size at highest difficulty
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const GAME_HEIGHT = 500;
const PIPE_SPACING = 300;
const MAX_SPEED = 8; // Maximum speed the game can reach
const DIFFICULTY_INCREASE_INTERVAL = 5; // Increase difficulty every 5 points

// Initial pipe positions with fixed gaps for first render
const INITIAL_PIPES = [
  { x: 400, gapStart: 200 },
  { x: 700, gapStart: 250 },
  { x: 1000, gapStart: 150 },
];

function getRandomGapStart(gapSize: number) {
  const minGap = 50;
  const maxGap = GAME_HEIGHT - gapSize - 50;
  return Math.floor(Math.random() * (maxGap - minGap) + minGap);
}

// Calculate difficulty based on score
function calculateDifficulty(score: number): { speed: number; gapSize: number } {
  const difficultyLevel = Math.floor(score / DIFFICULTY_INCREASE_INTERVAL);
  
  // Increase speed with score, but cap it at MAX_SPEED
  const speed = Math.min(
    INITIAL_PIPE_SPEED + (difficultyLevel * 0.5),
    MAX_SPEED
  );
  
  // Decrease gap size with score, but don't go below MIN_PIPE_GAP
  const gapSize = Math.max(
    INITIAL_PIPE_GAP - (difficultyLevel * 5),
    MIN_PIPE_GAP
  );
  
  return { speed, gapSize };
}

export default function Game() {
  const [isClient, setIsClient] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    birdPosition: 250,
    birdVelocity: 0,
    pipes: INITIAL_PIPES,
    score: 0,
    highScore: 0,
    gameOver: false,
    speed: INITIAL_PIPE_SPEED,
    currentGapSize: INITIAL_PIPE_GAP,
  });

  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  // Load high score on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyHighScore');
    if (savedHighScore) {
      setGameState(prev => ({
        ...prev,
        highScore: parseInt(savedHighScore, 10)
      }));
    }
    setIsClient(true);
  }, []);

  const updateGame = () => {
    if (gameState.gameOver) return;

    setGameState((prev) => {
      const newBirdVelocity = prev.birdVelocity + GRAVITY;
      const newBirdPosition = prev.birdPosition + newBirdVelocity;

      // Update difficulty based on score
      const { speed, gapSize } = calculateDifficulty(prev.score);

      // Update pipes
      const newPipes = prev.pipes.map(pipe => ({
        ...pipe,
        x: pipe.x - speed
      }));

      // Remove pipes that are off screen and add new ones
      if (newPipes[0].x < -PIPE_WIDTH) {
        newPipes.shift();
        const lastPipe = newPipes[newPipes.length - 1];
        newPipes.push({
          x: lastPipe.x + PIPE_SPACING,
          gapStart: getRandomGapStart(gapSize)
        });
      }

      // Check collisions
      const birdRect = {
        top: newBirdPosition,
        bottom: newBirdPosition + BIRD_SIZE,
        left: 50,
        right: 50 + BIRD_SIZE,
      };

      // Check collision with any pipe
      const collision = newPipes.some(pipe => {
        const upperPipeRect = {
          top: 0,
          bottom: pipe.gapStart,
          left: pipe.x,
          right: pipe.x + PIPE_WIDTH,
        };

        const lowerPipeRect = {
          top: pipe.gapStart + gapSize,
          bottom: GAME_HEIGHT,
          left: pipe.x,
          right: pipe.x + PIPE_WIDTH,
        };

        return (
          birdRect.right > upperPipeRect.left &&
          birdRect.left < upperPipeRect.right &&
          (birdRect.top < upperPipeRect.bottom || birdRect.bottom > lowerPipeRect.top)
        );
      });

      // Ground collision
      const groundCollision = newBirdPosition > GAME_HEIGHT - BIRD_SIZE || newBirdPosition < 0;

      if (collision || groundCollision) {
        // Update high score if current score is higher
        const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
        if (newHighScore > prev.highScore) {
          localStorage.setItem('flappyHighScore', newHighScore.toString());
        }
        return { ...prev, gameOver: true, highScore: newHighScore };
      }

      // Score point when passing pipe
      let newScore = prev.score;
      newPipes.forEach(pipe => {
        if (pipe.x + speed > 50 && pipe.x <= 50) {
          newScore += 1;
        }
      });

      return {
        ...prev,
        birdPosition: newBirdPosition,
        birdVelocity: newBirdVelocity,
        pipes: newPipes,
        score: newScore,
        speed,
        currentGapSize: gapSize,
      };
    });

    frameRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState.gameOver) {
          setGameState({
            birdPosition: 250,
            birdVelocity: 0,
            pipes: INITIAL_PIPES,
            score: 0,
            highScore: gameState.highScore,
            gameOver: false,
            speed: INITIAL_PIPE_SPEED,
            currentGapSize: INITIAL_PIPE_GAP,
          });
        } else {
          setGameState((prev) => ({
            ...prev,
            birdVelocity: JUMP_FORCE,
          }));
        }
      }
    };

    window.addEventListener('keydown', handleJump);
    frameRef.current = requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener('keydown', handleJump);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState.gameOver]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div className="relative w-full h-[500px] bg-sky-100 rounded-lg" />;
  }

  return (
    <div 
      ref={gameRef}
      className="relative w-full h-[500px] bg-sky-100 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => {
        if (gameState.gameOver) {
          setGameState({
            birdPosition: 250,
            birdVelocity: 0,
            pipes: INITIAL_PIPES,
            score: 0,
            highScore: gameState.highScore,
            gameOver: false,
            speed: INITIAL_PIPE_SPEED,
            currentGapSize: INITIAL_PIPE_GAP,
          });
        } else {
          setGameState((prev) => ({
            ...prev,
            birdVelocity: JUMP_FORCE,
          }));
        }
      }}
    >
      {/* Bird */}
      <div
        className="absolute w-[30px] h-[30px] rounded-full bg-yellow-400 transition-transform"
        style={{
          top: `${Math.round(gameState.birdPosition)}px`,
          left: '50px',
          transform: `rotate(${Math.round(gameState.birdVelocity * 4)}deg)`,
        }}
      />

      {/* Pipes */}
      {gameState.pipes.map((pipe, index) => (
        <div key={index} className="absolute">
          {/* Upper pipe */}
          <div
            className="absolute w-[60px] bg-green-500"
            style={{
              left: `${Math.round(pipe.x)}px`,
              top: 0,
              height: `${Math.round(pipe.gapStart)}px`,
            }}
          />
          {/* Lower pipe */}
          <div
            className="absolute w-[60px] bg-green-500"
            style={{
              left: `${Math.round(pipe.x)}px`,
              top: `${Math.round(pipe.gapStart + gameState.currentGapSize)}px`,
              height: `${Math.round(GAME_HEIGHT - (pipe.gapStart + gameState.currentGapSize))}px`,
            }}
          />
        </div>
      ))}

      {/* Score and Speed Display */}
      <div className="absolute top-4 left-4 text-2xl font-bold text-white">
        <div>Score: {gameState.score}</div>
        <div className="text-sm mt-1">High Score: {gameState.highScore}</div>
        <div className="text-sm mt-1">Speed: {gameState.speed.toFixed(1)}x</div>
      </div>

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl">Score: {gameState.score}</p>
            {gameState.score === gameState.highScore && gameState.score > 0 && (
              <p className="text-lg text-yellow-400 mt-2">🏆 New High Score! 🏆</p>
            )}
            <p className="text-lg mt-2">High Score: {gameState.highScore}</p>
            <p className="mt-4 text-sm">Press Space or Click to play again</p>
          </div>
        </div>
      )}
    </div>
  );
} 