import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server as SocketIOServer } from "socket.io";  
// import gameState from "../frontend/remoteGame.js"

let waitingPlayers : string[] = [];
export const gameRooms = new Map<string, { player1: string, player2: string }>();
const boardHeight: number = 450;
const paddleWidth: number = 15; 
const paddleHeight: number = 80;
const boardWidth: number = 900;

const player1_keys : string[] =['s', 'S', 'W', 'w'];
const player2_keys : string[] =['ArrowUp', 'ArrowDown'];

interface GameState {
    player1: string;
    player2: string;
    player1_Y: number;
    player2_Y: number;
    ballX: number;
    ballY: number;
    ballStepX: number;
    ballStepY: number;
    score1: number;
    score2: number;
    gameActive: boolean;
}

async function startServer() {
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


function movePLayer(player: "player1" | "player2", key:string)
{
    const step = 6;
    if(player === "player1")
    {
        if((key === 'W' || key === 'w') && gameState.player1_Y > 0)
        {
            gameState.player1_Y -= step;
        }
        else if((key === 's' || key === 'S' ) && gameState.player1_Y < boardHeight - paddleHeight){
            gameState.player1_Y += step;
        }
            

    }
}

// Listen for connection
gameSocket.on("connection", (socket) => {  
    console.log("✅ Client connected:", socket.id);
    waitingPlayers.push(socket.id);
    console.log("All player IDs connected : ", waitingPlayers);
    socket.on("findGame", () => {
        console.log("🔍 Player looking for game:", socket.id);
    if(waitingPlayers.length >= 2)
    {
        
        
        if (waitingPlayers[0] && waitingPlayers[1]) 
        {
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

         // listen for keyevents
        player1Socket?.on("keydown", (key) => {
            if(room?.player1 &&  player1_keys.includes(key))
            {
                console.log("📨 the key received from player1 is : ", key);
                movePLayer("player1", key);
            }

        });
        player2Socket?.on("keydown", (key) => {
              if(room?.player1 && player2_keys.includes(key))
            {
                console.log("📨 the key received from player2 is : ", key);
                movePLayer("player2", key);

            }

        });
        

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
        waitingPlayers = waitingPlayers.filter(id => id !== socket.id);
        console.log("All player IDs after disconnect:", waitingPlayers);

    });
});

console.log("🚀 Server running on http://localhost:3001");
}

startServer(); 