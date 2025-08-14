import { Router } from "express";


/**
 * Load health check routes.
 * @param router The Express router instance.
 */
export function loadHealthRoutes(router: Router): void {
    router.get('/health', (_, res) => {
        res.json({ status: 'ok' });
    });
}