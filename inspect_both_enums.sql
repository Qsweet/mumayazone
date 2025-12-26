-- Inspect both Enum types
SELECT t.typname, e.enumlabel 
FROM pg_enum e 
JOIN pg_type t ON e.enumtypid = t.oid 
WHERE t.typname IN ('user_role', 'UserRole')
ORDER BY t.typname;
