import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-genre',
  templateUrl: './editor-genre.component.html',
  styleUrls: ['./editor-genre.component.scss']
})
export class EditorGenreComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }

}
