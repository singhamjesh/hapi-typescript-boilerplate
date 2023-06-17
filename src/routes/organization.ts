import { Server } from '@hapi/hapi';
import { responseCodes } from '@/utils/respSchemaHandler';
import OrganizationController from '@/controllers/OrganizationController';
import { createSchema, updateSchema } from '@/validator/organization';
import { idSchema } from '@/validator/common';

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
            tags: ['api', 'Organization'],
            pre: [],
            validate: { payload: createSchema },
            handler: OrganizationController.create,
            description: `To create new organization`
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
            tags: ['api', 'Organization'],
            pre: [],
            validate: { payload: updateSchema, params: idSchema },
            handler: OrganizationController.update,
            description: `To update new organization`
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
            tags: ['api', 'Organization'],
            pre: [],
            validate: {},
            handler: OrganizationController.fetch,
            description: `To get a specific organization by ID`
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
            tags: ['api', 'Organization'],
            pre: [],
            validate: { params: idSchema },
            handler: OrganizationController.delete,
            description: `To delete specific organization by ID`
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'organization'
  }
};
