import dotenv from 'dotenv';
dotenv.config({ quiet: true }); // Load environment variables

import { loadConfig } from './config';
import logger from './logger';
import express from 'express';
import { loadRoutes } from './router';
import { loadMiddleware } from './middleware';

function bootstrap() {
    const config = loadConfig(); // Load and validate configuration
    
    logger.info(`Application starting in ${config.NODE_ENV} mode`);
    
    const app = express();
    
    loadMiddleware(app); // Load middleware into the Express application
    
    loadRoutes(app.router); // Load routes into the Express application
    
    app.listen(3000, (err) => {
        if (err) {
            logger.error(`Failed to start server: ${err.message}`);
            process.exit(1);
        }
        logger.info(`Server listening on port 3000`);
    });
}


bootstrap(); // Start the application

