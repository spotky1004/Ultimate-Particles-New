import game from "./game/index.js";
import testStage from "../testStages/space2.js";
import * as schemas from "./game/schemas/index.js";

window.game = game;
game.stagePlayer.load(testStage);
game.stagePlayer.play();

function tick() {
  game.tick();
  requestAnimationFrame(tick);
}
tick();

for (const name in schemas.actions) {
  const s = schemas.actions[name];
  document.getElementById("editor").appendChild(s.components.element);
}
