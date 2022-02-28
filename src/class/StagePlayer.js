import loadStage from "../loadStage.js";
import {
  Stage,
  ActionBase,
  Actions,
} from "./Stage/index.js";
import { keyPressed, screenDragPower } from "../events.js";

class StagePlayer {
  constructor() {
    /** @type {Stage!} */
    this.stage = null;
    /** @type {number} */
    this.stageStuck = 0;
    /** @type {number} */
    this.lastTick = new Date().getTime();
    /** @type {boolean} */
    this.loadingStage = false;
  }

  /**
   * @param {string | Stage} link 
   */
  async load(data) {
    if (this.loadingStage) return;
    this.loadingStage = true;
    if (data instanceof Stage) {
      this.stage = data;
    } else if (typeof data === "object" || typeof data === "string") {
      /** @type {Object.<string, any>} */
      let stageJSON = typeof data === "object" ? data : undefined;
      if (typeof data === "string") {
        const urlRegex =/^(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])$/ig;
        if (data.match(urlRegex)) {
          stageJSON = await loadStage(data);
        } else {
          stageJSON = data;
        }
        stageJSON = JSON.parse(stageJSON);
      }
      if (stageJSON) {
        let stage = stageJSON;
        if (!(stage.actions[0] instanceof ActionBase)) {
          stage.actions = [...stage.actions].map(actionData => {
            return new Actions[actionData.type](actionData);
          });
        }
        stage = new Stage(stage);
        this.stage = stage;
      }
    } else {
      return new Error("Invaild stage");
    }
    this.loadingStage = false;

    return this;
  }

  unload() {
    if (this.stage === null) return;

    this.stop();
    this.stage = null;
  }

  play() {
    if (this.stage === null) return;
    this.stage.play();
    document.getElementById("status").innerHTML = "";
    this.stageStuck = 0;

    return this;
  }

  tick() {
    if (!this.stage?.playing) return;
    const timeNow = new Date().getTime();
    const dt = timeNow - this.lastTick;
    this.lastTick = timeNow;
    const result = this.stage.tick(dt, true, { keyPressed, screenDragPower });
    if (!result) {
      if (this.stage.playing) {
        this.stageStuck++;
        if (this.stageStuck >= 10) {
          alert("Terminated stage due to infinite loop");
          this.unload();
        }
      } else {
        this.play();
      }
    }

    return this;
  }

  stop() {
    if (!this.stage?.playing) return;
    this.stage.stop();

    return this;
  }

  continue() {
    if (this.stage?.playing) return;
    this.stage.continue();

    return this;
  }
}

export default StagePlayer;
