import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth, type AuthedRequest } from "../middleware/auth.middleware";

export const cartRouter = Router();

cartRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const { rows } = await pool.query(
    `SELECT ci.id, ci.product_id AS "productId", p.name AS "productName",
            ci.variant_selections AS "variantSelections", ci.quantity,
            ci.unit_price AS "unitPrice"
     FROM cart_items ci
     JOIN catalog_products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at ASC`,
    [req.userId]
  );
  res.json(rows);
});

// Same product + same variant selections merges into the existing row
// (quantity += n) instead of creating a duplicate line.
cartRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const { productId, variantSelections, quantity, unitPrice } = req.body as {
    productId?: string;
    variantSelections?: Record<string, string>;
    quantity?: number;
    unitPrice?: number;
  };

  if (!productId || !quantity || typeof unitPrice !== "number") {
    return res.status(400).json({ error: "productId, quantity, unitPrice are required" });
  }

  const selections = JSON.stringify(variantSelections ?? {});

  // 1. Check if item exists
  const existing = await pool.query(
    `SELECT id FROM cart_items
     WHERE user_id = $1 AND product_id = $2 AND variant_selections = $3::jsonb`,
    [req.userId, productId, selections]
  );

  let cartItemId: string;

  if (existing.rows.length > 0) {
    cartItemId = existing.rows[0].id;
    await pool.query(
      `UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2`,
      [quantity, cartItemId]
    );
  } else {
    const insertRes = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, variant_selections, quantity, unit_price)
       VALUES ($1, $2, $3::jsonb, $4, $5)
       RETURNING id`,
      [req.userId, productId, selections, quantity, unitPrice]
    );
    cartItemId = insertRes.rows[0].id;
  }

  // 2. Fetch complete CartItem including productName to return to client
  const { rows } = await pool.query(
    `SELECT ci.id, ci.product_id AS "productId", p.name AS "productName",
            ci.variant_selections AS "variantSelections", ci.quantity,
            ci.unit_price AS "unitPrice"
     FROM cart_items ci
     JOIN catalog_products p ON p.id = ci.product_id
     WHERE ci.id = $1`,
    [cartItemId]
  );

  res.status(existing.rows.length > 0 ? 200 : 201).json(rows[0]);
});

cartRouter.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { quantity } = req.body as { quantity?: number };
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "quantity must be >= 1" });
  }

  const { rows } = await pool.query(
    `UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3
     RETURNING id, product_id AS "productId", variant_selections AS "variantSelections",
               quantity, unit_price AS "unitPrice"`,
    [quantity, req.params.id, req.userId]
  );

  if (rows.length === 0) return res.status(404).json({ error: "Cart item not found" });
  res.json(rows[0]);
});

cartRouter.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { rowCount } = await pool.query(`DELETE FROM cart_items WHERE id = $1 AND user_id = $2`, [
    req.params.id,
    req.userId,
  ]);
  if (rowCount === 0) return res.status(404).json({ error: "Cart item not found" });
  res.status(204).send();
});

// Mock checkout — no payment processing of any kind. It does write a real
// order + order_items (so it shows up in the analytics Sales tab like any
// other order), then empties the cart.
cartRouter.post("/checkout", requireAuth, async (req: AuthedRequest, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      `SELECT product_id, quantity, unit_price FROM cart_items WHERE user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Giỏ hàng đang trống" });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status) VALUES ($1, 'completed') RETURNING id, created_at`,
      [req.userId]
    );
    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.unit_price]
      );
    }

    const total = cartResult.rows.reduce(
      (sum: number, r: { quantity: number; unit_price: number }) => sum + r.quantity * r.unit_price,
      0
    );

    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [req.userId]);
    await client.query("COMMIT");

    res.status(201).json({ orderId: order.id, createdAt: order.created_at, total });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});