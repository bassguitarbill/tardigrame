import {Grid} from './grid.js';
import {Hud} from './hud.js';
import {Tardigrade} from './tardigrade.js'
import {Point, distanceSquared, addPoints, assignPoint} from './math.js';
import {Popover, RegretPopover} from './popover.js';
import {liveTardigrades} from './tardigrade.js'

<<<<<<< HEAD
=======
export type Tool = 'WATER'|'PAN'|'MOSS'|'DEBUG_INSPECT_TARDIGRADE';

export const generationOne : number = 10;
export const generationTwo : number = Math.ceil(Math.pow(generationOne, 1.5))
export const generationThree : number = Math.ceil(Math.pow(generationOne, 2))
export const generationFour : number = Math.ceil(Math.pow(generationOne, 2.5))
export const generationFive : number = Math.ceil(Math.pow(generationOne, 3))

>>>>>>> Calculate game generation stages
export class Game {
  readonly grid = new Grid(this, 100, 100);
  readonly pawns = new Array<Tardigrade>();
  readonly hud = new Hud(this);

  private readonly heldButtons = new Set<number>();

  popover: Popover;

  private readonly screenSpaceMousePotisionAtLeftClick: Point = {x: 0, y: 0};
  readonly screenSpaceMousePosition: Point = {x: 0, y: 0};
  readonly worldSpaceMousePosition: Point = {x: 0, y: 0};

  availableWater = 20;
  debugDrawPaths = false;

  numberToNextGen : number = generationTwo;


  readonly viewport = {
    x: 0,
    y: 0,
    width: 640,
    height: 640,
    scale: 1.0,
  };

  private readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('mousedown', ({button}) => {
      if(button === 0) assignPoint(this.screenSpaceMousePotisionAtLeftClick, this.screenSpaceMousePosition);
      this.heldButtons.add(button);
    });
    canvas.addEventListener('mouseup', ({button}) => {
      this.heldButtons.delete(button);
      if(button !== 0) return;
      const draggedDistance = distanceSquared(this.screenSpaceMousePosition, this.screenSpaceMousePotisionAtLeftClick);
      if(draggedDistance > 20) return;
      this.grid.clicked(this.worldSpaceMousePosition);
    });
    canvas.addEventListener('mouseout', () => this.heldButtons.clear());
    canvas.addEventListener('wheel', this.zoom.bind(this));

    for (let i = 0; i < generationOne; i++){
      this.pawns.push(new Tardigrade(this, Math.random() * 100, Math.random() * 100));
    }

    this.popover = RegretPopover(this.ctx);
    // this.popover.show();
  }

  tick(dt: number) {
    this.grid.tick(dt);
    for(let i = 0; i < this.pawns.length; i++) {
      this.pawns[i].tick(dt);
    }

    if (liveTardigrades.size >= generationFour){
      //Moon Laser Destroy the Earth
      this.numberToNextGen = generationFive
    } else if (liveTardigrades.size >= generationThree){
      //Mine ice
      this.numberToNextGen = generationFour
    } else if (liveTardigrades.size >= generationTwo){
      //Build moss
      this.numberToNextGen = generationThree;
    } else if (liveTardigrades.size > 0){
      this.numberToNextGen = generationTwo;
    } else if (liveTardigrades.size == 0){
      //Ded
      this.numberToNextGen = generationOne;
    }
   
  }

  draw() {
    this.ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height);

    this.ctx.setTransform(this.viewport.scale, 0, 0, this.viewport.scale, -this.viewport.x, -this.viewport.y);

    this.grid.draw(this.ctx);
    for (let i = 0; i < this.pawns.length; i++){
      this.pawns[i].draw(this.ctx);
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.hud.draw(this.ctx);
    this.popover.draw();
  }

  mouseMove(ev: MouseEvent) {
    if(this.heldButtons.has(0)) {
      const delta = {
        x: this.screenSpaceMousePosition.x - ev.offsetX,
        y: this.screenSpaceMousePosition.y - ev.offsetY
      };
      addPoints(this.viewport, this.viewport, delta);
    }

    this.screenSpaceMousePosition.x = ev.offsetX;
    this.screenSpaceMousePosition.y = ev.offsetY;

    this.worldSpaceMousePosition.x = (ev.offsetX + this.viewport.x) / this.viewport.scale / this.grid.xPixelsPerCell;
    this.worldSpaceMousePosition.y = (ev.offsetY + this.viewport.y) / this.viewport.scale / this.grid.yPixelsPerCell;
  }

  zoom(ev: WheelEvent) {
    this.viewport.x += this.viewport.width / 2;
    this.viewport.y += this.viewport.height / 2;
    this.viewport.x /= this.viewport.scale;
    this.viewport.y /= this.viewport.scale;
    this.viewport.scale += ev.deltaY * - 0.01;
    this.viewport.scale = Math.max(0.5, this.viewport.scale);
    this.viewport.x *= this.viewport.scale;
    this.viewport.y *= this.viewport.scale;
    this.viewport.x -= this.viewport.width / 2;
    this.viewport.y -= this.viewport.height / 2;

    this.mouseMove(ev);
  }
}
