/**
 * translate words to pixelate
 */
let FONT:string = "48px serif";

//get the string height
/**
 * 
 * @param text 
 * @returns 
 * 
 * tips: the TextMetrics has two member we need to notice 
 * 
 * fontBoundingBox: The size is controlled by font
 * actualBoundingBox: The actual size of the word, same font, different word has different size.
 * 
 */
export function getTextHeight(text: TextMetrics): number {
  return text.fontBoundingBoxAscent + text.fontBoundingBoxDescent;
}
//set the font
export function setFont (font: string) {
  FONT = font;
}
//measure the word height and width
export function measureText (word: string): TextMetrics {
  let canvasDOm:HTMLCanvasElement = document.createElement("canvas");
  let ctx:CanvasRenderingContext2D = canvasDOm.getContext("2d") as CanvasRenderingContext2D;
  ctx.font = FONT;
  let text = ctx.measureText(word);
  return text;
}
//trans the word from string to imageData
export function transLetterToImageData (words: string): ImageData {
  if (!words) {
    throw new Error("there need a words argument at the first place")
  }
  let text = measureText(words);
  let canvasDOm:HTMLCanvasElement = document.createElement("canvas");
  let ctx:CanvasRenderingContext2D = canvasDOm.getContext("2d") as CanvasRenderingContext2D;
  canvasDOm.width = text.width;
  canvasDOm.height = getTextHeight(text);
  ctx.font = FONT;
  //Note the baseline, the textBaseline is the attribute which line is aimed at the start position.
  ctx.textBaseline = 'top';
  ctx.fillText(words, 0, 0);
  let imgData = ctx.getImageData(0, 0, canvasDOm.width, canvasDOm.height);
  return imgData;
}