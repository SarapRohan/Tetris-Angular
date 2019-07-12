import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PauseComponent } from './pause/pause.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(public dialog: MatDialog) { 
  }

  pauseMenu(): void {
    let dialogRef = this.dialog.open(PauseComponent, {
      width: '300px',
      height: '500px',
    });
    
  }
  
}
