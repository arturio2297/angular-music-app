import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-field',
  templateUrl: './info-field.component.html',
  styleUrls: ['./info-field.component.less']
})
export class InfoFieldComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  value: string | number;

  constructor() { }

  ngOnInit(): void {
  }

}
