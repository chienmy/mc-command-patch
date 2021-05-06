import {Block, BlockType} from "./block";

export class BlockArray {

  private designArray: string[][];
  private blockMap: Map<string, BlockType>;
  private xMask = [1, 0, 0];
  private yMask = [0, 1, 0];
  private zMask = [0, 0, 1];

  constructor(table: string[][], charMap: Map<string, BlockType>) {
    this.designArray = table;
    this.blockMap = charMap;
  }

  public setMask(xMask: number[], yMask: number[], zMask: number[]) {
    this.xMask = xMask;
    this.yMask = yMask;
    this.zMask = zMask;
  }

  public getBlocks(position: number[]): Block[] {
    let blocks = [];
    for (let k = 0; k < this.designArray.length; k++) {
      for (let i = 0; i < this.designArray[k].length; i++) {
        for (let j = 0; j < this.designArray[k][i].length; j++) {
          const b = this.blockMap.get(this.designArray[k][i].charAt(j));
          if (b != undefined) {
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
    let result = [];
    for (const b of blocks) {
      let p = [0, 0, 0];
      for (const m of [this.xMask, this.yMask, this.zMask]) {
        p[0] += (b.x * m[0]);
        p[1] += (b.y * m[1]);
        p[2] += (b.z * m[2]);
      }
      result.push({
        type: b.type,
        x: p[0] + position[0],
        y: p[1] + position[1],
        z: p[2] + position[2]
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