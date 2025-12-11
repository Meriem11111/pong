import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  

export let playerID : string[] = [];
export const gameRooms = new Map<string, { player1: string, player2: string }>();


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

function generateRoomID() : string {
    const randomID = Math.floor(Math.random() * 1000);
    return `room${randomID}`;
}

// Listen for connection
gameSocket.on("connection", (socket) => {  
    console.log("✅ Client connected:", socket.id);
    playerID.push(socket.id);
    console.log("All player IDs connected : ", playerID);
    
    if(playerID.length >= 2)
    {
        
        if (playerID[0] && playerID[1]) {
            let newRoomID = generateRoomID();
            while (gameRooms.has(newRoomID)) {
               newRoomID = generateRoomID();
            }
            console.log("new ROOM_ID ::::  ",newRoomID);
            gameRooms.set(newRoomID, {
            player1: playerID[0],
            player2: playerID[1]
        });
        playerID.splice(0,2);
        const room = gameRooms.get(newRoomID);
        console.log(room?.player1);
        console.log(room?.player2);
        console.log("New room created:", newRoomID, gameRooms.get(newRoomID));


        }

    }




    // Listen for "hello" event from client
    socket.on("hello", (msg) => {
        console.log("📨 Received from client:", msg);
        socket.emit("reply", "Hello from server!");


        


    });

    // Listen for disconnect 
    socket.on("disconnect", () => {
        console.log("⚠️ Client disconnected:", socket.id);
        playerID = playerID.filter(id => id !== socket.id);
        console.log("All player IDs after disconnect:", playerID);

    });
});

console.log("🚀 Server running on http://localhost:3001");