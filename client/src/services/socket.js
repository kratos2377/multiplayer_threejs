import React from "react";
import io from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"],
  reconnection: true,
  secure: true,
});
