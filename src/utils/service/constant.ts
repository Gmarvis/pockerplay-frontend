import io from "socket.io-client";
export const GOOGLE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_CLIENT;

export const api_call = process.env.NEXT_PUBLIC_LOCAL_BURL;
export const public_call = process.env.NEXT_PUBLIC_LOCAL_FURL;
export const socket = io(api_call || "", {
  path: "/socket.io/",
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});
