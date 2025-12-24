-- Fix missing default values for updated_at columns
ALTER TABLE "workshops" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "courses" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
