/**
 * Generates a browser fingerprint based on various browser characteristics
 * This creates a unique identifier for the user's browser
 */
function generateBrowserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Browser fingerprint', 2, 2);
  const canvasFingerprint = canvas.toDataURL();

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    canvasFingerprint,
  ].join('|');

  return fingerprint;
}

/**
 * Generates a simple hash from a string
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a username based on IP and browser fingerprint
 * Uses a combination of browser fingerprint and a stored ID
 */
export async function generateUsername(): Promise<string> {
  // Try to get stored user ID from localStorage
  const storedUserId = localStorage.getItem('game_user_id');
  
  if (storedUserId) {
    // Use stored ID to generate consistent username
    const hash = simpleHash(storedUserId);
    return `Player${(hash % 10000).toString().padStart(4, '0')}`;
  }

  // Generate browser fingerprint
  const fingerprint = generateBrowserFingerprint();
  const hash = simpleHash(fingerprint);
  
  // Try to get IP (this will be approximate in client-side)
  // In a real app, you'd get this from a server API
  let ipHash = 0;
  try {
    // This is a client-side approximation - in production, get IP from server
    const response = await fetch('https://api.ipify.org?format=json').catch(() => null);
    if (response) {
      const data = await response.json();
      ipHash = simpleHash(data.ip || '');
    }
  } catch {
    // If IP fetch fails, use timestamp as fallback
    ipHash = simpleHash(Date.now().toString());
  }

  // Combine hashes to create unique ID
  const combinedHash = simpleHash(`${hash}-${ipHash}`);
  const userId = `user_${combinedHash}`;
  
  // Store user ID for consistency
  localStorage.setItem('game_user_id', userId);
  
  // Generate username from hash
  const usernameHash = combinedHash % 10000;
  return `Player${usernameHash.toString().padStart(4, '0')}`;
}

/**
 * Leaderboard entry type
 */
export interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
  userId: string;
}

/**
 * Gets the leaderboard from localStorage
 */
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const stored = localStorage.getItem('game_leaderboard');
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Adds a score to the leaderboard
 */
export async function addToLeaderboard(score: number): Promise<LeaderboardEntry> {
  const username = await generateUsername();
  const userId = localStorage.getItem('game_user_id') || `user_${Date.now()}`;
  
  const entry: LeaderboardEntry = {
    username,
    score,
    timestamp: Date.now(),
    userId,
  };

  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  
  // Sort by score (descending), then by timestamp (ascending for same score)
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timestamp - b.timestamp;
  });

  // Keep only top 50 entries
  const topEntries = leaderboard.slice(0, 50);
  
  localStorage.setItem('game_leaderboard', JSON.stringify(topEntries));
  
  return entry;
}

/**
 * Gets the top N scores from the leaderboard
 */
export function getTopScores(limit: number = 10): LeaderboardEntry[] {
  const leaderboard = getLeaderboard();
  return leaderboard.slice(0, limit);
}
