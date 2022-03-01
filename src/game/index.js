import Game from "../class/Core/Game.js";

const game = new Game({
  canvas: document.getElementById("canvas"),
  canvasWrapper: document.getElementById("canvas-wrapper")
});

export default game;
