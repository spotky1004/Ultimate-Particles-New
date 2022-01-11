import ActionBase from "./ActionBase.js";

/**
 * @typedef {import("../StatusItem.js").StatusItemType} StatusItemType
 * @typedef {import("../StatusItem.js").StatusItemData} StatusItemData
 */
/**
 * @typedef ActionData
 * @property {StatusItemType} type
 * @property {string} name
 * @property {StatusItemData[StatusItemType]} data
 */
/**
 * @typedef {Object.<string, any>} OptimizationData
 */

/**
 * @template {StatusItemType} T
 */
class AddStatus extends ActionBase {
  /**
   * @typedef _ActionData
   * @property {T} type
   * @property {string} name
   * @property {StatusItemData[T]} data
   * 
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: _ActionData }} param0 
   */

  constructor({ data }) {
    super({ ...arguments[0], type: "AddStatus" });

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
    stage.state.status.addItem(this.data.name, this.data.type, this.data.data);
  }
}

export default AddStatus;
