const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5433/mqudah_db'
});

async function main() {
    try {
        console.log('Connecting to', client.connectionParameters.database);
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Time:', res.rows[0]);
        await client.end();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

main();
