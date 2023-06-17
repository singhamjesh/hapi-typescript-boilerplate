import { Server } from '@hapi/hapi';
import { responseCodes } from '@/utils/respSchemaHandler';
import AgentController from '@/controllers/AgentController';
import { agentsSchema, updateSchema } from '@/validator/agent';
import { admin } from '@/middleware/user.middleware';
import { idSchema } from '@/validator/common';

export default {
  plugin: {
    register(server: Server) {
      server.route([
        {
          method: 'GET',
          path: '/',
          options: {
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            tags: ['api', 'Agent'],
            pre: [],
            validate: {},
            handler: AgentController.fetch,
            description: `To get agents`
          }
        }
      ]);
      server.route([
        {
          method: 'POST',
          path: '/create',
          options: {
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            pre: [<any>admin],
            tags: ['api', 'Agent'],
            validate: { payload: agentsSchema },
            handler: AgentController.createAgents,
            description: `To insert agents`
          }
        }
      ]);
      server.route([
        {
          method: 'PATCH',
          path: '/{id}',
          options: {
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            pre: [<any>admin],
            tags: ['api', 'Agent'],
            validate: { payload: updateSchema, params: idSchema },
            handler: AgentController.patch,
            description: `To Update agents`
          }
        }
      ]);
      server.route([
        {
          method: 'DELETE',
          path: '/{id}',
          options: {
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            pre: [<any>admin],
            tags: ['api', 'Agent'],
            validate: { params: idSchema },
            handler: AgentController.delete,
            description: `To Delete agents`
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'agent'
  }
};
