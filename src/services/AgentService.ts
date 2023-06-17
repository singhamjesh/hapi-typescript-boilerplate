import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { AgentConfig } from '@/types/agent';
import BaseService from './BaseService';
class AgentService extends BaseService {
  /**
   * AgentService constructor
   */
  constructor() {
    super();
  }

  /**
   *
   */
  getAgentUrl(agentName: string) {
    const ymlPath = path.join(__dirname, '../config/agent.yml');
    const fileContents = fs.readFileSync(ymlPath, 'utf8');
    const config: AgentConfig = yaml.load(fileContents) as AgentConfig;
    return config[agentName];
  }

  async createAgents(data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.createAgents() called!');
      return await this.save('agents', data);
    } catch (error) {
      this.log('error', `AgentService.createAgents getting error: ${error}`);
      this.handleError(error);
    }
  }

  async findById(data: string): Promise<any> {
    try {
      return await this.findOne('agents', { _id: data });
    } catch (error) {
      this.log(
        'error',
        `AgentService.findAgentsByName getting error: ${error}`
      );
    }
  }

  /**
   *
   * @param data agent name
   * @param status it is ideal or busy for agent
   * @returns promise any type
   */
  async findAndUpdate(data: string, status: any): Promise<any> {
    try {
      this.log('info', 'AgentService.findAgents() called!');
      const result = await this.findOne('agents', { name: data });
      return await this.update('agents', { _id: result._id }, status);
    } catch (error) {
      this.log('error', `AgentService.findAgents getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method called for pagination
   *
   * @param {any} query mongodb query
   * @return {Promise<any>} Test document objects with pagination value
   */
  async pagination(query: any): Promise<any> {
    try {
      this.log('info', 'AgentService.pagination() called!');
      const { Modal } = await this.getModal('agents', 'pagination');
      return await Modal.paginate(query.where, query.options);
    } catch (error) {
      this.log('error', `AgentService.pagination getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   *
   * @param {data<any> } agent id
   * @returns {Promise<any>}
   */
  async patch(id: any, data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.patch() called!');
      return await this.update('agents', { _id: id }, data);
    } catch (error) {
      this.log('error', `AgentService.patch getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   *
   * @param {data<any> } agent id
   * @returns {Promise<any>}
   */
  async deleteAgent(data: any): Promise<any> {
    try {
      this.log('info', 'AgentService.deleteAgent() called!');
      return await this.delete('agents', { _id: data });
    } catch (error) {
      this.log('error', `AgentService.deleteAgent getting error: ${error}`);
      this.handleError(error);
    }
  }
}

export default new AgentService();
