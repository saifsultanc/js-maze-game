let mazeCanvas = document.getElementById("mazeCanvas");
let mazeSize, cellSize;
let maze;
let start, end;
const directions = ["n", "s", "e", "w"];
const moveDirections = {
  n: {
    y: -1,
    x: 0,
    prev: "s"
  },
  s: {
    y: 1,
    x: 0,
    prev: "n"
  },
  e: {
    y: 0,
    x: 1,
    prev: "w"
  },
  w: {
    y: 0,
    x: -1,
    prev: "e"
  }
};

function pickStartEndPoints() {
  let pick = Math.random(4);

  if (pick === 0) {
    start = {
      x: 0,
      y: 0
    };
    end = {
      x: mazeSize - 1,
      y: mazeSize - 1
    };
  } else if (pick === 1) {
    start = {
      x: 0,
      y: mazeSize - 1
    };
    end = {
      x: mazeSize - 1,
      y: 0
    };
  } else if (pick === 2) {
    start = {
      x: mazeSize - 1,
      y: 0
    };
    end = {
      x: 0,
      y: mazeSize - 1
    };
  } else {
    start = {
      x: mazeSize - 1,
      y: mazeSize - 1
    };
    end = {
      x: 0,
      y: 0
    };
  }
}

function createMaze() {
  mazeMap = new Array(mazeSize);
  for (y = 0; y < mazeSize; y++) {
    mazeMap[y] = new Array(mazeSize);
    for (x = 0; x < mazeSize; x++) {
      mazeMap[y][x] = {
        n: false,
        s: false,
        e: false,
        w: false,
        visited: false,
        prev: null
      };
    }
  }
  return mazeMap;
}

function buildMaze() {
  let isComp = false;
  let move = false;
  let cellsVisited = 1;
  let numLoops = 0;
  let maxLoops = 0;
  let pos = {
    x: 0,
    y: 0
  };
  let numCells = mazeSize * mazeSize;
  while (!isComp) {
    move = false;
    mazeMap[pos.x][pos.y].visited = true;

    if (numLoops >= maxLoops) {
      shuffle(directions);
      maxLoops = Math.round(Math.random(mazeSize / 8));
      numLoops = 0;
    }
    numLoops++;
    for (index = 0; index < directions.length; index++) {
      let direction = directions[index];
      let nx = pos.x + modDir[direction].x;
      let ny = pos.y + modDir[direction].y;

      if (nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize) {
        //Check if the tile is already visited
        if (!mazeMap[nx][ny].visited) {
          //Carve through walls from this tile to next
          mazeMap[pos.x][pos.y][direction] = true;
          mazeMap[nx][ny][modDir[direction].o] = true;

          //Set Currentcell as next cells Prior visited
          mazeMap[nx][ny].priorPos = pos;
          //Update Cell position to newly visited location
          pos = {
            x: nx,
            y: ny
          };
          cellsVisited++;
          //Recursively call this method on the next tile
          move = true;
          break;
        }
      }
    }

    if (!move) {
      //  If it failed to find a direction,
      //  move the current position back to the prior cell and Recall the method.
      pos = mazeMap[pos.x][pos.y].priorPos;
    }
    if (numCells == cellsVisited) {
      isComp = true;
    }
  }
}

function buildMaze() {
  let difficulty = document.getElementById("diffSelect");
  mazeSize = difficulty.options[difficulty.selectedIndex].value;
  cellSize = mazeCanvas.width / mazeSize;
  createMaze();
  pickStartEndPoints();
  buildMaze();
}
