import { ResponseToolkit } from '@hapi/hapi';
import { errorHandler } from '@/utils/errorHandler';
import { Request } from '@/types/request';
import { Agent, UpdateParams } from '@/types/agent';
import AgentService from '@/services/AgentService';
import { formatCreatorDetails } from '@/utils/helpers';
import { agentDetailsById } from '@/types/agent';
class AgentController {
  /**
   *This method is called for create agents
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async createAgents(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const payload = <Agent>request.payload;
      const user = request.user;
      const creator = formatCreatorDetails(user);
      const result = await AgentService.createAgents({ ...payload, creator });
      return h
        .response({
          statusCode: 200,
          message: 'Agents is created successfully!',
          result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in AgentController.createAgents', error);
      return errorHandler(error);
    }
  }

  /**
   *This method is called for paginate Agents document using agent query
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async fetch(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const query = request.parsedQuery;
      const result = await AgentService.pagination(query);
      return h
        .response({
          statusCode: 200,
          message: 'Agent fetched successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in AgentController.fetch', error);
      return errorHandler(error);
    }
  }

  /**
   *This method is called for update agent by admin
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async patch(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = <UpdateParams>request.params;
      const data = <agentDetailsById>request.payload;
      const result = await AgentService.patch(id, data);
      return h.response({
        statusCode: 200,
        message: 'Agent update successfully',
        data: result
      });
    } catch (error) {
      request.logger.error('Error in AgentController.patch', error);
      return errorHandler(error);
    }
  }

  /**
   *This method is called for delete agent by admin
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async delete(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = request.params;
      const result = await AgentService.deleteAgent(id);
      return h.response({
        statusCode: 200,
        message: 'Agent delete successfully',
        data: result
      });
    } catch (error) {
      request.logger.error('Error in AgentController.delete', error);
      return errorHandler(error);
    }
  }
}

export default new AgentController();
