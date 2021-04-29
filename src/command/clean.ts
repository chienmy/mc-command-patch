import { commandParser } from "../commandMap";

/**
 * 一键清理 “clean snow <x y z> [n=10] [h=5]”
 * @param command
 */
export const clean: commandParser = (command) => {
  const arr = command.split(" ");
  if (arr.length >= 5) {
    const target = arr[1];
    const x = Number(arr[2]);
    const y = Number(arr[3]);
    const z = Number(arr[4]);
    const n = Number(arr[5] ?? "10");
    const h = Number(arr[6] ?? "5");
    if (target === "snow") {
      return [
        `fill ${x + n} ${y + h} ${z + n} ${x - n} ${y - h} ${
          z - n
        } air 0 replace snow_layer`,
      ];
    } else if (target === "water") {
      return [
        `fill ${x + n} ${y + h} ${z + n} ${x - n} ${y - h} ${
          z - n
        } air 0 replace water`,
      ];
    }
  }
  return [];
};
