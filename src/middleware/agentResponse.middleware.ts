import * as Boom from '@hapi/boom';
import { ResponseToolkit } from '@hapi/hapi';
import { Request } from '@/types/request';
import AgentResponseService from '@/services/AgentResponseService';

export const remove = {
  assign: 'DELETE',
  method: async (request: Request, h: ResponseToolkit) => {
    try {
      const result = await AgentResponseService.checkUser(request);
      if (!result) {
        throw new Boom.Boom(
          'User have not authorized to delete agent response',
          {
            statusCode: 401
          }
        );
      }
      return h.continue;
    } catch (err) {
      request.logger.error('Error in user.middleware.admin', err);
      throw Boom.unauthorized('You have not delete this response');
    }
  }
};
