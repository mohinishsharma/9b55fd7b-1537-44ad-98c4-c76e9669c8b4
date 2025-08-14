import z from "zod/v4"

export const deviceSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(2).max(100),
    timezone: z.string().min(2).max(100)
});
export type Device = z.infer<typeof deviceSchema>;

export const createDeviceSchema = deviceSchema.omit({ id: true });
export type CreateDevice = z.infer<typeof createDeviceSchema>;
