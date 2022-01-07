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
 * @template {ParticleGroupEventTypes} T
 */
class ParticleGroupEvent extends ActionBase {
  /**
   * @param {object} param0 
   * @param {object} param0.data
   * @param {T} param0.data.type
   * @param {string} param0.data.name
   * @param {ParticleGroupEventDatas[T]} param0.data.data
   */
  constructor({ data: { type, name, data } = {} }) {
    super(arguments[0]);

    /** @type {{ type: T, name: string, data: ParticleGroupEventDatas[T] }} */
    this.data = { type, name, data };
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.emitGroupEvent(this.data.type, this.data.type, this.data.data);
  }
}

window.ParticleGroupEvent = ParticleGroupEvent;

export default ParticleGroupEvent;
