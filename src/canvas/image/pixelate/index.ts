/**
 * 
 * use this to pixelate pictures or text
 * 
 */
///<reference path="../../../util/transColor.d.ts" />


import { transHEX2RGBA } from "util/transColor";

export function imgPixelate(imgData: ImageData, pixWidth: number, borderWidth: number, borderColor: string): ImageData {
  let {data, width, height} = imgData;
  let colorObj:colorObj = {
    red: 255,
    green: 255,
    blue: 255,
    color:`rgba(255, 255, 255, 1)`
  };
  if (borderColor) {
    colorObj: colorObj = transHEX2RGBA(borderColor);
  }
  console.log(colorObj);
  for (let h = 0; h < height; h++) {
    for (let w = 0; w <= width; w ++) {
      if (h % pixWidth == 0) {
        for (let b = 0; b < borderWidth; b++) {
          let hpos = (h * (b + 1) * width + w) * 4;
          data[hpos] = colorObj.red;
          data[hpos + 1] = colorObj.green;
          data[hpos + 2] = colorObj.blue;
          data[hpos + 3] = 255;
        }
      }
      if (w % pixWidth == 0) {
        for (let b = 0; b < borderWidth; b++) {
          let hpos = (h * width + w * (b + 1)) * 4;
          data[hpos] = colorObj.red;
          data[hpos + 1] = colorObj.green;
          data[hpos + 2] = colorObj.blue;
          data[hpos + 3] = 255;
        }
      }
    }
  }
  
  return imgData;
}