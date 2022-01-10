import testStage from "../testStages/fourth.js";
import StagePlayer from "./class/StagePlayer.js";
import { renderDrags } from "./events.js";

const stagePlayer = await new StagePlayer().load(testStage);
stagePlayer.play();

window.stagePlayer = stagePlayer;

function tick() {
  stagePlayer.tick();

  renderDrags();

  requestAnimationFrame(tick);
}
tick();
