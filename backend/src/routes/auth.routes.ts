import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export const authRouter = Router();

// Mock login: in this demo we skip real bcrypt compare and accept the seeded
// admin account, or any email/password pair, so the front-end flow can be
// wired up end-to-end without a full auth system.
authRouter.post("/login", async (req, res) => {
  const { email } = req.body as { email?: string; password?: string };

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const { rows } = await pool.query(
    "SELECT id, name, email, role FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  const user = rows[0] ?? {
    id: "mock-user-id",
    name: "Demo User",
    email,
    role: "staff",
  };

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET ?? "dev-secret-change-me", {
    expiresIn: "8h",
  });

  res.json({
    token,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    user,
  });
});
