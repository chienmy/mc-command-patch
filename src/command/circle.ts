import { commandParser } from "../commandMap";

/**
 * Bresenham方法生成八分之一个圆弧，圆心为坐标原点
 * @param radius 半径
 */
function bresenham(radius: number): number[][] {
  const pointArray: number[][] = [];
  let x = 0;
  let y = radius;
  let d = 3 - 2 * radius;
  while (x < y) {
    pointArray.push([x, y]);
    if (d < 0) {
      d = d + 4 * x + 6;
    } else {
      d = d + 4 * (x - y) + 10;
      y--;
    }
    x++;
  }
  if (x === y) {
    pointArray.push([x, y]);
  }
  return pointArray;
}

/**
 * 将八分之一个圆的坐标扩展为整个圆的坐标
 * @param x
 * @param y
 * @param partPoints
 */
function buildWhole(x: number, y: number, partPoints: number[][]) {
  // 通过Set去除可能出现的重复点
  const pointSet = new Set<string>();
  for (const point of partPoints) {
    pointSet.add(x + point[0] + " " + (y + point[1]));
    pointSet.add(x + point[1] + " " + (y + point[0]));
    pointSet.add(x + point[0] + " " + (y - point[1]));
    pointSet.add(x + point[1] + " " + (y - point[0]));
    pointSet.add(x - point[0] + " " + (y + point[1]));
    pointSet.add(x - point[1] + " " + (y + point[0]));
    pointSet.add(x - point[0] + " " + (y - point[1]));
    pointSet.add(x - point[1] + " " + (y - point[0]));
  }
  return [...pointSet].map((value) => value.split(" ").map((n) => Number(n)));
}

/**
 * 给定圆心坐标和半径，生成圆的边缘坐标
 * @param x
 * @param y
 * @param radius 半径
 */
function getCircleEdge(x: number, y: number, radius: number): number[][] {
  return buildWhole(x, y, bresenham(radius));
}

/**
 * 给定圆心坐标和半径，生成圆的内部坐标
 * @param x
 * @param y
 * @param radius 半径
 */
function getCircleFill(x: number, y: number, radius: number): number[][] {
  const edgePoints = bresenham(radius);
  const fillPoints: number[][] = [];
  for (const p of edgePoints) {
    for (let i = p[0]; i < p[1]; i++) {
      fillPoints.push([p[0], i]);
    }
  }
  return buildWhole(x, y, fillPoints);
}

/**
 * 画圆命令 “circle x y z r edge_block fill_block”
 * @param command
 */
export const drawCircle: commandParser = (command) => {
  const arr = command.split(" ");
  const [, x, y, z, r, edgeBlock, fillBlock] = arr;
  const edgePoints = getCircleEdge(Number(x), Number(z), Number(r));
  const result = edgePoints.map(
    p => `fill ${p[0]} ${y} ${p[1]} ${p[0]} ${y} ${p[1]} ${edgeBlock}`
  );
  if (fillBlock) {
    const fillPoints = getCircleFill(Number(x), Number(z), Number(r));
    return result.concat(fillPoints.map(
      p => `fill ${p[0]} ${y} ${p[1]} ${p[0]} ${y} ${p[1]} ${fillBlock}`
    ));
  } else {
    return result;
  }
};
