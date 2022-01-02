const EventTypeEnum = {
  DestroyAll: 0,
  DestroyRandom: 1,
};

/**
 * @typedef {keyof typeof EventTypeEnum} EventTypes
 */
/**
 * @typedef EventDatas
 * @property {{ }} DestroyAll
 * @property {{ chance: number }} DestroyRandom
 */

class ParticleGroup {
  constructor() {
    /** @type {import("./Particle.js").default[]} */
    this.particles = [];
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
      case "DestroyRandom":
        this.destroyRandom(data);
    }
  }

  /**
   * @param {object} obj
   */
  destroyAll({ }) {
    this.particles = [];
  }

  /**
   * @param {object} obj
   * @param {number} obj.chance 
   */
  destroyRandom({ chance }) {
    let particles = [];
    for (let i = 0; i < this.particles.length; i++) {
      if (Math.random() > chance) particles.push(this.particles[i]);
    }
    this.particles = particles;
  }

  /**
   * @param {import("./Particle.js").default} particle 
   */
  removeParticle(particle) {
    this.particles = this.particles.filter(p => p !== particle);
  }
}

export default ParticleGroup;
