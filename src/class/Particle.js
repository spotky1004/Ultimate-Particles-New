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
 * @property {string | string[]} [group] - Particle group
 * @property {Object.<string, number | string>} constants
 * @property {Object.<string, number | string>} variables
 * @property {Size<number | string>} [size] - Size of the particle.
 * @property {Vector2<number | string>} [position] - Position of the particle.
 * @property {string} [color] - Color of the particle.
 * @property {string | number} [speed]
 * @property {string | number} [deg]
 * @property {string | number | boolean} [tracePlayerIf]
 * @property {string | number | boolean} [hasHitboxIf]
 */
/**
 * @typedef ParticleValues
 * @property {string} group
 * @property {Vector2<number>} position
 * @property {Size<number>} size
 * @property {string} color
 * @property {number} speed
 * @property {number} deg
 * @property {string | number | boolean} tracePlayerIf
 * @property {string | number | boolean} hasHitboxIf
 */
/**
 * @typedef DrawData
 * @property {Vector2<number>} position
 * @property {Size<number>} size
 */

class Particle {
  /**
   * @param {ParticleOptions} options 
   * @param {Object.<string, number | string | boolean>} variables
   */
  constructor(options, variables) {
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.seed = Math.floor(Math.random() * 1e6);

    const { i, j } = variables;
    /** @type {typeof options["constants"]} */
    this.constants = new Value({...options.constants, i, j} ?? {}).getValue(variables);
    /** @type {Value<typeof options["variables"]>} */
    this._variables = new Value(this.variables ?? {});

    /** @type {ParticleValues} */
    this.values = {};

    /** @type {ParticleValues["group"]} */
    this.group = options.group ?? "default";
    /** @type {ParticleValues["position"]} */
    const position = options.position ?? { x: 50, y: 50 };
    this._position = new Value(position, this.constants);
    /** @type {ParticleValues["size"]} */
    const size = options.size ?? { width: 2, height: 2 };
    this._size = new Value(size, this.constants);
    /** @type {ParticleValues["color"]} */
    const color = options.color ?? "#000";
    this._color = new Value(color, this.constants);
    /** @type {ParticleValues["speed"]} */
    const speed = options.speed ?? 0;
    this._speed = new Value(speed, this.constants);
    /** @type {ParticleValues["deg"]} */
    const deg = options.deg ?? null;
    this._deg = new Value(deg, this.constants);
    /** @type {ParticleValues["tracePlayerIf"]} */
    const tracePlayerIf = options.tracePlayerIf ?? false;
    this._tracePlayerIf = new Value(tracePlayerIf, this.constants);
    /** @type {ParticleValues["hasHitboxIf"]} */
    const hasHitboxIf = options.hasHitboxIf ?? true;
    this._hasHitboxIf = new Value(hasHitboxIf, this.constants);

    const _variables = this.getVariables(variables);
    this.updateValues(_variables);
  }

  get x() {
    return this.values.position.x;
  }
  get y() {
    return this.values.position.y;
  }

  /**
   * @param {number} position
   */
  set x(position) {
    this._position.changeValue({ key: "x", value: position });
  }
  /**
   * @param {number} position
   */
  set y(position) {
    this._position.changeValue({ key: "y", value: position });
  }

  /**
   * @param {Object.<string, number | string>} globalVariables
   */
  getVariables(globalVariables={}) {
    /** @type {Object.<string, number | string>} */
    let variables = Object.assign({ t: this.time }, globalVariables, this.constants);
    variables = Object.assign(this._variables.getValue(variables), variables);
    return variables;
  }

  /** @param {Object.<string, number | string>} globalVariables */
  updateValues(variables={}) {
    this.values = {
      group: this.group,
      position: this._position.getValue(variables),
      size: this._size.getValue(variables),
      color: this._color.getValue(variables),
      speed: this._speed.getValue(variables),
      deg: this._deg.getValue(variables),
      tracePlayerIf: this._tracePlayerIf.getValue(variables),
      hasHitboxIf: this._hasHitboxIf.getValue(variables),
    };

    return this;
  }

  /**
   * @param {number} dt 
   * @param {Object.<string, number | string>} globalVariables
   */
  tick(dt, globalVariables={}) {
    const _dt = dt/1000;
    this.time += dt;

    const variables = this.getVariables(globalVariables);

    // For fixed position
    if (this._position.isValueFixed) {
      if (this._deg.getValue(variables) !== null) {
        const speed = this._speed.getValue(variables);
        const position = this._position.getValue(variables);
        const [ dx, dy ] = [
          Math.sin(this.values.deg/180*Math.PI),
          -Math.cos(this.values.deg/180*Math.PI)
        ];
        this._position.changeValue({ key: "x", value: Number(position.x) + speed*dx*_dt });
        this._position.changeValue({ key: "y", value: Number(position.y) + speed*dy*_dt });
      }
    }

    this.updateValues(variables);

    return this;
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

// let test = new Particle({
//   id: "test",
//   color: "\"#\"+0+0+0+\"f\"+0+1",
//   position: {
//     x: "$a+$t/10",
//     y: "$b"
//   },
//   size: {
//     x: "$a*$b",
//     y: "$b/$a"
//   }
// }, {
//   a: 5,
//   b: 6
// });
// window.Particle = Particle;
// window.test = test;
