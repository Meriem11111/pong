//board
let board: HTMLCanvasElement;

let boardWidth: number = 900;
let boardHeight: number = 450;
let contex : CanvasRenderingContext2D | null = null;

window.onload = function() {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");

    drawBoard(0, 0, board.width, board.height);
    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, player1.color);
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, player1.color);
    // drawRect(net.x, net.y, net.width, net.height, net.color);
    drawNet();
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawScore(score.x_l, score.y, player1.score, score.color);
    drawScore(score.x_r, score.y, player2.score, score.color);

}

function drawBoard(x: number, y: number, w:number, h:number)
{
    if (!contex) return;
    contex.fillStyle = "#490f5eff";
    contex.fillRect(x, y, w, h);
}
 // draw paddle
let paddleWidth: number = 15; 
let paddleHeight: number = 80;

let player1 = {
    x :  20,
    y :  boardHeight / 2 - paddleHeight / 2,
    color : "#a46fb8ff",
    score : 0,
};
let player2 = {
    x :  boardWidth - 20 - paddleWidth,
    y :  boardHeight / 2 - paddleHeight / 2,
    color : "#a46fb8ff",
    score : 0,
};

const net = {
    x :  boardWidth/2 - 10 /2,
    y : 5,
    width: 7,
    height : 25,
    color : "#ab7cbdff",
};

const ball = {
    x :  boardWidth/2,
    y : boardHeight/2,
    radius : 15,
    color : "#1e1422ff",
};

const score={
    x_l : boardWidth/4,
    x_r : 3 * boardWidth/4,
    y : boardHeight/5,
    color :"#2d1d33ff",
}

function drawRect(x: number, y: number, w:number, h:number, color:string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.fillRect(x, y, w, h);
}

// draw net 
function drawNet(){
for(let i: number = 0; i <= boardHeight; i += 35)
{
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
}
}

// draw ball
function drawBall(x: number, y: number, radius: number, color:string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.arc(x, y, radius, 0, 2* Math.PI);
    contex.fill();
}

//draw score

function drawScore(x: number, y:number, score: number, color: string)
{
    if (!contex) return;
    contex.fillStyle = color;
    
    contex.fillText(score.toString(), x, y);
}
