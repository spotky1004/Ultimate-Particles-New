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

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.canvas.getContext('2d');
  }

  /**
   * @param {CanvasDrawOption[]} drawOptions 
   */
  draw(drawOptions) {
    const screenSize = {
      width : this.parentElement?.offsetWidth,
      height: his.parentElement?.offsetHeight
    };
    const WIDTH = Math.max(10, screenSize.width);
    const HEIGHT = Math.max(10, screenSize.height);
    drawOptions = [...drawOptions].sort((a, b) => a.zIndex - b.zIndex);

    if (
      WIDTH !== this.canvas.width ||
      HEIGHT !== this.canvas.height
    ) {
      /** @type {ImageData} */
      let content = this.ctx.getImageData();
      this.canvas.width = WIDTH;
      this.canvas.height = HEIGHT;
      this.ctx.putImageData(content);

      this.tempCanvas.width = WIDTH;
      this.tempCanvas.height = HEIGHT;
    } else {
      this.ctx.clearRect(0, 0, HEIGHT, WIDTH);
    }

    for (let i = 0; i < drawOptions.length; i++) {
      const drawOption = drawOptions[i];
      this.tempCtx.clearRect(0, 0, WIDTH, HEIGHT);
      const toDraws = drawOption.toDraw;
      for (let i = 0; i < toDraws.length; i++) {
        const toDraw = toDraws[i];
        this.tempCtx.save();
        this.tempCtx.color = toDraw.color ?? "#000";
        this.tempCtx.rect(
          toDraw.position.x * WIDTH / 100,
          toDraw.position.y * HEIGHT / 100,
          toDraw.size.width * WIDTH / 100,
          toDraw.size.height * HEIGHT / 100
        );
        this.tempCtx.restore();
      }
      this.ctx.drawImage(this.tempCanvas);
    }
  }
}

export default Canvas;
