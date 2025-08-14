import z from "zod/v4";

/**
 * Configuration schema for the application.
 */
const configSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "staging"]),
    APP_PORT: z.coerce.number().min(1).max(65535),
    CORS_ORIGIN: z.url(),
    MYSQL_HOST: z.string(),
    MYSQL_PORT: z.coerce.number().min(1).max(65535),
    MYSQL_DATABASE: z.string(),
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().min(1).max(65535)
});

/**
 * Configuration type for the application.
 */
export type Config = z.infer<typeof configSchema>;

let config: Config | null = null;

/**
 * Load configuration from environment variables.
 * @returns {Config} The validated configuration.
 */
export function loadConfig(): Config {
    if (config) return config;
    const parsed = configSchema.safeParse(process.env);
    if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error("Invalid configuration:", JSON.stringify(parsed.error));
        process.exit(1);
    }
    config = parsed.data;
    return config;
}
