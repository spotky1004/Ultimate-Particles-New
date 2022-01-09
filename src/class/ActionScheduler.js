/**
 * @typedef {import("./Stage.js").default} Stage
 * @typedef {import("./Actions/index.js").Actions} AnyAction
 */
/**
 * @typedef LoopingAction
 * @property {AnyAction} action
 * @property {number} lastPerformed
 * @property {number} performCount
 */

class ActionScheduler {
  /** @param {Stage} stage */
  constructor(stage) {
    /** @type {typeof stage} */
    this.parent = stage;

    /** @type {typeof stage.actions} */
    this.actions = stage.actions;
    /** @type {number} */
    this.actionIndex = 0;
    /** @type {LoopingAction[]} */
    this.loopingActions = [];
  }

  /**
   * @param {AnyAction} action
   * @param {number} startTime
   */
  addLoopingAction(action, startTime) {
    this.loopingActions.push({
      action,
      lastPerformed: startTime,
      performCount: 1
    })
  }

  /**
   * @param {number} time
   * @param {Object.<string, number | string>} globalVariables
   * @returns {boolean}
   */
  tick(time, globalVariables={}) {
    const stage = this.parent;

    // Init loop limit
    const LOOP_LIMIT = 10000;
    let loops = 0;

    /**
     * @type {[AnyAction, number, number, number][]} - [Action, loop, timeOffset, innerLoop]
     */
    let actionsToPerform = [];
    // Prepare to perform action
    for (let i = this.actionIndex; i < stage.actions.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const action = stage.actions[i];
      if (action.startTime > time) break;
      actionsToPerform.push([ action, 0, 0, 0 ]);
      const loopCount = action.getLooperData(1).loopCount;
      if (loopCount >= 2) this.addLoopingAction(action, action.startTime);
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

        const innerLoopCount = actionLooperData.innerLoop;
        for (let k = 0; k < innerLoopCount; k++) {
          loops++;
          if (loops > LOOP_LIMIT) return false;
          
          const offset = actionLooperData.interval*(bulkLoop-j-1)+offsetOffset || 0;
          actionsToPerform.push([ loopingAction.action, loopingAction.performCount, offset, k ]);
        }
        loopingAction.lastPerformed += actionLooperData.interval;
        loopingAction.performCount++;
        if (loopingAction.performCount >= actionLooperData.loopCount) {
          this.loopingActions[i] = null;
          break;
        }
      }
    }
    this.loopingActions = this.loopingActions.filter(loopingAction => loopingAction);

    // Perform action
    for (let i = 0; i < actionsToPerform.length; i++) {
      loops++;
      if (loops > LOOP_LIMIT) return false;

      const [ action, loopCount, offset, innerLoop ] = actionsToPerform[i];
      action.perform({
        stage,
        loop: loopCount,
        innerLoop,
        timeOffset: offset,
        globalVariables
      });
    }

    return true;
  }
}

export default ActionScheduler;
