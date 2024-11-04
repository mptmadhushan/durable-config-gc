const df = require('durable-functions');
const { Client: PgClient } = require('pg');
const mysql = require('mysql2/promise');

df.app.activity('FetchAndStoreData', {
    handler: async (input) => {
        const { dbType, dbUrl, port, user, password, database, fetchQuery, fetchParams, storeQuery, storeParams } = input.metaData;

        let client;
        let fetchResult;

        try {
            if (dbType === 'postgres') {
                client = new PgClient({
                    host: dbUrl,
                    port: port,
                    user: user,
                    password: password,
                    database: database
                });
                await client.connect();
                const fetchRes = await client.query(fetchQuery, fetchParams);
                fetchResult = fetchRes.rows;

                // Store data
                await client.query(storeQuery, storeParams);
                await client.end();
            } else if (dbType === 'mysql') {
                client = await mysql.createConnection({
                    host: dbUrl,
                    port: port,
                    user: user,
                    password: password,
                    database: database
                });
                const [fetchRows] = await client.execute(fetchQuery, fetchParams);
                fetchResult = fetchRows;

                // Store data
                await client.execute(storeQuery, storeParams);
                await client.end();
            } else {
                throw new Error(`Unsupported database type: ${dbType}`);
            }
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }

        return fetchResult;
    },
});