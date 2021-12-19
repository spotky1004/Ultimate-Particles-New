import Action from "./Action.js";
import ParticleGroup from "./ParticleGroup.js";
import drawCanvas from "../drawCanvas.js";

/**
 * @typedef StageOptions
 * @property {Particle[]} particlePalette
 * @property {number} [maximumTickLength]
 * @property {Action[]} actions
 */

class Stage {
  /**
   * @param {StageOptions} options 
   */
  constructor(options) {
    if (!(options.actions[0] instanceof Action)) options.actions = [...options.actions].map(actionData => new Action(...actionData));
    this.actions = options.actions.sort((a, b) => a.time - b.time);
    this.maximumTickLength = options.maximumTickLength ?? Math.ceil(1000/60);
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef LoopingAction
     * @property {Action} action
     * @property {number} lastPerformed
     * @property {number} performCount
     * @property {import("./Action.js").ActionLooper} interval
     * @property {number} intervalUpdatedAt
     */
    /**
     * @typedef PlayingData
     * @property {number} time
     * @property {Object.<string, ParticleGroup>} particleGroups
     * @property {number} actionIdx
     * @property {LoopingAction[]} loopingActions - [Action, loopCount]
     */
    /** @type {PlayingData} */
    this.playingData = {};
  }

  play() {
    this.playing = true;
    this.playingData = {
      time: 0,
      particleGroups: {
        player: new ParticleGroup(),
        default: new ParticleGroup()
      },
      actionIdx: 0,
      loopingActions: []
    };
  }

  tick(dt) {
    dt = Math.min(this.maximumTickLength, dt);

    if (!this.playing) return;

    this.playingData.time += dt;
    const time = this.playingData.time;

    /** @type {[Action, number, number][]} */
    let actionsToPerform = []; // [Action, loop, timeOffset, innerLoop]
    // Perform action
    for (let i = this.playingData.actionIdx; i < this.actions.length; i++) {
      const action = this.actions[i];
      if (action.time > time) break;
      actionsToPerform.push([ action, 0, 0, 0 ]);
      if (action.loopCount >= 2) {
        this.playingData.loopingActions.push({
          action,
          lastPerformed: action.time,
          performCount: 1,
          interval: null,
          intervalUpdatedAt: null,
        });
      }
      this.playingData.actionIdx++;
    }

    // Action looper
    for (let i = 0; i < this.playingData.loopingActions.length; i++) {
      const loopingAction = this.playingData.loopingActions[i];
      if (loopingAction.intervalUpdatedAt !== loopingAction.performCount) {
        loopingAction.interval = loopingAction.action.getLoopInterval(loopingAction.performCount);
      }
      const bulkLoop = Math.floor( ( time - loopingAction.lastPerformed ) / loopingAction.interval );
      const offsetOffset = (time - loopingAction.lastPerformed) % loopingAction.interval;
      for (let j = 0; j < bulkLoop; j++) {
        const innerLoopCount = loopingAction.action.getInnerLoop(loopingAction.performCount);
        for (let k = 0; k < innerLoopCount; k++) {
          const offset = loopingAction.interval*(bulkLoop-j-1)+offsetOffset || 0;
          actionsToPerform.push([ loopingAction.action, loopingAction.performCount, offset, k ]);
          loopingAction.lastPerformed += loopingAction.interval;
        }
        loopingAction.performCount++;
        if (loopingAction.performCount >= loopingAction.action.loopCount) {
          this.playingData.loopingActions.splice(i, 1);
          i--;
          break;
        }
      }
    }

    // Perform action
    for (let i = 0; i < actionsToPerform.length; i++) {
      const [ action, loopCount, offset, innerLoop ] = actionsToPerform[i];
      action.perform(this, loopCount, offset, innerLoop);
    }

    // Update particles
    for (const groupName in this.playingData.particleGroups) {
      const particleGroup = this.playingData.particleGroups[groupName].particles;
      for (let i = 0; i < particleGroup.length; i++) {
        particleGroup[i].tick(dt);
      }
    }

    drawCanvas(this);
  }

  
  stop() {
    this.playing = false;
  }
  
  continue() {
    this.playing = true;
  }
  
  export() {
    const data = {
      actions: []
    };

    for (let i = 0; i < this.actions.length; i++) {
      data.actions.push(this.actions[i].export());
    }

    return data;
  }
  toString() {
    return JSON.stringify(this.export(), null, 2);
  }

  /** @param {import("./Particle.js").default} particle */
  createParticle(particle) {
    const particleGroup = particle.values.group;
    if (!this.playingData.particleGroups[particleGroup]) this.playingData.particleGroups[particleGroup] = new ParticleGroup();
    this.playingData.particleGroups[particleGroup].particles.push(particle);
  }

  /**
   * @param {string} name 
   * @param {import("./ParticleGroup.js").EventTypes} type 
   * @param {import("./ParticleGroup.js").EventDatas} data 
   */
  emitGroupEvent(name, type, data) {
    if (this.playingData.particleGroups[name]) {
      this.playingData.particleGroups[name].emitEvent(type, data);
    }
  }

  /**
   * @param {string} name 
   */
  deleteGroup(name) {
    if (this.playingData.particleGroups[name]) {
      delete this.playingData.particleGroups[name];
    }
  }
}

export default Stage;
