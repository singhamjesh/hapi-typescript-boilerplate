import { Server } from '@hapi/hapi';
import { responseCodes } from '@/utils/respSchemaHandler';
import AgentResponseController from '@/controllers/AgentResponseController';
import {
  createSchema,
  updateSchema,
  webhookSchema,
  agentParams
} from '@/validator/agentResponse';
import { idSchema } from '@/validator/common';
import { remove } from '@/middleware/agentResponse.middleware';

export default {
  plugin: {
    register(server: Server) {
      server.route([
        {
          method: 'POST',
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
            tags: ['api', 'AgentResponse'],
            pre: [],
            validate: { payload: createSchema },
            handler: AgentResponseController.create,
            description: `To call given agent`
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
            tags: ['api', 'AgentResponse'],
            pre: [],
            validate: { payload: updateSchema, params: idSchema },
            handler: AgentResponseController.patch,
            description: `To Update agent`
          }
        }
      ]);
      server.route([
        {
          method: 'POST',
          path: '/{agentName}/webhook',
          options: {
            plugins: {
              'hapi-swagger': {
                // security: [
                //   {
                //     AUTH0_TOKEN: []
                //   }
                // ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            auth: false,
            tags: ['api', 'AgentResponse'],
            pre: [],
            validate: { payload: webhookSchema, params: agentParams },
            handler: AgentResponseController.agentWebhook,
            description: `To Webhook agent`
          }
        }
      ]);
      server.route([
        {
          method: 'GET',
          path: '/groupby',
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
            tags: ['api', 'AgentResponse'],
            pre: [],
            validate: {},
            handler: AgentResponseController.groupByGenerateDate,
            description: `To get agent response data group by date`
          }
        }
      ]);
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
            tags: ['api', 'AgentResponse'],
            pre: [],
            validate: {},
            handler: AgentResponseController.fetch,
            description: `To get agent response data fetched`
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
            tags: ['api', 'AgentResponse'],
            pre: [<any>remove],
            validate: { params: idSchema },
            handler: AgentResponseController.delete,
            description: `To delete agent response`
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'agentResponse'
  }
};
