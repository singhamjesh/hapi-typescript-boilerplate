import { isEmpty } from 'lodash';
import { ResponseToolkit } from '@hapi/hapi';
import { Request } from '@/types/request';
import UserService from '@/services/UserService';

class AuthController {
  /**
   * This method will verify the user after decoding jwt token present in header or query params
   * It is used as the validate function in hapi-jwt2-auth
   *
   * @param {any} decoded - decoded jwt token with payload
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async verifyAuthToken(
    decoded: any,
    request: Request,
    h: ResponseToolkit
  ): Promise<any> {
    try {
      /* find routes to skip user validation and return true */
      const skipRouts = process.env.SKIP_USER_VALIDATION_ON_ROUTES || '';
      const skipValidationForRoutes = skipRouts.split(',');
      if (skipValidationForRoutes.includes(request.path)) {
        return { isValid: true };
      }

      /* Get machine to machine token from auth0 */
      // const jwtToken = await AuthService.authM2MToken(request, '/user/detail');

      /* Get user profile data from curl request from activate-im server */
      const user = await UserService.getUserProfile(
        request.headers.authorization,
        decoded.email
      );

      if (isEmpty(user)) {
        return {
          isValid: false,
          response: h
            .response({
              error: 'User does not exists',
              message: 'User not found',
              statusCode: 404
            })
            .code(404)
        };
      }

      request.user = user;

      return { isValid: true };
    } catch (error: any) {
      request.logger.error('Error in AuthController.validateUserToken', error);
      return {
        isValid: false,
        response: h
          .response({
            error: `Internal server error: ${error}`,
            message: 'Something went wrong!',
            statusCode: 500
          })
          .code(500)
      };
    }
  }
}

export default new AuthController();
