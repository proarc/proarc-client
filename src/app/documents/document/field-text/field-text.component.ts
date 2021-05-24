
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModsElement } from 'src/app/model/mods/element.model';

@Component({
  selector: 'app-field-text',
  templateUrl: './field-text.component.html',
  styleUrls: ['./field-text.component.scss']
})
export class FieldTextComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();


  constructor() {
  }

  ngOnInit() {
  }

  

}
