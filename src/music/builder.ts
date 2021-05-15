import { Block, BlockType } from "../utils";
import { Cube } from "../utils";

export class MusicBuilder {
  // 横截面设计，16音轨，4声部
  // 原点为对称轴最下方的方块
  // [ ][M][ ][M][ ][M][ ]
  // [M][-][M][-][M][-][M]
  // [-][ ][-][ ][-][ ][-]
  // [ ][M][ ][ ][ ][M][ ]
  // [ ][-][ ][ ][ ][-][ ]
  // [M][ ][M][ ][M][ ][M]
  // [-][M][-][M][-][M][-]
  // [ ][-][ ][-][ ][-][ ]

  private originalPoint: number[] = [0, 0, 0];
  // 24音阶音符盒位置数组
  private noteBlockPlace: number[][] = [];

  private railPosition: number[][] = [
    [0, 0, 1], [0, 0, 3], [0, 0, 5],
    [0, -1, 0], [0, -1, 2], [0, -1, 4], [0, -1, 6],
    [0, -3, 1], [0, -3, 5],
    [0, -5, 0], [0, -5, 2], [0, -5, 4], [0, -5, 6],
    [0, -6, 1], [0, -6, 3], [0, -6, 5],
  ];

  private blockMap = new Map<string, BlockType>([
    ["G", {name: "glass", data: 0, rank: 2}],
    ["R", {name: "redstone_wire", data: 0, rank: 0}],
    ["1", {name: "unpowered_repeater", data: 1, rank: 1}],
    ["2", {name: "unpowered_repeater", data: 5, rank: 1}],
    ["3", {name: "unpowered_repeater", data: 9, rank: 1}],
    ["4", {name: "unpowered_repeater", data: 13, rank: 1}]]);

  public setPosition(x: number, y: number, z: number) {
    this.originalPoint = [x, y, z];
  }

  /**
   * 初始化24音阶音符盒位置
   * @param x
   * @param y
   * @param z
   */
  public setNoteBlock(x: number, y: number, z: number) {
    for (let i = 0; i < 24; i++) {
      this.noteBlockPlace.push([x + i, y, z]);
    }
  }

  buildHeader() {
    const array = [[
      "       ",
      "       ",
      "R     R",
      "G     G",
      "R     R",
      "G     G",
      "       ",
      "       "], [
      " R R R ",
      "RGRGRGR",
      "G G G G",
      "R     R",
      "GGGGGGG",
      "R R R R",
      "GRGRGRG",
      " G G G "], [
      " R R R ",
      "RG1G1GR",
      "G G G G",
      " R   R ",
      " GGGGG ",
      "2 3 3 2",
      "GRGRGRG",
      " G G G "]
    ];
    const blockArray = new Cube(array, this.blockMap);
    blockArray.setMask([0, 1, 0], [-1, 0, 0], [0, 0, 1]);
    return blockArray.toCommand(this.originalPoint);
  }

  public readMusic() {
    const test = [
      {
        base: 2,
        rail: [3, 4, 9, 10],
        series: ["5-4", "5-4", "9-4", "9-4", "10-4", "10-4", "9-4", "9-4", "8-4", "8-4", "7-4", "7-4", "6-4", "6-2", "6-1", "7-1", "5-8"]
      },
      {
        base: -10,
        rail: [6, 5, 12, 11],
        series: ["3-4", "10-4", "12-4", "10-4", "13-4", "10-4", "12-4", "10-4", "11-4", "9-4", "10-4", "8-4", "6-4", "7-4", "3-8"]
      }
    ];
    let result = [];
    for (let m of test) {
      let record = [];
      let sum = 0;
      for (let s of m.series) {
        const t = s.split("-");
        record.push({
          rail: m.rail[sum % 4],
          p: Math.floor(sum / 4),
          v: m.base + Number(t[0])
        });
        sum += Number(t[1]);
      }
      for (let r of m.rail) {
        for (let i = 0; i <= sum / 4; i++) {
          const x = this.originalPoint[0] + 4 + 2 * i + this.railPosition[i][0];
          const y = this.originalPoint[1] + this.railPosition[i][1];
          const z = this.originalPoint[0] + this.railPosition[i][2];
          result.push(`setblock ${x} ${y - 1} ${z} stone_slab 8`);
          result.push(`setblock ${x} ${y} ${z} unpowered_repeater 13`);
        }
      }
      for (let r of record) {
        const x = this.originalPoint[0] + 3 + 2 * r.p + this.railPosition[r.rail][0];
        const y = this.originalPoint[1] + this.railPosition[r.rail][1];
        const z = this.originalPoint[0] + this.railPosition[r.rail][2];
        result.push(`setblock ${x} ${y - 1} ${z} ${this.getInstrument(r.v)[0]} 0`);
        const p = this.noteBlockPlace[this.getInstrument(r.v)[1]]
        result.push(`clone ${p[0]} ${p[1]} ${p[2]} ${p[0]} ${p[1]} ${p[2]} ${x} ${y} ${z}`);
      }
    }
    return result;
  }

  private getInstrument(value: number): [string, number] {
    if (value < -18) return ["wood", value + 30]
    else if (value < -6) return ["wool", value + 18]
    else if (value < 18) return ["dirt", value + 6]
    else if (value < 30) return ["clay", value - 18]
    else return ["gold_block", value - 30]
  }

}