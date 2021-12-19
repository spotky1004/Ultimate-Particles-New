const canvas = document.getElementById("draw-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { alpha: false });
const displayCanvas = document.getElementById('display-canvas');
/** @type {CanvasRenderingContext2D} */
const displayCtx = displayCanvas.getContext("2d");

const ceil = Math.ceil;

/**
 * @param {import("./class/Stage.js").default} stage 
 */
function drawCanvas(stage) {
  const canvasSize = Math.min(innerWidth, innerHeight) * 0.9;
  canvas.height = canvasSize;
  canvas.width = canvasSize;
  const s = canvasSize/100;

  ctx.fillStyle = "#ffc966";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const { particleGroups } = stage.playingData;

  for (const groupName in particleGroups) {
    const particleGroup = particleGroups[groupName].particles;
    for (let i = 0; i < particleGroup.length; i++) {
      const particle = particleGroup[i].values;
      let { width: w, height: h } = particle.size;
      const { x, y } = particle.position;
      ctx.fillStyle = particle.color || "#000";
      ctx.fillRect(
        ceil(s * (x - h/2)),
        ceil(s * (y - w/2)),
        ceil(s * w),
        ceil(s * h)
      );
    }
  }

  displayCanvas.height = canvasSize;
  displayCanvas.width = canvasSize;
  displayCtx.drawImage(canvas, 0, 0);
}

export default drawCanvas;
