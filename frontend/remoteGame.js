import { io } from "socket.io-client";
let socket = null;
function connectServer() {
    socket = io("http://localhost:3001");
    socket.on("connect", () => {
        console.log("CONNECTED! socket Id ::", socket.id);
        socket?.emit("hello", "Hi server!");
    });
    socket.on("reply", (msg) => {
        console.log("Server replied:", msg);
    });
    socket.on("disconnect", () => {
        console.log("DISCONNECTED! socket Id ::", socket.id);
    });
}
connectServer();
