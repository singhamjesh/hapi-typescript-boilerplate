import { Request } from '@/types/request';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { find, get } from 'lodash';
import Boom from '@hapi/boom';
import CacheInterface from '@/config/nodeFileCache';
import BaseService from './BaseService';

class AuthService extends BaseService {
  /**
   * AuthService constructor
   */
  constructor() {
    super();
  }

  /**
   * This method called auth0 and fetch management token using client credentials
   * After getting token store in <root>/store.json file and return to called function
   *
   * @return {Promise<any>} auth0 access_token
   */
  async authM2MToken(): Promise<any> {
    try {
      this.log('info', 'AuthService authM2MToken() called!');
      const cache = CacheInterface.getInstance();
      let m2mAccessToken = cache.get('m2m_access_token');

      if (!m2mAccessToken) {
        const response = await axios({
          method: 'POST',
          url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
          headers: { 'content-type': 'application/json' },
          data: {
            client_id: process.env.M2M_CLIENT_ID,
            client_secret: process.env.M2M_CLIENT_SECRET,
            audience: process.env.M2M_AUDIENCE, // need to change for player state
            grant_type: 'client_credentials'
          }
        });

        const decoded: any = jwtDecode(response.data.access_token);
        m2mAccessToken = response.data.access_token;

        const tokenExpiry =
          (new Date(decoded.exp * 1000).getTime() - new Date().getTime()) /
          1000;

        cache.set('m2m_access_token', m2mAccessToken, { life: tokenExpiry });

        this.log('info', `Generate new M2M token and store in cache.`);
      }
      this.log('info', `Get machine to machine token`);

      return m2mAccessToken;
    } catch (error: any) {
      this.log('error', `Error in AuthService.authM2MToken: ${error}`);
      throw new Boom.Boom(error, { statusCode: 403 });
    }
  }

  /**
   * This method is responsible for check user has admin role or not
   * Fetch auth0 roles using M2M auth0 token and check user has admin role.
   *
   * @param {Hapi request obj} request - hapi request object
   * @return {boolean} true/false
   */
  async isAdmin(request: Request) {
    this.log('info', 'AuthService isAdmin() called!');

    /* Get Auth0 management to management API token */
    const m2mToken = await this.authM2MToken();

    /* Get Auth0 user role by user auth0 id */
    const userRoles = await this.Auth0UserRoles(request.user.auth0Id, m2mToken);

    if (userRoles.length > 0 && find(userRoles, { name: 'admin' })) {
      this.log('info', 'User has admin role!');
      return true;
    }
    this.log('error', 'User has not assign auth0 admin role!');

    throw new Boom.Boom('User has not assign auth0 admin role', {
      statusCode: 401
    });
  }

  /**
   * This method is responsible for fetch user roles from Auth0
   * Fetch auth0 roles using M2M auth0 token
   *
   * @param {string | undefined} auth0Id - clint auth0Id
   * @param {string} m2mToken - Auth0 M2M token
   * @return {Array} user auth0 roles[]
   */
  async Auth0UserRoles(auth0Id: string | undefined, m2mToken: string) {
    try {
      this.log('info', 'AuthService Auth0UserRoles() called!');
      const result = await axios({
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0Id}/roles`,
        headers: {
          Authorization: `Bearer ${m2mToken}`
        }
      });

      this.log('info', 'Get user auth0 roles!');

      return get(result, 'data', []);
    } catch (error: any) {
      this.log(
        'error',
        `Getting error in AuthService.Auth0UserRoles: ${JSON.parse(error)}`
      );
      this.handleError(error);
    }
  }

  /**
   * This method is responsible for fetch user roles from Auth0 and check given role is exist or not
   *
   * @param {Hapi request obj} request - hapi request object
   * @param {string} role - user role
   * @return {boolean} true/false
   */
  async isRoleExist(request: Request, role: string) {
    try {
      this.log('info', 'AuthService.isRoleExist method called!');
      /* Get Auth0 management to management API token */
      const m2mToken = await this.authM2MToken();

      /* Get Auth0 user role by user auth0 id */
      const userRoles = await this.Auth0UserRoles(
        request.user.auth0Id,
        m2mToken
      );
      if (find(userRoles, { name: role })) {
        this.log('info', `User has ${role} role!`);
        return true;
      }
      this.log('error', `User has not assign auth0 ${role} role!`);
      throw new Boom.Boom('Unauthorized access', { statusCode: 401 });
    } catch (error: any) {
      this.log(
        'error',
        `Error in AuthService.isRoleExist: ${JSON.parse(error)}`
      );
      throw new Boom.Boom(error, { statusCode: 401 });
    }
  }
}

export default new AuthService();
