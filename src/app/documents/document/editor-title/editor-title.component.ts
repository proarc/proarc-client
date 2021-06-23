import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-title',
  templateUrl: './editor-title.component.html',
  styleUrls: ['./editor-title.component.scss']
})
export class EditorTitleComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }

}
