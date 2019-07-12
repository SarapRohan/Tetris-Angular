import { Component, OnInit, HostListener, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { Shape } from './shape';
import { MatDialog } from '@angular/material';
import { GameOverComponent } from '../game-over/game-over.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  host: { '(document:keydown)': 'handleKeyboardEvents($event)',
  '(document:mousemove)': 'handleMouseMoveEvents($event)',
  '(document:click)': 'handleMouseClickEvents($event)',
  '(document:keyup)': 'handleKeyboardEvents2($event)'}
})
export class GridComponent implements OnInit {

  @Input('DataFromApp') data: any;
  @Output('DataFromGrid') outgoingData = new EventEmitter<any>();

  height: number;
  width: number;
  board: number[][];
  previousBoard: number[][];
  
  currentShape: Shape;
  nextShape: Shape;
  holdShape: Shape;
  x: number;
  y: number;
  canMoveDown: boolean;

  score: number;
  dropSpeed: number;
  isPaused: boolean;
  linesLeft: number;
  msDropSpeed: number;
  gameOver: boolean;
  speedChanged: boolean;
  interval_id;
  goingDown: boolean;
  name: string;

  setGrid(): void {
    this.height = 20;
    this.width = 10;
    this.board = Array(this.height)
    .fill(0)
    .map(() =>
      new Array(this.width)
      .fill(0)
    );
  }

  fillShape(s: Shape): void {
    this.board = this.copy(this.previousBoard);
    for (let i = this.y; i < this.y + s.layout.length; i++)
      for (let j = this.x; j < this.x + s.layout[0].length; j++)
        if (s.layout[i - this.y][j - this.x])
          this.board[i][j] = s.layout[i - this.y][j - this.x];
  }

  isGameOver(s: Shape): boolean {
    let gameOver = false;
    for (let i = this.y; i < this.y + s.layout.length; i++)
      for (let j = this.x; j < this.x + s.layout[0].length; j++)
        if (s.layout[i - this.y][j - this.x] && this.previousBoard[i][j])
          gameOver = true;
    return gameOver;
  }

  copy(board: number[][]): number[][] {
    const clone = [];
    for (let i = 0; i < board.length; i++) {
      clone.push(board[i].slice(0));
    }
    return clone;
  }

  speed: number[] = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];

  constructor(public dialog: MatDialog, private http: HttpClient) {
    this.sendScore = false;
    this.setGrid();
    this.x = 3;
    this.y = 0;
    this.previousBoard = this.copy(this.board);
    this.canMoveDown = true;
    this.currentShape = new Shape(Math.floor(Math.random() * 7) + 1);
    this.nextShape = new Shape(Math.floor(Math.random() * 7) + 1);
    this.score = 0;
    this.dropSpeed = 5;
    this.isPaused = true;
    this.linesLeft = 15;
    this.speedChanged = false;
    this.goingDown = false;
    this.msDropSpeed = this.speed[this.dropSpeed];
  }

  public sendDataToApp() {
    const object = {
      dropSpeed: this.dropSpeed,
      holdShape: this.holdShape,
      score: this.score,
      nextShape: this.nextShape,
      linesLeft: this.linesLeft
    };
    this.outgoingData.emit(object);
  }

  reset(): void {
    this.setGrid();
    this.x = 3;
    this.y = 0;
    this.previousBoard = this.copy(this.board);
    this.canMoveDown = true;
    this.currentShape = new Shape(Math.floor(Math.random() * 7) + 1);
    this.nextShape = new Shape(Math.floor(Math.random() * 7) + 1);
    this.score = 0;
    this.dropSpeed = this.data.dropSpeed;
    this.isPaused = false;
    this.linesLeft = 15;
    this.speedChanged = false;
    this.msDropSpeed = this.speed[this.dropSpeed];
  }

  public returnInterval() {
    return window.setInterval(() => {
      if (!this.isPaused) {
        this.moveDown();
        this.fillShape(this.currentShape);
        this.checkPosition();
        this.sendDataToApp();
        if (this.speedChanged) {
          this.speedChanged = false;
          window.clearInterval(this.interval_id);
          this.returnInterval();
          if (this.isPaused) this.isPaused = false;
        }
      }
    }, this.msDropSpeed);
  }

  checkStart(): void {
    window.setInterval(() => {
      this.speedChanged = this.data.speedChanged;
      if (this.speedChanged) {
        this.isPaused = false;
        this.dropSpeed = this.data.dropSpeed;
        this.msDropSpeed = this.speed[this.dropSpeed];
        window.clearInterval(this.interval_id);
        this.startGame();
      }
    }, 100);
  }

  startGame(): void {
    window.setInterval(() => {
      if (!this.isPaused) {
        this.moveDown();
        this.fillShape(this.currentShape);
        this.checkPosition();
        this.sendDataToApp();
      }
    }, this.msDropSpeed);
  }

  ngOnInit() {
    let tempInterval_id = window.setInterval(() => {
      if (this.data.start) {
        this.name = this.data.name;
        this.dropSpeed = this.data.dropSpeed;
        this.msDropSpeed = this.speed[this.dropSpeed];
        console.log("Changing level in grid");
        console.log("dropSpeed : " + this.data.dropSpeed);
        this.isPaused = false;
        window.clearInterval(tempInterval_id);
        console.log("temp : " + tempInterval_id);
        this.interval_id = this.returnInterval();
      }
    }, 1000);
  }
    

  togglePlayPause(): void{
    this.isPaused = !this.isPaused;
  }

  updateHoldShape(): void {
    let tempShape: Shape;
    if (!this.holdShape) {
      this.holdShape = this.currentShape;
      this.currentShape = this.nextShape;
      this.nextShape =  new Shape(Math.floor(Math.random() * 7) + 1);
    } else {
      tempShape = this.holdShape;
      this.holdShape = this.currentShape;
      this.currentShape = tempShape;
      this.y = 0;
      this.x = 3;
    }
  }

  moveLeft(): void {
    let canMoveLeft = true;
    for (let i = this.y; i < this.y +  this.currentShape.layout.length; i++) {
      for (let j = this.x; j < this.x + this.currentShape.layout[0].length; j++) {
        if (this.currentShape.layout[i - this.y][j - this.x] > 0) {
          if (j > 0 &&  this.previousBoard[i][j - 1] > 0) {
            canMoveLeft = false;
          } else if (j === 0) {
            canMoveLeft = false;
          }
        }
      }
    }
    if (canMoveLeft) {
      this.x--;
    }
  }

  moveRight(): void {
    let canMoveRight = true;
    for (let i = this.y; i < this.y +  this.currentShape.layout.length; i++) {
      for (let j = this.x; j < this.x + this.currentShape.layout[0].length; j++) {
        if (this.currentShape.layout[i - this.y][j - this.x] > 0) {
          if (j < this.width - 1 &&  this.previousBoard[i][j + 1] > 0) {
            canMoveRight = false;
          } else if (j === this.width - 1) {
            canMoveRight = false;
          }
        }
      }
    }
    if (canMoveRight) {
      this.x++;
    }
  }

  rotateRight(): void {
    if (this.x + this.currentShape.layout.length > this.width - 1) {
      const dist = this.x + this.currentShape.layout.length - this.width;
      this.x = this.x - dist;
    }
    if (this.y + this.currentShape.layout[0].length > this.height - 1) {
      const dist = this.y + this.currentShape.layout[0].length - this.height;
      this.y = this.y - dist;
    }
    this.currentShape.rotateRight();
  }

  rotateLeft(): void {
    this.rotateRight();
    this.rotateRight();
    this.rotateRight();
  }

  moveDown(): void {
    for (let i = this.y; i < this.y +  this.currentShape.layout.length; i++) {
      for (let j = this.x; j < this.x + this.currentShape.layout[0].length; j++) {
        if (this.currentShape.layout[i - this.y][j - this.x] > 0) {
          if (i < this.height - 1 &&  this.previousBoard[i + 1][j] > 0) {
            this.canMoveDown = false;
          } else if (i === this.height - 1) {
            this.canMoveDown = false;
          }
        }
      }
    }
    if (this.canMoveDown) {
      this.y++;
    } 
  }

  hardDown(): void {
    this.goingDown = true;
    while (this.canMoveDown) {
      for (let i = this.y; i < this.y +  this.currentShape.layout.length; i++) {
        for (let j = this.x; j < this.x + this.currentShape.layout[0].length; j++) {
          if (this.currentShape.layout[i - this.y][j - this.x] > 0) {
            if (i < this.height - 1 &&  this.previousBoard[i + 1][j] > 0) {
              this.canMoveDown = false;
            } else if (i === this.height - 1) {
              this.canMoveDown = false;
            }
          }
        }
      }
      if (this.canMoveDown) {
        this.y++;
        this.fillShape(this.currentShape);
      }
    }
    this.goingDown = false;
    this.checkPosition();
  }

  updateBoard(): void {
    for (let i = this.y; i < this.y + this.currentShape.layout.length; i++)
      for (let j = this.x; j < this.x + this.currentShape.layout[0].length; j++)
        if (this.currentShape.layout[i - this.y][j -this.x] > 0)
          this.previousBoard[i][j] = this.currentShape.layout[i - this.y][j - this.x];
  }

  clearLine(line: number): void {
    for (let i = line; i > 0; i--)
      this.previousBoard[i] = this.previousBoard[i - 1];
    this.previousBoard[0].fill(0);
  }

  checkLine(): void {
    let loopAgain = true;
    let streak = 0;
    do {
      loopAgain = false;
      for (let i = this.height - 1; i >= 0; i--) {
        if (this.previousBoard[i].every(function(box) { return box > 0})) {
          this.previousBoard[i].fill(0);
          this.clearLine(i);
          streak++;
          loopAgain = true;
        }
      }
    } while (loopAgain);
    this.score += streak * 100 * (this.dropSpeed + 1);
    this.linesLeft -= streak;
    if (this.linesLeft <= 0) {
      if (this.dropSpeed < 9) {
        this.dropSpeed++;
      } 
      this.msDropSpeed = this.speed[this.dropSpeed];
      this.linesLeft += 15;
    }
  }

  sendScore: boolean;

  checkPosition(): void {
    if (this.canMoveDown === false) {
      this.updateBoard();
      this.fillShape(this.currentShape);
      this.checkLine();
      this.y = 0;
      this.x = 3;
      if (this.isGameOver(this.nextShape)) {
        console.log("Game Over");
        this.isPaused = true;
        if (this.sendScore === false) {
          this.sendScore = true;
          if (this.score > 0) {
            this.http.post('http://localhost:5000/tetris-angular/us-central1/app/api/saveUser/', {"name": this.name, "score": this.score}).subscribe(data => {
            console.log("post is successful", data);
            },
            error => {
              console.log("Error ", error);
            });
          }
          this.openDialog();
        }
      } else {
        this.currentShape = this.nextShape;
        this.nextShape = new Shape(Math.floor(Math.random() * 7) + 1);
        this.fillShape(this.currentShape);
        this.canMoveDown = true;
      }
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    if (this.goingDown === false) {
      switch(event.keyCode) {
        case 37:
          this.moveLeft();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
        case 38:
          this.rotateRight();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
        case 39:
          this.moveRight();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
        case 90:
          this.rotateLeft();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
        case 80:
          this.togglePlayPause();
          break;
        case 40:
          this.moveDown();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
        case 88:
          this.updateHoldShape();
          this.fillShape(this.currentShape);
          this.checkPosition();
          break;
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvents2(event: KeyboardEvent) {
    if (this.goingDown === false) {
      switch(event.keyCode) {
        case 32: this.hardDown();
          break;
      }
    }
  }
  @HostListener('document:mousemove', ['$event'])
  handleMouseMoveEvents(event: MouseEvent) {
    // console.log("Client : " + "x : " + event.clientX + " y : " + event.clientY);
    // console.log("Offset : " + "x : " + event.offsetX + " y : " + event.offsetY);
    // console.log(event.target);
  }

  @HostListener('document:click', ['$event'])
  handleMouseClickEvents(event: MouseEvent) {
    // console.log("x : " + event.clientX + " y : " + event.clientY);
  }

  right(event: MouseEvent): void {
    console.log(event);
    this.rotateRight();
    this.fillShape(this.currentShape);
    this.checkPosition();
  }

  getId(i: number, j: number): void {
    this.rotateRight();
    this.fillShape(this.currentShape);
    this.checkPosition();
  }

  move(j: number): void {
    if (j > this.x) {
      let k = j - this.x;
      while (k) {
        this.moveRight();
        this.fillShape(this.currentShape);
        this.checkPosition();
        k--;
      } 
    } else if (this.x > j) {
      let k = this.x - j;
      while (k) {
        this.moveLeft();
        this.fillShape(this.currentShape);
        this.checkPosition();
        k--;
      }
    }
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(GameOverComponent, {
      width: '350px',
      height: '435px',
      data: this.score
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result");
    })
  }

}
