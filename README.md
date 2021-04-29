# mc-command-patch

This package provides extra commands which are parsed to a series of original minecraft's commands.

## Features

- [x] provide simplify partial original commands
- [x] draw pictures shown on the map
- [ ] play music with redstone component

## Usage

```typescript
import { parseCommand } from "mc-command-patch";

const commands = parseCommand("Customized command");
// run these commands by yourself
```

#### Weather

`<clear | rain | thunder> [time]`

change weather and set its continuous time

#### Time

`<day | noon | night | midnight>`

change time in game

#### Circle

`circle <x y z> <r> <edge_block> [fill_block]`

Take point `<x y z>` as center，`<r>` as radius, use `edge_block` draw a circle, while having choice to fill by `fill_block`

#### Quick clean

`clean <water | snow> <x y z> [n=10] [h=5]`

Clear snow or water around the coordinate `<x y z>` in `n` grids, up and down `h` grids (`n` and `h` are optional)

#### Draw pixel picture

`draw <x y z> <north | south | east | west> <url>`

set point `<x y z>` as upper left corner of the picture(given by `url`), and it towards `<north | south | east | west>`

- `url` is a HTTP link

- remain enough space and at least two grids high
