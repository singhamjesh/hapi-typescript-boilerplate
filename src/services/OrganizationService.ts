import BaseService from './BaseService';

class OrganizationService extends BaseService {
  /**
   * OrganizationService constructor
   */
  constructor() {
    super();
  }

  /**
   * This method is called when store in Organization document
   *
   * @param {any} data - Organization Object
   * @return {Promise<any>} Created Organization document data
   */
  async create(data: any): Promise<any> {
    try {
      this.log('info', 'OrganizationService.create() called!');
      return await this.save('organization', data);
    } catch (error) {
      this.log('error', `OrganizationService.create getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method is called when we update in Organization document
   *
   * @param {string} id - Organization object id
   * @param {any} data - Organization object
   * @return {Promise<any>} Updated Organization document data
   */
  async updateById(id: string, data: any): Promise<any> {
    try {
      this.log('info', `OrganizationService.update() called for ID ${id}!`);
      return await this.update('organization', { _id: id }, data);
    } catch (error) {
      this.log('error', `OrganizationService.update getting error: ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This method id fetch test document with pagination value
   *
   * @param {any} query mongodb query
   * @return {Promise<any>} Test document objects with pagination value
   */
  async pagination(query: any): Promise<any> {
    try {
      this.log('info', 'OrganizationService.pagination() called!');
      const { Modal } = await this.getModal('organization', 'pagination');
      return await Modal.paginate(query.where, query.options);
    } catch (error) {
      this.log(
        'error',
        `OrganizationService.pagination getting error: ${error}`
      );
      this.handleError(error);
    }
  }

  /**
   * This method is called for delete test document
   *
   * @param {any} id Test document id
   * @return {Promise<any>} Deleted test document data
   */
  async remove(id: string): Promise<any> {
    try {
      this.log('info', `OrganizationService.delete() called for ID ${id}!`);
      return await this.delete('organization', { _id: id });
    } catch (error) {
      this.log('error', `OrganizationService.delete getting error: ${error}`);
      this.handleError(error);
    }
  }
}

export default new OrganizationService();
