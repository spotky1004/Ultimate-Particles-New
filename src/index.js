import testStage from "../testStages/space.js";
import StagePlayer from "./class/StagePlayer.js";
import { renderDrag } from "./events.js";

const stagePlayer = await new StagePlayer().load(testStage);
stagePlayer.play();

window.stagePlayer = stagePlayer;

function tick() {
  stagePlayer.tick();

  renderDrag();

  requestAnimationFrame(tick);
}
tick();
