import { io } from "socket.io-client";

export const socket = io("http://localhost:5001", {
  auth: {
    userId: user._id,
    role: user.role,
    repositories: user.repositories,
  },
});
