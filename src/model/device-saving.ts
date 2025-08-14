import { RowDataPacket } from "mysql2";
import pool from "../service/mysql";

/**
 * Options for querying device savings data.
 */
export interface DeviceSavingOptions {
    /**
     * The start date for filtering device savings.
     */
    startDate?: Date;
    /**
     * The end date for filtering device savings.
     */
    endDate?: Date;
    /**
     * The aggregation level for the results.
     */
    aggregated?: "daily" | "monthly" | "yearly";
    /**
     * The maximum number of results to return.
     */
    limit?: number;
}

/**
 * Aggregated device saving data.
 */
export interface AggregatedDeviceSaving {
    /**
     * The ID of the device.
     */
    deviceId: string;
    /**
     * The total carbon saving for the device.
     */
    totalCarbonSaving: number;
    /**
     * The total fuel saving for the device.
     */
    totalFuelSaving: number;
    /**
     * The period for the aggregated data.
     */
    period: Date;
}

/**
 * Get savings data for a specific device.
 * @param deviceId The ID of the device.
 * @param options Query options for filtering and aggregation.
 * @returns An array of device saving records.
 */
export async function getSavingsForDevice(deviceId: string, options: DeviceSavingOptions = {}): Promise<AggregatedDeviceSaving[]> {
    const { startDate, endDate, limit, aggregated = "daily" } = options;

    const groupBy = aggregated ? `GROUP BY DATE_FORMAT(timestamp, '${aggregated === "daily" ? "%Y-%m-%d" : aggregated === "monthly" ? "%Y-%m" : "%Y"}')` : '' ;

    const query = `
        SELECT
            device_id,
            SUM(carbon_saved) AS total_carbon_saving,
            SUM(fuel_saved) AS total_fuel_saving,
            DATE_FORMAT(timestamp, '${aggregated === "daily" ? "%Y-%m-%d" : aggregated === "monthly" ? "%Y-%m" : "%Y"}') AS period
        FROM device_savings
        WHERE device_id = ?
        ${startDate ? 'AND timestamp >= ?' : ''}
        ${endDate ? 'AND timestamp <= ?' : ''}
        ${groupBy}
        ${limit ? 'LIMIT ?' : ''}
    `;

    const params: (string | Date | number)[] = [deviceId];
    if (startDate) {
        params.push(startDate);
    }
    if (endDate) {
        params.push(endDate);
    }
    if (limit) {
        params.push(limit);
    }

    const [rows] = await pool().query<RowDataPacket[]>(query, params);
    return rows.map(row => ({
        deviceId: row.device_id,
        totalCarbonSaving: row.total_carbon_saving,
        totalFuelSaving: row.total_fuel_saving,
        period: new Date(row.period as string)
    }));
}

export interface EstimatedSaving {
    carbonSaving: {
        total: number;
        monthlyAvg: number;
    };
    fuelSaving: {
        total: number;
        monthlyAvg: number;
    };
}

/**
 * Get the estimated saving for a specific device. (monthly avg and total)
 * @param deviceId The ID of the device.
 * @returns The estimated saving. (monthly avg and total)
 */
export async function getEstimatedSaving(deviceId: string): Promise<EstimatedSaving> {
    const query = `
        SELECT
            SUM(carbon_saved) AS total_carbon_saving,
            SUM(fuel_saved) AS total_fuel_saving,
            DATE_FORMAT(timestamp, '%Y-%m') AS month
        FROM device_savings
        WHERE device_id = ?
        GROUP BY month
    `;
    const [rows] = await pool().query<RowDataPacket[]>(query, [deviceId]);
    return {
        carbonSaving: {
            total: rows.reduce((sum, row) => sum + Number(row.total_carbon_saving || 0), 0),
            monthlyAvg: rows.length > 0 ? rows.reduce((sum, row) => sum + Number(row.total_carbon_saving || 0), 0) / rows.length : 0
        },
        fuelSaving: {
            total: rows.reduce((sum, row) => sum + Number(row.total_fuel_saving || 0), 0),
            monthlyAvg: rows.length > 0 ? rows.reduce((sum, row) => sum + Number(row.total_fuel_saving || 0), 0) / rows.length : 0
        }    
    };
}