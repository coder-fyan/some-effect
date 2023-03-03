import {transLetterToImageData, measureText, getTextHeight} from "$canvasWord/index";
import {wordPixelate} from "$canvasWord/pixelate/";
import {createCanvas, randomColor} from "$canvas/util"; 

// 形成字符的实心小方格
interface fillItem {
    posX: number, //小方格的X位置
    posY: number, //小方格的Y位置
    height: number, //小方格高
    width: number, //小方格宽
    stepX: number, //小方格的X方向的步幅
    stepY: number, //小方格的Y方向的步幅
    disY: number, //小方格Y方向的步幅增量
    color?: string //小方格的颜色
}

// 时间时分秒位置保存的字符
interface canvasText {
    [index: number]: string
}

let itemWidth: number = 5; //构成字体单元格大小
let element: HTMLElement; //动画容器元素
let midText: canvasText = []; //当前时分秒位置的字符
let animateArray: fillItem[] = []; //实心小方格数组
let BORDER: number = 0; //画布四边的空白宽度，先默认为四边的空白宽度一致
let WORDSPACE:number = 0; //字符间距

interface numberImageDataType {
    [index: string | number]: ImageData
}

interface pixeObj {
    [index: string | number]: pixeArray
}

let imageDataObj: numberImageDataType = {}, maxItem: string = "0", pixeArray: pixeObj = {};
// find the widest of the number from zero to nine
function handleStr(str: string) {
    let testArr = str.split("");
    let maxWidth = 0;
    maxItem = testArr[0];
    testArr.forEach((item: string) => {
        let textMeasure = measureText(item);
        if (textMeasure.width > maxWidth) {
            maxWidth = textMeasure.width;
            maxItem = item;
        }
        imageDataObj[item] = transLetterToImageData(item);
        pixeArray[item] = wordPixelate(imageDataObj[item]);
    })
}

interface areaInfoType {
    height: number,
    width: number
}
//the area infomation include it's width and height;
function getAreaInfo (): areaInfoType {
    let theMaxString = "" + maxItem + maxItem + ":" + maxItem + maxItem + ":" + maxItem + maxItem + "";
    let stringInfo:TextMetrics = measureText(theMaxString);
    let width = stringInfo.width * itemWidth + WORDSPACE + BORDER * 2;
    let height = getTextHeight(stringInfo) * itemWidth + BORDER * 2;
    return { width, height }
}

//the map info
let areaInfo:areaInfoType;
//at this animate, we need three canvas, one as the background,one to show the date and the last one to show the animate.
let backgroundCanvas:CanvasRenderingContext2D, timeCanvas:CanvasRenderingContext2D, animateCanvas:CanvasRenderingContext2D;
/**
 * init the canvas
 * @param ele the wrapDom,do not set it width and height
 * @param IWidth the item width which form the letter
 */
export function initCanvas (ele: HTMLElement, IWidth: number) {
    element = ele;
    itemWidth = IWidth;
    const theStringWillBeShow = "0123456789:";//The string is not the final string, it just includes the letters which will be inclueded in the words.
    //notice the order of the canvasElement
    handleStr(theStringWillBeShow);
    areaInfo = getAreaInfo();
    backgroundCanvas = createCanvas(element, areaInfo, "static");//to expand the space
    timeCanvas = createCanvas(element, areaInfo, "absolute");
    animateCanvas = createCanvas(element, areaInfo, "absolute");
}

interface drawMethod {
    (ctx: CanvasRenderingContext2D, item: fillItem): void;
}

//绘制空心矩形(x，y:起始位置，color: 颜色)
function drawRect (ctx: CanvasRenderingContext2D, item: fillItem) {
    ctx.strokeStyle = item.color ? item.color : "black";
    ctx.strokeRect(item.posX, item.posY, itemWidth, itemWidth);
}

//绘制实心矩形(x，y:起始位置，color: 颜色)
function fillRect (ctx: CanvasRenderingContext2D, item: fillItem) {
    ctx.fillStyle = item.color ? item.color : "black";
    ctx.fillRect(item.posX, item.posY, itemWidth, itemWidth);
}

//the value of the item animation distance
let steps: number[] = [2, 4, 6];
//animation
function animate (drawMethod: drawMethod) {
    for(let i = animateArray.length - 1; i > -1; i--) {
        if (animateArray[i].posX >= areaInfo.width || animateArray[i].posY >= areaInfo.height) {

           // 弹跳效果
           animateArray[i].stepY = animateArray[i].stepY - 3;
            if (animateArray[i].stepY <= 0) {
                animateArray.splice(i, 1);
                continue;
            }
            animateArray[i].stepY = -animateArray[i].stepY;

            //没有弹跳效果
            // animateArray.splice(i, 1);
            // continue;
        }
        drawMethod(animateCanvas, animateArray[i]);
        animateArray[i].stepY += animateArray[i].disY;
        animateArray[i].posX += animateArray[i].stepX;
        animateArray[i].posY += animateArray[i].stepY;
    }
    // requestAnimationFrame(rectAnimate);
}

//画字
function drawTime (textArray: pixeArray, startPos: {x: number, y: number}, drawMethod: drawMethod) {        
    for(let i = textArray.length -1; i > -1; i--) {
        for (let j = textArray[i].length -1; j > -1; j--) {
            if (textArray[i][j] == 1) {
                const curFillItem = {posX: itemWidth * j + startPos.x, posY: itemWidth * i + BORDER, height: itemWidth, width: itemWidth, stepX: Math.floor(Math.random() * 6 - 3), stepY: -steps[Math.floor(Math.random()*steps.length)], disY: 1, color:randomColor()};
                animateArray.push(curFillItem)
                // fillRect(timeCanvas, curFillItem);
                drawMethod(timeCanvas, curFillItem);
            }
        }
    }
}

//when the word changes, add animation to the word.
/**
 * 
 * @param index the letter pos
 * @param text the letter content
 * @returns 
 */
function needAddAnimate (index: number, text: string):boolean {
    if (midText[index] != text) {
        midText[index] = text;
        return true;
    }
    return false;
}

//获取当前时间
export function draw () {
    animateCanvas.clearRect(0, 0, areaInfo.width, areaInfo.height); //清除整个画布是正确的，动画的位置不一定只出现在当前字符位置
    let regs = /(\d)(\d)(:)(\d)(\d)\3(\d)(\d)/.exec(new Date().toString()) as RegExpExecArray;//通过正则的记忆模式来获取时间的时分秒
    let time = [regs[1], regs[2], regs[3], regs[4], regs[5], regs[3], regs[6], regs[7]];
    let startPos = {x: BORDER, y: BORDER};
    for (let t = 0 ; t < time.length; t++) {
        let imgData:ImageData = imageDataObj[time[t]];
        let curWordWidth = imgData.width * itemWidth;
        if (t != time.length - 1 && t != 0) {
            startPos.x += WORDSPACE;
        }
        let pixeText = pixeArray[time[t]];
        let need = needAddAnimate(t, time[t]);
        if (need) {
            timeCanvas.clearRect(startPos.x, startPos.y, curWordWidth, areaInfo.height);
            drawTime(pixeText, startPos, fillRect);
        }
        startPos.x += curWordWidth;
    };
    animate(fillRect);
    requestAnimationFrame(draw);
    // setTimeout(getTime,50)
}