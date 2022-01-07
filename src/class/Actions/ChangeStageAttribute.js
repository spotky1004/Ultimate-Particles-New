import ActionBase from "./ActionBase.js";

/**
 * @typedef {object} ActionData
 * @property {keyof import("../Stage.js").StageAttribute} name
 * @property {number | string} value
 */

class ChangeStageAttribute extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "ChangeStageAttribute" });

    /** @type {ActionData} */
    this.data = data;
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.playingData.stageAttribute[this.data.name] = new Value(this.data.value).getValue(variables);
  }
}

export default ChangeStageAttribute;
