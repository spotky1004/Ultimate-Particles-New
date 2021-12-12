import Value from "./Value.js";

/**
 * @typedef Vector2
 * @property {T} width
 * @property {T} height
 * @template T
 */
/**
 * @typedef Size
 * @property {T} width
 * @property {T} height
 * @template T
 */

/**
 * @typedef ParticleOptions
 * @property {string} id - Id of the particle, use to recognize particle.
 * @property {Size<number | string>} [size] - Size of the particle.
 * @property {Vector2<number | string>} [position] - Position of the particle.
 * @property {string} [color] - Color of the particle.
 */
/**
 * @typedef DrawData
 * @property {Vector2<number>} position
 * @property {Size<number>} size
 */

class Particle {
  /**
   * @param {ParticleOptions} options 
   */
  constructor(options, variables) {
    this.variables = {...variables};

    /** @type {string} */
    this._id = options.id;
    this._position = new Value(options.position ?? { x: 50, y: 50 });
    this._size = new Value(options.size ?? { width: 2, height: 2 });
    this._color = new Value(options.color ?? "#000");
  }

  getValues(variables) {
    variables = {...this.variables, ...variables};
    return {
      id: this._id,
      position: this._position.getValue(variables),
      size: this._size.getValue(variables),
      color: this._color.getValue(variables),
    }
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
