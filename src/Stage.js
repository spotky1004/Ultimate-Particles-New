import Action from "./Action.js";
import drawCanvas from "./drawCanvas.js";

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
    this.actions = options.actions.sort((a, b) => a.time - b.time);
    this.maximumTickLength = options.maximumTickLength ?? 10;
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef PlayingData
     * @property {number} time
     * @property {Map<string, import("./Particle.js").default>} particles
     * @property {number} actionIdx
     */
    /** @type {PlayingData} */
    this.playingData = {};
  }

  play() {
    this.playing = true;
    this.playingData = {
      time: 0,
      particles: new Map([]),
      actionIdx: 0
    };
  }

  tick(dt) {
    dt = Math.min(this.maximumTickLength, dt);

    if (!this.playing) return;

    this.playingData.time += dt;

    let actionsToPerform = [];
    for (let i = this.playingData.actionIdx; i < this.actions.length; i++) {
      const action = this.actions[i];
      if (action.time > this.playingData.time) break;
      actionsToPerform.push(action);
      this.playingData.actionIdx++;
    }
    for (let i = 0; i < actionsToPerform.length; i++) {
      const action = actionsToPerform[i];
      action.perform(this);
    }

    for (const v of this.playingData.particles) {
      let particle = v[1];
      particle.update(dt);
    }

    drawCanvas(this);
  }

  stop() {
    this.playing = false;
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
    const particleId = particle.values.id
    if (
      !particleId ||
      this.playingData.particles.has(particleId)
    ) return;
    this.playingData.particles.set(particleId, particle);
  }
}

export default Stage;
