import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  

const server = Fastify({
    logger : true
});

server.get("/", async(request, reply) =>{
    return {message : "Hello THERE !!"};
});

await server.register(fastifyCors, {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true
});

const gameSocket = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

gameSocket.on("connect", (socket) => {
    console.log("Client connected: ", socket.id);
});

gameSocket.on("disconnect", () => {
    console.log("Client disconnected: " , socket.id);
});

server.listen({port : 3001});