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
 */

class ActionBase {
  /**
   * @param {ActionBaseParams} param0
   */
  constructor({ type="ActionBase", startTime=0, data={}, looperData={} }) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.startTime = Number(startTime);
    /** @type {Object.<string, any>} */
    this.data = data;
    /** @type {number} */
    this.rawInterval = looperData?.interval;
    /** @type {number} */
    this.rawloopCount = looperData?.loopCount;
    /** @type {number} */
    this.rawInnerLoop = looperData?.innerLoop;

    const _looperData = {
      interval: this.rawInterval ?? 0,
      loopCount: this.rawloopCount ?? 1,
      innerLoop: this.rawInnerLoop ?? 1
    };

    /** @type {Value<_looperData>} */
    this._looperData = new Value(_looperData);
  }

  getLooperData(loopCount=0) {
    return this._looperData.getValue({ i: loopCount });
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
      }
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

  /** @param {PerformParams} param0 */
  perform({ stage, loop=0, innerLoop=0, timeOffset=0, globalVariables={} }) {
    const variables = this.getVariables(arguments[0]);
    variables, stage, loop, innerLoop, timeOffset, globalVariables;
  }
}

export default ActionBase;
