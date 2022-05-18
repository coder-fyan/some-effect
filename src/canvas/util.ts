/**
 * 
 * translate text to pixel picture
 * 
 */



//create canvas element,sometimes we need not noly an element;
export function createCanvas<t extends {width: number, height: number}>(wrap: HTMLElement, areaInfo: t, position: string): CanvasRenderingContext2D {
  let canvasDom = document.createElement("canvas");
  canvasDom.style.position = position;
  canvasDom.style.top = "0";
  canvasDom.style.left = "0";
  canvasDom.width = areaInfo.width;
  canvasDom.height = areaInfo.height;
  wrap.append(canvasDom);
  let ctx = canvasDom.getContext("2d") as CanvasRenderingContext2D;
  return ctx;
}

