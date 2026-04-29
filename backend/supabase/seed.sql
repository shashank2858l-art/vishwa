-- ============================================
-- SEED DATA — Development Only
-- ============================================
-- Run after schema.sql to populate initial data.

-- Admin user (password: Admin@12345 — bcrypt hash)
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'Platform Admin',
  'admin@grievance.gov.in',
  '+919999999999',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Sample validator
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'Trusted Validator',
  'validator@ngo.org',
  '+918888888888',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'validator'
) ON CONFLICT (email) DO NOTHING;

-- Sample NGO user
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'NGO Representative',
  'ngo@helpinghands.org',
  '+917777777777',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'ngo'
) ON CONFLICT (email) DO NOTHING;
