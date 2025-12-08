import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  

const server = Fastify({
    logger: true
});

server.get("/", async(request, reply) => {
    return {message: "Hello THERE !!"};
});

await server.register(fastifyCors, {
   origin: true,
    credentials: true
});

await server.listen({ port: 3001, host: '0.0.0.0' });

const gameSocket = new SocketIOServer(server.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Listen for connection
gameSocket.on("connection", (socket) => {  
    console.log("✅ Client connected:", socket.id);

    // Listen for "hello" event from client
    socket.on("hello", (msg) => {
        console.log("📨 Received from client:", msg);
        socket.emit("reply", "Hello from server!");
    });

    // Listen for disconnect 
    socket.on("disconnect", () => {
        console.log("⚠️ Client disconnected:", socket.id);
    });
});

console.log("🚀 Server running on http://localhost:3001");