-- Schema for the MFA demo project.
-- Mounted into the postgres container's /docker-entrypoint-initdb.d/
-- so it runs automatically the first time the container starts.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'customer')) DEFAULT 'staff'
);

CREATE TABLE IF NOT EXISTS service_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'cancelled')) DEFAULT 'active',
  subscriber_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS revenue_by_month (
  id SERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  revenue NUMERIC(12, 2) NOT NULL
);

-- Storefront catalogue. These columns map to service-app's Product type;
-- category-specific presentation fields remain nullable for accessories.
CREATE TABLE IF NOT EXISTS catalog_products (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('esim', 'accessory')),
  carrier TEXT,
  name TEXT NOT NULL,
  badge TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  base_price INTEGER NOT NULL CHECK (base_price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  description TEXT NOT NULL,
  variant_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  detail_rows JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Supports upgrading a database created before stock became a quantity.
ALTER TABLE catalog_products
  ALTER COLUMN stock TYPE INTEGER
  USING CASE
    WHEN stock::text ~ '^[0-9]+$' THEN stock::text::integer
    ELSE 0
  END;

-- Ordered gallery images for each catalogue product (Product.images).
CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0),
  UNIQUE (product_id, position)
);

-- The promo banner has image content only; its primary key is technical.
CREATE TABLE IF NOT EXISTS promo_banners (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL UNIQUE
);

-- Seed data (password for the demo admin user is "password123", hashed with bcrypt offline)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Demo', 'admin@mfa.dev', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Y3sq6zX8vHnFZm3zNz.d1ZnW3v0Wi', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO service_plans (name, description, price, status, subscriber_count) VALUES
  ('Gói Cơ Bản', 'Gói dịch vụ dữ liệu tốc độ chuẩn', 99000, 'active', 1240),
  ('Gói Nâng Cao', 'Gói dữ liệu tốc độ cao kèm thoại nội mạng', 199000, 'active', 860),
  ('Gói Doanh Nghiệp', 'Gói dành cho khách hàng doanh nghiệp', 499000, 'active', 120),
  ('Gói Khuyến Mãi Hè', 'Chương trình khuyến mãi theo mùa', 149000, 'suspended', 340)
ON CONFLICT DO NOTHING;

INSERT INTO revenue_by_month (month, revenue) VALUES
  ('2026-02', 420000000),
  ('2026-03', 455000000),
  ('2026-04', 468000000),
  ('2026-05', 501000000),
  ('2026-06', 512000000),
  ('2026-07', 534000000)
ON CONFLICT DO NOTHING;

INSERT INTO catalog_products
  (id, category, carrier, name, badge, highlights, base_price, stock, description, variant_groups, detail_rows)
VALUES
  ('plan-giga-01', 'esim', 'Viettel', 'Siêu Việt eSIM 5G', 'Hỗ trợ eSIM', ARRAY['240GB/tháng', 'Miễn phí nội mạng', '100 phút ngoại mạng'], 350000, 120, 'Gói cước tốc độ cao cho người dùng data lớn.', '[{"id":"duration","label":"Kỳ hạn gói","options":[{"id":"v1","label":"1 tháng","priceDelta":0},{"id":"v3","label":"3 tháng","priceDelta":-30000},{"id":"v6","label":"6 tháng","priceDelta":-70000}]}]', '[{"label":"Nhà mạng","value":"Viettel"},{"label":"Dung lượng","value":"240GB/tháng"}]'),
  ('plan-nova-01', 'esim', 'Mobifone', 'NovaMax eSIM Data', 'Hỗ trợ eSIM', ARRAY['180GB/tháng', 'Miễn phí nội mạng'], 299000, 80, 'Gói data tiết kiệm cho nhu cầu hằng ngày.', '[{"id":"duration","label":"Kỳ hạn gói","options":[{"id":"v1","label":"1 tháng","priceDelta":0},{"id":"v3","label":"3 tháng","priceDelta":-20000}]}]', '[{"label":"Nhà mạng","value":"Mobifone"},{"label":"Dung lượng","value":"180GB/tháng"}]'),
  ('plan-sky-01', 'esim', 'Vinaphone', 'Vinaphone eSIM Pro', 'Hỗ trợ eSIM', ARRAY['300GB/tháng', 'Miễn phí nội mạng', '200 phút ngoại mạng'], 399000, 45, 'Gói cao cấp với data lớn và phút gọi ngoại mạng.', '[]', '[{"label":"Nhà mạng","value":"Vinaphone"},{"label":"Dung lượng","value":"300GB/tháng"}]'),
  ('plan-vina-01', 'esim', 'VietnamMobile', 'VietnamMobile eSIM Sinh Viên', 'Hỗ trợ eSIM', ARRAY['150GB/tháng', 'Miễn phí nội mạng'], 199000, 60, 'Gói ưu đãi cho học sinh, sinh viên.', '[]', '[{"label":"Nhà mạng","value":"VietnamMobile"},{"label":"Dung lượng","value":"150GB/tháng"}]'),
  ('plan-giga-02', 'esim', 'Viettel', 'Viettel eSIM Gia Đình', 'Hỗ trợ eSIM', ARRAY['400GB/tháng', 'Miễn phí nội mạng', '300 phút ngoại mạng'], 450000, 30, 'Chia sẻ data cho cả gia đình.', '[]', '[{"label":"Nhà mạng","value":"Viettel"},{"label":"Dung lượng","value":"400GB/tháng"}]'),
  ('plan-sky-02', 'esim', 'Vinaphone', 'Vinaphone eSIM Cơ Bản', 'Hỗ trợ eSIM', ARRAY['100GB/tháng', 'Miễn phí nội mạng'], 149000, 0, 'Gói cơ bản cho nhu cầu liên lạc.', '[]', '[{"label":"Nhà mạng","value":"Vinaphone"},{"label":"Dung lượng","value":"100GB/tháng"}]'),
  ('acc-01', 'accessory', NULL, 'Ốp lưng điện thoại chống sốc', NULL, '{}', 149000, 75, 'Ốp lưng silicon chống sốc.', '[]', '[{"label":"Chất liệu","value":"Silicon TPU"}]'),
  ('acc-02', 'accessory', NULL, 'Sạc nhanh 20W đầu USB-C', NULL, '{}', 259000, 40, 'Củ sạc nhanh USB-C 20W.', '[]', '[{"label":"Công suất","value":"20W"}]'),
  ('acc-03', 'accessory', NULL, 'Tai nghe Bluetooth true wireless', NULL, '{}', 399000, 0, 'Tai nghe không dây chống ồn.', '[]', '[{"label":"Kết nối","value":"Bluetooth 5.3"}]'),
  ('acc-04', 'accessory', NULL, 'Cáp sạc Type-C', NULL, '{}', 89000, 90, 'Cáp sạc Type-C bọc dù.', '[]', '[{"label":"Chất liệu","value":"Bọc dù"}]'),
  ('acc-05', 'accessory', NULL, 'Pin sạc dự phòng', NULL, '{}', 349000, 25, 'Pin sạc dự phòng hỗ trợ sạc nhanh.', '[]', '[{"label":"Dung lượng","value":"10.000mAh"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, position) VALUES
  ('plan-giga-01', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80', 'Siêu Việt eSIM 5G', 0),
  ('plan-nova-01', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', 'NovaMax eSIM Data', 0),
  ('plan-sky-01', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80', 'SkyConnect eSIM Pro', 0),
  ('plan-vina-01', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80', 'VinaLink eSIM Sinh Viên', 0),
  ('plan-giga-02', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80', 'GigaTel eSIM Gia Đình', 0),
  ('plan-sky-02', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80', 'SkyConnect eSIM Cơ Bản', 0),
  ('acc-01', 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=1200&q=80', 'Ốp lưng điện thoại chống sốc', 0),
  ('acc-02', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80', 'Sạc nhanh USB-C 20W', 0),
  ('acc-03', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'Tai nghe Bluetooth true wireless', 0),
  ('acc-04', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80', 'Cáp sạc Type-C', 0),
  ('acc-05', 'https://images.unsplash.com/photo-1609592424824-7f873bd3f6b6?auto=format&fit=crop&w=1200&q=80', 'Pin sạc dự phòng', 0)
ON CONFLICT (product_id, position) DO NOTHING;

INSERT INTO promo_banners (image_url) VALUES
  ('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85'),
  ('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85')
ON CONFLICT (image_url) DO NOTHING;
