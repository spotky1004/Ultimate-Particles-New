import Value from "../Value.js";

/**
 * @typedef LooperData
 * @property {number | string} interval
 * @property {number} loopCount
 * @property {number} innerLoop
 */
/**
 * @typedef PerformParams
 * @property {import("../Stage.js").default} stage
 * @property {number} loop
 * @property {number} innerLoop
 * @property {number} timeOffset
 * @property {Object.<string, string | number>} globalVariables
 */

/**
 * @typedef ActionBaseParams
 * @property {string} type
 * @property {number} startTime
 * @property {Object.<string, any>} data
 * @property {LooperData} looperData
 * @property {string} groupName
 */

class ActionBase {
  /**
   * @param {ActionBaseParams} param0
   */
  constructor({ type="ActionBase", startTime=0, data={}, looperData={}, groupName="default" }) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.startTime = startTime;
    /** @type {Object.<string, any>} */
    this.data = data;
    /** @type {number} */
    this.rawInterval = looperData?.interval;
    const loopCount = looperData?.loopCount;
    /** @type {number} */
    this.rawloopCount = loopCount === null ? Infinity : loopCount;
    /** @type {number} */
    this.rawInnerLoop = looperData?.innerLoop;
    const _looperData = {
      interval: this.rawInterval ?? 0,
      loopCount: this.rawloopCount ?? 1,
      innerLoop: this.rawInnerLoop ?? 1
    };
    /** @type {Value<_looperData>} */
    this._looperData = new Value(_looperData);

    this.groupName = groupName;

    /** @type {Object.<string, any>} */
    this.optimizationData = {};
  }

  export() {
    return {
      type: (this.type ?? "Null").toString(),
      startTime: this.startTime,
      data: this.data,
      looperData: {
        interval: this.rawInterval,
        loopCount: this.rawloopCount,
        innerLoop: this.rawInnerLoop
      },
      groupName: this.groupName
    };
  }

  toString() {
    return JSON.stringify(this.export(), null, 2);
  }

  /** @param {PerformParams} param0 */
  getVariables({ globalVariables={}, timeOffset=0, loop=0, innerLoop=0 }) {
    return Object.assign(
      {},
      globalVariables,
      {
        t: timeOffset,
        i: loop,
        j: innerLoop
      },
    );
  }

  getLooperData(loopCount=0) {
    return this._looperData.getValue({ i: loopCount });
  }

  /** @param {PerformParams} param0 */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    variables, stage, loop, innerLoop, timeOffset, globalVariables;
  }
}

export default ActionBase;
