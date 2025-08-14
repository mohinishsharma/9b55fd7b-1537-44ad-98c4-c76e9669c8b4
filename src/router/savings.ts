import { Router } from "express";
import { getSavingsForDevice, getOverallSavingsForDevice } from "../controller/savings";


/**
 * Load savings routes.
 * @param router - The Express router to load the savings routes into.
 */
export function loadSavingsRoute(router: Router): void {
    router.get("/savings/:id", getSavingsForDevice);
    router.get("/savings/:id/overall", getOverallSavingsForDevice);
}