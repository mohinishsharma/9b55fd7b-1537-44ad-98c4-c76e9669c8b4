/* eslint no-console: 0 */
import dotenv from 'dotenv';
dotenv.config({ quiet: true }); // Load environment variables
import pool from '../service/mysql';
import { Pool } from 'mysql2/promise';
import { createReadStream, PathLike } from 'fs';
import path from 'path';


async function createTables(p: Pool) {
    await p.query(`DROP TABLE IF EXISTS device_savings`);
    await p.query(`DROP TABLE IF EXISTS devices`);
    // Create devices table
    await p.query(`
        CREATE TABLE IF NOT EXISTS devices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            timezone VARCHAR(255) NOT NULL
        )
    `)

    // Create device_savings table
    await p.query(`
        CREATE TABLE IF NOT EXISTS device_savings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            device_id INT NOT NULL,
            carbon_saved DECIMAL(20, 17) NOT NULL,
            fuel_saved DECIMAL(20, 17) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            device_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (device_id) REFERENCES devices(id),
            INDEX (device_id),
            INDEX (timestamp),
            INDEX (device_timestamp)
        )
    `)
}

async function seedDevices(p: Pool, file: PathLike) {
    const neatCsv = (await import('neat-csv')).default;
    const readStream = createReadStream(file);
    const c = await neatCsv(readStream);
    for (const row of c) {
        await p.query(`
            INSERT INTO devices (id, name, timezone) VALUES
            (?, ?, ?)
        `, [row.id, row.name, row.timezone]);
    }
}

async function seedDeviceSavings(p: Pool, file: PathLike) {
    const neatCsv = (await import('neat-csv')).default;
    const readStream = createReadStream(file);
    const c = await neatCsv(readStream);
    const ps = [];
    for (const row of c) {
        ps.push(p.query(`
            INSERT INTO device_savings (device_id, carbon_saved, fuel_saved, timestamp, device_timestamp) VALUES
            (?, ?, ?, ?, ?)
        `, [row.device_id, row.carbon_saved, row.fueld_saved, row.timestamp.replace('T', ' ').replace('Z', ''), row.device_timestamp.replace('T', ' ').replace('Z', '')]));
    }
    if (ps.length > 0) {
        await Promise.all(ps);
    }
}

async function seedData() {
    console.clear();
    console.log("Seeding data...");
    const p = pool();
    await createTables(p);
    await seedDevices(p, path.join(__dirname,'../data/devices.csv'));
    await seedDeviceSavings(p, path.join(__dirname, '../data/device-saving.csv'));
}


seedData().then(() => {
    console.log("Seeding completed successfully.");
    process.exit(0);
}).catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});