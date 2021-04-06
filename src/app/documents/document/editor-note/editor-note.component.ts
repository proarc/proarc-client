import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-note',
  templateUrl: './editor-note.component.html',
  styleUrls: ['./editor-note.component.scss']
})
export class EditorNoteComponent implements OnInit {

  types = [ 'performers', 'statement of responsibility', 'historical'];

  @Input() field: ElementField;
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }



}
