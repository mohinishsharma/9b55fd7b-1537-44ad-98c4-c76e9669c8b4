import { Router } from "express";
import { loadHealthRoutes } from "./health";


export function loadRoutes(router: Router): void {
    loadHealthRoutes(router);
}