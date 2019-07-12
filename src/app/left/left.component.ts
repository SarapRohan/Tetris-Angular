import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent implements OnInit {

  @Input('DataFromApp') data: any;

  constructor() { }

  ngOnInit() {
  }

}
