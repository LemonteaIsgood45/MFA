-- Schema for the MFA demo project.
-- Mounted into the postgres container's /docker-entrypoint-initdb.d/
-- so it runs automatically the first time the container starts.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'customer')) DEFAULT 'customer'
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

-- ============================================================================
-- Additions for analytics-app: user moderation/session state + real order
-- data (so sales charts aren't just a single precomputed table).
-- ============================================================================

-- Supports the Users tab: ban/unban, and "created_at" for a signups-over-time
-- chart if you want one later.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Update existing user role constraint if migrating an existing DB
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'moderator', 'customer'));

-- "num in session": a session row exists per login and gets touched on
-- activity. The backend treats last_seen_at within the last 15 minutes as
-- "currently active" — see analytics.routes.ts.
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Real orders instead of only a precomputed revenue_by_month table — lets
-- the Sales tab derive more than one chart (status breakdown, top products)
-- from the same underlying data, which is closer to how a real backend
-- would work even though this one's still a mock.
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')) DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES catalog_products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0)
);

-- Seed data (password for the demo admin user is "password123").
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Demo', 'admin@mfa.dev', '$2a$10$RqiFirVt6/qdLHPH6xfVc.Hu9x9G38./Le3wTcE8X2M/MptvMVbiC', 'admin')
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;

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

-- More users, with explicit ids so orders/sessions below can reference them,
-- and a couple already banned so the Users tab has something to show.
INSERT INTO users (id, name, email, password_hash, role, is_banned, created_at) VALUES
  ('10000000-0000-4000-a000-000000000001', 'Nguyễn Văn An',   'an.nguyen@example.com',   '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '210 days'),
  ('10000000-0000-4000-a000-000000000002', 'Trần Thị Bích',   'bich.tran@example.com',   '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '180 days'),
  ('10000000-0000-4000-a000-000000000003', 'Lê Minh Châu',    'chau.le@example.com',    '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  true,  now() - interval '160 days'),
  ('10000000-0000-4000-a000-000000000004', 'Phạm Quốc Dũng',  'dung.pham@example.com',   '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '140 days'),
  ('10000000-0000-4000-a000-000000000005', 'Hoàng Thị Em',    'em.hoang@example.com',    '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '120 days'),
  ('10000000-0000-4000-a000-000000000006', 'Vũ Anh Phong',    'phong.vu@example.com',    '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '100 days'),
  ('10000000-0000-4000-a000-000000000007', 'Đặng Thị Giang',  'giang.dang@example.com',  '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  true,  now() - interval '90 days'),
  ('10000000-0000-4000-a000-000000000008', 'Bùi Văn Hải',     'hai.bui@example.com',     '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '75 days'),
  ('10000000-0000-4000-a000-000000000009', 'Ngô Thị Hoa',     'hoa.ngo@example.com',     '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '60 days'),
  ('10000000-0000-4000-a000-000000000010', 'Đỗ Minh Khang',   'khang.do@example.com',    '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '45 days'),
  ('10000000-0000-4000-a000-000000000011', 'Lý Thị Lan',      'lan.ly@example.com',      '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'customer',  false, now() - interval '30 days'),
  ('10000000-0000-4000-a000-000000000012', 'Trịnh Văn Minh',  'minh.trinh@example.com',  '$2b$10$dummydummydummydummydummydummydummydummydummydu', 'moderator', false, now() - interval '300 days')
ON CONFLICT (email) DO NOTHING;

-- Active sessions: last_seen_at within the last 15 minutes counts as
-- "currently active" — 5 of the 12 users below are "in session" right now.
INSERT INTO user_sessions (user_id, created_at, last_seen_at) VALUES
  ('10000000-0000-4000-a000-000000000001', now() - interval '40 minutes', now() - interval '2 minutes'),
  ('10000000-0000-4000-a000-000000000002', now() - interval '25 minutes', now() - interval '1 minutes'),
  ('10000000-0000-4000-a000-000000000005', now() - interval '10 minutes', now() - interval '4 minutes'),
  ('10000000-0000-4000-a000-000000000009', now() - interval '60 minutes', now() - interval '8 minutes'),
  ('10000000-0000-4000-a000-000000000011', now() - interval '5 minutes',  now() - interval '30 seconds'),
  ('10000000-0000-4000-a000-000000000004', now() - interval '2 days',     now() - interval '2 days'),
  ('10000000-0000-4000-a000-000000000006', now() - interval '5 days',     now() - interval '5 days')
ON CONFLICT DO NOTHING;

-- Orders + line items spread across the same 6 months as revenue_by_month,
-- so the Sales tab can derive a top-products chart and an order-status
-- breakdown from real rows instead of only reading one precomputed table.
INSERT INTO orders (id, user_id, status, created_at) VALUES
  ('20000000-0000-4000-a000-000000000001', '10000000-0000-4000-a000-000000000001', 'completed', '2026-02-05'),
  ('20000000-0000-4000-a000-000000000002', '10000000-0000-4000-a000-000000000002', 'completed', '2026-02-14'),
  ('20000000-0000-4000-a000-000000000003', '10000000-0000-4000-a000-000000000004', 'cancelled', '2026-02-20'),
  ('20000000-0000-4000-a000-000000000004', '10000000-0000-4000-a000-000000000005', 'completed', '2026-03-02'),
  ('20000000-0000-4000-a000-000000000005', '10000000-0000-4000-a000-000000000006', 'completed', '2026-03-11'),
  ('20000000-0000-4000-a000-000000000006', '10000000-0000-4000-a000-000000000008', 'pending',   '2026-03-25'),
  ('20000000-0000-4000-a000-000000000007', '10000000-0000-4000-a000-000000000009', 'completed', '2026-04-03'),
  ('20000000-0000-4000-a000-000000000008', '10000000-0000-4000-a000-000000000010', 'completed', '2026-04-15'),
  ('20000000-0000-4000-a000-000000000009', '10000000-0000-4000-a000-000000000011', 'completed', '2026-04-22'),
  ('20000000-0000-4000-a000-000000000010', '10000000-0000-4000-a000-000000000001', 'completed', '2026-05-04'),
  ('20000000-0000-4000-a000-000000000011', '10000000-0000-4000-a000-000000000002', 'completed', '2026-05-10'),
  ('20000000-0000-4000-a000-000000000012', '10000000-0000-4000-a000-000000000005', 'cancelled', '2026-05-19'),
  ('20000000-0000-4000-a000-000000000013', '10000000-0000-4000-a000-000000000006', 'completed', '2026-05-27'),
  ('20000000-0000-4000-a000-000000000014', '10000000-0000-4000-a000-000000000008', 'completed', '2026-06-01'),
  ('20000000-0000-4000-a000-000000000015', '10000000-0000-4000-a000-000000000009', 'completed', '2026-06-09'),
  ('20000000-0000-4000-a000-000000000016', '10000000-0000-4000-a000-000000000010', 'pending',   '2026-06-18'),
  ('20000000-0000-4000-a000-000000000017', '10000000-0000-4000-a000-000000000011', 'completed', '2026-06-26'),
  ('20000000-0000-4000-a000-000000000018', '10000000-0000-4000-a000-000000000001', 'completed', '2026-07-02'),
  ('20000000-0000-4000-a000-000000000019', '10000000-0000-4000-a000-000000000002', 'completed', '2026-07-08'),
  ('20000000-0000-4000-a000-000000000020', '10000000-0000-4000-a000-000000000004', 'completed', '2026-07-15'),
  ('20000000-0000-4000-a000-000000000021', '10000000-0000-4000-a000-000000000005', 'completed', '2026-07-22'),
  ('20000000-0000-4000-a000-000000000022', '10000000-0000-4000-a000-000000000006', 'cancelled', '2026-07-27')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  ('20000000-0000-4000-a000-000000000001', 'plan-giga-01', 1, 350000),
  ('20000000-0000-4000-a000-000000000002', 'acc-02', 2, 259000),
  ('20000000-0000-4000-a000-000000000003', 'plan-sky-01', 1, 399000),
  ('20000000-0000-4000-a000-000000000004', 'plan-giga-01', 1, 350000),
  ('20000000-0000-4000-a000-000000000004', 'acc-04', 1, 89000),
  ('20000000-0000-4000-a000-000000000005', 'plan-nova-01', 1, 299000),
  ('20000000-0000-4000-a000-000000000006', 'acc-05', 1, 349000),
  ('20000000-0000-4000-a000-000000000007', 'plan-giga-02', 1, 450000),
  ('20000000-0000-4000-a000-000000000008', 'plan-vina-01', 1, 199000),
  ('20000000-0000-4000-a000-000000000008', 'acc-01', 1, 149000),
  ('20000000-0000-4000-a000-000000000009', 'acc-02', 1, 259000),
  ('20000000-0000-4000-a000-000000000010', 'plan-giga-01', 1, 350000),
  ('20000000-0000-4000-a000-000000000011', 'plan-sky-02', 2, 149000),
  ('20000000-0000-4000-a000-000000000012', 'plan-sky-01', 1, 399000),
  ('20000000-0000-4000-a000-000000000013', 'acc-03', 1, 399000),
  ('20000000-0000-4000-a000-000000000014', 'plan-giga-02', 1, 450000),
  ('20000000-0000-4000-a000-000000000015', 'acc-04', 3, 89000),
  ('20000000-0000-4000-a000-000000000016', 'plan-nova-01', 1, 299000),
  ('20000000-0000-4000-a000-000000000017', 'acc-05', 1, 349000),
  ('20000000-0000-4000-a000-000000000017', 'acc-01', 1, 149000),
  ('20000000-0000-4000-a000-000000000018', 'plan-giga-01', 1, 350000),
  ('20000000-0000-4000-a000-000000000019', 'plan-vina-01', 1, 199000),
  ('20000000-0000-4000-a000-000000000020', 'acc-02', 1, 259000),
  ('20000000-0000-4000-a000-000000000021', 'plan-sky-01', 1, 399000),
  ('20000000-0000-4000-a000-000000000022', 'acc-03', 1, 399000)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
  variant_selections JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  -- Snapshot of the price at add-to-cart time, not a live lookup — so a
  -- later price change on the product doesn't retroactively change what's
  -- already sitting in someone's cart.
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- orders.id was only ever populated with explicit UUIDs in the seed data;
-- checkout needs to generate one itself.
ALTER TABLE orders ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- A couple of sample cart rows for the demo admin account, purely for
-- convenience while testing the Cart page.
INSERT INTO cart_items (user_id, product_id, variant_selections, quantity, unit_price)
SELECT id, 'plan-giga-01', '{"duration":"v3"}'::jsonb, 1, 320000 FROM users WHERE email = 'admin@mfa.dev'
UNION ALL
SELECT id, 'acc-04', '{"length":"2m"}'::jsonb, 2, 109000 FROM users WHERE email = 'admin@mfa.dev';
