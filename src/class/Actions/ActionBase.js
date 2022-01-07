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

class ActionBase {
  /**
   * @param {object} param0
   * @param {string} param0.type
   * @param {number} param0.startTime 
   * @param {Object.<string, any>} param0.data 
   * @param {LooperData} param0.looperData 
   */
  constructor({ type="Null", startTime=0, data={}, looperData={} }) {
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
    return [
      (this.type ?? "Null").toString(),
      this.startTime,
      JSON.stringify(this.data, null, 2),
      JSON.stringify({
        interval: this.rawInterval,
        loopCount: this.rawloopCount,
        innerLoop: this.rawInnerLoop
      }, null, 2)
    ];
  }

  toString() {
    return this.export().join(",\n");
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
