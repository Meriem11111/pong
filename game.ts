//board
let board: HTMLCanvasElement;

let boardWidth: number = 500;
let boardHeight: number = 500;
let contex : CanvasRenderingContext2D | null = null;

window.onload = function() {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.height = boardHeight;
    board.width = boardWidth;
    contex = board.getContext("2d");

}