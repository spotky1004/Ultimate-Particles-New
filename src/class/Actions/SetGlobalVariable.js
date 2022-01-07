import ActionBase from "./ActionBase.js";
import Value from "../Value.js";

/**
 * @typedef {object} ActionData
 * @property {string} name
 * @property {number | string} value
 */

class SetGlobalVariable extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super(arguments[0]);

    /** @type {ActionData} */
    this.data = data;
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    const value = new Value(this.data.value).getValue(variables);
    stage.playingData.globalVariables.changeValue({
      key: this.data.name,
      value: value,
      variables: variables
    });
    globalVariables[this.data.name] = value;
  }
}

export default SetGlobalVariable;
