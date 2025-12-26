-- Switch users.role to use "UserRole" type
-- Fixes code 42804 mismatch

BEGIN;

-- 1. Drop default constraint first (to avoid type conflict during cast)
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- 2. Alter column type with casting
-- Note: 'user', 'admin', 'instructor' (lowercase) values in the column must be mapped!
-- BUT I already updated the rows to uppercase earlier (Step 2186).
-- So all rows should have STUDENT, ADMIN, INSTRUCTOR.
ALTER TABLE users 
  ALTER COLUMN role 
  TYPE "UserRole" 
  USING role::text::"UserRole";

-- 3. Restore default value using NEW type
ALTER TABLE users 
  ALTER COLUMN role 
  SET DEFAULT 'STUDENT'::"UserRole";

COMMIT;
