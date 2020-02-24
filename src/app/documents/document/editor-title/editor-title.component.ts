import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-title',
  templateUrl: './editor-title.component.html',
  styleUrls: ['./editor-title.component.scss']
})
export class EditorTitleComponent implements OnInit {

  @Input() field: ElementField;

  titleTypes: string[] = ['abbreviated', 'translated', 'alternative', 'uniform'];

  constructor() {
  }

  ngOnInit() {
  }


}
