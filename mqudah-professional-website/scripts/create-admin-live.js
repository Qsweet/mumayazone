
const { Client } = require('pg');
require('dotenv').config({ path: '.env' }); // Try to load .env if available

// hardcoded hash for "MqudahAdmin2025!" (generated locally to be safe, or we can use bcryptjs if installed)
// bcryptjs is in dependencies, so we can use it!
const bcrypt = require('bcryptjs');

async function main() {
    console.log("Connecting to DB...");

    // Fallback to local default if env missing (common on VPS if not loaded)
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mqudah_db";

    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();

        const email = "admin_e2e@mqudah.com";
        const password = "MqudahAdmin2025!";

        // Check Enum Values - SKIPPED (Case sensitivity issues, assuming 'admin' works after patch)
        // const enumRes = await client.query("SELECT unnest(enum_range(NULL::user_role)) as val");
        // const allowed = enumRes.rows.map(r => r.val);
        // console.log("Allowed Roles:", allowed);

        // Since we patched the enum, we force "admin"
        const roleToUse = "admin";
        console.log(`Using Role: ${roleToUse}`);

        console.log(`Hashing password for ${email}...`);
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Upserting Admin User...");

        // We need to handle the ID. Since it's text, we generate a UUID-like string or use a crypto lib.
        // Node's crypto is built-in.
        const crypto = require('crypto');
        const id = crypto.randomUUID();

        const query = `
            INSERT INTO users (id, name, email, password_hash, role, is_verified, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
            ON CONFLICT (email) 
            DO UPDATE SET role = $5, password_hash = $4, updated_at = NOW()
            RETURNING id, role;
        `;

        const values = [id, "Mqudah Admin", email, hashedPassword, roleToUse];

        const res = await client.query(query, values);
        console.log("✅ Success! Admin Updated/Created:", res.rows[0]);

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await client.end();
    }
}

main();
