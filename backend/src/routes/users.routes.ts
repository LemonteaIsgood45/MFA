import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth, requireAnalyticsAccess, type AuthedRequest } from "../middleware/auth.middleware";

export const usersRouter = Router();
usersRouter.use(requireAuth);
usersRouter.get("/me", async (req: AuthedRequest, res) => {
  const { rows } = await pool.query("SELECT id, name, email, role, cart, purchase_history AS \"purchaseHistory\" FROM users WHERE id = $1", [req.userId]);
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(rows[0]);
});
usersRouter.post("/me/cart/items", async (req: AuthedRequest, res) => {
  const item = req.body as Record<string, unknown>;
  if (typeof item.productId !== "string" || typeof item.quantity !== "number" || item.quantity < 1) return res.status(400).json({ error: "productId and a positive quantity are required" });
  const { rows } = await pool.query("UPDATE users SET cart = cart || jsonb_build_array($1::jsonb) WHERE id = $2 RETURNING cart", [JSON.stringify({ ...item, addedAt: new Date().toISOString() }), req.userId]);
  res.json({ cart: rows[0]?.cart ?? [] });
});
usersRouter.post("/me/purchases", async (req: AuthedRequest, res) => {
  const item = req.body as Record<string, unknown>;
  if (typeof item.productId !== "string" || typeof item.quantity !== "number" || item.quantity < 1) return res.status(400).json({ error: "productId and a positive quantity are required" });
  const { rows } = await pool.query("UPDATE users SET purchase_history = purchase_history || jsonb_build_array($1::jsonb) WHERE id = $2 RETURNING purchase_history AS \"purchaseHistory\"", [JSON.stringify({ ...item, purchasedAt: new Date().toISOString() }), req.userId]);
  res.status(201).json({ purchaseHistory: rows[0]?.purchaseHistory ?? [] });
});
usersRouter.get("/stats", requireAuth, requireAnalyticsAccess, async (_req, res) => {
  const totalUsers = await pool.query(`SELECT COUNT(*)::int AS count FROM users`);
  const activeSessions = await pool.query(
    `SELECT COUNT(DISTINCT user_id)::int AS count
     FROM user_sessions
     WHERE last_seen_at > now() - interval '15 minutes'`
  );
 
  res.json({
    totalUsers: totalUsers.rows[0].count,
    activeSessions: activeSessions.rows[0].count,
  });
});
 
// List + search. ?search= matches name or email, case-insensitively.
usersRouter.get("/", requireAuth, requireAnalyticsAccess, async (req, res) => {
  const { search } = req.query as { search?: string };
 
  const { rows } = await pool.query(
    `SELECT
       u.id, u.name, u.email, u.role, u.is_banned AS "isBanned", u.created_at AS "createdAt",
       EXISTS (
         SELECT 1 FROM user_sessions s
         WHERE s.user_id = u.id AND s.last_seen_at > now() - interval '15 minutes'
       ) AS "isActive"
     FROM users u
     WHERE ($1::text IS NULL OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
     ORDER BY u.created_at DESC`,
    [search ?? null]
  );
  res.json(rows);
});
 
usersRouter.patch("/:id/ban", requireAuth, requireAnalyticsAccess, async (req, res) => {
  const { id } = req.params;
  const { isBanned } = req.body as { isBanned: boolean };
 
  const { rows } = await pool.query(
    `UPDATE users SET is_banned = $1 WHERE id = $2 RETURNING id, is_banned AS "isBanned"`,
    [isBanned, id]
  );
 
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(rows[0]);
});
 
// Mock reset: sets password_hash to a fixed placeholder and returns a
// one-time demo password. A real backend would email a reset link instead
// of returning a password directly — this is a stand-in for the demo.
usersRouter.post("/:id/reset-password", requireAuth, requireAnalyticsAccess, async (req, res) => {
  const { id } = req.params;
  const demoPassword = "Reset@123";
 
  const { rows } = await pool.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email`,
    ["$2b$10$resetresetresetresetresetresetresetresetresetrese", id]
  );
 
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ ...rows[0], temporaryPassword: demoPassword });
});
