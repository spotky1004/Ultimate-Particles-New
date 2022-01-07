import ActionBase from "./ActionBase.js";
import Particle from "../Particle.js";

/**
 * @typedef {import("../Particle.js").ParticleOptions} ActionData
 */

class CreateParticle extends ActionBase {
  /**
   * @param {object} param0 
   * @param {ActionData} param0.data
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
    stage.createParticle(new Particle({ ...this.data, t: timeOffset, i: loop, j: innerLoop }, variables));
  }
}

export default CreateParticle;