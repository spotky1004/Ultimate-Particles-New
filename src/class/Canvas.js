/**
 * @typedef {{x: number, y: number}} Vector2
 * @typedef {{width: number, height: number}} Size
 */
/**
 * @typedef CanvasDrawOption
 * @property {Vector2} position
 * @property {Size} size
 * @property {string} color
 */

class Canvas {
  /**
   * @typedef CanvasOptions
   * @property {boolean} keepContent
   */
  /**
   * @param {CanvasOptions} options 
   */
  constructor(options={}) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.keepContent = options.keepContent ?? false;
  }

  /**
   * @param {Size} screenSize 
   * @param {CanvasDrawOption[]} drawOptions 
   */
  draw(screenSize, drawOptions) {
    if (
      screenSize.width !== this.canvas.width ||
      screenSize.height !== this.canvas.height
    ) {
      /** @type {ImageData} */
      let content = undefined;
      if (false) content = this.ctx.getImageData();
      this.canvas.width = screenSize.width;
      this.canvas.height = screenSize.height;
      if (false) this.ctx.putImageData(content);
    }

    
    const { width, height } = this.canvas;
    for (let i = 0; i < drawOptions.length; i++) {
      const drawOption = drawOptions[i];
      this.ctx.save();

      this.ctx.color = drawOption.color ?? "#000";
      this.ctx.rect(
        drawOption.position.x * width / 100,
        drawOption.position.y * height / 100,
        drawOption.size.width * width / 100,
        drawOption.size.height * height / 100
      );

      this.ctx.restore();
    }
  }
}

export default Canvas;
