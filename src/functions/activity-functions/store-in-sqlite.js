const df = require('durable-functions');
const sqlite3 = require('sqlite3').verbose();

df.app.activity('StoreInSQLite', {
    handler: async (input) => {
        const dbName = input.metaData.dbName || 'data.db';
        const tableName = input.metaData.tableName || 'data';

        const db = new sqlite3.Database(dbName);

        db.serialize(() => {
            // Create table if it doesn't exist
            db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                jsonData TEXT
            )`);

            // Insert data
            const stmt = db.prepare(`INSERT INTO ${tableName} (jsonData) VALUES (?)`);
            stmt.run(JSON.stringify(input.results));
            stmt.finalize();
        });

        db.close();
    },
});