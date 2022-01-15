import ActionBase from "./ActionBase.js";

/**
 * @typedef {Object.<string, any>} ActionData
 */
/**
 * @typedef {Object.<string, any>} OptimizationData
 */

class ActionTemplate extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "ActionTemplate" });

    /** @type {ActionData} */
    this.data = data;
    /** @type {OptimizationData} */
    this.optimizationData = {};
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
  }
}

export default ActionTemplate;
