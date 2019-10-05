import {Cell} from './cell.js';
import {loadImage} from './loader.js';
import {Point} from './math.js';
import {Game} from './game.js';

export class Grid {
  readonly cells: Cell[][];
  readonly hoveredCell: Point = {x: 0, y: 0};

  readonly xPixelsPerCell = 64;
  readonly yPixelsPerCell = 64;

  constructor(readonly game: Game, readonly rows: number, readonly columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.cells = [];
    for (let x=0; x<columns; x++) {
      this.cells.push([]);
      for (let y=0; y<rows; y++) {
        this.cells[x].push(Math.random() < 0.8 ? Cell.BLANK : Math.random() < 0.5 ? Cell.BIG_ROCK : Cell.POOL);
      }
    }

    // put a road somewhere
    for(let y = 0; y < this.rows; y++) {
      this.cells[2][y] = Cell.ROAD
    }
  }

  tick() {
    this.updateHoveredCell();
  }

  draw(ctx: CanvasRenderingContext2D) {
    for(let x = 0; x < this.columns; x++) {
      for(let y = 0; y < this.rows; y++) {
        if(x === this.hoveredCell.x && y === this.hoveredCell.y) {
          ctx.filter = 'brightness(150%)';
        }
        ctx.drawImage(
          this.getImageForCell(x, y),
          x * this.xPixelsPerCell,
          y * this.yPixelsPerCell,
          this.xPixelsPerCell,
          this.yPixelsPerCell
        );
        ctx.filter = 'none';
      }
    }
    const drawGridLines = true; // Put this as a Game-level config option?
    if(drawGridLines) {
        for (let x = 0; x < this.columns; x++) {
            ctx.moveTo(x * this.xPixelsPerCell, 0)
            ctx.lineTo(x * this.xPixelsPerCell, this.rows * this.yPixelsPerCell)
        }
        for (let y = 0; y < this.rows; y++) {
            ctx.moveTo(0, y * this.yPixelsPerCell)
            ctx.lineTo(this.rows * this.xPixelsPerCell, y * this.yPixelsPerCell)
        }
        ctx.stroke();
    }
  }

  private updateHoveredCell() {
    this.hoveredCell.x = Math.floor(this.game.mousePosition.x / this.xPixelsPerCell);
    this.hoveredCell.y = Math.floor(this.game.mousePosition.y / this.yPixelsPerCell);
  }

  private getImageForCell(x: number, y: number) {
    const cell = this.cells[x][y];
    switch(cell) {
      case Cell.BLANK: return GridImages.empty1;
      case Cell.POOL: return GridImages.pool1;
      case Cell.BIG_ROCK: return GridImages.bigRock;
      case Cell.ROAD: return GridImages.road;
    }
  }
}

const GridImages = {
  pool1: loadImage('assets/pictures/pool1.png'),
  empty1: loadImage('assets/pictures/empty1.png'),
  bigRock: loadImage('assets/pictures/bigrock1.png'),
  road: loadImage('assets/pictures/nsroad1.png'),
}
