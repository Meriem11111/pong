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
    drawRec(0, 0, board.width, board.height);
};
function drawRec(x, y, w, h) {
    if (!contex)
        return;
    contex.fillStyle = "#490f5eff";
    contex.fillRect(x, y, w, h);
}
