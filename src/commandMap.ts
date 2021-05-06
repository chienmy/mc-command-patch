// 后续考虑对命令参数进行验证
import {clean, drawCircle, drawPicture, musicCommand} from "./command";

export type commandParser = (command: string) => string[] | Promise<string[]>;

// 设置天气
const setWeather: commandParser = (command) => ["weather " + command];
// 设置时间
const setTime: commandParser = (command) => [
  "time set " + command.split(" ")[0],
];

/**
 * 提供命令名与对应的处理方法
 */
const commandMap = new Map<string, commandParser>();
// 修改天气
commandMap.set("clear", setWeather);
commandMap.set("rain", setWeather);
commandMap.set("thunder", setWeather);
// 修改时间
commandMap.set("day", setTime);
commandMap.set("noon", setTime);
commandMap.set("night", setTime);
commandMap.set("midnight", setTime);
// 画圆
commandMap.set("circle", drawCircle);
// 地图像素画
commandMap.set("draw", drawPicture);
// 清扫
commandMap.set("clean", clean);
//
commandMap.set("music", musicCommand);

/**
 * 拆分命令为命令组
 * @param command
 * @return string[]
 */
export const parseCommand: commandParser = (command) => {
  let arr = command.split(" ");
  const parser = commandMap.get(arr[0]);
  if (parser != null) {
    return parser(command);
  }
  return [command];
};
