-- Users
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "language_preference" TEXT DEFAULT 'en';

-- Course Level Enum (Postgres syntax)
CREATE TYPE "course_level" AS ENUM ('beginner', 'intermediate', 'advanced');

-- Courses
ALTER TABLE "courses" ADD COLUMN "duration" TEXT NOT NULL DEFAULT '0h';
ALTER TABLE "courses" ADD COLUMN "level" "course_level" NOT NULL DEFAULT 'beginner';
