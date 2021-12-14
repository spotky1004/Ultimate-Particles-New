import loadStage from "./loadStage.js";

const stageLoaded = await loadStage("https://raw.githubusercontent.com/spotky1004/Ultimate-Particles-New/main/testSave.json");
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
