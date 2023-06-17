import { UpdateParams } from '@/types/agent';
import BaseService from './BaseService';
import axios from 'axios';
import { User } from '@/types/user';
import { Request } from '@/types/request';
import { formatCreatorDetails, parseInMongoObjectId } from '@/utils/helpers';
import { emitSocketOnLoginClientRoom } from '@/utils/socketHandler';

class AgentResponseService extends BaseService {
  /**
   * AgentService constructor
   */
  constructor() {
    super();
  }

  /**
   * This method is responsible for create agent data in database
   *
   * @param {any} payload - Agent data
   * @return {Promise<any>}
   */
  async create(data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.create() called!');
      return await this.save('agentResponse', data);
    } catch (error) {
      this.log('error', `AgentService.create getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method is responsible for update Agent response
   *
   * @param {any} where - mongodb condition
   * @param {any} data - mongodb object data
   */
  async patch(where: any, data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.patch() called!');
      return await this.update('agentResponse', where, data);
    } catch (error) {
      this.log('error', `AgentService.patch getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method is responsible for update agent
   *
   * @param {sttring} - Agent object id
   * @param {any} - Data for update
   * @return {Promise<any>}
   */
  async updateAgent(id: string, data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.updateAgent() called!');
      return await this.update('agentResponse', { _id: id }, data);
    } catch (error) {
      this.log('error', `AgentService.updateAgent getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   *
   * @param id for find agent in database
   * @returns {Promise<any>}
   */
  async findAgent(id: string): Promise<any> {
    try {
      this.log('info', 'AgentService.findAgent() called!');
      return await this.findById('agentResponse', { _id: id });
    } catch (error) {
      this.log('error', `AgentService.findAgent getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method agentResponsePaginate
   *
   * @param {any} query mongodb query
   * @return {Promise<any>} Test document objects with pagination value
   */
  async agentResponsePaginate(query: any): Promise<any> {
    try {
      this.log('info', 'AgentService.agentResponsePaginate() called!');
      const { Modal } = await this.getModal('agentResponse', 'pagination');
      return await Modal.paginate(query.where, query.options);
    } catch (error) {
      this.log(
        'error',
        `AgentService.agentResponsePaginate getting error: ${error}`
      );
      this.handleError(error);
    }
  }
  /**
   * This method id fetch test document with pagination value
   *
   * @param {any} query mongodb query
   * @return {Promise<any>} Test document objects with pagination value
   */
  async groupByGenerateDate(query: any, user: User): Promise<any> {
    try {
      this.log('info', 'AgentService.groupByGenerateDate() called!');
      if (query.where && 'generateDate' in query.where) {
        query.where.generateDate = {
          $lte: new Date(query.where.generateDate['$lte'])
        };
      }

      let options;
      if (query) {
        options = query.options;
      } else {
        options = {
          offset: 0,
          limit: 10
        };
      }

      const { Modal } = await this.getModal('agentResponse', 'pagination');
      const userId = parseInMongoObjectId(user.userId);
      const result = await Modal.aggregate([
        {
          $match: {
            $and: [{ 'creator.userId': userId }, query.where]
          }
        },
        {
          $group: {
            _id: '$generateDate',
            /* get a count of every result that matches until now */
            count: { $sum: 1 },
            results: {
              $push: '$$ROOT'
            }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: options.limit },
        { $skip: options.offset },
        {
          $project: {
            count: 1,
            _id: 0,
            date: '$_id',
            rows: '$results'
          }
        }
      ]);
      return result;
    } catch (error) {
      this.log(
        'error',
        `AgentService.groupByGenerateDate getting error: ${error}`
      );
      this.handleError(error);
    }
  }

  /**
   * To delete response Chack user are valid or not
   *
   * @Hapi request
   * @returns {Promise<any>}
   */
  async checkUser(request: Request) {
    this.log('info', 'Agent service checkUser() called!');
    const { id } = <UpdateParams>request.params;
    const user = request.user;
    const userId = formatCreatorDetails(user);
    const agentResp = await this.findOne('agentResponse', { _id: id });
    const userObjectId = agentResp.creator.userId;
    if (userObjectId.toString() === userId.userId) {
      this.log('info', 'User has valid!');
      return true;
    }
    return false;
  }

  async deletAgentResponse(id: any): Promise<any> {
    try {
      this.log('info', 'AgentResponse deletAgentResponse() called!');
      return await this.delete('agentResponse', { _id: id });
    } catch (error) {
      this.log(
        'error',
        `agentResponse.deletAgentResponse getting error: ${error}`
      );
      this.handleError(error);
    }
  }

  /**
   * This method is responsible for call agent for data processing
   *
   * @param {string} uri  - Agent url
   * @param {any} data - For processing data
   * @return {void} - null
   */
  agentCalled(uri: string, data: any, user: any) {
    axios({
      method: 'POST',
      url: uri,
      headers: { 'content-type': 'application/json' },
      data
    })
      .then(() => {
        console.log('Agent called successfully');
      })
      .catch(() => {
        /* Emit event in socket for UI information */
        emitSocketOnLoginClientRoom(user, {
          status: 'failed',
          id: data.id
        });

        /* Update agent response data */
        this.patch({ _id: data.id }, { status: 'failed' });
      });
  }
}

export default new AgentResponseService();
