import axios from "axios";
import { PNG } from "pngjs";
import { mapColorConvert } from "../picture";

export const drawPicture = (command: string): Promise<string[]> => {
  const [, x, y, z, target, url] = command.split(" ");
  return new Promise<string[]>((resolve) => {
    if (["north", "south", "east", "west"].indexOf(target) < 0) {
      resolve([]);
    }
    axios.get(url, {responseType: 'arraybuffer'})
      .then((res) => {
        if (res.headers["content-type"] === "image/png") {
          new PNG().parse(res.data, (err, data) => {
            resolve(mapColorConvert(Number(x), Number(y), Number(z), data, target));
          })
        }
      })
  })
}