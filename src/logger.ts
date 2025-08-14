import pino from 'pino';

/**
 * Logger configuration using Pino.  
 * This logger is set up to use pretty printing for development purposes.  
 * It will log messages with a default level of 'info', which can be overridden by the LOG_LEVEL environment variable.
 */
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    },
    level: process.env.LOG_LEVEL || 'info'
});

export default logger;
