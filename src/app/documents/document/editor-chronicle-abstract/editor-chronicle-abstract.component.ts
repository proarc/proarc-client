import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-chronicle-abstract',
  templateUrl: './editor-chronicle-abstract.component.html',
  styleUrls: ['./editor-chronicle-abstract.component.scss']
})
export class EditorChronicleAbstractComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }



}
