/* eslint-disable no-console */
import { get } from 'lodash';
import { Server } from 'socket.io';

const Socket = (function () {
  let io: any;
  return {
    /**
     * This method return Socket instance
     *
     * @param {any} listener - hapi js server listener
     * @returns {instance} Socket instance
     */
    getInstance: function () {
      return io;
    },

    /**
     * This method create and return Socket instance
     *
     * @param {any} listener - hapi js server listener
     * @returns {void}
     */
    createInstance: function (listener: any) {
      try {
        io = new Server(listener, {
          cors: {
            origin: process.env.SOCKET_ALLOWED_ORIGIN
            // methods: ['GET'],
          }
        });

        /* socket middleware */
        io.use((socket: any, next: any) => {
          const token = get(socket, 'handshake.auth.token', false);
          if (token) {
            next();
          } else {
            next(new Error('Invalid token'));
          }
          /* Emit on connect socket */
        }).on('connection', (socket: any) => {
          const userId = get(socket, 'handshake.query.user', false);
          /* Check user want to connect is authentic user or not */
          if (userId) {
            socket.join(`${userId}-individual`);
            console.info(
              `User ${userId} join individual room: ${userId}-individual`
            );
          }
          /* Emit on receiving msg */
          socket.on('room', (data: any) => {
            socket.join(data.roomName);
            console.info(`Socket join room: ${data.roomName}`);
          });
        });

        console.info(
          `Socket listener on: ${process.env.APP_HOST}:${process.env.APP_PORT}`
        );
        return io;
      } catch (error) {
        console.error(`Socket getting error: ${error}`);
      }
    }
  };
})();

export default Socket;
