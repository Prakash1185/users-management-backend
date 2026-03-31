import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  logger.debug({
    query: e.query,
    params: e.params,
    duration: `${e.duration}ms`,
  });
});

prisma.$on('error', (e) => {
  logger.error({
    target: e.target,
    message: e.message,
  });
});

prisma.$on('warn', (e) => {
  logger.warn({
    target: e.target,
    message: e.message,
  });
});

prisma.$on('info', (e) => {
  logger.info({
    target: e.target,
    message: e.message,
  });
});

export default prisma;
