import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const { userId, role, repositories } = socket.handshake.auth;

    socket.join(`user:${userId}`);

    if (role === "WH_MANAGER") {
      repositories.forEach((repoId) => {
        socket.join(`repo:${repoId}:manager`);
      });
    }
  });

  return io;
}

export function getIO() {
  return io;
}
