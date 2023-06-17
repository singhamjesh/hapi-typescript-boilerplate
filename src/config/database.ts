/* eslint-disable no-console */
import mongoose from 'mongoose';

class Database {
  /**
   * This method is called for established mongodb connection using URI
   *
   * @param dbUrl - mongodb URI connection string
   */
  async connect(dbUrl: string) {
    try {
      await mongoose.set('strictQuery', true);
      await mongoose.connect(dbUrl);
      console.info(
        `Mongoose Connection state ${mongoose.connection.readyState}`
      );
      console.info(`Database Connected at ${new Date()}`);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This method is called for disconnect mongodb connection
   *
   */
  async disconnect() {
    try {
      await mongoose.connection.close();
      console.info(`Database Disconnected at ${new Date()}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Database();
