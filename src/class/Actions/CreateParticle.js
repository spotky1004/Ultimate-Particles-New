import ActionBase from "./ActionBase.js";
import Particle from "../Particle.js";
import Value from "../Value.js";

/**
 * @typedef {import("../Particle.js").ParticleOptions} ActionData
 */
/**
 * @typedef OptimizationData
 * @property {import("../Particle.js").ParticleOptions} data
 */

class CreateParticle extends ActionBase {
  /**
   * @param {Omit<import("./ActionBase.js").ActionBaseParams, "data"> & { data: ActionData }} param0 
   */
  constructor({ data }) {
    super({ ...arguments[0], type: "CreateParticle" });

    /** @type {ActionData} */
    this.data = data;
    /** @type {OptimizationData} */
    this.optimizationData = {
      data: new Value(data).getRawValue()
    }
  }

  /**
   * @param {import("./ActionBase.js").PerformParams} param0
   */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    stage.state.particleGroups.addParticle(new Particle(this.optimizationData.data, variables), globalVariables);
  }
}

export default CreateParticle;
