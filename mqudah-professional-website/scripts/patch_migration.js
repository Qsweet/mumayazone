const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../lib/db/migrations');
const files = fs.readdirSync(migrationsDir);
const sqlFile = files.find(f => f.endsWith('.sql'));

if (!sqlFile) {
    console.error('No SQL migration file found in', migrationsDir);
    process.exit(1);
}

const filePath = path.join(migrationsDir, sqlFile);
console.log('Patching migration file:', filePath);
let content = fs.readFileSync(filePath, 'utf8');

// 0. Analyze for FKs to users to generate fix-up SQL
// Regex to capture: Table, ConstraintName, Column
const fkRegex = /ALTER TABLE "([^"]+)" ADD CONSTRAINT "([^"]+)" FOREIGN KEY \("([^"]+)"\) REFERENCES "public"\."users"\("id"\)/g;

let match;
let dropConstraintsSql = [];
let alterColumnsSql = [];

while ((match = fkRegex.exec(content)) !== null) {
    const table = match[1];
    const constraint = match[2];
    const column = match[3];

    // Drop Constraint if exists
    dropConstraintsSql.push(`
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = '${constraint}' AND table_name = '${table}') THEN
        ALTER TABLE "${table}" DROP CONSTRAINT "${constraint}";
    END IF;`);

    // Alter Column if table exists
    alterColumnsSql.push(`
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}' AND table_schema = 'public') THEN
        ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE text USING "${column}"::text;
    END IF;`);
}

// Construct the Pre-Fix Block
const fixBlock = `
-- AUTO-GENERATED FIX FOR UUID -> TEXT MIGRATION (ROBUST EXISTENCE CHECKS)
DO $$ 
BEGIN
    -- 1. Drop Default on users.id (if users table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
    END IF;
    
    -- 2. Drop PK on users (Cascades to referencing FKs not caught by regex)
    IF EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'users_pkey' AND table_name = 'users') THEN
        ALTER TABLE "users" DROP CONSTRAINT "users_pkey" CASCADE;
    END IF;
    
    -- 3. Alter known referencing columns to text (Generated from Migration File)
    -- Safe checks generated above
    ${alterColumnsSql.join('\n    ')}
    
    -- 4. Alter Users PK to text
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE "users" ALTER COLUMN "id" TYPE text USING "id"::text;
        
        -- 5. Re-Add Primary Key
        ALTER TABLE "users" ADD PRIMARY KEY ("id");
    END IF;
    
    -- Note: No Exception Swallowing! Let it crash if logic is wrong.
END $$;
--> statement-breakpoint
`;

// 1. Tables: CREATE TABLE " -> CREATE TABLE IF NOT EXISTS "
content = content.replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "');

// 2. Constraints & Enums: ALTER TABLE / CREATE TYPE ... ; -> DO $$ ... END $$;
const lines = content.split('\n');
const newLines = lines.map(line => {
    let sql = line.trim();
    // Check for ALTER TABLE or CREATE TYPE
    if (sql.startsWith('ALTER TABLE "') || sql.startsWith('CREATE TYPE "')) {
        let suffix = '';
        if (sql.includes('--> statement-breakpoint')) {
            const parts = sql.split('--> statement-breakpoint');
            sql = parts[0].trim();
            suffix = '--> statement-breakpoint' + (parts[1] || '');
        }

        if (!sql.endsWith(';')) sql += ';';

        // Wrap in idempotent block (safe duplicate handling)
        return `DO $$ BEGIN\n ${sql}\nEXCEPTION\n WHEN duplicate_object THEN null;\nEND $$;${suffix}`;
    }
    return line;
});

// Prepend the fix block
const finalContent = fixBlock + newLines.join('\n');

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log(`Migration patched: ${dropConstraintsSql.length} FKs handled.`);
