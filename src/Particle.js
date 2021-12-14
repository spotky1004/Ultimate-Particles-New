import Value from "./Value.js";

/**
 * @typedef Vector2
 * @property {T} x
 * @property {T} y
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
 * @property {string | number} [speed]
 * @property {string | number} [deg]
 */
/**
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
    this.variables = {

    /** @type {ParticleValues["id"]} */
    const id = options.id;
    this._id = new Value(id);
    /** @type {ParticleValues["time"]} */
    const time = timestemp;
    this._time = new Value(time);
    /** @type {ParticleValues["position"]} */
    const position = options.position ?? { x: 50, y: 50 };
    this._position = new Value(position);
    /** @type {ParticleValues["size"]} */
    const size = options.size ?? { width: 2, height: 2 };
    this._size = new Value(size);
    /** @type {ParticleValues["color"]} */
    const color = options.color ?? "#000";
    this._color = new Value(color);
    /** @type {ParticleValues["speed"]} */
    const speed = options.speed ?? 0;
    this._speed = new Value(speed);
    /** @type {ParticleValues["deg"]} */
    const deg = options.deg ?? 0;
    this._deg = new Value(deg);
  }

  updateValues() {
    this.values = {
      id: this._id.getValue(variables),
      position: this._position.getValue(variables),
      size: this._size.getValue(variables),
      color: this._color.getValue(variables),
      speed: this._speed.getValue(variables),
      deg: this.deg.getValue(variables),
    };
  }
    }
  }

  /**
   * @returns {DrawData}
   */
  get drawData() {
    return {
      position: {...this.values.position},
      size: {...this.values.size},
    };
  }
}

export default Particle;

let test = new Particle({
  id: "test",
  color: "\"#\"+0+0+0+\"f\"+0+1",
  position: {
    x: "$a",
    y: "$b"
  },
  size: {
    x: "$a*$b",
    y: "$b/$a"
  }
}, {
  a: 5,
  b: 6
});
window.Particle = Particle;
window.test = test;
