/**
 * @typedef {{x: number, y: number}} Vector2
 * @typedef {{width: number, height: number}} Size
 */
/**
 * @typedef CanvasDrawBlock
 * @property {Vector2} position
 * @property {Size} size
 * @property {string} color
 */
/**
 * @typedef CanvasDrawOption
 * @property {number} zIndex
 * @property {undefined} filter
 * @property {CanvasDrawBlock[]} toDraw
 */

class Canvas {
  /**
   * @param {HTMLElement} parentElement 
   */
  constructor(parentElement) {
    /** @type {typeof parentElement} */
    this.parentElement = parentElement;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.tempCanvas = document.createElement("canvas");
    this.tempCtx = this.tempCanvas.getContext("2d");
  }

  /**
   * @param {CanvasDrawOption[]} drawOptions 
   * @param {number} width
   * @param {number} height
   */
  draw(drawOptions, baseSize, width, height) {
    const WIDTH = Math.floor(Math.max(10, width));
    const HEIGHT = Math.floor(Math.max(10, height));
    drawOptions = [...drawOptions].sort((a, b) => a.zIndex - b.zIndex);

    if (
      WIDTH !== this.canvas.width ||
      HEIGHT !== this.canvas.height
    ) {
      this.canvas.width = WIDTH;
      this.canvas.height = HEIGHT;

      this.tempCanvas.width = WIDTH;
      this.tempCanvas.height = HEIGHT;
    } else {
      this.ctx.clearRect(0, 0, HEIGHT, WIDTH);
    }

    this.tempCtx.fillStyle = "#ff0000";
    for (let i = 0; i < drawOptions.length; i++) {
      const drawOption = drawOptions[i];
      this.tempCtx.clearRect(0, 0, WIDTH, HEIGHT);
      const toDraws = drawOption.toDraw;
      for (let i = 0; i < toDraws.length; i++) {
        const toDraw = toDraws[i];
        this.tempCtx.save();
        this.tempCtx.fillStyle = toDraw.color || "#000";
        this.tempCtx.fillRect(
          toDraw.position.x * baseSize / 100,
          toDraw.position.y * baseSize / 100,
          toDraw.size.width * baseSize / 100,
          toDraw.size.height * baseSize / 100
        );
        this.tempCtx.restore();
      }
      this.ctx.drawImage(this.tempCanvas, 0, 0);
    }

    return this.canvas;
  }
}

export default Canvas;
