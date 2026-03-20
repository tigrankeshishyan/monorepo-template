import { type Request, type Response, type NextFunction } from "express";
import { extractBearerToken, verifyToken } from "@app/shared-db";
import { createLogger } from "@app/shared-utils";

const logger = createLogger("auth-middleware");

/**
 * Express middleware that validates the JWT in the Authorization header.
 * Attaches the decoded payload to `req.user` on success.
 * Returns 401 on missing or invalid token.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.headers["authorization"]);

  if (!token) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  try {
    const payload = verifyToken(token);
    // Attach to the request for downstream handlers
    (req as Request & { user: typeof payload }).user = payload;
    next();
  } catch (err) {
    logger.warn("Auth middleware rejected token", { error: err });
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
