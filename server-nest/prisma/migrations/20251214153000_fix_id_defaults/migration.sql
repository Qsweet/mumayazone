-- Fix missing default values for ID columns
ALTER TABLE "blog_posts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "site_content" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Ensure extension is available (usually is, but good practice)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 
-- (Assuming PG13+ gen_random_uuid is built-in)
