import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth } from "../middleware/auth.middleware";

export const servicesRouter = Router();

servicesRouter.get("/", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, description, price, status, subscriber_count AS "subscriberCount"
     FROM service_plans ORDER BY price ASC`
  );
  res.json(rows);
});

servicesRouter.patch("/:id/status", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: "active" | "suspended" | "cancelled" };

  const { rows } = await pool.query(
    `UPDATE service_plans SET status = $1 WHERE id = $2
     RETURNING id, name, description, price, status, subscriber_count AS "subscriberCount"`,
    [status, id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Service plan not found" });
  }

  res.json(rows[0]);
});