-- Fix missing default values for ID columns in Workshops and Courses
ALTER TABLE "workshops" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "courses" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
