/* eslint-disable no-console */
import { Client } from '@elastic/elasticsearch';

class ElasticSearch {
  /* Private members */
  clientInstance: any;

  /**
   * ElasticSearch Constructor
   */
  constructor() {
    this.clientInstance = null;
  }
  /**
   * Create instance of elastic search client
   * Only one time call connect function when server start.
   */
  async connect() {
    try {
      if (process.env.NODE_ENV !== 'testing') {
        this.clientInstance = new Client({
          node: process.env.ELASTIC_SEARCH_URL,
          auth: {
            apiKey: {
              id: process.env.ELASTIC_API_ID!,
              api_key: process.env.ELASTIC_API_KEY!
            }
          }
        });

        await this.clientInstance.info();
        console.info(
          `Elasticsearch cluster is up on : ${{
            uri: process.env.ELASTIC_SEARCH_URL,
            time: new Date()
          }}`
        );
      }
      return this.clientInstance;
    } catch (error) {
      console.warn('Elasticsearch cluster is down!');
      console.error(error);
      this.clientInstance = null;
      return this.clientInstance;
    }
  }

  /**
   * Its return elastic search client instance
   */
  client() {
    return this.clientInstance;
  }
}

export default new ElasticSearch();
