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
 * @property {string} [activeGroupOnHit]
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
 * @property {string} activeGroupOnHit
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
  constructor(options={}, variables={}) {
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.seed = Math.floor(Math.random() * 1e6);

    const { i, j } = variables;
    /** @type {typeof options["constants"]} */
    this.constants = new Value({...options.constants, i, j} ?? {}).getValue(variables);
    /** @type {Value<typeof options["variables"]>} */
    this._variables = new Value(options.variables ?? {});

    /** @type {ParticleValues} */
    this.values = {};
    /** @type {Object<string, any>} */
    this.variables = {...this.constants, thisX: null, thisY: null};

    const variableNames = Object.keys(options.variables ?? {});
    const fixedConstants = Object.fromEntries(Object.entries(this.constants).filter(([key]) => !variableNames.includes(key)));

    /** @type {ParticleValues["group"]} */
    this.group = options.group ?? "default";
    /** @type {ParticleValues["position"]} */
    const position = options.position ?? { x: 50, y: 50 };
    this._position = new Value(position, fixedConstants);
    /** @type {ParticleValues["size"]} */
    const size = options.size ?? { width: 2, height: 2 };
    this._size = new Value(size, fixedConstants);
    /** @type {ParticleValues["color"]} */
    const color = options.color ?? "#000";
    this._color = new Value(color, fixedConstants);
    /** @type {ParticleValues["speed"]} */
    const speed = options.speed ?? 0;
    this._speed = new Value(speed, fixedConstants);
    /** @type {ParticleValues["deg"]} */
    const deg = options.deg ?? null;
    this._deg = new Value(deg, fixedConstants);
    /** @type {ParticleValues["tracePlayerIf"]} */
    const tracePlayerIf = options.tracePlayerIf ?? false;
    this._tracePlayerIf = new Value(tracePlayerIf, fixedConstants);
    /** @type {ParticleValues["hasHitboxIf"]} */
    const hasHitboxIf = options.hasHitboxIf ?? true;
    this._hasHitboxIf = new Value(hasHitboxIf, fixedConstants);
    /** @type {ParticleValues["hasHitboxIf"]} */
    const activeGroupOnHit = options.activeGroupOnHit ?? "";
    this._activeGroupOnHit = new Value(activeGroupOnHit);
    
    this.updateVariables(0, variables);
    this.updateValues();
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
   * @param {number} dt
   * @param {Object.<string, number | string>} globalVariables
   */
  updateVariables(dt=0, globalVariables={}) {
    Object.assign(this.variables, globalVariables);
    this.variables.dt = dt;
    this.variables.t = this.time;
    this.variables.thisX = this.values?.position?.x;
    this.variables.thisY = this.values?.position?.y;
    Object.assign(this.variables, this._variables.getValue(this.variables));
  }

  updateValues() {
    const variables = this.variables;

    this.values = {
      group: this.group,
      position: this._position.getValue(variables),
      size: this._size.getValue(variables),
      color: this._color.getValue(variables),
      speed: this._speed.getValue(variables),
      deg: this._deg.getValue(variables),
      tracePlayerIf: this._tracePlayerIf.getValue(variables),
      hasHitboxIf: this._hasHitboxIf.getValue(variables),
      activeGroupOnHit: this._activeGroupOnHit.getValue(variables),
    };

    return this;
  }

  /**
   * @param {number} dt 
   * @param {Object.<string, number | string>} globalVariables
   */
  tick(dt=0, globalVariables={}) {
    const _dt = dt/1000;
    this.time += dt;

    this.updateVariables(dt, globalVariables);
    const variables = this.variables;

    // For fixed position
    if (this._position.isValueFixed) {
      const deg = this._deg.getValue(variables);
      if (deg !== null) {
        const speed = this._speed.getValue(variables);
        const position = this._position.getValue(variables);
        const [ dx, dy ] = [
          Math.sin(deg/180*Math.PI),
          -Math.cos(deg/180*Math.PI)
        ];
        this._position.changeValue({ key: "x", value: Number(position.x) + speed*dx*_dt });
        this._position.changeValue({ key: "y", value: Number(position.y) + speed*dy*_dt });
      }
    }

    this.updateValues();

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
