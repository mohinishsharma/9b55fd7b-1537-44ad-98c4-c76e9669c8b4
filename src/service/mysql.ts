import { createPool } from 'mysql2/promise'
import { loadConfig } from '../config';


/**
 * MySQL database connection pool.  
 * Connection pool is created due to the need for efficient database access.
*/
let pool: ReturnType<typeof createPool> | null = null;

/**
 * Get MySQL database connection pool.
 * @returns {Promise<Pool>} The MySQL connection pool.
 */
export default function getPool() {
    const config = loadConfig(); // Load and validate configuration
    if (!pool) {
        pool = createPool({
            host: config.MYSQL_HOST,
            port: config.MYSQL_PORT,
            user: config.MYSQL_USER,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DATABASE
        });
    }
    return pool;
};
