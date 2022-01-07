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
 * @template {StatusItemType} T
 */
class AddStatus extends ActionBase {
  /**
   * @param {object} param0 
   * @param {object} param0.data
   * @param {T} param0.data.type
   * @param {string} param0.data.name
   * @param {StatusItemData[T]} param0.data.data
   */
  constructor({ data: { type, name, data } = {} }) {
    super(arguments[0]);

    /** @type {{ type: T, name: string, data: StatusItemData[T] }} */
    this.data = { type, name, data };
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.playingData.status.addItem(this.data.name, this.data.type, this.data.data);
  }
}

export default AddStatus;
