import { Server, Request, ResponseToolkit } from '@hapi/hapi';

export default {
  plugin: {
    register(server: Server) {
      server.route([
        {
          method: 'GET',
          path: '/',
          options: {
            auth: false,
            tags: ['api', 'Health'],
            validate: {},
            pre: [],
            handler: function (request: Request, h: ResponseToolkit) {
              return h.response({
                statusCode: 200,
                message: `API health is good!`,
                data: 'API health is good!'
              });
            },
            description: `Check api health`
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'health'
  }
};
