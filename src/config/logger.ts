class Logger {
  /* Private member */
  logger: any;

  /**
   * Logger Constructor
   */
  constructor() {
    this.logger = null;
  }
  /**
   * This method is create logger instance and return
   */
  createLogger(logger: any) {
    this.logger = logger;
    return this.logger;
  }

  /**
   * This method is return existing logger instance
   */
  getLogger() {
    return this.logger;
  }
}

export default new Logger();
