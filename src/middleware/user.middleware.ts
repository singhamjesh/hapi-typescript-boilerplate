import * as Boom from '@hapi/boom';
import { ResponseToolkit } from '@hapi/hapi';
import { Request } from '@/types/request';
import AuthService from '@/services/AuthService';

/**
 * This method is called for check user has admin role or not
 * Its call to auth0 and get permission according to user roles.
 * Its work like middleware
 * pre is emit before handler method
 */
export const admin = {
  assign: 'ADMIN',
  method: async (request: Request, h: ResponseToolkit) => {
    try {
      /* Check API write permission from auth0 according to user auth0 id */
      await AuthService.isAdmin(request);
      return h.continue;
    } catch (err) {
      request.logger.error('Error in user.middleware.admin', err);
      throw Boom.unauthorized(
        'You have not a admin role. Please contact to auth0 manager!'
      );
    }
  }
};
