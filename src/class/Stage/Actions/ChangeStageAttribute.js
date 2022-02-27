import Value from "../../Value.js";
import ActionBase from "./ActionBase.js";

/**
 * @typedef ActionData
 * @property {keyof import("../StageAttribute.js").DefaultValues} name
 * @property {number | string} value
 */
/**
 * @typedef OptimizationData
 * @property {Value<number | string>} value
 */

class ChangeStageAttribute extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "ChangeStageAttribute" });

    /** @type {ActionData} */
    this.data = data;
    /** @type {OptimizationData} */
    this.optimizationData = {
      value: new Value(this.data.value)
    }
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0 
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.state.stageAttribute[this.data.name] = this.optimizationData.value.getValue(variables);
  }
}

export default ChangeStageAttribute;
