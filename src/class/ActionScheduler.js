import isValueTure from "../util/isValueTrue.js";

/**
 * @typedef {import("./Stage.js").default} Stage
 * @typedef {import("./Actions/index.js").AnyAction} AnyAction
 */
/**
 * @typedef LoopingAction
 * @property {AnyAction} action
 * @property {number} lastPerformed
 * @property {number} performCount
 */
/**
 * @typedef ActionToPerform
 * @property {AnyAction} action 
 * @property {number} loop 
 * @property {number} timeOffset 
 * @property {number} innerLoop 
 */

class ActionScheduler {
  /** @param {Stage} stage */
  constructor(stage) {
    /** @type {typeof stage} */
    this.parent = stage;

    /** @type {AnyAction[]} */
    this.actions = [...stage.actions].sort((a, b) => a.startTime - b.startTime);
    /** @type {Object.<string, AnyAction[]>} */
    this.actionGroups = {};
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i];
      const group = action.groupName;
      if (typeof this.actionGroups[group] === "undefined") {
        this.actionGroups[group] = [];
      }
      this.actionGroups[group].push(action);
    }

    /** @type {number} */
    this.actionIndex = 0;
    /** @type {LoopingAction[]} */
    this.loopingActions = [];
    /** @type {ActionToPerform[]} */
    this.actionsToPerform = [];
  }

  /**
   * @param {object} param0
   * @param {AnyAction} param0.action
   * @param {number} param0.startTime
   * @param {number} param0.performCount
   */
  addLoopingAction({ action, startTime, performCount }) {
    this.loopingActions.push({
      action,
      lastPerformed: startTime,
      performCount
    })
  }

  /**
   * @param {string} name 
   * @param {string} offset 
   */
  activateGroup(name, offset=0) {
    console.log(name);
    const time = (this.parent.playingData.time ?? 0) - offset;
    const group = this.actionGroups[name];
    if (typeof group === "undefined") return;

    for (let i = 0; i < group.length; i++) {
      const action = group[i];
      this.addLoopingAction({
        action,
        startTime: time,
        performCount: 0
      });
    }
  }

  /**
   * @param {ActionToPerform} param0
   */
  addActionToPerform({ action, loop=0, innerLoop=0, timeOffset=0 }) {
    this.actionsToPerform.push({
      action,
      loop,
      innerLoop,
      timeOffset
    });
  }

  /**
   * @param {number} time
   * @param {Object.<string, number | string>} globalVariables
   * @returns {boolean}
   */
  tick(globalVariables={}) {
    const actions = this.actionGroups["default"];
    const stage = this.parent;
    const time = stage.playingData.time;

    // Init loop limit
    const LOOP_LIMIT = 10000;
    let loops = 0;

    this.actionsToPerform = [];
    // Prepare to perform action
    for (let i = this.actionIndex; i < actions.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;
      
      const action = actions[i];
      if (action.startTime > time) break;
      
      const actionLooperData = action.getLooperData(0);
      if (!isValueTure(actionLooperData.shouldPerform)) continue;
      const innerLoopCount = Math.floor(actionLooperData.innerLoop);
      for (let j = 0; j < innerLoopCount; j++) {
        loops++;
        if (loops > LOOP_LIMIT) return false;
        this.addActionToPerform({
          action,
          loop: 0,
          innerLoop: j,
          timeOffset: 0
        });
      }
      const loopCount = actionLooperData.loopCount;
      if (loopCount >= 2) {
        this.addLoopingAction({
          action,
          startTime: action.startTime,
          performCount: 0
        });
      }
      this.actionIndex++;
    }

    // Action looper
    for (let i = 0; i < this.loopingActions.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const loopingAction = this.loopingActions[i];
      const actionLooperData = loopingAction.action.getLooperData(loopingAction.performCount);
      const bulkLoop = actionLooperData.interval > 0 ? Math.floor( ( time - loopingAction.lastPerformed ) / actionLooperData.interval ) : stage.maximumTickLength;
      const offsetOffset = (time - loopingAction.lastPerformed) % actionLooperData.interval;
      for (let j = 0; j < bulkLoop; j++) {
        loops++;
        if (loops > LOOP_LIMIT) return false;
        
        if (isValueTure(actionLooperData.shouldPerform)) continue;
        const innerLoopCount = Math.floor(actionLooperData.innerLoop);
        for (let k = 0; k < innerLoopCount; k++) {
          loops++;
          if (loops > LOOP_LIMIT) return false;
          
          const offset = actionLooperData.interval*(bulkLoop-j-1)+offsetOffset || 0;
          this.addActionToPerform({
            action: loopingAction.action,
            loop: loopingAction.performCount,
            innerLoop: k,
            timeOffset: offset
          });
        }
        loopingAction.lastPerformed += actionLooperData.interval;
        loopingAction.performCount++;
        if (loopingAction.performCount+1 >= actionLooperData.loopCount) {
          this.loopingActions[i] = null;
          break;
        }
      }
    }
    this.loopingActions = this.loopingActions.filter(loopingAction => loopingAction);

    // Perform action
    for (let i = 0; i < this.actionsToPerform.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const { action, loop, offset, innerLoop } = this.actionsToPerform[i];
      const globalVariablesToIncrement = action.incrementGlobal;
      if (
        globalVariablesToIncrement &&
        typeof stage.playingData.globalVariables.value[globalVariablesToIncrement] !== "undefined"
      ) {
        stage.playingData.globalVariables.changeValue({
          key:globalVariablesToIncrement,
          value: globalVariables[globalVariablesToIncrement] + 1
        });
      }
      /** @type {import("./Actions/ActionBase.js").PerformParams} */
      const performParams = {
        stage,
        loop,
        innerLoop,
        timeOffset: offset,
        globalVariables
      };

      action.perform(performParams);
    }

    return true;
  }
}

export default ActionScheduler;
