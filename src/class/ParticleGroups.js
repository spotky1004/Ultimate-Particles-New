import ParticleGroup from "./ParticleGroup.js";
import Value from "./Value.js";

class ParticleGroups {
  /** @param {string[]} initialGroups */
  constructor(initialGroups) {
    /** @type {Object.<string, ParticleGroup>} */
    this.groups = {};
    for (let i = 0; i < initialGroups.length; i++) {
      const groupName = initialGroups[i];
      this.groups[groupName] = new ParticleGroup();
    }
  }

  /**
   * @param {import("./Particle.js").default} particle
   * @param {Object.<string, number | string>} globalVariables
   */
  addParticle(particle, globalVariables) {
    const groupName = particle.group;
    if (typeof this.groups[groupName] === "undefined") {
      this.groups[groupName] = new ParticleGroup();
    }
    this.groups[groupName].addParticle(particle);
  }
}

export default ParticleGroups;
