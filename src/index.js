import game from "./game/index.js";
import testStage from "../testStages/space2.js";

window.game = game;
game.stagePlayer.load(testStage);
game.stagePlayer.play();

function tick() {
  game.tick();
  requestAnimationFrame(tick);
}
tick();
