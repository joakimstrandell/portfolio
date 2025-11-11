'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGameState } from './GameStateProvider';
import { addToLeaderboard, getTopScores, type LeaderboardEntry } from '@/lib/game-utils';
import { Button } from './ui/button';

export default function GameOverModal() {
  const { gameOver, finalScore, resetGame } = useGameState();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameOver && finalScore !== null) {
      setIsLoading(true);
      // Add score to leaderboard
      addToLeaderboard(finalScore)
        .then((entry) => {
          setCurrentEntry(entry);
          // Get updated leaderboard
          const topScores = getTopScores(10);
          setLeaderboard(topScores);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [gameOver, finalScore]);

  useEffect(() => {
    if (gameOver && modalRef.current) {
      // Animate in
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [gameOver]);

  if (!gameOver || finalScore === null) return null;

  const currentRank = leaderboard.findIndex((entry) => entry.userId === currentEntry?.userId) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 bg-background border border-border rounded-lg shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
            Game Over!
          </h2>
          <p className="text-muted-foreground text-lg">Time&apos;s up</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Calculating your score...</p>
          </div>
        ) : (
          <>
            {/* Final Score Display */}
            <div className="text-center mb-8 p-6 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-6xl font-bold font-mono">{finalScore}</p>
              {currentEntry && currentRank > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Rank #{currentRank} on the leaderboard
                </p>
              )}
            </div>

            {/* Leaderboard */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Leaderboard</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Be the first to set a score!
                  </p>
                ) : (
                  leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.userId === currentEntry?.userId;
                    return (
                      <div
                        key={`${entry.userId}-${entry.timestamp}`}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          isCurrentUser
                            ? 'bg-accent/20 border-accent'
                            : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-sm font-bold w-8 ${
                              index === 0
                                ? 'text-yellow-500'
                                : index === 1
                                  ? 'text-gray-400'
                                  : index === 2
                                    ? 'text-orange-600'
                                    : 'text-muted-foreground'
                            }`}
                          >
                            #{index + 1}
                          </span>
                          <span className={`font-medium ${isCurrentUser ? 'text-accent' : ''}`}>
                            {entry.username}
                          </span>
                        </div>
                        <span className="font-mono font-bold">{entry.score}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                size="lg"
                className="min-w-32"
              >
                Play Again
              </Button>
              <Button
                onClick={() => {
                  resetGame();
                  // Close modal by resetting game
                }}
                size="lg"
                variant="outline"
                className="min-w-32"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
