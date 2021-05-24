import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-abstract',
  templateUrl: './editor-abstract.component.html',
  styleUrls: ['./editor-abstract.component.scss']
})
export class EditorAbstractComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;

  constructor() {
  }

  ngOnInit() {
  }



}
