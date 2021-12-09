/**
 * @typedef Vector2
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef Size
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef ParticleOptions
 * @property {string} id - Id of the particle, use to recognize particle.
 * @property {Size} [size] - Size of the particle.
 * @property {Vector2} [position] - Position of the particle.
 * @property {string} [color] - Color of the particle.
 */
/**
 * @typedef DrawData
 * @property {Vector2} position
 * @property {Size} size
 */

class Particle {
  /**
   * @param {ParticleOptions} options 
   */
  constructor(options) {
    /** @type {string} */
    this.id = options.id;
    /** @type {Vector2} */
    this.position = options.position ?? { x: 50, y: 50 };
    /** @type {Size} */
    this.size = options.size ?? { width: 2, height: 2 };
    /** @type {string} */
    this.color = options.color ?? "#000";
  }



  /**
   * @returns {DrawData}
   */
  get drawData() {
    return {
      position: {...this.position},
      size: {...this.size},
    };
  }
}

export default Particle;
