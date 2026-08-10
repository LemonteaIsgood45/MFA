import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth } from "../middleware/auth.middleware";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, async (_req, res) => {
  const revenueResult = await pool.query(
    "SELECT month, revenue FROM revenue_by_month ORDER BY month ASC"
  );
  const subsResult = await pool.query(
    "SELECT COALESCE(SUM(subscriber_count), 0) AS total FROM service_plans WHERE status = 'active'"
  );

  const revenueByMonth = revenueResult.rows.map((r) => ({
    month: r.month as string,
    revenue: Number(r.revenue),
  }));

  const totalRevenue = revenueByMonth.reduce((sum, r) => sum + r.revenue, 0);
  const totalSubscribers = Number(subsResult.rows[0]?.total ?? 0);

  res.json({
    totalRevenue,
    totalSubscribers,
    churnRate: 2.4, // static mock figure for the demo
    revenueByMonth,
  });
});
