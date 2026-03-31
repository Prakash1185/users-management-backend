import { buildApp } from './app';
import config from './config';
import logger from './utils/logger';

const start = async (): Promise<void> => {
  try {
    const app = await buildApp();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    logger.info(`Server is running on http://${config.host}:${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://${config.host}:${config.port}/health`);
    logger.info(`API v1: http://${config.host}:${config.port}/api/v1`);

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully...`);
      await app.close();
      logger.info('Server closed');
      process.exit(0);
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
  } catch (err) {
    console.error('Error starting server:', err);
    logger.error('Error starting server:', err);
    process.exit(1);
  }
};

void start();
