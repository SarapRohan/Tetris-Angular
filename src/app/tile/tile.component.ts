import { Component, OnInit, Input, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  
})
export class TileComponent implements OnInit {
  @Input() tile: number;

  constructor() { }

  ngOnInit() {
  }

}
