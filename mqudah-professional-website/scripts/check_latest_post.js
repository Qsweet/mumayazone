
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function checkLatestPost() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT id, title, slug, is_published, created_at, updated_at 
            FROM blog_posts 
            ORDER BY created_at DESC 
            LIMIT 1;
        `);

        if (res.rows.length === 0) {
            console.log("No blog posts found.");
        } else {
            console.log("Latest Post:", res.rows[0]);
        }
    } catch (err) {
        console.error("Error querying database:", err);
    } finally {
        await client.end();
    }
}

checkLatestPost();
