/* eslint-disable no-console */
import Agenda from 'agenda';

const JobScheduler = (function () {
  /* Private members */
  let agenda: any;
  return {
    /**
     * This method return Agenda instance if exist otherwise create new instance and return
     *
     * @return {instance} - Agenda instance
     */
    getInstance: function () {
      if (agenda) {
        return agenda;
      }
      agenda = JobScheduler.createInstance();
      return agenda;
    },

    /**
     * This method create and return Agenda instance
     *
     * @return {instance} - Agenda instance
     */
    createInstance: async function () {
      try {
        agenda = new Agenda({
          db: { address: process.env.JOBS_DB_URL!, collection: 'scheduleTask' },
          maxConcurrency: 50,
          defaultConcurrency: 15
        });
        await agenda.start();
        console.info(`Agenda connected successfully`);
        return agenda;
      } catch (error) {
        console.error(`Agenda getting error: ${error}`);
      }
    }
  };
})();

export default JobScheduler;
