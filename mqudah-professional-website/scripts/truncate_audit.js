const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://admin:MqudahSecure2025!@127.0.0.1:5436/mqudah_v2_db?schema=public' });
client.connect()
    .then(() => {
        console.log('Connected');
        return client.query('TRUNCATE TABLE audit_logs CASCADE');
    })
    .then(() => {
        console.log('Truncated audit_logs');
        client.end();
    })
    .catch(e => {
        console.error(e);
        client.end();
    });
