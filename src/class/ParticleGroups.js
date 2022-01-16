import ParticleGroup from "./ParticleGroup.js";
import Value from "./Value.js";

/**
 * @template {string[]} T
 */
class ParticleGroups {
  /** @param {T} initialGroups */
  constructor(initialGroups) {
    /** @type {Record.<T[number], ParticleGroup> & Object.<string, ParticleGroup>} */
    this.groups = {};
    for (let i = 0; i < initialGroups.length; i++) {
      const groupName = initialGroups[i];
      this.groups[groupName] = new ParticleGroup();
    }
  }

  tick() {
    this.groups = Object.fromEntries(Object.entries(this.groups).sort(([, groupA], [, groupB]) => groupB.zIndex - groupA.zIndex));
  }

  /**
   * @param {import("./Particle.js").default} particle
   * @param {Object.<string, number | string>} globalVariables
   */
  addParticle(particle, globalVariables) {
    const groupName = new Value(particle.group).getValue(globalVariables);
    if (typeof this.groups[groupName] === "undefined") {
      this.groups[groupName] = new ParticleGroup();
    }
    this.groups[groupName].addParticle(particle);
  }
}

export default ParticleGroups;
