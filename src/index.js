import createTestStage from "../createTestStage.js";
import StagePlayer from "./class/StagePlayer.js";

const stagePlayer = await new StagePlayer().load(createTestStage);
stagePlayer.play();

window.stagePlayer = stagePlayer;

function tick() {
  stagePlayer.tick();

  requestAnimationFrame(tick);
}
tick();
