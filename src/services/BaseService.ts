import * as fs from 'fs';
import * as path from 'path';
import { get, isEmpty } from 'lodash';
import { errorHandler } from '@/utils/errorHandler';
import Logger from '@/config/logger';

class BaseService {
  /**
   * This method write log using hapi-pino for log
   *
   * @param {any} msg - message
   * @param {string} type - log type [error, info, warning]
   */
  log(msg: any, type: string): any {
    const log = Logger.getLogger();
    switch (type) {
      case 'error': {
        log.error(msg);
        break;
      }
      default: {
        log.info(msg);
      }
    }
  }

  /**
   * This method is handle error with custom msg
   *
   * @param {any} error - error object/string
   * @param {any} customErrorMsg - custom error msg
   * @returns {error} complete error msg
   */
  handleError(error: any, customErrorMsg: any = ''): any {
    return errorHandler(error, customErrorMsg);
  }

  /**
   * This method is responsible for validate and return MongoDB modal
   * @param {string} modalName - mongodb modal file name
   * @param {string} fnName - function name for called
   * @returns {Promise<any>} - imported mongodb modal
   */
  async getModal(modalName: string, fnName: string): Promise<any> {
    /* Type check of modal name, only string accepted */
    if (typeof modalName !== 'string') {
      this.handleError(
        new Error('MongooseService error'),
        `Parameter "Modal" to MongooseService.${fnName}() must be an String, got ${typeof modalName}`
      );
    }

    /* Get modal path using modal name from modal directory */
    const modelsPath = path.join(__dirname, `../models/${modalName}.ts`);

    /* Check file is exist or not */
    if (fs.existsSync(modelsPath)) {
      const m: any = await import(modelsPath);
      return { Modal: m.default, Mname: m.modelName };
    }
    this.handleError(
      new Error('BaseService modal path error'),
      `${modalName} modal does not exist!`
    );
  }

  /**
   * Format mongodb fetch query using query and option
   *
   * @param {any} query - mongodb query object
   * @param {any} options - mongodb options
   * @returns {any} mongodb query with select/populate/limit/offset/short
   */
  getFetchQuery(query: any, options: any = {}): any {
    if (options && !isEmpty(options)) {
      if ('select' in options) {
        query.select(options.select);
      }
      if ('populate' in options) {
        query.populate(options.populate);
      }
      if ('limit' in options) {
        query.limit(options.limit);
      }
      if ('offset' in options) {
        query.skip(options.offset);
      }
      if ('sort' in options) {
        query.sort(options.sort);
      }
    }
    return query;
  }

  /**
   * This method is insert a new record in given document
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} data - mongodb modal document object
   * @return {Promise<any>} Created document object
   */
  async save(...args: any[]): Promise<any> {
    try {
      const [modal, data] = args;
      const { Modal, Mname } = await this.getModal(modal, 'create');

      this.log('info', `BaseService ${Mname}.create() called`);

      return await new Modal(data).save();
    } catch (error: any) {
      this.log('error', `Error in BaseService.create ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This function is called for fetch given modal single document using id
   *
   * @param {string} modal - mongodb modal file name
   * @param {string} id - mongodb modal document id
   * @param {any} options - mongodb query options
   * @return {Promise<any>} Fetched document object
   */
  async findById(...args: any[]): Promise<any> {
    try {
      const [modal, id, options] = args;
      const { Modal, Mname } = await this.getModal(modal, 'findById');

      this.log('info', `BaseService ${Mname}.findById() called`);

      let query = Modal.findById(id);
      query = this.getFetchQuery(query, options);

      return await query.lean().exec();
    } catch (error: any) {
      this.log('error', `Error in BaseService.findById ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This function is called for fetch given modal single document using where condition
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} where - mongodb modal document where condition
   * @param {any} options - mongodb query options
   * @return {Promise<any>} Fetched document object
   */
  async findOne(...args: any[]): Promise<any> {
    try {
      const [modal, where, options] = args;
      const { Modal, Mname } = await this.getModal(modal, 'findOne');

      this.log('info', `BaseService ${Mname}.findOne() called`);

      let query = Modal.findOne(where);
      query = this.getFetchQuery(query, options);

      return await query.lean().exec();
    } catch (error: any) {
      this.log('error', `Error in BaseService.findOne ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This function is called for fetch given modal multiple document using where condition
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} where - mongodb modal document where condition
   * @param {any} options - mongodb query options
   * @return {Promise<any>} Fetched document object
   */
  async find(...args: any[]): Promise<any> {
    try {
      const [modal, where, options] = args;
      const { Modal, Mname } = await this.getModal(modal, 'find');

      this.log('info', `BaseService ${Mname}.find() called`);

      let query = Modal.find(where);
      query = this.getFetchQuery(query, options);

      return await query.lean().exec();
    } catch (error: any) {
      this.log('error', `Error in BaseController.find ${error}`);
      this.handleError(error);
    }
  }

  /**
   * This function is called for update given modal single/multiple document using where condition
   * We update single and multiple document using options.multi = true/false
   * If options.multi = true it's update multiple otherwise update single document
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} where - mongodb modal document where condition
   * @param {any} data - mongodb db document object
   * @param {any} options - mongodb query options
   * @return {Promise<any>} Updated document object
   */
  async update(...args: any[]): Promise<any> {
    try {
      const [modal, where, data, options] = args;
      const { Modal, Mname } = await this.getModal(modal, 'create');
      this.log('info', `BaseService ${Mname}.update() called`);
      if (get(options, 'multi', false)) {
        await Modal.updateMany(where, data, {
          new: true,
          safe: true,
          multi: true
        });
        const result = Modal.find(where);
        return result;
      }

      return await Modal.findOneAndUpdate(where, data, {
        new: true,
        safe: true,
        multi: true,
        upsert: get(options, 'upsert', false),
        setDefaultsOnInsert: get(options, 'upsert', false)
      });
    } catch (error: any) {
      this.log('error', `Error in MongooseService.update ${error}`);
      errorHandler(error);
    }
  }

  /**
   * This function is called for delete given modal single/multiple document using where condition
   * We delete single and multiple document using options.multi = true/false
   * If options.multi = true it's delete multiple otherwise delete single document
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} where - mongodb modal document where condition
   * @param {any} data - mongodb db document object
   * @param {any} options - mongodb query options
   * @return {Promise<any>} Deleted document object
   */
  async delete(...args: any[]): Promise<any> {
    try {
      const [modal, where, options] = args;
      const { Modal, Mname } = await this.getModal(modal, 'create');

      this.log('info', `BaseService ${Mname}.delete() called`);

      if (get(options, 'multi', false)) {
        const result = Modal.find(where);
        await Modal.deleteMany(where);
        return result;
      }
      return await Modal.findOneAndDelete(where);
    } catch (error: any) {
      this.log('error', `Error in BaseService.delete() ${error}`);
      errorHandler(error);
    }
  }

  /**
   * This function is called for paginate document using where, options and lookup
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} where - mongodb modal document where condition
   * @param {any} options - mongodb query options
   * @param {any} lookups - mongodb query lookups
   * @return {Promise<any>} Fetched document with pagination data
   */
  async customPagination(...args: any[]): Promise<any> {
    try {
      const [modal, where, options, lookups] = args;
      const { Modal, Mname } = await this.getModal(modal, 'pagination');

      this.log('info', `BaseService ${Mname}.pagination() called!`);

      const query: any = [{ $match: where }];

      if (options.sort) {
        for (const item in options.sort) {
          options.sort[item] = parseInt(options.sort[item]);
        }
        query.push({ $sort: options.sort });
      }

      if (lookups.length > 0) {
        lookups.forEach((element: any) => {
          query.push(element);
        });
      }
      query.push(
        {
          $group: {
            _id: null,
            /* get a count of every result that matches until now */
            count: { $sum: 1 },
            /* keep our results for the next operation */
            results: { $push: '$$ROOT' }
          }
        },
        /* and finally trim the results to within the range given by start/endRow */
        {
          $project: {
            count: 1,
            rows: { $slice: ['$results', options.offset, options.limit] }
          }
        }
      );

      const [result] = await Modal.aggregate(query);

      return {
        docs: result ? result.rows : [],
        total: result ? result.count : 0,
        limit: options.limit,
        offset: options.offset
      };
    } catch (error: any) {
      this.log('error', `Error in BaseService.pagination() ${error}`);
      errorHandler(error);
    }
  }

  /**
   * This function is called for search document using given modal and searchItem
   *
   * @param {string} modal - mongodb modal file name
   * @param {any} searchItem - mongodb modal document query
   * @param {any} limit - mongodb query limit options
   * @param {any} skip - mongodb query skip options
   * @param {any} index - mongodb search index name
   * @return {Promise<any>} Fetched document with pagination data
   */
  async search(...args: any[]): Promise<any> {
    try {
      const [modal, searchItem, limit, skip, index] = args;
      const { Modal, Mname } = await this.getModal(modal, 'create');

      this.log('info', `BaseService ${Mname}.search() called!`);

      const data = await Modal.aggregate([
        {
          $search: {
            index,
            autocomplete: { query: searchItem, path: 'name' }
          }
        },
        {
          $project: { _id: 1, name: 1, profileImage: 1, gallery: 1 }
        },
        {
          $addFields: {
            type: Modal.modelName,
            imageUrl: {
              $cond: {
                if: {
                  $eq: [{ $type: '$gallery' }, 'missing']
                },
                then: '$profileImage.originalLink',
                else: '$gallery.originalLink'
              }
            }
          }
        },
        {
          $unset: ['profileImage', 'gallery']
        },
        {
          $limit: limit
        },
        {
          $skip: skip
        }
      ]);
      return data;
    } catch (error: any) {
      this.log(
        'error',
        `Error in BaseController.pagination ${JSON.parse(error)}`
      );
      errorHandler(error);
    }
  }
}

export default BaseService;
