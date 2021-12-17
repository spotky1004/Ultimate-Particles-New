import loadStage from "../loadStage.js";
import Stage from "./Stage.js";

class stagePlayer {
  constructor() {
    /** @type {Stage!} */
    this.stage = null;
    /** @type {number} */
    this.lastTick = new Date().getTime();
    /** @type {boolean} */
    this.loadingStage = false;
  }

  /**
   * @param {string | Stage} link 
   */
  async load(stage) {
    if (this.loadingStage) return;
    this.loadingStage = true;
    if (stage instanceof Stage) {
      this.stage = stage;
    } else if (typeof stage === "object") {
      this.stage = await loadStage(stage);
    } else if (typeof stage === "string") {
      this.stage = await loadStage(stage);
    } else {
      throw new Error("Invaild stage");
    }
    this.loadingStage = false;

    return this;
  }

  play() {
    if (this.stage === null) return;
    this.stage.play();

    return this;
  }

  tick() {
    if (!this.stage.playing || !this.stage) return;
    const timeNow = new Date().getTime();
    const dt = timeNow - this.lastTick;
    this.lastTick = timeNow;
    this.stage.tick(dt);

    return this;
  }

  stop() {
    if (!this.stage.playing) return;
    this.stage.stop();

    return this;
  }

  continue() {
    if (this.stage.playing) return;
    this.stage.continue();

    return this;
  }
}

export default stagePlayer;
