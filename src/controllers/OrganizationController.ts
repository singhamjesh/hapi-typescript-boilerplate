import { ResponseToolkit } from '@hapi/hapi';
import { errorHandler } from '@/utils/errorHandler';
import { Request } from '@/types/request';
import { Organization } from '@/types/organization';
import OrganizationService from '@/services/OrganizationService';

class OrganizationController {
  /**
   * This method is called for create a Organization using given payload
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async create(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const payload = <Organization>request.payload;
      const user = request.user;
      const data = {
        profile: payload.profile,
        users: payload.users,
        agents: payload.agents,
        creator: user
      };
      const result = await OrganizationService.create(data);
      return h
        .response({
          statusCode: 200,
          message: 'Organization is created successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in OrganizationController.create', error);
      return errorHandler(error);
    }
  }

  /**
   * This method is called for paginate Organization document using Organization query
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async fetch(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const query = request.parsedQuery;
      const result = await OrganizationService.pagination(query);
      return h
        .response({
          statusCode: 200,
          message: 'Organization is retrieved successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in OrganizationController.read', error);
      return errorHandler(error);
    }
  }

  /**
   * This method is called for update Organization document using Organization id
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async update(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = request.params;
      const payload = <Organization>request.payload;
      const data = {
        $set: { profile: payload.profile },
        $push: { agents: payload.agents, users: payload.users }
      };
      const result = await OrganizationService.updateById(id, data);

      return h
        .response({
          statusCode: 200,
          message: 'Organization is updated successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in OrganizationController.update', error);
      return errorHandler(error);
    }
  }

  /**
   * This method is called for delete Organization document using Organization id
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async delete(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = request.params;
      const status = { status: 'inActive' };
      const result = await OrganizationService.updateById(id, status);
      return h
        .response({
          statusCode: 200,
          message: 'Organization is deleted successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in OrganizationController.delete', error);
      return errorHandler(error);
    }
  }
}

export default new OrganizationController();
