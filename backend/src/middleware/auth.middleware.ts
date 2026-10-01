import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: "admin" | "moderator" | "customer";
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = header.slice("Bearer ".length);
  let payload: { sub: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret-change-me") as { sub: string };
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  try {
    const { rows } = await pool.query("SELECT role, is_banned FROM users WHERE id = $1", [payload.sub]);
    const account = rows[0] as { role: "admin" | "moderator" | "customer"; is_banned: boolean } | undefined;
    if (!account || account.is_banned) {
      res.status(401).json({ error: "Account not found or disabled" });
      return;
    }
    req.userId = payload.sub;
    req.userRole = account.role;
    next();
  } catch {
    res.status(500).json({ error: "Unable to verify account" });
  }
}

export function requireAnalyticsAccess(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (req.userRole === "admin" || req.userRole === "moderator") return next();
  res.status(403).json({ error: "Analytics access requires an admin or moderator role" });
}
