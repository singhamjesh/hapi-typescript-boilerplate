/* eslint-disable no-console */
import Cache from 'node-file-cache';

const CacheInterface = (function () {
  /* Private member */
  let cache: any;

  return {
    /**
     * This method return node-file-cache instance if exist otherwise create new instance and return
     *
     * @returns {instance} - node-file-cache instance
     */
    getInstance: function () {
      if (cache) {
        return cache;
      }
      cache = CacheInterface.createInstance();
      return cache;
    },

    /**
     * This method create and return node-file-cache instance
     *
     * @return {instance} - node-file-cache instance
     */
    createInstance: function () {
      try {
        cache = Cache.create();
        console.info(`Node file cache create successfully`);
        return cache;
      } catch (error) {
        console.error(`Node file cache getting error: ${error}`);
      }
    }
  };
})();

export default CacheInterface;
