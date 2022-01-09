import ActionBase from "./ActionBase.js";

/**
 * @typedef ActionData
 * @property {string} name
 */
/**
 * @typedef {Object.<string, any>} OptimizationData
 */

class ActiveActionGroup extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "ActiveActionGroup" });

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

    const time = stage.playingData.time;
    stage.playingData.actionScheduler.activeGroup(this.data.name, time - timeOffset);
  }
}

export default ActiveActionGroup;
