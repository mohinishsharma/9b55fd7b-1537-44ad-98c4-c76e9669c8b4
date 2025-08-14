import { Router } from "express";
import { getListOfDevices } from "../controller/devices";


/**
 * Load Devices routes.
 * @param router - The Express router to load the devices routes into.
 */
export function loadDevicesRoute(router: Router): void {
    router.get("/devices", getListOfDevices);
}