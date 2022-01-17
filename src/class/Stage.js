import Value from "./Value.js";
import isValueTure from "../util/isValueTrue.js";
import StageAttribute from "./StageAttribute.js";
import ParticleGroups from "./ParticleGroups.js";
import ActionScheduler from "./ActionScheduler.js";
import Status from "./Status.js";
import drawCanvas from "../drawCanvas.js";

/**
 * @typedef {import("./Actions/index.js").AnyAction} AnyAction
 */
/**
 * @typedef StageMetadata
 * @property {string} author
 * @property {string} description
 * @property {string} createDate
 */
/**
 * @typedef StageOptions
 * @property {number} [maximumTickLength]
 * @property {AnyAction[]} actions
 * @property {StageMetadata} metadata
 */

class Stage {
  /**
   * @param {StageOptions} options 
   */
  constructor(options) {
    /** @type {AnyAction[]} */
    this.actions = options.actions;
    /** @type {number} */
    this.maximumTickLength = options.maximumTickLength ?? Math.ceil(1000/60);
    const metadata = options.metadata ?? {};
    /** @type {StageMetadata} */
    this.metadata = {
      author: metadata.author ?? "",
      description: metadata.description ?? "",
      createDate: metadata.createDate ?? new Date().toGMTString(),
    };
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef StageState
     * @property {number} time
     * @property {StageAttribute} stageAttribute
     * @property {ParticleGroups<["default", "player"]>} particleGroups
     * @property {ActionScheduler} actionScheduler
     * @property {Value<Object.<string, (number | string)>>} globalVariables
     * @property {Status} status
     */
    /** @type {StageState} */
    this.state = {};
  }

  play() {
    this.playing = true;
    this.state = {
      time: 0,
      stageAttribute: new StageAttribute(),
      particleGroups: new ParticleGroups(["default", "player"]),
      actionScheduler: new ActionScheduler(this),
      globalVariables: new Value({
        life: 10,
        maxLife: 10,
      }),
      status: new Status(),
    };
  }

  /**
   * @param {number} dt 
   * @param {boolean} updateCanvas 
   * @param {{ keyPressed: Object.<string, boolean>, screenDragPower: { x: number, y: number, power: number } }} inputs
   * @returns {boolean}
   */
  tick(dt, updateCanvas=true, inputs={}) {
    if (!this.playing) return;

    const { keyPressed, screenDragPower } = inputs;
    
    dt = Math.min(this.maximumTickLength, dt);

    // Init loop limit
    const LOOP_LIMIT = 80000;
    let loops = 0;
    let wasSuccessful = true;
    
    // GlobalVariables
    this.state.time += dt;
    const time = this.state.time;
    
    let globalVariables = this.state.globalVariables.getValue({ t: time/1000, ...this.state.globalVariables });
    globalVariables.dt = dt/1000;
    globalVariables.stageTime = time/1000;
    globalVariables.stageX = this.state.stageAttribute.stageX;
    globalVariables.stageY = this.state.stageAttribute.stageY;
    const playerParticles = this.state.particleGroups.groups["player"].particles;
    const playerToStore = playerParticles[Math.floor(Math.random() * playerParticles.length)];
    if (playerToStore) {
      globalVariables.playerX = playerToStore.values.position.x;
      globalVariables.playerY = playerToStore.values.position.y;
    } else {
      globalVariables.playerX = 0;
      globalVariables.playerY = 0;
    }
    
    // Run ActionScheduler
    wasSuccessful &= this.state.actionScheduler.tick(globalVariables);

    // Fix state
    this.state.stageAttribute.fixValues();

    this.state.particleGroups.tick();

    // Player move
    const stageRange = this.state.stageAttribute.stageRange;
    const playerDirections = {
      up: Boolean(keyPressed.KeyW || keyPressed.ArrowUp),
      down: Boolean(keyPressed.KeyS || keyPressed.ArrowDown),
      left: Boolean(keyPressed.KeyA || keyPressed.ArrowLeft),
      right: Boolean(keyPressed.KeyD || keyPressed.ArrowRight),
    }
    const isBothDirections = Boolean((playerDirections.up ^ playerDirections.down) && (playerDirections.left ^ playerDirections.right));
    const focusMode = Boolean(keyPressed.ShiftLeft || keyPressed.ShiftRight);
    const playerSpeedFactor = (focusMode ? 0.5 : 1) / (isBothDirections ? Math.SQRT2 : 1);
    const playerVec = screenDragPower.power > 0 ? screenDragPower : {
      x: playerSpeedFactor * (playerDirections.right - playerDirections.left),
      y: playerSpeedFactor * (playerDirections.down - playerDirections.up)
    };
    for (let i = 0; i < playerParticles.length; i++) {
      const particle = playerParticles[i];
      const speed = particle.values.speed;
      const size = particle.values.size;
      // console.log({...particle.values}, {...globalVariables});
      particle.x = Math.min(stageRange.x[1]-size.width/2, Math.max(stageRange.x[0]+size.width/2, particle.x + speed*playerVec.x*dt/1000));
      particle.y = Math.min(stageRange.y[1]-size.height/2, Math.max(stageRange.y[0]+size.height/2, particle.y + speed*playerVec.y*dt/1000));
      particle.updateValues(0, globalVariables);
    }

    // Particle loop
    const outOfBoundsRange = this.state.stageAttribute.outOfBoundsRange;
    for (const groupName in this.state.particleGroups.groups) {
      const particleGroup = this.state.particleGroups.groups[groupName];
      const particles = particleGroup.particles;
      const particlesToRemove = [];
      outLoop: for (let i = 0; i < particles.length; i++) {
        loops++;
        if (loops > LOOP_LIMIT) return false;
        const particle = particles[i];

        // Check OutOfBounds
        if (groupName !== "player") {
          if (
            particle.values.position.x < outOfBoundsRange.x[0] ||
            particle.values.position.x > outOfBoundsRange.x[1] ||
            particle.values.position.y < outOfBoundsRange.y[0] ||
            particle.values.position.y > outOfBoundsRange.y[1]
          ) {
            particlesToRemove.push(particle);
            continue;
          }
        }

        // Update particles
        particle.tick(dt, globalVariables);

        // Player collision
        if (groupName !== "player") {
          if (isValueTure(particle.values.tracePlayerIf)) {
            const toTraceIdx = particle.seed%playerParticles.length;
            const toTrace = playerParticles[toTraceIdx];
            const { x: particleX, y: particleY } = particle.values.position;
            const { x: toTraceX, y: toTraceY } = toTrace.values.position;
            const deg = (Math.atan2(toTraceY-particleY, toTraceX-particleX)*180/Math.PI+360+90)%360;
            particle._deg.changeValue({ value: deg });
          }

          if (isValueTure(particle.values.hasHitboxIf)) {
            let { x: particleX, y: particleY } = particle.values.position;
            const { width: particleWidth, height: particleHeight } = particle.values.size;
            for (let j = 0; j < playerParticles.length; j++) {
              const playerParticle = playerParticles[j];
  
              let { x: playerX, y: playerY } = playerParticle.values.position;
              let { width: playerWidth, height: playerHeight } = playerParticle.values.size;
              const playerHitboxFactor = this.state.stageAttribute.playerHitboxFactor;
              playerWidth *= playerHitboxFactor;
              playerHeight *= playerHitboxFactor;
              playerX -= playerWidth/2;
              playerY -= playerHeight/2;
              particleX -= particleWidth/2;
              particleY -= particleHeight/2;
  
              // Player collision
              if (
                playerX < particleX + particleWidth &&
                playerX + playerWidth > particleX &&
                playerY < particleY + particleHeight &&
                playerHeight + playerY > particleY
              ) {
                const actionGroupToActive = particle.values.activeGroupOnHit;
                if (actionGroupToActive === "") {
                  this.state.globalVariables.changeValue({ key: "life", value: Math.max(0, globalVariables.life - 1) });
                  globalVariables.life = this.state.globalVariables.value.life.getValue(globalVariables);
                } else {
                  this.state.actionScheduler.activateGroup(actionGroupToActive);
                }
                particlesToRemove.push(particle);
                continue outLoop;
              }
            }
          }
        }
      }
      for (let i = 0; i < particlesToRemove.length; i++) {
        particleGroup.removeParticle(particlesToRemove[i]);
      }
    }
    
    // Update status
    this.state.status.update(globalVariables);
    
    if (updateCanvas) drawCanvas(this);
    
    // Life check
    if (globalVariables.life <= 0) {
      this.stop();
      return false;
    }

    return wasSuccessful;
  }

  
  stop() {
    this.playing = false;
  }
  
  continue() {
    this.playing = true;
  }
  
  export() {
    const data = {
      maximumTickLength: this.maximumTickLength,
      metadata: this.metadata,
      actions: []
    };

    for (let i = 0; i < this.actions.length; i++) {
      data.actions.push(this.actions[i].export());
    }

    return data;
  }
  toString() {
    return JSON.stringify(this.export(), null, 2);
  }

  /**
   * @param {string} name 
   */
  deleteGroup(name) {
    if (this.state.particleGroups.groups[name]) {
      delete this.state.particleGroups.groups[name];
    }
  }
}

export default Stage;
