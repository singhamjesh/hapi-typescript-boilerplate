import moment from 'moment';
import { isEmpty, get } from 'lodash';
import { ResponseToolkit } from '@hapi/hapi';
import { errorHandler } from '@/utils/errorHandler';
import { Request } from '@/types/request';
import AgentResponseService from '@/services/AgentResponseService';
import AgentService from '@/services/AgentService';
import { formatCreatorDetails } from '@/utils/helpers';
import { emitSocketOnLoginClientRoom } from '@/utils/socketHandler';

class AgentResponseController {
  /**
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @returns {Promise<any>} hapi response
   */
  async create(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const user = request.user;
      const payload: any = request.payload;

      /* Find agent by agent id */
      const agent = await AgentService.findById(payload.agentId);

      /** Check Agent not empty */
      if (isEmpty(agent)) {
        return h
          .response({
            statusCode: 404,
            error: 'record_doesnot_exist',
            message: 'Agent does not exist'
          })
          .code(404);
      }

      /* Save Agent name details, payload url, Creator details */
      const result = await AgentResponseService.create({
        agent,
        url: payload.url,
        creator: formatCreatorDetails(user)
      });

      /* Axios call for send data for agents  */
      AgentResponseService.agentCalled(
        agent.url,
        {
          id: result._id,
          url: payload.url
        },
        user
      );

      /* Agent find and update status ideal to busy */
      await AgentService.findAndUpdate(agent.name, { status: 'busy' });

      return h
        .response({
          statusCode: 200,
          message: 'Agent called successfully!',
          result
        })
        .code(200);
    } catch (error) {
      request.logger.error('Error in AgentResponseController.create', error);
      return errorHandler(error);
    }
  }

  /**
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @returns {Promise<any>} hapi response
   */
  async patch(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = request.params;
      const payload: any = request.payload;
      await AgentResponseService.updateAgent(id, payload);
      return h
        .response({
          statusCode: 200,
          message: 'Agent is updated successfully!'
        })
        .code(200);
    } catch (error) {
      request.logger.error('Error in AgentResponseController.patch', error);
      return errorHandler(error);
    }
  }

  /**
   * This method is receive agnets webhook response and update agents status
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async agentWebhook(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const payload: any = request.payload;
      const { agentName } = request.params;
      const statusCode = get(payload, 'response.statusCode', 500);

      /* Receive agent response and update webhook response */
      const result = await AgentResponseService.updateAgent(payload.id, {
        response: get(payload, 'response'),
        status: statusCode === 200 ? 'completed' : 'failed',
        generateDate: moment().format('YYYY-MM-DD'),
        generateTime: moment().format('LT')
      });

      /* Update Agents status is ideal */
      await AgentService.findAndUpdate(agentName, { status: 'ideal' });

      /* Emit event in socket for UI information */
      emitSocketOnLoginClientRoom(
        { _id: result.creator.userId },
        {
          status: statusCode === 200 ? 'success' : 'failed',
          id: payload.id
        }
      );

      return h
        .response({
          statusCode: 200,
          message: 'Agent response receive successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error(
        'Error in AgentResponseController.agentWebhook',
        error
      );
      return errorHandler(error);
    }
  }

  /**
   * This method is called for group by date
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async groupByGenerateDate(
    request: Request,
    h: ResponseToolkit
  ): Promise<any> {
    try {
      const user = request.user;
      const userName = formatCreatorDetails(user);
      const query = request.parsedQuery;
      const result = await AgentResponseService.groupByGenerateDate(
        query,
        userName
      );

      return h
        .response({
          statusCode: 200,
          message: 'Agent response fetched successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error(
        'Error in AgentResponseController.groupByGenerateDate',
        error
      );
      return errorHandler(error);
    }
  }

  /**
   * This method is called for paginate Agents response document using agent query
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async fetch(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const query = request.parsedQuery;
      const result = await AgentResponseService.agentResponsePaginate(query);
      return h
        .response({
          statusCode: 200,
          message: 'Agent response fetched successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in AgentResponseController.fetch', error);
      return errorHandler(error);
    }
  }

  /**
   * This method is called for delete agent response
   *
   * @param {Hapi request} request - hapi request object
   * @param {Hapi handler} h - hapi response object
   * @return {Promise<any>} hapi response
   */
  async delete(request: Request, h: ResponseToolkit): Promise<any> {
    try {
      const { id } = request.params;
      const result = await AgentResponseService.deletAgentResponse(id);
      return h
        .response({
          statusCode: 200,
          message: 'Agent response delete successfully!',
          data: result
        })
        .code(200);
    } catch (error: any) {
      request.logger.error('Error in AgentResponseController.delete', error);
      return errorHandler(error);
    }
  }
}

export default new AgentResponseController();
