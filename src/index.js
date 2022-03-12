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

const editorElement = document.getElementById("editor");

const displayValues = document.createElement("div");
editorElement.appendChild(displayValues);
for (const name in schemas.actions) {
  const displayValue = document.createElement("div");
  const schema = schemas.actions[name].clone();
  editorElement.appendChild(schema.components.element);
  setInterval(function() {
    displayValue.innerText = `${schema.name}: ${JSON.stringify(schema.value)}`;
  }, 100);
  displayValues.appendChild(displayValue);
}
