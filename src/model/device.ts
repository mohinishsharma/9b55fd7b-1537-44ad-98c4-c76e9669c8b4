import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CreateDevice, Device } from "../schema/device";
import pool from "../service/mysql";

/**
 * Creates a new device in the database.
 * @param data The device data to insert.
 * @returns The created device with its ID.
 */
export async function createDevice(data: CreateDevice): Promise<Device> {
    const [result] = await pool().query<ResultSetHeader>('INSERT INTO devices SET ?', data);
    return {
        id: result.insertId,
        ...data
    };
}

/**
 * Retrieves a device by its ID.
 * @param id The ID of the device to retrieve.
 * @returns The device with the specified ID, or null if not found.
 */
export async function getDeviceById(id: number): Promise<Device | null> {
    const [rows] = await pool().query<RowDataPacket[]>('SELECT * FROM devices WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
        return null;
    }
    return rows[0] as unknown as Device; // Type assertion
}

/**
 * Retrieves all devices from the database.
 * @returns An array of all devices.
 */
export async function getAllDevices(): Promise<Device[]> {
    const [rows] = await pool().query<RowDataPacket[]>('SELECT * FROM devices');
    return rows as unknown as Device[];
}