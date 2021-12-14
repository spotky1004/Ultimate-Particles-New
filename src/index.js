import Particle from "./Particle.js";
import loadStage from "./loadStage.js";

const stageLoaded = await loadStage("https://jsonblob.com/api/jsonBlob/920354248450129920");
stageLoaded.play();

window.stageLoaded = stageLoaded;

let lastTick = new Date().getTime();
function tick() {
  const timeNow = new Date().getTime();
  const dt = timeNow - lastTick;
  lastTick = timeNow;

  stageLoaded.tick(dt);

  requestAnimationFrame(tick);
}
tick();
