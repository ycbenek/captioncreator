import { getDatabase } from "./init";

export function checkRateLimit(
  userId: string,
  windowMs: number,
  maxRequests: number,
): boolean {
  const db = getDatabase();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - Math.floor(windowMs / 1000);

  // Get or create rate limit array for user
  let timestamps = db.rateLimits.get(userId) || [];

  // Clean old entries
  timestamps = timestamps.filter((ts) => ts >= windowStart);

  if (timestamps.length >= maxRequests) {
    db.rateLimits.set(userId, timestamps);
    return false;
  }

  // Add current request
  timestamps.push(now);
  db.rateLimits.set(userId, timestamps);

  return true;
}

export function getRateLimitInfo(
  userId: string,
  windowMs: number,
  maxRequests: number,
): {
  remaining: number;
  resetAt: number;
} {
  const db = getDatabase();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - Math.floor(windowMs / 1000);

  // Get rate limit array for user
  const timestamps = db.rateLimits.get(userId) || [];

  // Count recent requests
  const recentCount = timestamps.filter((ts) => ts >= windowStart).length;

  return {
    remaining: Math.max(0, maxRequests - recentCount),
    resetAt: now + Math.floor(windowMs / 1000),
  };
}
