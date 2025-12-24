require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mqudah_db'
});

async function main() {
    await client.connect();

    const email = 'admin_e2e@mqudah.com';
    const password = 'MqudahAdmin2025!';
    const hash = bcrypt.hashSync(password, 10);

    // Check if exists
    const res = await client.query('SELECT id FROM users WHERE email = $1', [email]);

    if (res.rows.length === 0) {
        await client.query(`
            INSERT INTO users (id, name, email, password_hash, role, is_verified, permissions)
            VALUES (gen_random_uuid()::text, 'E2E Admin', $1, $2, 'admin', true, '["*"]')
        `, [email, hash]);
        console.log('E2E Admin created.');
    } else {
        // Update password/role to ensure it matches
        await client.query(`
            UPDATE users SET password_hash = $2, role = 'admin', is_verified = true, permissions = '["*"]'
            WHERE email = $1
        `, [email, hash]);
        console.log('E2E Admin updated.');
    }

    await client.end();
}

main().catch(console.error);
