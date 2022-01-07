import Value from "../Value.js";

/**
 * @typedef LooperData
 * @property {number | string} interval
 * @property {number} loopCount
 * @property {number} innerLoop
 */

class ActionBase {
  /**
   * @param {object} param0
   * @param {string} param0.type
   * @param {number} param0.startTime 
   * @param {Object.<string, any>} param0.data 
   * @param {LooperData} param0.looperData 
   */
  constructor({ type, startTime=0, data={}, looperData={} }) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.startTime = startTime;
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
    }

    /** @type {Value<_looperData>} */
    this._looperData = new Value(_looperData);
  }

  getLooperData(loopCount=0) {
    return this._looperData.getValue({ i: loopCount });
  }

  export() {
    return [this.type, this.time, this.data, {interval: this.rawInterval, loopCount: this.rawloopCount, innerLoop: this.rawInnerLoop}];
  }

  toString() {
    return this.export().toString();
  }
}

export default ActionBase;
