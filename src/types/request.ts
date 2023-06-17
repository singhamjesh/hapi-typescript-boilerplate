import { Request as HapiRequest } from '@hapi/hapi';
export type Request = HapiRequest & {
  logger: any;
  parsedQuery: any;
  user: any;
};
