
/**
 * 
 * @param canvasDom the dom whitch will be used to draw bee words.
 * @param pixeArray maintain the piexed info of string
 * @param option some others options 
 */

interface initOpt {
  startX: number,
  startY: number,
  beeWidth: number
}

interface bee {
  x: number,
  y: number,

}

export function initBee(ctx: CanvasRenderingContext2D, pixeArray: pixeArray, option: initOpt) {
  const {startX, startY, beeWidth} = option;
  pixeArray.forEach((row, r) => {
    row.forEach((item, i) => {
      ctx.strokeRect(i * beeWidth, r * beeWidth, beeWidth, beeWidth);
      if (item === 1) {
        ctx.fillRect(i * beeWidth, r * beeWidth, beeWidth, beeWidth);
      }
    })
  })
}