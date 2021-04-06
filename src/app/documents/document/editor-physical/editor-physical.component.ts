import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-physical',
  templateUrl: './editor-physical.component.html',
  styleUrls: ['./editor-physical.component.scss']
})
export class EditorPhysicalComponent implements OnInit {

  @Input() field: ElementField;
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }



}
