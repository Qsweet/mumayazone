
require('dotenv').config();
const { db } = require('./lib/db');
const { users } = require('./lib/db/schema');

async function main() {
    console.log('Fetching users...');
    const allUsers = await db.query.users.findMany({ limit: 1 });
    console.log('First User:', allUsers[0]);
    process.exit(0);
}

main().catch(console.error);
