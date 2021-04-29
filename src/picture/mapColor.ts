import { ColorPool } from "./colorPool";
import { PNG } from "pngjs";

const mapColor = new ColorPool();
// 数据值参考 https://minecraft-zh.gamepedia.com/地图物品格式
mapColor.addColor(127, 178, 56, "grass");
mapColor.addColor(247, 233, 163, "planks", 2);
mapColor.addColor(199, 199, 199, "web");
mapColor.addColor(255, 0, 0, "redstone_block");
mapColor.addColor(160, 160, 255, "blue_ice");
mapColor.addColor(167, 167, 167, "iron_block");
mapColor.addColor(0, 124, 0, "leaves");
mapColor.addColor(255, 255, 255, "concrete", 0);
mapColor.addColor(164, 168, 184, "clay");
mapColor.addColor(151, 109, 77, "dirt");
mapColor.addColor(112, 112, 112, "smooth_stone");
mapColor.addColor(64, 64, 255, "water");
mapColor.addColor(143, 119, 72, "planks", 0);
mapColor.addColor(255, 252, 245, "quartz_block");
mapColor.addColor(216, 127, 51, "concrete", 1);
mapColor.addColor(178, 76, 216, "concrete", 2);
mapColor.addColor(102, 153, 216, "concrete", 3);
mapColor.addColor(229, 229, 51, "concrete", 4);
mapColor.addColor(127, 204, 25, "concrete", 5);
mapColor.addColor(242, 127, 165, "concrete", 6);
mapColor.addColor(76, 76, 76, "concrete", 7);
mapColor.addColor(153, 153, 153, "concrete", 8);
mapColor.addColor(76, 127, 153, "concrete", 9);
mapColor.addColor(127, 63, 178, "concrete", 10);
mapColor.addColor(51, 76, 178, "concrete", 11);
mapColor.addColor(102, 76, 51, "concrete", 12);
mapColor.addColor(102, 127, 51, "concrete", 13);
mapColor.addColor(153, 51, 51, "concrete", 14);
mapColor.addColor(25, 25, 25, "concrete", 15);
mapColor.addColor(250, 238, 77, "gold_block");
mapColor.addColor(92, 219, 213, "diamond_block");
mapColor.addColor(74, 128, 255, "lapis_block");
mapColor.addColor(0, 217, 58, "emerald_block");
mapColor.addColor(129, 86, 49, "planks", 1);
mapColor.addColor(112, 2, 0, "netherrack");
mapColor.addColor(209, 177, 161, "stained_hardened_clay", 0);
mapColor.addColor(159, 82, 36, "stained_hardened_clay", 1);
mapColor.addColor(149, 87, 108, "stained_hardened_clay", 2);
mapColor.addColor(112, 108, 138, "stained_hardened_clay", 3);
mapColor.addColor(186, 133, 36, "stained_hardened_clay", 4);
mapColor.addColor(103, 117, 53, "stained_hardened_clay", 5);
mapColor.addColor(160, 77, 78, "stained_hardened_clay", 6);
mapColor.addColor(57, 41, 35, "stained_hardened_clay", 7);
mapColor.addColor(135, 107, 98, "stained_hardened_clay", 8);
mapColor.addColor(87, 92, 92, "stained_hardened_clay", 9);
mapColor.addColor(122, 73, 88, "stained_hardened_clay", 10);
mapColor.addColor(76, 62, 92, "stained_hardened_clay", 11);
mapColor.addColor(76, 50, 35, "stained_hardened_clay", 12);
mapColor.addColor(76, 82, 42, "stained_hardened_clay", 13);
mapColor.addColor(142, 60, 46, "stained_hardened_clay", 14);
mapColor.addColor(37, 22, 16, "stained_hardened_clay", 15);

/**
 * 在指定坐标处绘制一副像素画
 * @param x
 * @param y
 * @param z
 * @param png png图片
 * @param towards 基点为图片左上角，确定朝向
 */
export const mapColorConvert = (x: number, y: number, z: number, png: PNG, towards: string) => {
  const result = [];
  const colorArray = mapColor.fitPicture(png);
  for (let i = 0; i < colorArray.length; i++) {
    for (let j = 0; j < colorArray[0].length; j++) {
      const color = colorArray[i][j];
      let position: number[] = [];
      if (towards === "south") {
        position = [x-j, y, z-i];
      } else if (towards === "west") {
        position = [x+i, y, z-j];
      } else if (towards === "east") {
        position = [x-i, y, z+j];
      } else {
        position = [x+j, y, z+i];
      }
      if (color.id === "air") {
        continue;
      }
      if (color.id === "water") {
        position[1] --;
        result.push(`fill ${position.join(" ")} ${position.join(" ")} stone`);
        position[1] ++;
      }
      result.push(`fill ${position.join(" ")} ${position.join(" ")} ${color.id} ${color.data}`);
    }
  }
  return result;
}
