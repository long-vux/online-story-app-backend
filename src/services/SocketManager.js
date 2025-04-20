// services/SocketManager.js
class SocketManager {
    constructor() {
      this.userSockets = new Map(); // userId -> socket
    }
  
    init(server) {
      this.io = require('socket.io')(server);
      
      this.io.use((socket, next) => {
        const token = socket.handshake.query.token;
        // Xác thực JWT
        next();
      });
  
      this.io.on('connection', (socket) => {
        const userId = getUserIdFromToken(socket.handshake.query.token);
        this.userSockets.set(userId, socket);
  
        socket.on('disconnect', () => {
          this.userSockets.delete(userId);
        });
      });
    }
  
    sendToUser(userId, event, data) {
      const socket = this.userSockets.get(userId);
      if (socket) socket.emit(event, data);
    }
  }
  
  module.exports = new SocketManager(); // Singleton