import fixNumber from "../util/fixNumber.js";

const defaultValues = {
  bgColor: "#ffc966",
  screenX: 0,
  screenY: 0,
  screenWidth: 100,
  screenHeight: 100,
  screenWidthScale: 1,
  screenHeightScale: 1,
  stageY: 0,
  stageX: 0,
  stageWidthScale: 1,
  stageHeightScale: 1,
  playerHitboxFactor: 1,
  outOfBoundsFactor: 2,
};
Object.freeze(defaultValues);

/** @typedef {typeof defaultValues} DefaultValues */

class StageAttribute {
  constructor() {
    /** @type {DefaultValues["bgColor"]} */
    this.bgColor = defaultValues.bgColor;
    /** @type {DefaultValues["screenX"]} */
    this.screenX = defaultValues.screenX;
    /** @type {DefaultValues["screenY"]} */
    this.screenY = defaultValues.screenY;
    /** @type {DefaultValues["screenWidth"]} */
    this.screenWidth = defaultValues.screenWidth;
    /** @type {DefaultValues["stageHeight"]} */
    this.screenHeight = defaultValues.screenHeight;
    /** @type {DefaultValues["screenWidthScale"]} */
    this.screenWidthScale = defaultValues.screenWidthScale;
    /** @type {DefaultValues["screenheightScale"]} */
    this.screenHeightScale = defaultValues.screenHeightScale;
    /** @type {DefaultValues["stageX"]} */
    this.stageX = defaultValues.stageX;
    /** @type {DefaultValues["stageY"]} */
    this.stageY = defaultValues.stageY;
    /** @type {DefaultValues["stageWidthScale"]} */
    this.stageWidthScale = defaultValues.stageWidthScale;
    /** @type {DefaultValues["stageHeightScale"]} */
    this.stageHeightScale = defaultValues.stageHeightScale;
    /** @type {DefaultValues["playerHitboxFactor"]} */
    this.playerHitboxFactor = defaultValues.playerHitboxFactor;
    /** @type {DefaultValues["outOfBoundsFactor"]} */
    this.outOfBoundsFactor = defaultValues.outOfBoundsFactor;
  }

  get stageSize() {
    return {
      width: this.screenWidth / this.stageWidthScale * this.screenWidthScale * 2,
      height: this.screenHeight / this.stageHeightScale * this.screenHeightScale * 2
    };
  }

  get screenSize() {
    return {
      width: this.screenWidth * this.screenWidthScale,
      height: this.screenHeight * this.screenHeightScale
    };
  }

  get stageRange() {
    const stageSize = this.stageSize;
    return {
      x: [
        this.stageX-stageSize.width/2,
        this.stageX+stageSize.width/2
      ],
      y: [
        this.stageY-stageSize.height/2,
        this.stageY+stageSize.height/2
      ]
    };
  }

  get screenRange() {
    const screenSize = this.screenSize;
    return {
      x: [this.screenX, this.screenX+screenSize.width],
      y: [this.screenY, this.screenY+screenSize.height]
    };
  }

  get outOfBoundsRange() {
    const stageSize = this.stageSize;
    const stageRange = this.stageRange;
    return {
      x: [
        stageRange.x[0] - stageSize.width/2*(this.outOfBoundsFactor-1),
        stageRange.x[1] + stageSize.width/2*(this.outOfBoundsFactor-1)
      ],
      y: [
        stageRange.y[0] - stageSize.height/2*(this.outOfBoundsFactor-1),
        stageRange.y[1] + stageSize.height/2*(this.outOfBoundsFactor-1)
      ]
    };
  }

  /**
   * @param {import("./Particle.js").default} particle
   */
  getParticleDrawData(particle) {
    const screenSize = this.screenSize;

    const values = particle.values;

    const color = values.color;
    const size = {
      width: values.size.width * this.stageWidthScale / 2,
      height: values.size.height * this.stageHeightScale / 2
    };
    const position = {
      x: ((values.position.x - this.stageX)*this.stageWidthScale - size.width + screenSize.width) / 2,
      y: ((values.position.y - this.stageY)*this.stageHeightScale - size.height + screenSize.height) / 2
    };

    return { size, position, color };
  }

  fixValues() {
    if (typeof this.bgColor !== "string") this.bgColor = defaultValues.bgColor;
    this.stageX = fixNumber(this.stageX, -999999, 999999, defaultValues.stageX);
    this.stageY = fixNumber(this.stageY, -999999, 999999, defaultValues.stageY);
    this.screenWidth = fixNumber(this.screenWidth, 0, 500, defaultValues.screenWidth);
    this.screenHeight = fixNumber(this.screenHeight, 0, 500, defaultValues.screenHeight);
    this.screenWidthScale = fixNumber(this.screenWidthScale, 0, 5, defaultValues.screenWidthScale);
    this.screenHeightScale = fixNumber(this.screenHeightScale, 0, 5, defaultValues.screenHeightScale);
    this.stageWidthScale = fixNumber(this.stageWidthScale, 0.001, 1000, defaultValues.stageWidthScale);
    this.stageHeightScale = fixNumber(this.stageHeightScale, 0.001, 1000, defaultValues.stageHeightScale);
    this.screenX = fixNumber(this.screenX, -2000, 2000, defaultValues.screenX);
    this.screenY = fixNumber(this.screenY, -2000, 2000, defaultValues.screenY);
    this.playerHitboxFactor = fixNumber(this.playerHitboxFactor, 0, 2, defaultValues.playerHitboxFactor);
    this.outOfBoundsFactor = fixNumber(this.outOfBoundsFactor, 0, 10000, defaultValues.outOfBoundsFactor);
  }
}

export default StageAttribute;
