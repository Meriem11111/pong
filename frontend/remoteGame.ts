import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

let board: HTMLCanvasElement;

const boardWidth: number = 900;
const boardHeight: number = 450;
let contex : CanvasRenderingContext2D | null = null;

const paddleWidth: number = 15; 
const paddleHeight: number = 80;
const paddleSpeed: number = 6; 

let gameStart : boolean = false;
let countDown = 3;
let gameCountDown : boolean = false;
let gameGO : boolean = false;

let winner : string | null = null;
const maxScore : number = 3;

const player1_X : number = 20;
const player2_X : number = boardWidth - 20 - paddleWidth;
const ballColor: string = "white";
const ballRadius : number = 15;
const ballStepX :number= 5;
const ballStepY :number = 5;
const  playerColor: string ="#829cbdff";

const score={
    x_l : boardWidth/4,
    x_r : 3 * boardWidth/4,
    y : boardHeight/5,
    color: "white",
}
const net = {
    x :  boardWidth/2 - 10 /2,
    y : 5,
    width: 7,
    height : 25,
    color: "#16213e",       
};
const gameState={
    roomID : "",
    role : "",
    inGame : false,

    //ball
    ballX : boardWidth/2,
    ballY : boardHeight/2,
    

    //paddles
    player1_Y :  boardHeight / 2 - paddleHeight / 2,
    player2_Y :  boardHeight / 2 - paddleHeight / 2,

    //scores
    score1 : 0,
    score2 : 0,

}

const keys: {[key:string] : boolean}={
    'w' : false,
    's' : false,
    'W' : false,
    'S' : false,
    'ArrowUp' : false,
    'ArrowDown' : false,
}

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
    

    socket.on("gameStart", (data: { roomID: string, role: string }) => {
        console.log("🎮 Game found!");
        console.log("   Room:", data.roomID);
        console.log("   I am Player:", data.role);
        
        gameState.roomID = data.roomID;
        gameState.role = data.role;
        gameState.inGame = true;
        
        startGameLoop();
    });

    socket.on("disconnect", () => {
        console.log("DISCONNECTED! socket Id ::", socket?.id);
    });


}

connectServer();
  ////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);


}

function handleKeyDown(event: KeyboardEvent)
{
    event.preventDefault();
    if(event.key in keys)
    {
        keys[event.key] = true;
        socket?.emit("keydown", event.key);
    }
    // if(event.code === "Space" && !gameStart && !gameCountDown && !winner)
    // {
    //         // gameStart = true;
    //         gameCountDown = true;
    //         handleCountDown();   
    // }

}

function handleKeyUp(event: KeyboardEvent)
{
    if(event.key in keys)
    {
        keys[event.key] = false;
    }
}

function startGameLoop()
{
    requestAnimationFrame(draw);
}
function draw() {

    // movePlayer();
    // moveBall();


    drawBoard(0, 0, board.width, board.height);
    drawRect(player1_X, gameState.player1_Y, paddleWidth, paddleHeight, playerColor);
    drawRect(player2_X, gameState.player2_Y, paddleWidth, paddleHeight, playerColor);
    drawNet();
    drawBall(gameState.ballX, gameState.ballY, ballRadius, ballColor);
    drawScore(score.x_l, score.y, gameState.score1, score.color);
    drawScore(score.x_r, score.y, gameState.score2, score.color);
    // drawCountDown();
    // drawWinner();
    // if(!gameStart && !gameCountDown && !winner)
    // {
    //     drawStart();
    // }
   

    requestAnimationFrame(draw);
}
function drawBoard(x: number, y: number, w:number, h:number)
{
    if (!contex) return;
    contex.fillStyle = "#15152bff";
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}
// draw paddle
function drawRect(x: number, y: number, w:number, h:number, color:string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}

// draw net 
function drawNet(){
    for(let i: number = 0; i <= boardHeight; i += 35)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
}

// draw ball
function drawBall(x: number, y: number, radius: number, color:string)
{
    if (!contex) return;

    contex.shadowBlur = 10;
    contex.shadowColor = "#ff3b94";

    contex.fillStyle = color;
    contex.beginPath();
    contex.arc(x, y, radius, 0, 2* Math.PI);
    contex.fill();

    contex.shadowBlur = 0;
}

//draw score

function drawScore(x: number, y:number, score: number, color: string)
{
    if (!contex) return;
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