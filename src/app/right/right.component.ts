import { Component, OnInit, Input } from '@angular/core';
import { Shape } from '../grid/shape';
import { MatDialog } from '@angular/material';
import { PauseComponent } from '../pause/pause.component';
import { HttpClient } from '@angular/common/http';

@Component({  
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})  


export class RightComponent implements OnInit {

  @Input('DataFromApp') data: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog) { }

  users: any;

  ngOnInit() {
    this.http.get('http://localhost:5000/tetris-angular/us-central1/app/api/getUser').subscribe(data => this.users = data);
  }

  pauseMenu(): void {
    let dialogRef = this.dialog.open(PauseComponent, {
      width: '832px',
      height: '520px',
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}
