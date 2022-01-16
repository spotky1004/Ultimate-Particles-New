import Particle from "./Particle.js";

const EventTypeEnum = {
  DestroyAll: 0,
  DestroyRandom: 1,
  SetZIndex: 2,
};

/**
 * @typedef {keyof typeof EventTypeEnum} EventTypes
 */
/**
 * @typedef EventDatas
 * @property {{ }} DestroyAll
 * @property {{ chance: number }} DestroyRandom
 * @property {{ zIndex: number }} SetZIndex
 */

class ParticleGroup {
  constructor() {
    /** @type {Particle[]} */
    this.particles = [];
    /** @type {number} */
    this.zIndex = 0;
  }

  /**
   * @param {Particle} particle
   */
  addParticle(particle) {
    if (particle instanceof Particle) {
      this.particles.push(particle);
    }
  }

  /**
   * @template {keyof typeof EventTypeEnum} T
   * @param {T} type 
   * @param {EventDatas[T]} data 
   */
  emitEvent(type, data) {
    switch (type) {
      case "DestroyAll":
        this.destroyAll(data);
        break;
      case "DestroyRandom":
        this.destroyRandom(data);
        break;
      case "SetZIndex":
        this.setZIndex(data);
        break;
    }
  }

  /**
   * @param {object} obj
   */
  destroyAll({ }) {
    this.particles = [];
  }

  /**
   * @param {object} param0
   * @param {number} param0.chance 
   */
  destroyRandom({ chance }) {
    let particles = [];
    for (let i = 0; i < this.particles.length; i++) {
      if (Math.random() > chance) particles.push(this.particles[i]);
    }
    this.particles = particles;
  }

  /**
   * @param {object} param0 
   * @param {number} param0.zIndex
   */
  setZIndex({ zIndex }) {
    this.zIndex = zIndex ?? 1;
  }

  /**
   * @param {import("./Particle.js").default} particle 
   */
  removeParticle(particle) {
    this.particles = this.particles.filter(p => p !== particle);
  }
}

export default ParticleGroup;
