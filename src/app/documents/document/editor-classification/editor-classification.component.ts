import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-classification',
  templateUrl: './editor-classification.component.html',
  styleUrls: ['./editor-classification.component.scss']
})
export class EditorClassificationComponent implements OnInit {

  @Input() field: ElementField;
  @Input() type: string;
  @Input() data: any;

  authorities = ['udc', 'Konspekt'];
  editions = ['Konspekt'];

  constructor() {
  }

  ngOnInit() {
  }


}
