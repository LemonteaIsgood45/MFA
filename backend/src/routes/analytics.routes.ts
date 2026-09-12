import { Router } from "express";
import { pool } from "../db/pool";
import { requireAnalyticsAccess, requireAuth } from "../middleware/auth.middleware";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, requireAnalyticsAccess, async (_req, res) => {
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
    churnRate: 2.4,
    revenueByMonth,
  });
});
 
// Sales tab data: monthly revenue (still from the precomputed table — a
// realistic-looking rollup), plus two more charts derived from the actual
// orders/order_items rows so it's not just re-displaying the same number.
analyticsRouter.get("/sales", requireAuth, async (_req, res) => {
  const revenueByMonth = await pool.query(
    `SELECT month, revenue FROM revenue_by_month ORDER BY month ASC`
  );
 
  const orderStatus = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status`
  );
 
  const topProducts = await pool.query(
    `SELECT p.id, p.name, SUM(oi.quantity)::int AS "unitsSold",
            SUM(oi.quantity * oi.unit_price)::bigint AS revenue
     FROM order_items oi
     JOIN catalog_products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.status != 'cancelled'
     GROUP BY p.id, p.name
     ORDER BY revenue DESC
     LIMIT 5`
  );
 
  const totals = await pool.query(
    `SELECT COUNT(*)::int AS "totalOrders",
            COALESCE(SUM(oi.quantity * oi.unit_price), 0)::bigint AS "totalRevenue"
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.status != 'cancelled'`
  );
 
  res.json({
    revenueByMonth: revenueByMonth.rows.map((r) => ({ month: r.month, revenue: Number(r.revenue) })),
    orderStatusBreakdown: orderStatus.rows,
    topProducts: topProducts.rows.map((r) => ({ ...r, revenue: Number(r.revenue) })),
    totalOrders: totals.rows[0].totalOrders,
    totalRevenue: Number(totals.rows[0].totalRevenue),
  });
});
 
// Product-type breakdown for the Products tab's pie chart.
analyticsRouter.get("/product-mix", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT
       CASE WHEN category = 'esim' THEN COALESCE(carrier, 'Khác') ELSE 'Phụ kiện' END AS label,
       COUNT(*)::int AS count
     FROM catalog_products
     GROUP BY label
     ORDER BY count DESC`
  );
  res.json(rows);
});
