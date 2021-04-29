import { PNG } from "pngjs";

type Color = {
  r: number,
  g: number,
  b: number,
  // 方块ID
  id: string,
  // 方块数据值
  data: number
}

export class ColorPool {
  private colorList: Color[] = [];

  addColor(r: number, g: number, b: number, id: string, data: number = 0) {
    this.colorList.push({r: r, g: g, b: b, id: id, data: data});
  }

  /**
   * 从颜色池中选择一个最接近的颜色
   */
  private chooseColor(r: number, g: number, b: number): Color {
    const colorMap = new Map<number, Color>();
    this.colorList.forEach(color => {
      const rmean = (r + color.r) / 2;
      const R2 = Math.pow(r - color.r, 2);
      const G2 = Math.pow(g - color.g, 2);
      const B2 = Math.pow(b - color.b, 2);
      colorMap.set(Math.sqrt((2 + rmean / 256) * R2 + 4 * G2 + (2 + (255 - rmean) / 256) * B2), color);
    })
    const array = Array.from(colorMap.keys());
    const returnColor = colorMap.get(array.sort((a, b) => a - b)[0]);
    if (returnColor != undefined) {
      return returnColor;
    } else {
      return this.colorList[0];
    }
  }

  /**
   * 将图片与颜色池中的颜色相匹配
   * @param png pngjs打开的PNG数据
   * @param bgBlock 用于填充透明背景的方块
   */
  fitPicture(png: PNG, bgBlock: string = "air"): Color[][] {
    const result: Color[][] = [];
    for (let y = 0; y < png.height; y++) {
      const line: Color[] = [];
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        if (png.data[idx+3] > 250) {
          line.push(this.chooseColor(png.data[idx], png.data[idx+1], png.data[idx+2]));
        } else {
          line.push({r: 0, g: 0, b: 0, id: bgBlock, data: 0})
        }
      }
      result.push(line);
    }
    return result;
  }

}

