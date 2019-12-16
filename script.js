let mazeCanvas = document.getElementById("mazeCanvas");
let mazeContext = mazeCanvas.getContext("2d");
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

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
  maze = new Array(mazeSize);
  for (y = 0; y < mazeSize; y++) {
    maze[y] = new Array(mazeSize);
    for (x = 0; x < mazeSize; x++) {
      maze[y][x] = {
        n: false,
        s: false,
        e: false,
        w: false,
        visited: false,
        prev: null
      };
    }
  }
}

function setMaze() {
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
    maze[pos.x][pos.y].visited = true;

    if (numLoops >= maxLoops) {
      shuffle(directions);
      maxLoops = Math.round(Math.random(mazeSize / 8));
      numLoops = 0;
    }
    numLoops++;
    for (index = 0; index < directions.length; index++) {
      let direction = directions[index];
      let nx = pos.x + moveDirections[direction].x;
      let ny = pos.y + moveDirections[direction].y;

      if (nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize) {
        //Check if the tile is already visited
        if (!maze[nx][ny].visited) {
          //Carve through walls from this tile to next
          maze[pos.x][pos.y][direction] = true;
          maze[nx][ny][moveDirections[direction].o] = true;

          //Set Currentcell as next cells Prior visited
          maze[nx][ny].priorPos = pos;
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
      pos = maze[pos.x][pos.y].priorPos;
    }
    if (numCells == cellsVisited) {
      isComp = true;
    }
  }
}

function drawCell(xcoordinate, ycoordinate, cell) {
  let x = xcoordinate * cellSize;
  let y = ycoordinate * cellSize;

  if (cell.n === false) {
    mazeContext.beginPath();
    mazeContext.moveTo(x, y);
    mazeContext.lineTo(x + cellSize, y);
    mazeContext.stroke();
  }
  if (cell.s === false) {
    mazeContext.beginPath();
    mazeContext.moveTo(x, y + cellSize);
    mazeContext.lineTo(x + cellSize, y + cellSize);
    mazeContext.stroke();
  }
  if (cell.e === false) {
    mazeContext.beginPath();
    mazeContext.moveTo(x + cellSize, y);
    mazeContext.lineTo(x + cellSize, y + cellSize);
    mazeContext.stroke();
  }
  if (cell.w === false) {
    mazeContext.beginPath();
    mazeContext.moveTo(x, y);
    mazeContext.lineTo(x, y + cellSize);
    mazeContext.stroke();
  }
}

function drawMaze() {
  //let drawEndMethod;
  mazeContext.lineWidth = cellSize / 40;

  let canvasSize = cellSize * maze.length;
  mazeContext.clearRect(0, 0, canvasSize, canvasSize);

  for (x = 0; x < maze.length; x++) {
    for (y = 0; y < maze[x].length; y++) {
      drawCell(x, y, maze[x][y]);
    }
  }
  // mazeContext.closePath();
}

function buildMaze() {
  let difficulty = document.getElementById("diffSelect");
  mazeSize = difficulty.options[difficulty.selectedIndex].value;
  cellSize = mazeCanvas.width / mazeSize;
  createMaze();
  pickStartEndPoints();
  setMaze();
  drawMaze();
}

// copy
