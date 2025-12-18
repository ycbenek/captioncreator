import { getDatabase } from "./init";
import { randomUUID } from "crypto";

export interface User {
  id: string;
  canva_user_id: string;
  plan: "free" | "pro";
  monthly_credits: number;
  used_credits: number;
  reset_at: number;
  created_at: number;
  updated_at: number;
}

export function getUserByCanvaId(canvaUserId: string): User | undefined {
  const db = getDatabase();
  for (const [_, user] of db.users) {
    if (user.canva_user_id === canvaUserId) {
      return user;
    }
  }
  return undefined;
}

export function createUser(
  canvaUserId: string,
  plan: "free" | "pro" = "free",
): User {
  const db = getDatabase();
  const id = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const resetAt = getNextMonthTimestamp();
  const monthlyCredits = plan === "pro" ? 1000 : 50;

  const user: User = {
    id,
    canva_user_id: canvaUserId,
    plan,
    monthly_credits: monthlyCredits,
    used_credits: 0,
    reset_at: resetAt,
    created_at: now,
    updated_at: now,
  };

  db.users.set(id, user);
  return user;
}

export function getOrCreateUser(canvaUserId: string): User {
  let user = getUserByCanvaId(canvaUserId);
  if (!user) {
    user = createUser(canvaUserId);
  }
  return user;
}

export function checkAndResetCredits(user: User): User {
  const now = Math.floor(Date.now() / 1000);
  if (now >= user.reset_at) {
    // Reset credits
    const db = getDatabase();
    const newResetAt = getNextMonthTimestamp();
    user.used_credits = 0;
    user.reset_at = newResetAt;
    user.updated_at = now;
    db.users.set(user.id, user);

    return user;
  }
  return user;
}

export function useCredit(userId: string): boolean {
  const db = getDatabase();
  const user = db.users.get(userId);

  if (!user) return false;

  if (user.used_credits < user.monthly_credits) {
    user.used_credits += 1;
    user.updated_at = Math.floor(Date.now() / 1000);
    db.users.set(userId, user);
    return true;
  }

  return false;
}

export function updateUserPlan(userId: string, plan: "free" | "pro"): void {
  const db = getDatabase();
  const user = db.users.get(userId);

  if (!user) return;

  const monthlyCredits = plan === "pro" ? 1000 : 50;

  user.plan = plan;
  user.monthly_credits = monthlyCredits;
  user.updated_at = Math.floor(Date.now() / 1000);

  db.users.set(userId, user);
}

function getNextMonthTimestamp(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.floor(nextMonth.getTime() / 1000);
}
