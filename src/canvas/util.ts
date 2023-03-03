/**
 * 
 * translate text to pixel picture
 * 
 */

export function deletePx(pxStr: string): number {
  return +pxStr.replace("px", "");
}

//create canvas element,sometimes we need not noly an element;
/**
 * 
 * @param wrap 
 * @param areaInfo 
 * @param position  //we need this parameter set static to expand the space of parent dom, if the parent dom did not set the width and height style. 
 * @returns 
 */

 type posType = "absolute" | "static" | "fixed";
 export function createCanvas<t extends {width: number, height: number}>(wrap: HTMLElement, areaInfo: t, position: posType = "static"): CanvasRenderingContext2D {
  let canvasDom = document.createElement("canvas");
  canvasDom.style.position = position;
  if (position !== "static") {
    canvasDom.style.top = "0";
    canvasDom.style.left = "0";
  }
  canvasDom.width = areaInfo.width;
  canvasDom.height = areaInfo.height;
  wrap.append(canvasDom);
  let ctx = canvasDom.getContext("2d") as CanvasRenderingContext2D;
  return ctx;
}

//随机颜色
export function randomColor(): string {
  let r = Math.floor(255 * Math.random());
  let g = Math.floor(255 * Math.random());
  let b = Math.floor(255 * Math.random());
  let a = 1;
  return "rgb(" + r + "," + g + "," + b + "," + a + ")";
}