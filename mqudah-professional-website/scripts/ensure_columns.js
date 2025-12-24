const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log("🔧 Running Column Assurance Script...");
    try {
        await client.connect();

        // Helper to add column if missing
        const ensureColumn = async (table, column, definition) => {
            const check = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = $1 AND column_name = $2
            `, [table, column]);

            if (check.rows.length === 0) {
                console.log(`➕ Adding missing column: ${table}.${column}`);
                await client.query(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`);
            } else {
                console.log(`✅ Column exists: ${table}.${column}`);
            }
        };

        // Users Columns
        await ensureColumn('users', 'is_mfa_enabled', 'BOOLEAN DEFAULT false');
        await ensureColumn('users', 'language_preference', "TEXT DEFAULT 'en'");
        await ensureColumn('users', 'phone', 'TEXT');
        await ensureColumn('users', 'updated_at', 'TIMESTAMP DEFAULT NOW()');

        console.log("✅ Schema columns verified.");

    } catch (err) {
        console.error("❌ Schema Fix Failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
