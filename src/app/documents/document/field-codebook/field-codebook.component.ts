
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModsElement } from 'src/app/model/mods/element.model';

@Component({
  selector: 'app-field-codebook',
  templateUrl: './field-codebook.component.html',
  styleUrls: ['./field-codebook.component.scss']
})
export class FieldCodebookComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  @Input() options: any;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  

}
