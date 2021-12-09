const ActionTypeEnum = {
  CreateParticle: 0,
};

/**
 * @typedef ActionDatas
 * @property {import("./Particle.js").ParticleOptions} CreateParticle
 */

/**
 * @template {keyof typeof ActionTypeEnum} T
 */
class Action {
  /**
   * @param {T} type 
   * @param {number} time - In ms
   * @param {ActionDatas[T]} data 
   */
  constructor(type, time, data) {
    this.type = type;
    this.time = time;
    this.data = {...data};
  }

  /**
   * @param {import("./Stage.js").default} stage
   */
  perform(stage) {
    switch (this.type) {
      case "CreateParticle":
        stage.createParticle(this.data);
        break;
    }
  }
}

export default Action;
