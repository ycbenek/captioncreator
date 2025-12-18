import type { Request, Response } from "express";
import { Router } from "express";
import { getOrCreateUser, checkAndResetCredits } from "../db/user";
import { getRateLimitInfo } from "../db/rate-limit";

const router = Router();

router.get("/info", async (req: Request, res: Response): Promise<void> => {
  try {
    const canvaUserId = req.query.canvaUserId as string;

    if (!canvaUserId) {
      res.status(400).json({
        error: "canvaUserId is required",
        code: "INVALID_REQUEST",
      });
      return;
    }

    let user = getOrCreateUser(canvaUserId);
    user = checkAndResetCredits(user);

    const windowMs = 3600000; // 1 hour
    const maxRequests = user.plan === "pro" ? 100 : 10;
    const rateLimitInfo = getRateLimitInfo(user.id, windowMs, maxRequests);

    res.json({
      success: true,
      data: {
        plan: user.plan,
        credits: {
          used: user.used_credits,
          total: user.monthly_credits,
          remaining: user.monthly_credits - user.used_credits,
          reset_at: user.reset_at,
        },
        rateLimit: {
          remaining: rateLimitInfo.remaining,
          max: maxRequests,
          reset_at: rateLimitInfo.resetAt,
        },
      },
    });
  } catch (error: any) {
    console.error("User info fetch error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch user info",
      code: "USER_INFO_ERROR",
    });
  }
});

export default router;
