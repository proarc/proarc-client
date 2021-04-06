import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-resource',
  templateUrl: './editor-resource.component.html',
  styleUrls: ['./editor-resource.component.scss']
})
export class EditorResourceComponent implements OnInit {

  @Input() field: ElementField;
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }

}
