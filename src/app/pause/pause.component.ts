import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatGridTileHeaderCssMatStyler } from '@angular/material';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrls: ['./pause.component.css']
})
export class PauseComponent implements OnInit {

  menu: number;
  constructor(public dialogRef: MatDialogRef<PauseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.menu = 0;
  }

  goLeft(): void {
    if (this.menu == 0) this.menu = 2;
    else this.menu--;
  }

  goRight(): void {
    if (this.menu == 2) this.menu = 0;
    else this.menu++;
  }
}
