/* eslint-disable indent */
import { Server } from '@hapi/hapi';
import AuthController from '@/controllers/AuthController';
import * as HapiSwagger from 'hapi-swagger';
import routes from '@/routes';
import jwksClient from 'jwks-rsa';
import pack from './package.json';

/**
 * This plugin responsible for authorized API
 * For authorization we use jwks-rsa and Auth0
 * By pass Auth0 in testing environment
 */
const authPlugin = {
  async register(server: Server) {
    const key =
      process.env.NODE_ENV === 'testing'
        ? process.env.TOKEN_SECRET
        : jwksClient.hapiJwt2KeyAsync({
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
          });

    const obj = {
      complete: true,
      key,
      validate: await AuthController.verifyAuthToken,
      headerKey: 'authorization',
      tokenType: 'Bearer',
      verifyOptions: {
        algorithms: process.env.NODE_ENV === 'testing' ? false : ['RS256']
      }
    };

    // configuring jwt authentication strategy for validation
    server.auth.strategy('jwt', 'jwt', obj);

    // setting default authentication strategy
    server.auth.default('jwt');

    // Add helper method to get request ip
    const getIP = function (request: any) {
      // We check the headers first in case the server is behind a reverse proxy.
      return (
        request.headers['x-real-ip'] ||
        request.headers['x-forwarded-for'] ||
        request.info.remoteAddress
      );
    };
    server.method('getIP', getIP, {});
  },
  name: 'authenticate',
  version: pack.version
};

/**
 * Implement swagger for api documentation
 * Set schemes ['http','https'] for options
 * Host is base url retrieve from env files
 * Grouping by tag name
 * If you want to configure auth in swagger uncomment securityDefinitions
 */
const swaggerOption: HapiSwagger.RegisterOptions = {
  schemes: [process.env.APP_SWAGGER_SCHEME || 'http'],
  host: process.env.APP_BASE_URL,
  grouping: 'tags',
  expanded: 'none',
  tags: [],
  info: {
    title: 'API Documentation',
    version: pack.version
  },
  securityDefinitions: {
    AUTH0_TOKEN: {
      description: 'Auth0 jwt token use for api authentication',
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

/**
 * Create plugin array with different-different plugin for register in server
 */
let plugins = [
  {
    plugin: require('hapi-auth-jwt2')
  },
  {
    plugin: authPlugin
  },
  {
    plugin: require('hapi-pino'),
    options: {
      redact: ['req.headers.authorization']
    }
  },
  {
    plugin: require('hapi-query-builder'),
    options: {
      defaultLimit: process.env.INIT_RECORD
    }
  },
  {
    plugin: require('@hapi/inert')
  },
  {
    plugin: require('@hapi/vision')
  },
  {
    plugin: HapiSwagger,
    options: swaggerOption
  }
];

/**
 * Register all routes in plugins
 * Simply add new routes in routes/index.js file for routing.
 */
plugins = plugins.concat(routes);

export default plugins;
