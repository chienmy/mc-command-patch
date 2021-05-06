import {musicBuilder} from "../music";

export const musicCommand = (command: string): string[] => {
  const option = command.split(" ")[1];
  if (option == "position") {
    const [, , x, y, z] = command.split(" ");
    musicBuilder.setPosition(Number(x), Number(y), Number(z));
  }
  else if (option == "base") {
    const [, , x, y, z] = command.split(" ");
    musicBuilder.setNoteBlock(Number(x), Number(y), Number(z));
  }
  else if (option == "header") {
    return musicBuilder.buildHeader();
  }else if (option == "build") {
    return musicBuilder.readMusic();
  }
  return [];
}