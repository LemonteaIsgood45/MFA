import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export const authRouter = Router();

// Demo authentication: the password is accepted for local development. In a
// production deployment replace this with a password-hash or identity-provider check.
authRouter.post("/login", async (req, res) => {
  const { email } = req.body as { email?: string; password?: string };
  if (!email) return res.status(400).json({ error: "email is required" });

  let { rows } = await pool.query("SELECT id, name, email, role FROM users WHERE email = $1 LIMIT 1", [email]);
  if (!rows[0]) {
    const created = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING id, name, email, role",
      [email.split("@")[0] || "Customer", email, "demo-password-not-for-production"]
    );
    rows = created.rows;
  }
  const user = rows[0];
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET ?? "dev-secret-change-me", { expiresIn: "8h" });
  res.json({ token, expiresAt: Date.now() + 8 * 60 * 60 * 1000, user });
});
