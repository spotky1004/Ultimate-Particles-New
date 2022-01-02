import Action from "./Action.js";
import Status from "./Status.js";
import Value from "./Value.js";
import ParticleGroup from "./ParticleGroup.js";
import drawCanvas from "../drawCanvas.js";
import fixNumber from "../util/fixNumber.js";

/**
 * @typedef StageOptions
 * @property {Particle[]} particlePalette
 * @property {number} [maximumTickLength]
 * @property {Action[]} actions
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
    if (!(options.actions[0] instanceof Action)) options.actions = [...options.actions].map(actionData => new Action(...actionData));
    this.actions = options.actions.sort((a, b) => a.time - b.time);
    this.maximumTickLength = options.maximumTickLength ?? Math.ceil(1000/60);
    /** @type {boolean} */
    this.playing = false;
    /**
     * @typedef LoopingAction
     * @property {Action} action
     * @property {number} lastPerformed
     * @property {number} performCount
     * @property {import("./Action.js").ActionLooper} interval
     * @property {number} intervalUpdatedAt
     */
    /**
     * @typedef PlayingData
     * @property {number} time
     * @property {StageAttribute} stageAttribute
     * @property {Object.<string, ParticleGroup>} particleGroups
     * @property {number} actionIdx
     * @property {LoopingAction[]} loopingActions - [Action, loopCount]
     * @property {Value<Object.<string, (number | string)>>} globalVariables
     * @property {Status} status
     */
    /** @type {PlayingData} */
    this.playingData = {};
  }

  play() {
    this.playing = true;
    this.playingData = {
      time: 0,
      stageAttribute: {
        bgColor: "#ffc966",
        outOfBoundsFactor: 2,
        width: 100,
        height: 100,
        stageX: 0,
        stageY: 0,
        playerHitboxFactor: 1,
      },
      particleGroups: {
        player: new ParticleGroup(),
        default: new ParticleGroup()
      },
      actionIdx: 0,
      loopingActions: [],
      globalVariables: new Value({
        life: 10,
        maxLife: 10,
      }),
      status: new Status()
    };
  }

  /**
   * @param {number} dt 
   * @param {boolean} updateCanvas 
   * @param {Object.<string, boolean>} keyPressed 
   * @returns {boolean}
   */
  tick(dt, updateCanvas=true, keyPressed={}) {
    if (!this.playing) return;
    
    dt = Math.min(this.maximumTickLength, dt);

    // Fix stageAttribute
    this.playingData.stageAttribute.stageWidth = fixNumber(this.playingData.stageAttribute.stageWidth, 0, 100, 100);
    this.playingData.stageAttribute.stageHeight = fixNumber(this.playingData.stageAttribute.stageHeight, 0, 100, 100);
    this.playingData.stageAttribute.stageX = fixNumber(this.playingData.stageAttribute.stageX, -999999, 999999, 0);
    this.playingData.stageAttribute.stageY = fixNumber(this.playingData.stageAttribute.stageY, -999999, 999999, 0);

    // Init loop limit
    const LOOP_LIMIT = 10000;
    let loops = 0;

    // GlobalVariables
    this.playingData.time += dt;
    const time = this.playingData.time;
    
    let globalVariables = this.playingData.globalVariables.getValue({t: time, ...this.playingData.globalVariables});
    globalVariables.playTime = time;
    globalVariables.dt = dt/1000;
    globalVariables.stageWidth = this.playingData.stageAttribute.stageWidth;
    globalVariables.stageHeight = this.playingData.stageAttribute.stageHeight;
    globalVariables.stageX = this.playingData.stageAttribute.stageX;
    globalVariables.stageY = this.playingData.stageAttribute.stageY;

    /** @type {[Action, number, number][]} */
    let actionsToPerform = []; // [Action, loop, timeOffset, innerLoop]
    // Prepare to perform action
    for (let i = this.playingData.actionIdx; i < this.actions.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const action = this.actions[i];
      if (action.time > time) break;
      actionsToPerform.push([ action, 0, 0, 0 ]);
      if (action.loopCount >= 2) {
        this.playingData.loopingActions.push({
          action,
          lastPerformed: action.time,
          performCount: 1,
          interval: null,
          intervalUpdatedAt: null,
        });
      }
      this.playingData.actionIdx++;
    }

    // Action looper
    for (let i = 0; i < this.playingData.loopingActions.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const loopingAction = this.playingData.loopingActions[i];
      if (loopingAction.intervalUpdatedAt !== loopingAction.performCount) {
        loopingAction.interval = loopingAction.action.getLoopInterval(loopingAction.performCount);
      }
      const bulkLoop = loopingAction.interval > 0 ? Math.floor( ( time - loopingAction.lastPerformed ) / loopingAction.interval ) : this.maximumTickLength;
      const offsetOffset = (time - loopingAction.lastPerformed) % loopingAction.interval;
      for (let j = 0; j < bulkLoop; j++) {
        loops++;
        if (loops > LOOP_LIMIT) return false;

        const innerLoopCount = loopingAction.action.getInnerLoop(loopingAction.performCount);
        for (let k = 0; k < innerLoopCount; k++) {
          loops++;
          if (loops > LOOP_LIMIT) return false;
          
          const offset = loopingAction.interval*(bulkLoop-j-1)+offsetOffset || 0;
          actionsToPerform.push([ loopingAction.action, loopingAction.performCount, offset, k ]);
        }
        loopingAction.lastPerformed += loopingAction.interval;
        loopingAction.performCount++;
        if (loopingAction.performCount >= loopingAction.action.loopCount) {
          this.playingData.loopingActions.splice(i, 1);
          i--;
          break;
        }
      }
    }

    // Perform action
    for (let i = 0; i < actionsToPerform.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const [ action, loopCount, offset, innerLoop ] = actionsToPerform[i];
      action.perform(this, loopCount, offset, innerLoop, globalVariables);

      if (action.type === "SetGlobalVariable") {
        globalVariables[action.data.name] = this.playingData.globalVariables.value[action.data.name].getValue(globalVariables);
      }
    }
    
    // Player move
    const { stageWidth, stageHeight } = this.playingData.stageAttribute;
    const { stageX, stageY } = this.playingData.stageAttribute;
    const playerDirections = {
      up: Boolean(keyPressed.KeyW || keyPressed.ArrowUp),
      down: Boolean(keyPressed.KeyS || keyPressed.ArrowDown),
      left: Boolean(keyPressed.KeyA || keyPressed.ArrowLeft),
      right: Boolean(keyPressed.KeyD || keyPressed.ArrowRight),
    }
    const focusMode = Boolean(keyPressed.ShiftLeft || keyPressed.ShiftRight);
    const playerSpeedFactor = (focusMode ? 0.5 : 1);
    const playerVec = {
      x: playerSpeedFactor * (playerDirections.right - playerDirections.left),
      y: playerSpeedFactor * (playerDirections.down - playerDirections.up)
    };
    const playerParticles = this.playingData.particleGroups["player"].particles;
    for (let i = 0; i < playerParticles.length; i++) {
      const particle = playerParticles[i];
      const speed = particle.values.speed;
      const size = particle.values.size;
      particle.x = Math.min(stageWidth-size.width/2+stageX, Math.max(0+size.width/2+stageX, particle.x + speed*playerVec.x*dt/1000));
      particle.y = Math.min(stageHeight-size.height/2+stageY, Math.max(0+size.height/2+stageY, particle.y + speed*playerVec.y*dt/1000));
      particle.updateValues(globalVariables);
    }

    // Particle loop
    const outOfBoundsFactor = this.playingData.stageAttribute.outOfBoundsFactor;
    for (const groupName in this.playingData.particleGroups) {
      loops++;
      if (loops > LOOP_LIMIT) return false;
      
      const particleGroup = this.playingData.particleGroups[groupName];
      const particles = particleGroup.particles;
      const particlesToRemove = [];
      outLoop: for (let i = 0; i < particles.length; i++) {
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
          for (let j = 0; j < playerParticles.length; j++) {
            const playerParticle = playerParticles[j];

            let { x: playerX, y: playerY } = playerParticle.values.position;
            let { width: playerWidth, height: playerHeight } = playerParticle.values.size;
            const playerHitboxFactor = this.playingData.stageAttribute.playerHitboxFactor;
            playerWidth *= playerHitboxFactor;
            playerHeight *= playerHitboxFactor;
            playerX -= playerWidth/2;
            playerY -= playerHeight/2;
            let { x: particleX, y: particleY } = particle.values.position;
            const { width: particleWidth, height: particleHeight } = particle.values.size;
            particleX -= particleWidth/2;
            particleY -= particleHeight/2;

            // Player collision
            if (
              playerX < particleX + particleWidth &&
              playerX + playerWidth > particleX &&
              playerY < particleY + particleHeight &&
              playerHeight + playerY > particleY
            ) {
              this.playingData.globalVariables.changeValue({ key: "life", value: Math.max(0, globalVariables.life - 1) });
              globalVariables.life = this.playingData.globalVariables.value.life.getValue(globalVariables);
              particlesToRemove.push(particle);
              continue outLoop;
            }
          }
        }
      }
      for (let i = 0; i < particlesToRemove.length; i++) {
        particleGroup.removeParticle(particlesToRemove[i]);
      }
    }

    
    // Update status
    this.playingData.status.update(globalVariables);
    
    if (updateCanvas) drawCanvas(this);
    
    // Life check
    if (globalVariables.life <= 0) {
      this.stop();
      return false;
    }

    return true;
  }

  
  stop() {
    this.playing = false;
  }
  
  continue() {
    this.playing = true;
  }
  
  export() {
    const data = {
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

  /** @param {import("./Particle.js").default} particle */
  createParticle(particle) {
    const particleGroup = particle.values.group;
    if (!this.playingData.particleGroups[particleGroup]) this.playingData.particleGroups[particleGroup] = new ParticleGroup();
    this.playingData.particleGroups[particleGroup].particles.push(particle);
  }

  /**
   * @param {string} name 
   * @param {import("./ParticleGroup.js").EventTypes} type 
   * @param {import("./ParticleGroup.js").EventDatas} data 
   */
  emitGroupEvent(name, type, data) {
    if (this.playingData.particleGroups[name]) {
      this.playingData.particleGroups[name].emitEvent(type, data);
    }
  }

  /**
   * @param {string} name 
   */
  deleteGroup(name) {
    if (this.playingData.particleGroups[name]) {
      delete this.playingData.particleGroups[name];
    }
  }
}

export default Stage;
