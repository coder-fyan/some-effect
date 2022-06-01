import {trans, measureText, getTextHeight} from "../../word/text2ImageData";
import {createCanvas} from "../../util";

import pixelate from "../../specialEffect/imageDataPixelate";

// 形成字符的实心小方格
interface fillItem {
    posX: number, //小方格的X位置
    posY: number, //小方格的Y位置
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
let ctx: CanvasRenderingContext2D; //画笔
let midText: canvasText = []; //当前时分秒位置的字符
let fillArray: fillItem[] = []; //实心小方格数组
let border: number = 0; //画布四边的空白宽度，先默认为四边的空白宽度一致
let wordSpace:number = 0; //字符间距


//画布初始化,version one
// export function init (ele: HTMLCanvasElement, width?: number, bdr?: number) {
//     element = ele;
//     ctx = element.getContext("2d")
//     element.width = 7 * itemWidth * 8 + 70 + 100;
//     element.height = 10 * itemWidth + 100;
//     if (width && typeof width === "number"){
//         itemWidth = width;
//         element.width = 7 * width * 8 + 70;
//         element.height = 10 * width;
//     }
//     if (bdr && typeof bdr === "number"){
//         border = bdr;
//         element.width += 2 * border;
//         element.height += 2 * border;
//     }

// }


interface numberImageDataType {
    [index: string | number]: ImageData
}

//存储需要转换的字符imageData数据
let numberImageData: numberImageDataType = {};

// find the widest of the number from zero to nine
function findWidest():string {
    let testArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":"];
    // let testArr = [":", "8"];
    let maxWidth = 0, maxItem = "0";
    testArr.forEach((item: string) => {
        let textMeasure = measureText(item)
        if (textMeasure.width > maxWidth) {
            maxWidth = textMeasure.width;
            maxItem = item;
        }
        numberImageData[item] = trans(item);
    })
    return maxItem;
}

//get the width and height of which we can draw something in it;
function getTheStringInfo (): TextMetrics {
    let theMaxItem = findWidest();
    let theMaxString = "" + theMaxItem + theMaxItem + ":" + theMaxItem + theMaxItem + ":" + theMaxItem + theMaxItem + "";
    return measureText(theMaxString);
}


//at this animate, we need three canvas, one as the background,one to show the date and the last one to show the animate.
let backgroundCanvas:CanvasRenderingContext2D, timeCanvas:CanvasRenderingContext2D, animateCanvas:CanvasRenderingContext2D;

interface areaInfoType {
    height: number,
    width: number
}
//the area infomation include it's width and height;
function getAreaInfo ():areaInfoType {
    let stringInfo:TextMetrics = getTheStringInfo();
    let width = stringInfo.width * itemWidth + 7 * wordSpace + border * 2;
    let height = getTextHeight(stringInfo) * itemWidth + border * 2;
    return {width, height}
}

//定义画布信息
let areaInfo:areaInfoType;
// init canvas the version twos
export function init (ele: HTMLElement, IWidth: number) {
    element = ele;
    itemWidth = IWidth;
    //notice the order of the canvasElement
    areaInfo = getAreaInfo();
    // areaInfo = {height:600,width: 1000};
    backgroundCanvas = createCanvas(element, areaInfo, "static");
    timeCanvas = createCanvas(element, areaInfo, "absolute");
    animateCanvas = createCanvas(element, areaInfo, "absolute");
}

//随机颜色
function randomColor(): string {
    let r = Math.floor(255 * Math.random());
    let g = Math.floor(255 * Math.random());
    let b = Math.floor(255 * Math.random());
    return "rgb(" + r + "," + g + "," + b + ")";
}

//绘制空心矩形(x，y:起始位置，color: 颜色)
function drawRect (ctx: CanvasRenderingContext2D, x: number, y: number, color?: string) {
    ctx.strokeStyle = color ? color : "black";
    ctx.strokeRect(x, y, itemWidth, itemWidth);
}

//绘制实心矩形(x，y:起始位置，color: 颜色)
function fillRect (ctx: CanvasRenderingContext2D, x: number, y:number, color?: string) {
    ctx.fillStyle = color ? color : randomColor();
    ctx.fillRect(x, y, itemWidth, itemWidth);
}

let steps: number[] = [1, 2, 3];
//实心矩形动画
function rectAnimate () {
    for(let i = fillArray.length - 1; i > -1; i--) {
        if (fillArray[i].posX >= areaInfo.width || fillArray[i].posY >= areaInfo.height) {

            //弹跳效果
            // fillArray[i].stepY = fillArray[i].stepY - 3;
            // if (fillArray[i].stepY <= 0) {
            //     fillArray.splice(i, 1);
            //     continue;
            // }
            // fillArray[i].stepY = -fillArray[i].stepY;

            //没有弹跳效果
            fillArray.splice(i, 1);
            continue;
        }
        fillRect(animateCanvas, fillArray[i].posX, fillArray[i].posY, fillArray[i].color);
        fillArray[i].stepY += fillArray[i].disY;
        fillArray[i].posX += fillArray[i].stepX;
        fillArray[i].posY += fillArray[i].stepY;
    }
    // requestAnimationFrame(rectAnimate);
}

//画字
function drawTime (textArray: Array<Array<number>>, startPos: number, needAnimate: boolean) {
    // if (element.getContext) {
        
        for(let i = textArray.length -1; i > -1; i--) {
            for (let j = textArray[i].length -1; j > -1; j--) {
                if (textArray[i][j] == 1) {
                    // drawRect(itemWidth * j, itemWidth * i);
                    if (needAnimate) {
                        fillArray.push({posX: itemWidth * j + startPos, posY: itemWidth * i + border, stepX: Math.floor(Math.random() * 4 -2), stepY: -2*steps[Math.floor(Math.random()*steps.length)], disY: 1, color:randomColor()})
                    }
                    fillRect(timeCanvas, itemWidth * j + startPos + border, itemWidth * i + border);
                }
            }
        }
        
    // }
}

//当字符变化，添加动画特效
/**
 * 
 * @param index 该字符位置
 * @param text 该字符内容
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
export function getTime () {
    animateCanvas.clearRect(0, 0, areaInfo.width, areaInfo.height); //清除整个画布是正确的，动画的位置不一定只出现在
    let regs = /(\d)(\d)(:)(\d)(\d)\3(\d)(\d)/.exec(new Date().toString()) as RegExpExecArray;//通过正则的记忆模式来获取时间的时分秒
    let time = [regs[1], regs[2], regs[3], regs[4], regs[5], regs[3], regs[6], regs[7]];
    // let time = [regs[3], regs[3], regs[3], regs[3], regs[3], regs[3], regs[3], regs[3]];
    let startPos = border;
    for (let t = 0 ; t < time.length; t++) {
        let imgData:ImageData;
        imgData = numberImageData[time[t]];
        let curWordWidth = imgData.width * itemWidth;
        if (t != time.length - 1 && t != 0) {
            startPos += wordSpace;
        }
        let pixeArray = pixelate(imgData);
        let need = needAddAnimate(t, time[t]);
        if (need) {
            timeCanvas.clearRect(startPos, 0, curWordWidth, areaInfo.height);
            drawTime(pixeArray, startPos, need);
        }
        startPos += curWordWidth;
    };
    rectAnimate();
    requestAnimationFrame(getTime);
    // setTimeout(getTime,50)
}