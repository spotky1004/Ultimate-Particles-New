import Particle from "./Particle.js";
import Value from "./Value.js";

const ActionTypeEnum = {
  CreateParticle: 0,
  ParticleGroupEvent: 1,
};

/**
 * @typedef ActionDatas
 * @property {import("./Particle.js").ParticleOptions} CreateParticle
 * @property {{ name: string, type : import("./ParticleGroup.js").EventTypes, data: import("./ParticleGroup.js").EventDatas[import("./ParticleGroup.js").EventTypes] }} ParticleGroupEvent
 */

/**
 * @typedef ActionLooper
 * @property {number | string} interval
 * @property {number} loopCount
 */

/**
 * @template {keyof typeof ActionTypeEnum} T
 */
class Action {
  /**
   * @param {T} type 
   * @param {number} time - In ms
   * @param {ActionDatas[T]} data 
   * @param {ActionLooper} looperData
   */
  constructor(type, time, data, looperData) {
    this.type = type;
    this.time = time;
    this.data = {...(data ?? {})};
    /** @type {number} */
    const loopInterval = (looperData && looperData.interval) ?? Infinity;
    this.rawInterval = looperData && looperData.interval;
    this._loopInterval = new Value(loopInterval);
    this.loopCount = (looperData && looperData.loopCount) ?? 1;
  }

  /**
   * @param {number} loopCount 
   * @returns {number}
   */
  getLoopInterval(loopCount) {
    return this._loopInterval.getValue({ i: loopCount });
  }

  export() {
    return [this.type, this.time, this.data, {interval: this.rawInterval, loopCount: this.loopCount}];
  }
  
  toString() {
    return this.export.toString();
  }

  /**
   * @param {import("./Stage.js").default} stage
   * @param {number} loop
   * @param {number} timeOffset
   */
  perform(stage, loop=0, timeOffset=0) {
    switch (this.type) {
      case "CreateParticle":
        let variables = {
          t: timeOffset,
          ...(this.data.variables ?? {}),
          i: loop,
        };
        stage.createParticle(new Particle({ ...this.data, variables }));
        break;
      case "ParticleGroupEvent":
        stage.emitGroupEvent(this.data.name, this.data.type, this.data.data);
        break;
    }
  }
}

export default Action;
