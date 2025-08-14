import { Router } from "express";
import { loadSavingsRoute } from "./savings";
import { loadHealthRoutes } from "./health";
import { loadDevicesRoute } from "./device";


export function loadRoutes(router: Router): void {
    loadHealthRoutes(router);
    loadSavingsRoute(router);
    loadDevicesRoute(router);
}