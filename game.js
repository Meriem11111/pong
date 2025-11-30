//board
var board;
var boardWidth = 900;
var boardHeight = 450;
var contex = null;
var paddleWidth = 15;
var paddleHeight = 80;
var playerVelocityX = 0;
var playerVelocityY = 0;
var player1 = {
    x: 20,
    y: boardHeight / 2 - paddleHeight / 2,
    color: "#0f3460",
    score: 0,
    variation: 10,
    speed: 5,
};
var player2 = {
    x: boardWidth - 20 - paddleWidth,
    y: boardHeight / 2 - paddleHeight / 2,
    color: "#0f3460",
    score: 0,
    variation: 10,
    speed: 5,
};
var net = {
    x: boardWidth / 2 - 10 / 2,
    y: 5,
    width: 7,
    height: 25,
    color: "#16213e",
};
var ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: 15,
    color: "white",
};
var score = {
    x_l: boardWidth / 4,
    x_r: 3 * boardWidth / 4,
    y: boardHeight / 5,
    color: "white",
};
var keys = {
    'w': false,
    's': false,
    'W': false,
    'S': false,
    'ArrowUp': false,
    'ArrowDown': false,
};
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");
    draw();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
};
function handleKeyDown(event) {
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = true;
    }
    movePlayer();
}
function handleKeyUp(event) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
}
function movePlayer() {
    //p1
    if ((keys['w'] || keys['W']) && player1.y > 0)
        player1.y -= player1.variation * player1.speed;
    if ((keys['s'] || keys['S']) && player1.y < boardHeight - paddleHeight)
        player1.y += player1.variation * player1.speed;
    //p2
    if (keys['ArrowUp'] && player2.y > 0)
        player2.y -= player2.variation * player2.speed;
    if (keys['ArrowDown'] && player2.y < boardHeight - paddleHeight)
        player2.y += player2.variation * player2.speed;
}
function draw() {
    drawBoard(0, 0, board.width, board.height);
    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, player1.color);
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, player2.color);
    // drawRect(net.x, net.y, net.width, net.height, net.color);
    drawNet();
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawScore(score.x_l, score.y, player1.score, score.color);
    drawScore(score.x_r, score.y, player2.score, score.color);
    requestAnimationFrame(draw);
}
function drawBoard(x, y, w, h) {
    if (!contex)
        return;
    // contex.fillStyle = "#490f5eff";
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
