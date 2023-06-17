import Socket from '@/config/socket';

/**
 * Handle agent-callback socket event
 *
 * @param {*} id string
 * @returns {ObjectId} mongodb object
 */
export const emitSocketOnLoginClientRoom = (loginUser: any, data: any) => {
  const io = Socket.getInstance();
  io.to(`${loginUser._id}-individual`).emit('agent-callback', data);
  return null;
};
