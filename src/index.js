import testStage from "../testStages/sixth.js";
import StagePlayer from "./game/class/StagePlayer.js";
import { renderDrag } from "./game/events.js";

const stagePlayer = await new StagePlayer().load(testStage);
stagePlayer.play();

window.stagePlayer = stagePlayer;

function tick() {
  stagePlayer.tick();
  renderDrag();
  requestAnimationFrame(tick);
}
tick();
