/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import * as Hapi from '@hapi/hapi';
import Socket from '@/config/socket';
import Logger from '@/config/logger';
import plugins from './plugin';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const origin = process.env.ALLOWED_ORIGIN || '*';

/**
 * Configure server with
 * HOST, PORT, Router, Routes, cors, validation
 * You can add if you want to add new configuration
 */
const server: any = new Hapi.Server({
  port: process.env.APP_PORT,
  host: process.env.APP_HOST,
  router: {
    stripTrailingSlash: true,
    isCaseSensitive: false
  },
  debug: false,
  routes: {
    security: {
      hsts: false,
      noOpen: true,
      noSniff: true,
      xframe: 'deny'
    },
    cors: {
      origin: origin.split(','),
      headers: ['Accept', 'Authorization', 'Content-Type']
    },
    validate: {
      failAction: (request, h, err) => {
        request.server.log(
          ['validation', 'error'],
          'Joi throw validation error'
        );
        throw err;
      }
    }
  }
});

/**
 * Initialize server with
 */
export const init = async (): Promise<Hapi.Server> => {
  await server.register(plugins);
  await server.initialize();
  Logger.createLogger(server.logger);
  return server;
};

/**
 * Server start
 * Do not use in test environment
 */
export const start = async (): Promise<Hapi.Server> => {
  await Socket.createInstance(server.listener);
  await server.start();
  return server;
};

/**
 * Handle Uncaught Exception
 */
process.on('uncaughtException', (err) => {
  console.error(err, 'Uncaught exception');
  process.exit(1);
});

/**
 * Handle Unhandled Rejection
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    {
      promise,
      reason
    },
    'unhandledRejection'
  );
  process.exit(1);
});
