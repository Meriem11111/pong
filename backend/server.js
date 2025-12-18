"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRooms = void 0;
var fastify_1 = require("fastify");
var cors_1 = require("@fastify/cors");
var socket_io_1 = require("socket.io");
// import gameState from "../frontend/remoteGame.js"
var waitingPlayers = [];
exports.gameRooms = new Map();
var boardHeight = 450;
var paddleWidth = 15;
var paddleHeight = 80;
var boardWidth = 900;
var ballRadius = 15;
var ballStepX = 5;
var ballStepY = 5;
var player1_X = 20;
var player2_X = boardWidth - 20 - paddleWidth;
var player1_keys = ['s', 'S', 'W', 'w'];
var player2_keys = ['ArrowUp', 'ArrowDown'];
var maxScore = 3;
var games_stats = new Map();
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        function generateRoomID() {
            return "room_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        }
        //Paddle movements
        function movePLayer(player, key, room_id) {
            var currentGame = games_stats.get(room_id);
            if (!currentGame) {
                console.log("THE ROOM IS NOT FOUND !!");
                return;
            }
            var speed = 6;
            var step = 1;
            if (currentGame.gameActive) {
                if (player === "player1") {
                    if ((key === 'W' || key === 'w') && currentGame.player1_Y > 0) {
                        currentGame.player1_Y -= step * speed;
                    }
                    else if ((key === 's' || key === 'S') && currentGame.player1_Y < boardHeight - paddleHeight) {
                        currentGame.player1_Y += step * speed;
                    }
                }
                else if (player === "player2") {
                    if ((key === 'ArrowUp') && currentGame.player2_Y > 0) {
                        currentGame.player2_Y -= step * speed;
                    }
                    else if ((key === 'ArrowDown') && currentGame.player2_Y < boardHeight - paddleHeight) {
                        currentGame.player2_Y += step * speed;
                    }
                }
                gameSocket.to(room_id).emit("updateGame", {
                    player1_Y: currentGame.player1_Y,
                    player2_Y: currentGame.player2_Y,
                    ballX: currentGame.ballX,
                    ballY: currentGame.ballY,
                    score1: currentGame.score1,
                    score2: currentGame.score2,
                    gameActive: currentGame.gameActive,
                    winner: currentGame.winner,
                });
            }
        }
        function init_gameState(room, player_1, player_2) {
            var game = {
                roomID: room,
                player1: player_1,
                player2: player_2,
                player1_Y: boardHeight / 2 - paddleHeight / 2,
                player2_Y: boardHeight / 2 - paddleHeight / 2,
                ballX: boardWidth / 2,
                ballY: boardHeight / 2,
                ballStepX: 5,
                ballStepY: 5,
                score1: 0,
                score2: 0,
                gameActive: true,
                winner: "",
            };
            games_stats.set(room, game);
        }
        function moveBall(room_id) {
            var currentGame = games_stats.get(room_id);
            if (!currentGame) {
                console.log("THE ROOM IS NOT FOUND !!");
                return;
            }
            if (currentGame.gameActive) {
                currentGame.ballX += currentGame.ballStepX;
                currentGame.ballY += currentGame.ballStepY;
                if (currentGame.ballY + ballRadius > boardHeight || currentGame.ballY - ballRadius < 0)
                    currentGame.ballStepY = -currentGame.ballStepY;
                if (currentGame.ballStepX < 0) {
                    if (currentGame.ballX - ballRadius <= player1_X + paddleWidth &&
                        currentGame.ballX - ballRadius > player1_X &&
                        currentGame.ballY + ballRadius >= currentGame.player1_Y &&
                        currentGame.ballY - ballRadius <= currentGame.player1_Y + paddleHeight) {
                        currentGame.ballStepX = Math.abs(currentGame.ballStepX);
                        currentGame.ballX = ballRadius + player1_X + paddleWidth;
                        var hitPos = (currentGame.ballY - currentGame.player1_Y) / paddleHeight;
                        currentGame.ballStepY = (hitPos - 0.5) * 10;
                    }
                }
                if (currentGame.ballStepX > 0) {
                    if (currentGame.ballX + ballRadius >= player2_X &&
                        currentGame.ballX + ballRadius < player2_X + paddleWidth &&
                        currentGame.ballY + ballRadius >= currentGame.player2_Y &&
                        currentGame.ballY - ballRadius <= currentGame.player2_Y + paddleHeight) {
                        currentGame.ballStepX = -Math.abs(currentGame.ballStepX);
                        currentGame.ballX = player2_X - ballRadius;
                        var hitPos = (currentGame.ballY - currentGame.player2_Y) / paddleHeight;
                        currentGame.ballStepY = (hitPos - 0.5) * 10;
                    }
                }
                // hndle scores
                if (currentGame.ballX - ballRadius <= 0) {
                    currentGame.score2++;
                    resetBall(room_id);
                    checkWinner(room_id);
                }
                else if (currentGame.ballX + ballRadius >= boardWidth) {
                    currentGame.score1++;
                    resetBall(room_id);
                    checkWinner(room_id);
                }
                gameSocket.to(room_id).emit("updateGame", {
                    player1_Y: currentGame.player1_Y,
                    player2_Y: currentGame.player2_Y,
                    ballX: currentGame.ballX,
                    ballY: currentGame.ballY,
                    score1: currentGame.score1,
                    score2: currentGame.score2,
                    gameActive: currentGame.gameActive,
                    winner: currentGame.winner,
                });
            }
        }
        function checkWinner(room_id) {
            var currentGame = games_stats.get(room_id);
            if (!currentGame) {
                console.log("THE ROOM IS NOT FOUND !!");
                return;
            }
            if (currentGame.score1 == maxScore) {
                currentGame.winner = "player1";
                currentGame.gameActive = false;
            }
            else if (currentGame.score2 == maxScore) {
                currentGame.winner = "player2";
                currentGame.gameActive = false;
            }
        }
        function resetBall(room_id) {
            var currentGame = games_stats.get(room_id);
            if (!currentGame) {
                console.log("THE ROOM IS NOT FOUND !!");
                return;
            }
            currentGame.ballX = boardWidth / 2;
            currentGame.ballY = boardHeight / 2;
            currentGame.ballStepX = currentGame.score1 > currentGame.score2 ? 5 : -5;
            currentGame.ballStepY = (Math.random() < 0.5 ? -5 : 5);
        }
        function startGameLoop(room_ID) {
            var currentGame = games_stats.get(room_ID);
            var gameInterval = setInterval(function () {
                if (!currentGame || !currentGame.gameActive) {
                    clearInterval(gameInterval);
                    return;
                }
                moveBall(room_ID);
            }, 1000 / 60);
        }
        var server, gameSocket;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = (0, fastify_1.default)({
                        logger: true
                    });
                    server.get("/", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, { message: "Hello THERE !!" }];
                        });
                    }); });
                    return [4 /*yield*/, server.register(cors_1.default, {
                            origin: true,
                            credentials: true
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, server.listen({ port: 3001, host: '0.0.0.0' })];
                case 2:
                    _a.sent();
                    gameSocket = new socket_io_1.Server(server.server, {
                        cors: {
                            origin: "*",
                            methods: ["GET", "POST"]
                        }
                    });
                    // Listen for connection
                    gameSocket.on("connection", function (socket) {
                        console.log("✅ Client connected:", socket.id);
                        waitingPlayers.push(socket.id);
                        console.log("All player IDs connected : ", waitingPlayers);
                        socket.on("findGame", function () {
                            console.log("🔍 Player looking for game:", socket.id);
                            if (waitingPlayers.length >= 2) {
                                if (waitingPlayers[0] && waitingPlayers[1]) {
                                    var newRoomID = generateRoomID();
                                    while (exports.gameRooms.has(newRoomID)) {
                                        newRoomID = generateRoomID();
                                    }
                                    console.log("new ROOM_ID ::::  ", newRoomID);
                                    exports.gameRooms.set(newRoomID, {
                                        player1: waitingPlayers[0],
                                        player2: waitingPlayers[1]
                                    });
                                    var player1Socket = gameSocket.sockets.sockets.get(waitingPlayers[0]);
                                    var player2Socket = gameSocket.sockets.sockets.get(waitingPlayers[1]);
                                    player1Socket === null || player1Socket === void 0 ? void 0 : player1Socket.join(newRoomID);
                                    player2Socket === null || player2Socket === void 0 ? void 0 : player2Socket.join(newRoomID);
                                    player1Socket === null || player1Socket === void 0 ? void 0 : player1Socket.emit("gameStart", { roomID: newRoomID, role: "player1" });
                                    player2Socket === null || player2Socket === void 0 ? void 0 : player2Socket.emit("gameStart", { roomID: newRoomID, role: "player2" });
                                    waitingPlayers.splice(0, 2);
                                    var room = exports.gameRooms.get(newRoomID);
                                    console.log(room === null || room === void 0 ? void 0 : room.player1);
                                    console.log(room === null || room === void 0 ? void 0 : room.player2);
                                    console.log("New room created:", newRoomID, exports.gameRooms.get(newRoomID));
                                    if (player1Socket && player2Socket) {
                                        init_gameState(newRoomID, player1Socket.id, player2Socket.id);
                                        startGameLoop(newRoomID);
                                    }
                                    // listen for keyevents
                                    // player1Socket?.on("keydown", (key) => {
                                    //     if(room?.player1 &&  player1_keys.includes(key))
                                    //     {
                                    //         console.log("📨 the key received from player1 is : ", key);
                                    //         movePLayer("player1", key, newRoomID);
                                    //     }
                                    // });
                                    // player2Socket?.on("keydown", (key) => {
                                    //       if(room?.player1 && player2_keys.includes(key))
                                    //     {
                                    //         console.log("📨 the key received from player2 is : ", key);
                                    //         movePLayer("player2", key, newRoomID);
                                    //     }
                                    // });
                                }
                            }
                        });
                        socket.on("keydown", function (data) {
                            var room = exports.gameRooms.get(data.roomID);
                            if (!room)
                                return;
                            if (socket.id === room.player1 && player1_keys.includes(data.key)) {
                                movePLayer("player1", data.key, data.roomID);
                            }
                            else if (socket.id === room.player2 && player2_keys.includes(data.key)) {
                                movePLayer("player2", data.key, data.roomID);
                            }
                        });
                        // Listen for "hello" event from client
                        socket.on("hello", function (msg) {
                            console.log("📨 Received from client:", msg);
                            socket.emit("reply", "Hello from server!");
                        });
                        // Listen for disconnect 
                        socket.on("disconnect", function () {
                            console.log("⚠️ Client disconnected:", socket.id);
                            waitingPlayers = waitingPlayers.filter(function (id) { return id !== socket.id; });
                            console.log("All player IDs after disconnect:", waitingPlayers);
                        });
                    });
                    console.log("🚀 Server running on http://localhost:3001");
                    return [2 /*return*/];
            }
        });
    });
}
startServer();
