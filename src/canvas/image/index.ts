export * from "./pixelate"

interface imgCanvasObj {
  canvasDom: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
}

export function img2canvas (img: HTMLImageElement): imgCanvasObj {
  let { width, height } = img;
  let canvasDom = document.createElement("canvas");
  canvasDom.width = width;
  canvasDom.height = height;
  let context = canvasDom.getContext("2d")!;
  context.drawImage(img, 0, 0);
  return {
    canvasDom,
    ctx: context
  }
}