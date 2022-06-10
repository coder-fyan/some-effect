/**
 * 
 * translate text to pixel picture
 * 
 */

export function deletePx(pxStr: string): number {
  return +pxStr.replace("px", "");
}