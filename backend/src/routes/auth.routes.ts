import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const { rows } = await pool.query(
    "SELECT id, name, email, password_hash, role, is_banned FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  const record = rows[0];
  if (!record || !(await bcrypt.compare(password, record.password_hash))) {
    return res.status(401).json({ error: "Email or password is incorrect" });
  }
  if (record.is_banned) {
    return res.status(403).json({ error: "This account has been disabled" });
  }

  const user = {
    id: record.id as string,
    name: record.name as string,
    email: record.email as string,
    role: record.role as "admin" | "moderator" | "customer",
  };

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET ?? "dev-secret-change-me", {
    expiresIn: "8h",
  });

  res.json({
    token,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    user,
  });
});

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email và password là bắt buộc" });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "Email đã được sử dụng" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'customer')
     RETURNING id, name, email, role`,
    [name, email, passwordHash]
  );
  const user = rows[0];

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET ?? "dev-secret-change-me", {
    expiresIn: "8h",
  });

  res.status(201).json({
    token,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    user,
  });
});
