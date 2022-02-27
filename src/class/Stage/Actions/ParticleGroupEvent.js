import ActionBase from "./ActionBase.js";

/**
 * @typedef {import("../ParticleGroup.js").EventTypes} ParticleGroupEventTypes
 * @typedef {import("../ParticleGroup.js").EventDatas} ParticleGroupEventDatas
 */
/**
 * @typedef ActionData
 * @property {ParticleGroupEventTypes} type
 * @property {string} name
 * @property {ParticleGroupEventDatas[ParticleGroupEventTypes]} data
 */
/**
 * @typedef {Object.<string, any>} OptimizationData
 */

/**
 * @template {ParticleGroupEventTypes} T
 */
class ParticleGroupEvent extends ActionBase {
  /**
   * @typedef _ActionData
   * @property {T} type
   * @property {string} name
   * @property {ParticleGroupEventDatas[T]} data
   * 
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: _ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "ParticleGroupEvent" });
    
    /** @type {_ActionData} */
    this.data = data;
    /** @type {OptimizationData} */
    this.optimizationData = {};
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.state.particleGroups.emitGroupEvent(this.data.name, this.data.type, this.data.data);
  }
}

window.ParticleGroupEvent = ParticleGroupEvent;

export default ParticleGroupEvent;
