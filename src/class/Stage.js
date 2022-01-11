import Value from "./Value.js";
import isValueTure from "../util/isValueTrue.js";
import ParticleGroups from "./ParticleGroups.js";
import ActionScheduler from "./ActionScheduler.js";
import Status from "./Status.js";
import drawCanvas from "../drawCanvas.js";
import fixNumber from "../util/fixNumber.js";

/**
 * @typedef {import("./Actions/index.js").AnyAction} AnyAction
 */
/**
 * @typedef StageOptions
 * @property {Particle[]} particlePalette
 * @property {number} [maximumTickLength]
 * @property {AnyAction[]} actions
 */

/**
 * @typedef StageAttribute
 * @property {string} bgColor
 * @property {number} outOfBoundsFactor
 * @property {number} playerHitboxFactor
 * @property {number} stageWidth
 * @property {number} stageHeight
 * @property {number} stageX
 * @property {number} stageY
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
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef StageState
     * @property {number} time
     * @property {StageAttribute} stageAttribute
     * @property {ParticleGroups} particleGroups
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
      stageAttribute: {
        bgColor: "#ffc966",
        outOfBoundsFactor: 2,
        stageWidth: 100,
        stageHeight: 100,
        stageX: 0,
        stageY: 0,
        playerHitboxFactor: 1,
      },
      particleGroups: new ParticleGroups(["default", "player"]),
      actionScheduler: new ActionScheduler(this),
      globalVariables: new Value({
        life: 10,
        maxLife: 10,
      }),
      status: new Status(),
    };
  }

  fixState() {
    this.state.stageAttribute.stageWidth = fixNumber(this.state.stageAttribute.stageWidth, 0, 100, 100);
    this.state.stageAttribute.stageHeight = fixNumber(this.state.stageAttribute.stageHeight, 0, 100, 100);
    this.state.stageAttribute.stageX = fixNumber(this.state.stageAttribute.stageX, -999999, 999999, 0);
    this.state.stageAttribute.stageY = fixNumber(this.state.stageAttribute.stageY, -999999, 999999, 0);
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
    globalVariables.stageWidth = this.state.stageAttribute.stageWidth;
    globalVariables.stageHeight = this.state.stageAttribute.stageHeight;
    globalVariables.stageX = this.state.stageAttribute.stageX;
    globalVariables.stageY = this.state.stageAttribute.stageY;
    
    wasSuccessful &= this.state.actionScheduler.tick(globalVariables);

    // Player move
    const { stageWidth, stageHeight } = this.state.stageAttribute;
    const { stageX, stageY } = this.state.stageAttribute;
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
    const playerParticles = this.state.particleGroups.groups["player"].particles;
    for (let i = 0; i < playerParticles.length; i++) {
      const particle = playerParticles[i];
      const speed = particle.values.speed;
      const size = particle.values.size;
      particle.x = Math.min(stageWidth-size.width/2+stageX, Math.max(0+size.width/2+stageX, particle.x + speed*playerVec.x*dt/1000));
      particle.y = Math.min(stageHeight-size.height/2+stageY, Math.max(0+size.height/2+stageY, particle.y + speed*playerVec.y*dt/1000));
      particle.updateValues(globalVariables);
    }

    // Particle loop
    const outOfBoundsFactor = this.state.stageAttribute.outOfBoundsFactor;
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
            (particle.values.position.x - stageX) > stageWidth * outOfBoundsFactor ||
            (particle.values.position.x - stageX) < stageWidth * -(outOfBoundsFactor-1) ||
            (particle.values.position.y - stageY) > stageHeight * outOfBoundsFactor ||
            (particle.values.position.y - stageY) < stageHeight * -(outOfBoundsFactor-1)
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
                this.state.globalVariables.changeValue({ key: "life", value: Math.max(0, globalVariables.life - 1) });
                globalVariables.life = this.state.globalVariables.value.life.getValue(globalVariables);
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

    // Fix state
    this.fixState();
    
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
   * @param {import("./ParticleGroup.js").EventTypes} type 
   * @param {import("./ParticleGroup.js").EventDatas} data 
   */
  emitGroupEvent(name, type, data) {
    if (this.state.particleGroups[name]) {
      this.state.particleGroups.groups[name].emitEvent(type, data);
    }
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
