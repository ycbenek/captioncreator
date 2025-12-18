import type { Request, Response } from "express";
import { Router } from "express";
import { generateCaption } from "../services/ai";
import { getOrCreateUser, checkAndResetCredits, useCredit } from "../db/user";
import { checkRateLimit } from "../db/rate-limit";
import { getDatabase } from "../db/init";
import { randomUUID } from "crypto";

const router = Router();

interface GenerateCaptionRequest {
  canvaUserId: string;
  texts: string[];
  platform: string;
  tone: string;
  language: string;
  designType: string;
}

router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { canvaUserId, texts, platform, tone, language, designType } =
      req.body as GenerateCaptionRequest;

    // Validation
    if (
      !canvaUserId ||
      !texts ||
      !platform ||
      !tone ||
      !language ||
      !designType
    ) {
      res.status(400).json({
        error: "Missing required fields",
        code: "INVALID_REQUEST",
      });
      return;
    }

    if (!Array.isArray(texts) || texts.length === 0) {
      res.status(400).json({
        error: "texts must be a non-empty array",
        code: "INVALID_TEXTS",
      });
      return;
    }

    // Get or create user
    let user = getOrCreateUser(canvaUserId);
    user = checkAndResetCredits(user);

    // Check rate limit
    const windowMs = 3600000; // 1 hour
    const maxRequests = user.plan === "pro" ? 100 : 10;

    if (!checkRateLimit(user.id, windowMs, maxRequests)) {
      res.status(429).json({
        error: "Rate limit exceeded. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
      });
      return;
    }

    // Check credits
    if (user.used_credits >= user.monthly_credits) {
      res.status(402).json({
        error: "Monthly credit limit reached. Upgrade to Pro for more credits.",
        code: "CREDIT_LIMIT_REACHED",
        data: {
          plan: user.plan,
          used_credits: user.used_credits,
          monthly_credits: user.monthly_credits,
          reset_at: user.reset_at,
        },
      });
      return;
    }

    // Generate caption
    const caption = await generateCaption({
      texts,
      platform,
      tone,
      language,
      designType,
    });

    // Use credit
    if (!useCredit(user.id)) {
      res.status(402).json({
        error: "Failed to use credit",
        code: "CREDIT_ERROR",
      });
      return;
    }

    // Save generation to history
    const db = getDatabase();
    const generationId = randomUUID();
    const generation = {
      id: generationId,
      user_id: user.id,
      platform,
      tone,
      language,
      design_type: designType,
      input_texts: JSON.stringify(texts),
      output_caption: caption,
      created_at: Math.floor(Date.now() / 1000),
    };
    db.generations.set(generationId, generation);

    // Return success
    res.json({
      success: true,
      data: {
        caption,
        generationId,
        credits: {
          used: user.used_credits + 1,
          total: user.monthly_credits,
          remaining: user.monthly_credits - user.used_credits - 1,
          reset_at: user.reset_at,
        },
      },
    });
  } catch (error: any) {
    console.error("Caption generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate caption",
      code: "GENERATION_ERROR",
    });
  }
});

router.get("/history", async (req: Request, res: Response): Promise<void> => {
  try {
    const canvaUserId = req.query.canvaUserId as string;

    if (!canvaUserId) {
      res.status(400).json({
        error: "canvaUserId is required",
        code: "INVALID_REQUEST",
      });
      return;
    }

    const user = getOrCreateUser(canvaUserId);
    const db = getDatabase();

    const history = Array.from(db.generations.values())
      .filter((gen: any) => gen.user_id === user.id)
      .sort((a: any, b: any) => b.created_at - a.created_at)
      .slice(0, 50);

    res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("History fetch error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch history",
      code: "HISTORY_ERROR",
    });
  }
});

export default router;
