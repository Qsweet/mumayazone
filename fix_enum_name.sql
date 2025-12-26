-- Rename Enum Type to match Prisma Schema expectation (UserRole)
-- Postgres 42804 error: column "role" is of type user_role but expression is of type "UserRole"
-- This implies Prisma is sending ::"UserRole" casting.

ALTER TYPE user_role RENAME TO "UserRole";
