export type BlockType = {
  name: string,
  data: number,
  rank: number
}

export type Block = {
  type: BlockType,
  x: number,
  y: number,
  z: number
}