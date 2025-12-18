import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import captionRouter from "./routes/caption";
import userRouter from "./routes/user";
import { initDatabase } from "./db/init";

// .env dosyasını yükle
dotenv.config();

const app = express();
// Railway uses PORT, local uses CANVA_BACKEND_PORT
const PORT = parseInt(process.env.PORT || process.env.CANVA_BACKEND_PORT || "3000", 10);

// Middleware - CORS yapılandırması
app.use(
  cors({
    origin: (origin, callback) => {
      // Canva app domain'leri ve localhost'u kabul et
      const allowedOrigins = [
        /^https:\/\/app-.+\.canva\.com$/,
        /^https:\/\/app-.+\.canva-apps\.com$/,
        "http://localhost:8080",
        "https://localhost:8080",
      ];
      
      if (!origin) {
        // Origin yoksa (örn: Postman) kabul et
        return callback(null, true);
      }
      
      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") {
          return allowed === origin;
        }
        return allowed.test(origin);
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS rejected origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/caption", captionRouter);
app.use("/api/user", userRouter);

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      code: err.code || "INTERNAL_ERROR",
    });
  },
);

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(
        `📊 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? "Yes" : "No"}`,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

export default app;
