import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-accessCondition',
  templateUrl: './editor-accessCondition.component.html',
  styleUrls: ['./editor-accessCondition.component.scss']
})
export class EditorAccessConditionComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;

  constructor() {
  }

  ngOnInit() {
  }



}
