"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameState = void 0;
var socket_io_client_1 = require("socket.io-client");
var socket = null;
var board;
var boardWidth = 900;
var boardHeight = 450;
var contex = null;
var paddleWidth = 15;
var paddleHeight = 80;
var paddleSpeed = 6;
var gameStart = false;
var countDown = 3;
var gameCountDown = false;
var gameGO = false;
var winner = null;
var maxScore = 3;
var player1_X = 20;
var player2_X = boardWidth - 20 - paddleWidth;
var ballColor = "white";
var ballRadius = 15;
var ballStepX = 5;
var ballStepY = 5;
var playerColor = "#829cbdff";
var score = {
    x_l: boardWidth / 4,
    x_r: 3 * boardWidth / 4,
    y: boardHeight / 5,
    color: "white",
};
var net = {
    x: boardWidth / 2 - 10 / 2,
    y: 5,
    width: 7,
    height: 25,
    color: "#16213e",
};
exports.gameState = {
    roomID: "",
    role: "",
    inGame: false,
    //ball
    ballX: boardWidth / 2,
    ballY: boardHeight / 2,
    //paddles
    player1_Y: boardHeight / 2 - paddleHeight / 2,
    player2_Y: boardHeight / 2 - paddleHeight / 2,
    //scores
    score1: 0,
    score2: 0,
};
var keys = {
    'w': false,
    's': false,
    'W': false,
    'S': false,
    'ArrowUp': false,
    'ArrowDown': false,
};
function connectServer() {
    socket = (0, socket_io_client_1.io)("http://localhost:3001");
    socket.on("connect", function () {
        console.log("CONNECTED! socket Id ::", socket === null || socket === void 0 ? void 0 : socket.id);
        socket === null || socket === void 0 ? void 0 : socket.emit("hello", "Hi server!");
        socket === null || socket === void 0 ? void 0 : socket.emit("findGame");
    });
    socket.on("reply", function (msg) {
        console.log("Server replied:", msg);
    });
    socket.on("gameStart", function (data) {
        console.log("🎮 Game found!");
        console.log("   Room:", data.roomID);
        console.log("   I am Player:", data.role);
        exports.gameState.roomID = data.roomID;
        exports.gameState.role = data.role;
        exports.gameState.inGame = true;
        startGameLoop();
    });
    socket.on("disconnect", function () {
        console.log("DISCONNECTED! socket Id ::", socket === null || socket === void 0 ? void 0 : socket.id);
    });
}
connectServer();
////////////////////////////////////////////////////////////////////////////////////
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
};
function handleKeyDown(event) {
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = true;
        socket === null || socket === void 0 ? void 0 : socket.emit("keydown", event.key);
    }
    // if(event.code === "Space" && !gameStart && !gameCountDown && !winner)
    // {
    //         // gameStart = true;
    //         gameCountDown = true;
    //         handleCountDown();   
    // }
}
function handleKeyUp(event) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
}
function startGameLoop() {
    requestAnimationFrame(draw);
}
function draw() {
    // movePlayer();
    // moveBall();
    drawBoard(0, 0, board.width, board.height);
    drawRect(player1_X, exports.gameState.player1_Y, paddleWidth, paddleHeight, playerColor);
    drawRect(player2_X, exports.gameState.player2_Y, paddleWidth, paddleHeight, playerColor);
    drawNet();
    drawBall(exports.gameState.ballX, exports.gameState.ballY, ballRadius, ballColor);
    drawScore(score.x_l, score.y, exports.gameState.score1, score.color);
    drawScore(score.x_r, score.y, exports.gameState.score2, score.color);
    // drawCountDown();
    // drawWinner();
    // if(!gameStart && !gameCountDown && !winner)
    // {
    //     drawStart();
    // }
    requestAnimationFrame(draw);
}
function drawBoard(x, y, w, h) {
    if (!contex)
        return;
    contex.fillStyle = "#15152bff";
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}
// draw paddle
function drawRect(x, y, w, h, color) {
    if (!contex)
        return;
    contex.fillStyle = color;
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}
// draw net 
function drawNet() {
    for (var i = 0; i <= boardHeight; i += 35)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
}
// draw ball
function drawBall(x, y, radius, color) {
    if (!contex)
        return;
    contex.shadowBlur = 10;
    contex.shadowColor = "#ff3b94";
    contex.fillStyle = color;
    contex.beginPath();
    contex.arc(x, y, radius, 0, 2 * Math.PI);
    contex.fill();
    contex.shadowBlur = 0;
}
//draw score
function drawScore(x, y, score, color) {
    if (!contex)
        return;
    contex.fillStyle = color;
    contex.font = "48px Arial";
    contex.textAlign = "center";
    contex.fillText(score.toString(), x, y);
}
// function drawCountDown()
// {
//     if(countDown)
//     {
//         if (!contex) return;
//         contex.fillStyle = "rgba(0, 0, 0, 0.7)";
//         contex.fillRect(0, 0, boardWidth, boardHeight);
//         contex.fillStyle = "white";
//         contex.font = "bold 150px Arial";
//         contex.textAlign = "center"; 
//         contex.textBaseline = "middle";
//         contex.fillText(countDown.toString(), boardWidth/2, boardHeight/2);
//         contex.shadowBlur = 15;
//         contex.fillStyle = "white";
//         contex.font = "30px Arial";
//         contex.fillText("GET READY", boardWidth / 2, boardHeight / 2 - 100);
//         contex.shadowBlur = 0;
//     }
//     if(gameGO)
//     {
//         if (!contex) return;
//         contex.fillStyle = "rgba(0, 0, 0, 0.7)";
//         contex.fillRect(0, 0, boardWidth, boardHeight);
//         contex.shadowBlur = 40;
//         contex.shadowColor = "#8f37f3ff";
//         contex.font = "bold 180px Arial";
//         contex.fillStyle = "white";
//         contex.textAlign = "center";
//         contex.textBaseline = "middle";
//         contex.fillText("GO!", boardWidth / 2, boardHeight / 2);
//         contex.shadowBlur = 0;
//     }
// }
// function drawWinner()
// {
//     if (!contex || !winner) return;
//     contex.fillStyle = "rgba(0, 0, 0, 0.85)";
//     contex.fillRect(0, 0, boardWidth, boardHeight);
//     contex.shadowBlur = 20;
//     contex.shadowColor = "#0244bdff";
//     contex.fillStyle = "white";
//     contex.font = "bold 70px Arial";
//     contex.textAlign = "center"; 
//     contex.textBaseline = "middle";
//     contex.fillText(`${winner} WINS!`, boardWidth/2, boardHeight/2 - 50);
//     contex.shadowBlur = 15;
//     contex.fillStyle = "white";
//     contex.font = "40px Arial";
//     contex.fillText(`${player1.score} - ${player2.score}`, boardWidth / 2, boardHeight / 2 + 30);
//     contex.shadowBlur = 10;
//     contex.fillStyle = "white";
//     contex.font = "25px Arial";
//     contex.fillText("Press SPACE to play again", boardWidth / 2, boardHeight / 2 + 100);
//     contex.shadowBlur = 0;
// }
// function drawStart()
// {
//     if (!contex) return;
//     contex.fillStyle = "rgba(0, 0, 0, 1)";
//     contex.fillRect(0, 0, boardWidth, boardHeight);
//     contex.shadowBlur = 20;
//     contex.shadowColor = "#9e58eeff";
//     contex.fillStyle = "white";
//     contex.font = "40px Arial";
//     contex.textAlign = "center";
//     contex.textBaseline = "middle";
//     contex.fillText("Press SPACE to Start ", boardWidth / 2, boardHeight / 2);
//     contex.font = "20px Arial";
//     contex.fillStyle = "white";
//     contex.fillText("Player 1: W/S | Player 2: ↑/↓", boardWidth / 2, boardHeight / 2 + 50);
//     contex.shadowBlur = 0;
// }
