import { Server } from "socket.io"
import http from "http"
import express from "express" 
const app = express(); 
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin:["https://chatty-umber-psi.vercel.app"]
    }
})
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get userId from socket handshake and verify it exists
  const userId = socket.handshake.query.userId;
  if (!userId) {
    console.log("User connected without userId, disconnecting");
    socket.disconnect();
    return;
  }

  // Map userId to socketId
  userSocketMap[userId] = socket.id;
  console.log("Current online users:", Object.keys(userSocketMap));
  
  // Emit updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    
    // Find and remove the disconnected user from userSocketMap
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      console.log("Updated online users:", Object.keys(userSocketMap));
      // Emit updated online users list to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };