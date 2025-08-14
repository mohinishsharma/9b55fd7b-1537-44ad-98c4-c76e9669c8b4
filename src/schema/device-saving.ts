import z from "zod/v4";

export const deviceSavingSchema = z.object({
    id: z.number().min(1),
    timestamp: z.date(),
    deviceTimestamp: z.date(),
    carbonSaved: z.number().min(0),
    fuelSaved: z.number().min(0)
});
export type DeviceSaving = z.infer<typeof deviceSavingSchema>;

export const createDeviceSavingSchema = deviceSavingSchema.omit({ id: true });
