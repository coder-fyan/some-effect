/**
 * 
 * use this to pixelate pictures or text
 * 
 */

export function wordPixelate(imgData: ImageData):pixeArray {
  let {data, width} = imgData;
  let len = data.length / 4;
  let row = len / width;
  let transArr = new Array(len).fill(0);
  let lastArr = [];
  
  for(let i = 0; i < len; i ++) {
    let alpha = data[i * 4 + 3];
    if (alpha != 0) {
      transArr[i] = 1;
    }
  };
  for (let j = 0; j < row; j ++) {
    lastArr.push(transArr.slice(j * width, (j + 1) * width));
  };
  return lastArr as pixeArray;
}