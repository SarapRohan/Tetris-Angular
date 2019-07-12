import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OverlayComponent } from './overlay/overlay.component';
import { LeftComponent } from './left/left.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dropSpeed = 1;
  holdShape;
  score = 0;
  linesLeft;
  nextShape;d
  gameOver: boolean;
  Left: any;
  Right: any;
  Grid: any;

  name: string;
  level: number;
  inumber: string;


  public handleDataFromGrid(object: any) {
    this.dropSpeed = object.dropSpeed;
    this.holdShape = object.holdShape;
    this.score = object.score;
    this.nextShape = object.nextShape;
    this.linesLeft = object.linesLeft;
    this.gameOver = object.gameOver;

    this.Left = {
      dropSpeed: this.dropSpeed,
      holdShape: this.holdShape,
      score: this.score,
      linesLeft: this.linesLeft
    }
  
    this.Right = {
      nextShape: this.nextShape
    }
  }

  constructor(
    private http: HttpClient,
    public dialog: MatDialog) {
    this.openDialog();
    this.Grid = {
      speedChanged: false,
      dropSpeed: this.dropSpeed
    }
    // this.http.get('http://localhost:3000/api/getUser/').subscribe(data => console.log(data));
  }

  openDialog() {
    let dialogRef = this.dialog.open(OverlayComponent, {
      width: '300px',
      height: '350px',
      panelClass: 'goingDark',
      data: {
        name: 'Anonymous',
        level: '1'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dropSpeed = result.level - 1;
      this.name = result.name;
      this.Grid = {
        name: this.name,
        start: true,
        dropSpeed: this.dropSpeed
      }
    })
  }
  
}
