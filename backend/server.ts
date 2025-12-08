import Fastify from "fastify";
import {io, Socket} from "socket.io-client";

const server = Fastify({
    logger : true
});

server.get("/", async(request, reply) =>{
    return {message : "Hello THERE !!"};
});

const gameSocket : Socket | null = null;

gameSocket.on("connect")

server.listen({port : 3000});