import axios from 'axios';
import BaseService from './BaseService';

class UserService extends BaseService {
  /**
   * UserService constructor
   */
  constructor() {
    super();
  }

  /**
   * Get User data from the help of curl request from activate_im server
   *
   * @param {string} jwtToken auth0 jwt token
   * @param {string} loggedUserEmail logged user email id
   * @return {Promise<any>} User document from IM
   */
  async getUserProfile(jwtToken: string, loggedUserEmail: string) {
    try {
      this.log('info', 'UserService.getUserProfile method called!');

      const response: any = await axios({
        method: 'GET',
        url: `${process.env.IM_API_URL}v1/user/detail`,
        headers: {
          Authorization: `${jwtToken}`
        }
      });

      this.log(
        'info',
        `Fetch user data from ${process.env.IM_API_URL} server with user:${loggedUserEmail}`
      );

      return response.data.data;
    } catch (error) {
      this.log('error', `UserService.getUserProfile getting error: ${error}`);
      this.handleError(error);
    }
  }
}

export default new UserService();
