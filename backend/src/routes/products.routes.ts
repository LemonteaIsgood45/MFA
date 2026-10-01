import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth, requireAnalyticsAccess } from "../middleware/auth.middleware";

export const productsRouter = Router();
productsRouter.use(requireAuth, requireAnalyticsAccess);

// Full catalogue with images attached, one row per product. Sorting and
// filtering happen client-side in analytics-app since the catalogue is
// small — no query params needed here.
productsRouter.get("/", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT
      p.id,
      p.category,
      p.carrier,
      p.name,
      p.badge,
      p.highlights,
      p.base_price AS "basePrice",
      p.stock,
      p.description,
      p.variant_groups AS "variantGroups",
      p.detail_rows AS "detailRows",
      COALESCE(
        json_agg(
          json_build_object('url', pi.image_url, 'alt', pi.alt_text)
          ORDER BY pi.position
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
      ) AS images
    FROM catalog_products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    GROUP BY p.id
    ORDER BY p.category, p.name
  `);
  res.json(rows);
});

// General edit — name, price, description. Stock has its own endpoint
// below since "add stock" is a distinct, more frequent action.
productsRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, basePrice, description } = req.body as {
    name?: string;
    basePrice?: number;
    description?: string;
  };

  const { rows } = await pool.query(
    `UPDATE catalog_products
     SET name = COALESCE($1, name),
         base_price = COALESCE($2, base_price),
         description = COALESCE($3, description)
     WHERE id = $4
     RETURNING id, name, base_price AS "basePrice", description, stock`,
    [name ?? null, basePrice ?? null, description ?? null, id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(rows[0]);
});

// Dedicated stock adjustment — positive delta to restock, negative to
// correct a count. Clamped at 0 so a bad delta can't go negative.
productsRouter.post("/:id/stock", async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body as { delta?: number };

  if (typeof delta !== "number" || Number.isNaN(delta)) {
    return res.status(400).json({ error: "delta must be a number" });
  }

  const { rows } = await pool.query(
    `UPDATE catalog_products
     SET stock = GREATEST(0, stock + $1)
     WHERE id = $2
     RETURNING id, stock`,
    [delta, id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(rows[0]);
});
