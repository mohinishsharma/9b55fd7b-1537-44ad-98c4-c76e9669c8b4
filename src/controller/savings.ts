import { RequestHandler } from "express";
import * as deviceSavingModel from "../model/device-saving";
import z from "zod/v4";
import dayjs from "dayjs";
import redis from "../service/redis";

/**
 * Get savings for a specific device.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getSavingsForDevice: RequestHandler = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const queryParamsSchema = z.object({
            startDate: z.iso.datetime().optional(),
            endDate: z.iso.datetime().optional(),
            limit: z.coerce.number().min(1).max(100).optional(),
            aggregated: z.enum(["daily", "monthly"]).optional()
        });
    
        const validationResult = queryParamsSchema.safeParse(req.query);
        if (!validationResult.success) {
            res.status(400).json({ error: "Invalid query parameters", details: validationResult.error.issues });
            return;
        }
    
        const { startDate, endDate, limit, aggregated } = validationResult.data;

        let autoAggregated = aggregated; // Keep track of the effective aggregation level

        if (startDate && endDate) {
            const startDateD = dayjs(startDate);
            const endDateD = dayjs(endDate);
            const diff = endDateD.diff(startDateD, "day");
            if (diff > 30) {
                autoAggregated = "monthly";
            }
        }
    
        // Fetch savings data for the device
        const savings = await deviceSavingModel.getSavingsForDevice(deviceId, {
            startDate: startDate ? new Date(startDate.toString()) : undefined,
            endDate: endDate ? new Date(endDate.toString()) : undefined,
            limit,
            aggregated: autoAggregated
        });
        res.json({ deviceId, savings });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: (error as Error).message });
    }
}

/**
 * Get overall savings for a specific device.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getOverallSavingsForDevice: RequestHandler = async (req, res) => {
    try {
        const deviceId = req.params.id;
        // check cache
        const cachedOverallSavings = await redis().get(`overall_savings:${deviceId}`);
        if (cachedOverallSavings) {
            return res.json({ deviceId, overallSavings: JSON.parse(cachedOverallSavings) });
        }
        const overallSavings = await deviceSavingModel.getEstimatedSaving(deviceId);
        redis().setex(`overall_savings:${deviceId}`, 3600, JSON.stringify(overallSavings)); // Cache for 1 hour
        res.json({ deviceId, overallSavings });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: (error as Error).message });
    }
}
