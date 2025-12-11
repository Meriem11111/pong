import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  

const waitingPlayers : string[] = [];
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
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

}

// Listen for connection
gameSocket.on("connection", (socket) => {  
    console.log("✅ Client connected:", socket.id);
    waitingPlayers.push(socket.id);
    console.log("All player IDs connected : ", waitingPlayers);
    socket.on("findGame", () => {
    if(waitingPlayers.length >= 2)
    {
        console.log("🔍 Player looking for game:", socket.id);
        
        if (waitingPlayers[0] && waitingPlayers[1]) {
            let newRoomID = generateRoomID();
            while (gameRooms.has(newRoomID)) {
               newRoomID = generateRoomID();
            }
            console.log("new ROOM_ID ::::  ",newRoomID);
            gameRooms.set(newRoomID, {
            player1: waitingPlayers[0],
            player2: waitingPlayers[1]
        });
        const player1Socket = gameSocket.sockets.sockets.get(waitingPlayers[0]);
        const player2Socket = gameSocket.sockets.sockets.get(waitingPlayers[1]);

        player1Socket?.join(newRoomID);
        player2Socket?.join(newRoomID);
        
        player1Socket?.emit("gameStart", { roomID: newRoomID, role: "player1" });
        player2Socket?.emit("gameStart", { roomID: newRoomID, role: "player2" });


        waitingPlayers.splice(0,2);
        const room = gameRooms.get(newRoomID);
        console.log(room?.player1);
        console.log(room?.player2);
        console.log("New room created:", newRoomID, gameRooms.get(newRoomID));


        }

    }
    });



    // Listen for "hello" event from client
    socket.on("hello", (msg) => {
        console.log("📨 Received from client:", msg);
        socket.emit("reply", "Hello from server!");


        


    });

    // Listen for disconnect 
    socket.on("disconnect", () => {
        console.log("⚠️ Client disconnected:", socket.id);
        waitingPlayers.filter(id => id !== socket.id);
        console.log("All player IDs after disconnect:", waitingPlayers);

    });
});

console.log("🚀 Server running on http://localhost:3001");