import { start, init } from './server';
import Database from '@/config/database';
import JobScheduler from '@/config/jobScheduler';
// import ElasticSearch from '@/config/elasticSearch';
import CacheInterface from '@/config/nodeFileCache';

(async (): Promise<void> => {
  await init();
  await start();
  await Database.connect(process.env.DB_URL!);
  // await ElasticSearch.connect();
  await JobScheduler.createInstance();
  await CacheInterface.createInstance();
})();

// -r ts-node/register/transpile-only
