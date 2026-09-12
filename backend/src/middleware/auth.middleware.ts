import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: "admin" | "moderator" | "customer";
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret-change-me") as {
      sub: string;
      role: "admin" | "moderator" | "customer";
    };
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAnalyticsAccess(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (req.userRole === "admin" || req.userRole === "moderator") return next();
  res.status(403).json({ error: "Analytics access requires an admin or moderator role" });
}
