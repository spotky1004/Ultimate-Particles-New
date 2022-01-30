import Canvas from "./Canvas.js";

/**
 * @template {string[]} T
 */
class CanvasManager {
  /**
   * @param {HTMLCanvasElement} drawCanvas
   * @param {T} canvasLayerNames 
   */
  constructor(drawCanvas, canvasLayerNames) {
    /** @type {typeof drawCanvas} */
    this.drawCanvas = drawCanvas;
    /** @type {CanvasRenderingContext2D} */
    this.drawCtx = drawCanvas.getContext("2d");

    /** @type {Record<T[number], Canvas>} */
    this.canvasLayers = {};
    for (let i = 0; i < canvasLayerNames.length; i++) {
      const canvasLayerName = canvasLayerNames[i];
      this.canvasLayers[canvasLayerName] = new Canvas({
        keepContent: false
      });
    }
  }

  /**
   * 
   * @param {Record<T[number], import("./Canvas.js").CanvasDrawOption[]>} drawOptions 
   */
  updateCanvas(drawOptions) {
    const screenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.drawCanvas.width = screenSize.width;
    this.drawCanvas.height = screenSize.height;
    this.drawCtx.clearRect(0, 0, screenSize.width, screenSize.height);

    for (const canvasName in this.canvas) {
      const drawOption = drawOptions[canvasName];
      if (typeof drawOption === "undefined") continue;
      /** @type {Canvas} */
      const canvas = this.canvas[canvasName];
      canvas.draw(screenSize, drawOption);
      this.drawCtx.drawImage(canvas.canvas, 0, 0);
    }
  }
}

export default CanvasManager;
