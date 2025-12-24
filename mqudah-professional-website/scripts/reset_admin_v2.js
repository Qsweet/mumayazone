const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log("Running Reset Admin Script (Direct JS)...");
    try {
        await client.connect();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('MqudahAdmin2025!', salt);

        // Insert or Update Admin - Ensure ID matches your desired Fixed ID
        const query = `
            INSERT INTO users (id, name, email, password_hash, role, is_verified)
            VALUES ('00000000-0000-0000-0000-000000000001', 'Mohammad Qudah', 'm.qudah@mqudah.com', $1, 'admin', true)
            ON CONFLICT (email) DO UPDATE SET password_hash = $1
        `;

        const res = await client.query(query, [hash]);
        console.log("✅ Admin password reset successfully.");

        // Self-Verification
        console.log("🔍 Running Self-Verification...");
        const verifyRes = await client.query("SELECT * FROM users WHERE email = 'm.qudah@mqudah.com'");
        if (verifyRes.rows.length === 0) {
            console.error("❌ Verification Failed: User not found after insert!");
            process.exit(1);
        }
        const user = verifyRes.rows[0];
        const isMatch = await bcrypt.compare('MqudahAdmin2025!', user.password_hash);

        if (isMatch) {
            console.log("✅ Self-Verification Passed: Password matches hash in DB.");
        } else {
            console.error("❌ Verification Failed: Hash mismatch!");
            console.error("Stored Hash:", user.password_hash);
            console.error("Generated Hash:", hash);
            process.exit(1);
        }
    } catch (err) {
        console.error("❌ Reset Failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}
main();
