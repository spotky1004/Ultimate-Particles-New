import loadStage from "./loadStage.js";

const stageLoaded = await loadStage("https://jsonblob.com/api/jsonBlob/918512895818743808");
stageLoaded.play();

let lastTick = new Date().getTime();
function tick() {
  const timeNow = new Date().getTime();
  const dt = timeNow - lastTick;
  lastTick = timeNow;

  stageLoaded.tick(dt);

  requestAnimationFrame(tick);
}
tick();
