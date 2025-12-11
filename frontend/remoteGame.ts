import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;



function connectServer() {
    socket = io("http://localhost:3001");

    socket.on("connect", () => {
        console.log("CONNECTED! socket Id ::", socket?.id);
        socket?.emit("hello", "Hi server!"); 

        socket?.emit("findGame");
       
    });

    socket.on("reply", (msg) => {
        console.log("Server replied:", msg);
    });
    
    socket.on("gameStart", (msg) => {
        console.log("Server replied:", msg);
    });

    socket.on("gameStart", (data: { roomID: string, role: string }) => {
        console.log("🎮 Game found!");
        console.log("   Room:", data.roomID);
        console.log("   I am Player:", data.role);
        
        let myRoomId = data.roomID;
        let myRole = data.role;
        
        // TODO: Show game screen 
    });

    socket.on("disconnect", () => {
        console.log("DISCONNECTED! socket Id ::", socket?.id);
    });
}

connectServer();