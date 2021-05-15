import {Block, BlockType} from "./block";

export class Cube {

  // 记录原始的字符串数据
  private blockRecord: string[][];
  // 单个字符到方块类型或嵌套子结构的映射
  private blockMap: Map<string, BlockType | Cube>;
  // 原始x轴方向：内层字符串遍历顺序
  private xMask = [1, 0, 0];
  // 原始y轴方向：字符串内遍历顺序
  private yMask = [0, 1, 0];
  // 原始z轴方向：外层字符串遍历顺序
  private zMask = [0, 0, 1];

  constructor(table: string[][], charMap: Map<string, BlockType | Cube>) {
    this.blockRecord = table;
    this.blockMap = charMap;
  }

  public setMask(xMask: number[], yMask: number[], zMask: number[]) {
    this.xMask = xMask;
    this.yMask = yMask;
    this.zMask = zMask;
  }

  /**
   * 构造并返回方块数据
   * @param position 原点位置坐标
   */
  public getBlocks(position: number[]): Block[] {
    // 首先根据原始数据和类型映射构造方块
    let blocks: Block[] = [];
    for (let k = 0; k < this.blockRecord.length; k++) {
      for (let i = 0; i < this.blockRecord[k].length; i++) {
        for (let j = 0; j < this.blockRecord[k][i].length; j++) {
          const b = this.blockMap.get(this.blockRecord[k][i].charAt(j));
          if (b instanceof Cube) {
            blocks = blocks.concat(b.getBlocks([i, j, k]))
          } else if (b != undefined) {
            blocks.push({
              type: b,
              x: i,
              y: j,
              z: k
            });
          }
        }
      }
    }
    // 然后使用变换矩阵变换，换算成真实坐标
    let result: Block[] = [];
    for (const b of blocks) {
      let p = [b.x, b.y, b.z];
      let mask = [this.xMask, this.yMask, this.zMask];
      const _p = p.map((value, index) => {
        let sum = 0;
        for (let i = 0; i < 3; i++) {
          sum += (p[i] * mask[index][i]);
        }
        return sum;
      })
      result.push({
        type: b.type,
        x: _p[0] + position[0],
        y: _p[1] + position[1],
        z: _p[2] + position[2]
      });
    }
    return result;
  }

  public toCommand(position: number[]) {
    return this.getBlocks(position).sort((a, b) => {
      return b.type.rank - a.type.rank;
    }).map((b) => {
      return `setblock ${b.x} ${b.y} ${b.z} ${b.type.name} ${b.type.data}`;
    });
  }
}