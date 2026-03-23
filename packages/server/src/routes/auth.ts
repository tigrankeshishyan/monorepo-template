import { Router, type Request, type Response } from "express";
import { getDatabaseManager, signToken, verifyToken, extractBearerToken } from "@app/shared-db";
import { createLogger } from "@app/shared-utils";
import { requireAuth } from "../middleware/auth";

const logger = createLogger("auth-routes");
export const authRouter = Router();

// ─── POST /auth/login ─────────────────────────────────────────────────────────

authRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  try {
    const db = getDatabaseManager();
    const user = await db.getUserByEmail(email);

    if (!user) {
      // Return same error for both "user not found" and "wrong password" to prevent user enumeration
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // TODO: Replace this stub with your actual password verification (e.g. bcrypt.compare)
    // The current implementation accepts any non-empty password for development purposes only.
    if (!password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    logger.info("User logged in", { userId: user.id });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    logger.error("Login error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

authRouter.get("/me", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = extractBearerToken(authHeader);

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyToken(token);
    const db = getDatabaseManager();
    const user = await db.getUserById(payload.sub);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    logger.error("Get me error", err);
    res.status(401).json({ error: "Invalid session" });
  }
});

// ─── POST /auth/logout ────────────────────────────────────────────────────────

authRouter.post("/logout", (req: Request, res: Response): void => {
  void req;
  // JWT is stateless — client is responsible for discarding the token.
  // TODO: If you add a token blocklist/Redis store for revocation, clear it here.
  res.json({ message: "Logged out" });
});
