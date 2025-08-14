import { Application } from "express";
import express from "express";
import cors from "cors";
import { loadConfig } from "../config";

/**
 * Load middleware for the Express application.
 * @param app The Express application instance.
 */
export function loadMiddleware(app: Application): Application {
    const config = loadConfig();
    app.use(cors({ origin: config.CORS_ORIGIN }));
    app.use(express.json({ limit: '1mb' })); // Middleware to parse JSON requests
    app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

    return app;
}