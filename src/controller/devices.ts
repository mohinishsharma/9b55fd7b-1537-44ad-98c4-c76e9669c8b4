import { RequestHandler } from "express";
import * as deviceModel from "../model/device";

/**
 * Get List of devices
 * @param req - The request object.
 * @param res - The response object.
 */
export const getListOfDevices: RequestHandler = async (_, res) => {
    try {
        const devices = await deviceModel.getAllDevices();
        res.json({ devices });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: (error as Error).message });
    }
}