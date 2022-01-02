import Particle from "./Particle.js";
import Value from "./Value.js";

const ActionTypeEnum = {
  CreateParticle: 0,
  ParticleGroupEvent: 1,
  ChangeStageAttributes: 2,
  SetGlobalVariable: 3,
  AddStatus: 4,
};

/**
 * @typedef ActionDatas
 * @property {import("./Particle.js").ParticleOptions} CreateParticle
 * @property {{ name: string, type : import("./ParticleGroup.js").EventTypes, data: import("./ParticleGroup.js").EventDatas[import("./ParticleGroup.js").EventTypes] }} ParticleGroupEvent
 * @property {{ name: keyof import("./Stage.js").StageAttribute, value: any }} ChangeStageAttributes
 * @property {{ name: string, value: (number | string) }} SetGlobalVariable
 * @property {{ name: string, type: import("./StatusItem.js").StatusItemType, data: import("./StatusItem.js").StatusItemData[import("./StatusItem.js").StatusItemType] }} AddStatus
 */

/**
 * @typedef ActionLooper
 * @property {number | string} interval
 * @property {number} loopCount
 * @property {number} innerLoop
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
    this.rawInterval = looperData?.interval;
    const loopInterval = this.rawInterval ?? 0;
    this._loopInterval = new Value(loopInterval);
    this.loopCount = looperData?.loopCount ?? 1;
    this.rawInnerLoop = looperData?.innerLoop;
    const innerLoop = this.rawInnerLoop ?? 1;
    this._innerLoop = new Value(innerLoop);
  }

  /**
   * @param {number} loop 
   * @returns {number}
   */
  getInnerLoop(loop) {
    return this._innerLoop.getValue({ i: loop });
  }

  /**
   * @param {number} loopCount 
   * @returns {number}
   */
  getLoopInterval(loopCount) {
    return this._loopInterval.getValue({ i: loopCount });
  }

  export() {
    return [this.type, this.time, this.data, {interval: this.rawInterval, loopCount: this.loopCount, innerLoop: this.rawInnerLoop}];
  }
  
  toString() {
    return this.export.toString();
  }

  /**
   * @param {import("./Stage.js").default} stage
   * @param {number} loop
   * @param {number} timeOffset
   * @param {number} innerLoop
   */
  perform(stage, loop=0, timeOffset=0, innerLoop=0, globalVariables={}) {
    if (this.type === "CreateParticle") {
      const variables = {
        t: timeOffset,
        ...(this.data.variables ?? {}),
        i: loop,
        j: innerLoop,
      };
      stage.createParticle(new Particle({ ...this.data, variables }));
    } else if (this.type === "ParticleGroupEvent") {
      stage.emitGroupEvent(this.data.name, this.data.type, this.data.data);
    } else if (this.type === "ChangeStageAttributes") {
      stage.playingData.stageAttribute[this.data.name] = new Value(this.data.value).getValue({ i: loop });
    } else if (this.type === "SetGlobalVariable") {
      const variables = {...globalVariables, i: loop, j: innerLoop};
      const value = new Value(this.data.value).getValue(variables);
      stage.playingData.globalVariables.changeValue({
        key: this.data.name,
        value: value,
        variables: variables
      });
    } else if (this.type === "AddStatus") {
      stage.playingData.status.addItem(this.data.name, this.data.type, this.data.data);
    }
  }
}

export default Action;
