import Game from "./class/Game.js";
import testStage from "../testStages/space2.js";
import { renderDrag } from "./events.js";

const game = new Game({
  canvas: document.getElementById("canvas"),
  canvasWrapper: document.getElementById("canvas-wrapper")
});
await game.stagePlayer.load(testStage);
game.stagePlayer.play();

window.game = game;

function tick() {
  game.tick();

  renderDrag();

  requestAnimationFrame(tick);
}
tick();
