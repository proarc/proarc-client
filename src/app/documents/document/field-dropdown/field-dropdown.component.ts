
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModsElement } from 'src/app/model/mods/element.model';

@Component({
  selector: 'app-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss']
})
export class FieldDropdownComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  

}
