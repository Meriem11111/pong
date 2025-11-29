//board
var board;
var boardWidth = 500;
var boardHeight = 500;
var contex = null;
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");
};
