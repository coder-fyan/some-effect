//trans color to colorObject
type colorFormateType = "rgb" | "rgba" | "hex" | "hsl";

function getColorFormate (color: string) {
  if (!color) {
    return
  }
  color = color.trim();
  let colorFormate:colorFormateType = "rgb";
  if (color.startsWith("#")) {
    colorFormate = "hex";
  } else if (color.startsWith("rgb")) {
    colorFormate = "rgb";
  }  else if (color.startsWith("rgba")) {
    colorFormate = "rgba";
  } else if (color.startsWith("h")) {
    colorFormate = "hsl";
  }
  return colorFormate;
}



function hsl2ColorObj(color: string): colorObj{
  var r, g, b;
  let getInfo = /^hsl\((.{0-3}),([0-9]{1,2})%,([0-9]{1-2})\)$/.exec(color);
  let hue = +RegExp!.$1;
  let saturation = +RegExp!.$2;
  let lightness = +RegExp!.$3;
  if(saturation == 0){
      r = g = b = lightness; // achromatic
  }else{
      var hue2rgb = function hue2rgb(p: number, q: number, t: number){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      var p = 2 * lightness - q;
      r = hue2rgb(p, q, hue + 1/3);
      g = hue2rgb(p, q, hue);
      b = hue2rgb(p, q, hue - 1/3);
  }
  return {
    red: Math.round(r * 255),
    green: Math.round(g * 255),
    blue: Math.round(b * 255),
    color:`rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 1)`
  }
}

function hex2ColorObj(hex: string): colorObj {
    let subNo = hex.replace("#", "");
    let hexArr = subNo.split("");
    let red = "";
    let green = "";
    let blue = "";
    if (hexArr.length == 3) {
      hexArr = [hexArr[0], hexArr[0], hexArr[1], hexArr[1], hexArr[2], hexArr[2]];
    }
    red = hexArr[0] + hexArr[1] + "";
    green = hexArr[2] + hexArr[3] + "";
    blue = hexArr[4] + hexArr[5] + "";
    console.log(red, green, blue);
    return {
      red: parseInt(red, 16),
      green: parseInt(green, 16),
      blue: parseInt(blue, 16),
      color:`rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}, 1)`
    }
}

function rgb2ColorObj (color: string): colorObj {
  color = color.toLowerCase();
  let getBracketREG = /^rgba?\((\d{0,3}),(\d{0,3}),(\d{0,3})(,\d{0,3})?\)/;
  return {
    red: +RegExp.$1,
    green: +RegExp.$2,
    blue: +RegExp.$3,
    color:`rgba(${RegExp.$1}, ${RegExp.$2}, ${RegExp.$3}, 1)`
  }
}

export function transHEX2RGBA(color: string): colorObj {
  let colorFormate = getColorFormate(color);
  let colorObj: colorObj;
  switch (colorFormate) {
    case "rgb":
    case "rgba":
      colorObj = rgb2ColorObj(color);
      break;
    case "hex":
      colorObj = hex2ColorObj(color);
      break;
    case "hsl":
      colorObj = hsl2ColorObj(color);
      break;
  }
  return colorObj!;
}