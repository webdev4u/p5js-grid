/**
 * grid.js
 * Grid for p5js
 *
 * @version 2.0.2
 * @author temchik76
 * @url https://github.com/temchik76/p5js-grid
 */

/**
 * Grid
 */
class Grid {
  private headerRow: number;
  private headerCol: number;
  private cellWidth: number;
  private cellHeight: number;
  private cells: _GridCell[][];
  private eventHandlers: object;
  private mouseIn: _GridCell = null;

  /**
   * @param cols number of columns
   * @param rows number of rows
   * @param bounds Bounds rectangle of the grid
   * @param enableHeaderRow grid has header row?
   * @param enableHeaderCol grid has header col?
   */
  constructor(readonly cols: number, readonly rows: number, private bounds: Bounds, 
              readonly enableHeaderRow: boolean = false,
              readonly enableHeaderCol: boolean = false) {
    this.headerRow = enableHeaderRow ? 1 : 0;
    this.headerCol = enableHeaderCol ? 1 : 0;

    this.cellWidth = Math.floor(this.bounds.w / (this.cols + this.headerCol));
    this.cellHeight = Math.floor(this.bounds.h / (this.rows + this.headerRow));

    this.eventHandlers = {};

    this.initCells();
    this.recalculateBounds();
  }

  /**
   * Register event handler
   * 
   * @param evt event code
   * @param fn function
   */
  on(evt: string, fn: Function): Grid {
    this.eventHandlers[evt] = fn;
    return this;
  }

  /**
   * Move/Resize and recalculate
   */
  resize(bounds: Bounds): void {
  	this.bounds = bounds;
  	this.recalculateBounds();
  }
  
  /**
   * Draw the grid
   */
  draw(): void {
    for (let col: number = 0; col < this.cols + this.headerCol; col++) {
      for (let row: number = 0; row < this.rows + this.headerRow; row++) {
        let cell = this.cells[col][row];
        this.fireEvent('draw', cell.col, cell.row, cell.bounds);
      }
    }
  }

  /**
   * Call this from p5 mouseClicked() if you want to receive mouseClick cell events 
   */
  mouseClicked(x: number, y: number) {
    if (this.bounds.contains(x, y)) {
      let cell = this.cellAt(x, y);

      this.fireEvent('mouseClicked', cell.col, cell.row);
    } 
  }
  
  /**
   * Call this from p5 mouseMoved() if you want to receive mouseIn/mouseOut cell events 
   */
  mouseMoved(x: number, y: number) {
    if (this.mouseIn && !this.mouseIn.bounds.contains(x, y)) {
      this.fireEvent('mouseOut', this.mouseIn.col, this.mouseIn.row);
      this.mouseIn = null;
    }
  
    if (this.bounds.contains(x, y) && !this.mouseIn) {
      this.mouseIn = this.cellAt(x, y);
      this.fireEvent('mouseIn', this.mouseIn.col, this.mouseIn.row);
    }
  }
  
  /**
   * Call this from p5 mousePressed() if you want to receive mousePress cell events 
   */
  mousePressed(x: number, y: number) {
    if (this.bounds.contains(x, y)) {
      let cell = this.cellAt(x, y);

      this.fireEvent('mousePressed', cell.col, cell.row);
    } 
  }
  
  /**
   * Call this from p5 mouseReleased() if you want to receive mouseRelease cell events 
   */
  mouseReleased(x: number, y: number) {
    if (this.bounds.contains(x, y)) {
      let cell = this.cellAt(x, y);

      this.fireEvent('mouseReleased', cell.col, cell.row);
    } 
  }
  
  /**
   * Initialize cells array, col/row are translated to include headers
   */
  private initCells(): void {
    this.cells = [];
    for (let col = 0; col < this.cols + this.headerCol; col ++) {
      this.cells[col] = [];
      for (let row = 0; row < this.rows + this.headerRow; row ++) {
        this.cells[col][row] = new _GridCell(col - this.headerCol, row - this.headerRow);
      }
    }
  }

  /**
   * Calculate bounds of each cell and headers
   */
  private recalculateBounds(): void {
    for (let col = 0; col < this.cols + this.headerRow; col++) {
      for (let row = 0; row < this.rows + this.headerRow; row++) {
        this.cells[col][row].bounds = this.cellBounds(col, row);
      }
    }
  }

  /**
   * Calculate cell bounds of a col/row (absolute, including headers)
   */
  private cellBounds(col: number, row: number): Bounds {
    return new Bounds(this.bounds.x + col * this.cellWidth,
      				  this.bounds.y + row * this.cellHeight,
      				  this.cellWidth,
      				  this.cellHeight);
  }

  /**
   * calculate column at a given x coordinate
   * @param x x coordinate
   */
  private colAt(x: number): number {
    return Math.floor((this.bounds.x + x) / this.cellWidth);
  }

  /**
   * calculate row at a given y coordinate
   * @param y y coordinate
   */
  private rowAt(y: number): number {
    return Math.floor((this.bounds.y + y) / this.cellHeight);
  }

  /**
   * Find a cell at x,y coordinates
   * @param x 
   * @param y 
   */
  private cellAt(x: number, y: number): _GridCell {
    return this.bounds.contains(x, y) ? this.cells[this.colAt(x)][this.rowAt(y)] : undefined;
  }

  /**
   * Fire event to listener
   * @param evt event code
   * @param params varargs callback parameters
   */
  private fireEvent(evt: string, ...params: any[]): void {
    let fn: Function = this.eventHandlers[evt];
    if (fn) {
      fn(...params);
    }
  }
}

/**
 * Generic rectangle bounds class
 */
class Bounds {
  constructor(public x: number, public y: number, public w: number, public h: number) {}
  
  /**
   * is (x, y) inside this rectangle?
   */
  contains(x: number, y: number): boolean {
  	return x >= this.x && y >= this.y && x < this.x + this.w && y < this.y + this.h;
  }
}

/**
 * private Grid cell class
 */
class _GridCell {
  /**
   * col/row are "logical" values, -1 being header cells
   * @param col logical column
   * @param row logical row
   * @param bounds bounds of the cell
   */
  constructor(readonly col: number, readonly row: number, public bounds: Bounds = null) {}
}