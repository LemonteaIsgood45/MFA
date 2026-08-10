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
