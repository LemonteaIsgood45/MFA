import { Router } from "express";
import { pool } from "../db/pool";

export const catalogRouter = Router();

catalogRouter.get("/products", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT
       product.id,
       product.category,
       product.carrier,
       product.name,
       product.badge,
       product.highlights,
       product.base_price AS "basePrice",
       product.stock,
       product.description,
       product.variant_groups AS "variantGroups",
       product.detail_rows AS "detailRows",
       COALESCE(
         json_agg(
           json_build_object('url', image.image_url, 'alt', image.alt_text)
           ORDER BY image.position
         ) FILTER (WHERE image.id IS NOT NULL),
         '[]'::json
       ) AS images
     FROM catalog_products product
     LEFT JOIN product_images image ON image.product_id = product.id
     GROUP BY product.id
     ORDER BY product.category, product.id`
  );

  res.json(rows);
});

catalogRouter.get("/banners", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT image_url AS "imageUrl"
     FROM promo_banners
     ORDER BY id`
  );

  res.json(rows);
});
