import StagePlayer from "./StagePlayer.js";
import Canvas from "./Canvas.js";

class Game {
  /**
   * @typedef GameOptions
   * @property {HTMLElement} canvasWrapper
   * @property {HTMLCanvasElement} canvas 
   */
  /**
   * @param {GameOptions} options
   */
  constructor(options) {
    this.stagePlayer = new StagePlayer();

    /** @type {HTMLElement} */
    this.canvasWrapper = options.canvasWrapper;
    this.drawCanvas = new Canvas(this.canvasWrapper);
    /** @type {HTMLCanvasElement} */
    this.gameCanvas = options.canvas;
    /** @type {CanvasRenderingContext2D} */
    this.gameCanvasCtx = this.gameCanvas.getContext("2d");

    this.editor = undefined; // TODO
  }

  getDrawData() {
    return this.stagePlayer.stage.getDrawData();
  }

  tick() {
    this.stagePlayer.tick();
    this.updateCanvas();
  }

  updateCanvas() {
    if (
      this.stagePlayer.stage === null ||
      !this.stagePlayer.stage.playing
    ) return;
    const stageAttribute = this.stagePlayer.stage.state.stageAttribute;
    const { offsetWidth: WIDTH, offsetHeight: HEIGHT } = this.canvasWrapper;
    const canvasSize = Math.min(WIDTH, HEIGHT);
    const canvasWidth = Math.max(10, canvasSize * stageAttribute.screenSize.width/100);
    const canvasHeight = Math.max(10, canvasSize * stageAttribute.screenSize.height/100);
    this.gameCanvas.width = canvasWidth;
    this.gameCanvas.height = canvasHeight;
    void this.drawCanvas.draw(
      this.getDrawData(),
      canvasSize,
      this.gameCanvas.width,
      this.gameCanvas.height
    );
    this.gameCanvasCtx.drawImage(this.drawCanvas.canvas, 0, 0);
  }
}

export default Game;
