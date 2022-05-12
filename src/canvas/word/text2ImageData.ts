/**
 * 
 * translate words to pixelate
 * 
 */

let FONT:string = "48px serif";

export function setFont (font: string) {
  FONT = font;
}

export function trans (words: string, font: string = FONT): ImageData {
  if (!words) {
    throw new Error("there need a words argument at the first place")
  }
  let canvasDOm = document.createElement("canvas");
  let ctx = canvasDOm.getContext("2d") as CanvasRenderingContext2D;
  ctx.font = font;
  let text = ctx.measureText(words);
  canvasDOm.width = text.width;
  canvasDOm.height = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
  ctx.font = font;
  ctx.textBaseline = 'top';
  ctx.fillText(words, 0,0);
  let imgData = ctx.getImageData(0,0,canvasDOm.width,canvasDOm.height);
  return imgData;
}