//board
var board;
var boardWidth = 900;
var boardHeight = 450;
var contex = null;
window.onload = function () {
    board = document.getElementById("board");
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
};
function drawBoard(x, y, w, h) {
    if (!contex)
        return;
    contex.fillStyle = "#490f5eff";
    contex.fillRect(x, y, w, h);
}
// draw paddle
var paddleWidth = 15;
var paddleHeight = 80;
var player1 = {
    x: 20,
    y: boardHeight / 2 - paddleHeight / 2,
    color: "#a46fb8ff",
    score: 0,
};
var player2 = {
    x: boardWidth - 20 - paddleWidth,
    y: boardHeight / 2 - paddleHeight / 2,
    color: "#a46fb8ff",
    score: 0,
};
var net = {
    x: boardWidth / 2 - 10 / 2,
    y: 5,
    width: 7,
    height: 25,
    color: "#ab7cbdff",
};
var ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    radius: 15,
    color: "#1e1422ff",
};
var score = {
    x_l: boardWidth / 4,
    x_r: 3 * boardWidth / 4,
    y: boardHeight / 5,
    color: "#2d1d33ff",
};
function drawRect(x, y, w, h, color) {
    if (!contex)
        return;
    contex.fillStyle = color;
    contex.fillRect(x, y, w, h);
}
// draw net 
function drawNet() {
    for (var i = 0; i <= boardHeight; i += 35) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
// draw ball
function drawBall(x, y, radius, color) {
    if (!contex)
        return;
    contex.fillStyle = color;
    contex.arc(x, y, radius, 0, 2 * Math.PI);
    contex.fill();
}
//draw score
function drawScore(x, y, score, color) {
    if (!contex)
        return;
    contex.fillStyle = color;
    contex.fillText(score.toString(), x, y);
}
