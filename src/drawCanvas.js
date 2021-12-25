const canvas = document.getElementById("draw-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { alpha: false });
const displayCanvas = document.getElementById('display-canvas');
/** @type {CanvasRenderingContext2D} */
const displayCtx = displayCanvas.getContext("2d");

/**
 * @param {import("./class/Stage.js").default} stage 
 */
function drawCanvas(stage) {
  const canvasSize = Math.min(innerWidth, innerHeight) * 0.9;
  canvas.height = canvasSize;
  canvas.width = canvasSize;
  const s = canvasSize/100;

  ctx.fillStyle = stage.playingData.stageAttribute.bgColor || "#ffc966";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const { particleGroups } = stage.playingData;
  const groupNames = Object.keys(particleGroups);
  for (let i = groupNames.length-1; i >= 0; i--) {
    const particleGroup = particleGroups[groupNames[i]].particles;
    for (let i = 0; i < particleGroup.length; i++) {
      const particle = particleGroup[i].values;
      let { width: w, height: h } = particle.size;
      const { x, y } = particle.position;
      ctx.fillStyle = particle.color || "#000";
      ctx.fillRect(
        s * (x - h/2),
        s * (y - w/2),
        s * w,
        s * h
      );
    }
  }

  displayCanvas.height = canvasSize;
  displayCanvas.width = canvasSize;
  displayCtx.drawImage(canvas, 0, 0);
}

export default drawCanvas;
