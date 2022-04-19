import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-tableOfContents',
  templateUrl: './editor-tableOfContents.component.html',
  styleUrls: ['./editor-tableOfContents.scss']
})
export class EditorTableOfContentsComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }



}
