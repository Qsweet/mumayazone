-- Fix Enum Mismatch
-- Add uppercase values demanded by Prisma
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'STUDENT';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ADMIN';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'INSTRUCTOR';

-- Migrate existing data to uppercase
UPDATE users SET role = 'STUDENT' WHERE role::text = 'user';
UPDATE users SET role = 'ADMIN' WHERE role::text = 'admin';
UPDATE users SET role = 'INSTRUCTOR' WHERE role::text = 'instructor';
